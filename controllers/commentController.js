
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

    asyncHandler(async (req,res)=>{
        const errors = validationResult(req);
        // should have client side validation inplace for UX
        // this is if the client side validation is bypasse
        // so not gg to bother to send the form details back to the front end
        if (!errors.isEmpty()){
            console.log("tf");
            return res.status(400).json({error:errors.array()})
        }
        console.log("inside post comment")
        console.log("the user is..",req.user)
        //user should be in req.user because of the aut handler
        const comment = new Comment({
            author:req.user,  //
            article:req.params.article_id,
            body:req.body.body
        })

        await comment.save();
        res.status(200).json({comment});

    })
]        // try{



//handle the authentication in the routes already
exports.comment_patch = [
    //actually dont you need the comment id only 
    param("comment_id")
        .trim()
        .isMongoId()
        .escape(),        
    body("body")
        .trim()
        .isLength({max:3000})
        .notEmpty()
        .escape(),

    asyncHandler(async (req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).json({error:errors.array()});
        }
        const comment = await Comment.findById(req.params.comment_id).exec();
        comment.body = req.body.body; //update the content
        await comment.save();
        res.status(200).json({comment})
    })
]

exports.comment_delete = async(req,res)=>{
    param("comment_id")
        .trim()
        .isMongoId()
        .escape(), 
    
    asyncHandler(async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).json({error:errors.array()});
        }
        await Comment.findByIdAndDelete(req.params.comment_id).exec();
    })
}