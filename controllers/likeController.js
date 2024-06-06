const Like = require("../models/like")
const Article = require("../models/article")
const asyncHandler = require("express-async-handler")
const is_valid_mongoID = require("../utils/validMongoId")



exports.like_put = asyncHandler(async(req,res,next)=>{
    //first check if the article is is valid
    if (!is_valid_mongoID(req.params.article_id)){
        res.status(400).json({error:"Invalid article id"});
    }
    const article = await Article.findById(req.params.article_id).exec();
    if (article===null){
        res.status(404).json({error:"Article not found"});
    }

    const hasLiked = await Like.findOneAndDelete({
        user: req.user._id,
        post: req.params.article_id
    }).exec();

    if (hasLiked!==null){
        await Like.create({
            user:req.user._id,
            post:req.params.article_id
        });
        article.likes_count+=1;
        await article.save();
    }
    else{
        article.likes_count-=1;
        await article.save();
    }
    res.status(200).json({likes_count:article.likes_count})

})