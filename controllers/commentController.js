//TODO comment_patch and comment_delete

//should make the comment post 
const asyncHandler = require("express-async-handler");
const {body,param,validationResult} = require("express-validator");
const Comment = require("../models/comment");


exports.comment_post = [
    param("article_id")
        .trim()
        .isMongoId()
        .escape(),
    body("body")
        .trim()
        .isLength({max:3000})
        .notEmpty()
        .escape(),

    async (req,res)=>{
        const errors = validationResult(req);
        // should have client side validation inplace for UX
        // this is if the client side validation is bypasse
        // so not gg to bother to send the form details back to the front end
        if (!errors.isEmpty()){
            res.status(400).json({error:errors.array()})
        }

        

        try{
            const comment = new Comment({
                author:req.params.user_id,
                article:req.params.article_id,
                body:req.body.body
            })

            await comment.save();
            res.status(200).json({comment});
        } catch(err){
            res.status(400).json({error:err.message})
        }
    }
]



//TODO comment_patch, essentially the same as post 
//handle the authentication in the routes already
exports.comment_patch = [
    param("article_id")
        .trim()
        .isMongoId()
        .escape(),
    param("comment_id")
        .trim()
        .isMongoId()
        .escape(),        
    body("body")
        .trim()
        .isLength({max:3000})
        .notEmpty()
        .escape(),

    async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).json({error:errors.array()});
        }

        try{
            //get the comment
            const comment = await Comment.findById(req.params.comment_id).exec();
            comment.body = req.body.body;
            await comment.save();
            res.status(200).json({comment})
            
        } catch(err){
            console.log("Error while updating comment. ")
            console.log(err.message);
            res.status(400).json({error:err.message})
        }
    //

    }
]

exports.comment_delete = async(req,res)=>{

}