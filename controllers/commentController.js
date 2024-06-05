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




exports.comment_patch = async (req,res)=>{
    //

}

exports.comment_delete = async(req,res)=>{

}