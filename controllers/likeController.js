const Like = require("../models/like")
const Article = require("../models/article")
const asyncHandler = require("express-async-handler")
const is_valid_mongoID = require("../utils/validMongoId")



exports.like_put = asyncHandler(async(req,res,next)=>{
    /**
     * info needed:
     * Params
     *   - article_id
     * 
     * Req
     *   - user._id (provided by auth middleware )
     * 
     * 
     * THERE is a big issue! if a user sends two request at once, they happen asyncrnomously
     * meaning double clicking will perform the SAME action twice!
     */
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
    }).exec(); //returns

    if (hasLiked===null){
        console.log("creating likes!");
        await Like.create({
            user:req.user._id,
            post:req.params.article_id
        });
        let count = await Like.find({post:req.params.article_id}).countDocuments();
        console.log("COUNT IS: ",count)
        article.likes_count= count;
        await article.save();
    }
    else{ //could not find and elete
        console.log("Has liked is")
        console.log(hasLiked);
        let count = await Like.find({post:req.params.article_id}).countDocuments();
        console.log("COUNT IS: ",count)
        article.likes_count= count;
        await article.save();
    }
    console.log("like c",article.likes_count);
    res.status(200).json({likes_count:article.likes_count}) //return the updated like count 

})

exports.like_article_one_get = asyncHandler(async(req,res,next)=>{
        if (!is_valid_mongoID(req.params.article_id)){
            res.status(400).json({error:"Invalid article id"});
        }
        //in the layload we just send back true the id 
        const article = await Article.findById(req.params.article_id).exec();
        if (article===null){
            res.status(400).json({error:"Invalid article id"});
        }

        const hasLiked = await Like.findOne({
            user: req.user._id,
            post: req.params.article_id
        })

        if (hasLiked===null){
            res.status(200).json({has_liked:false})
        }
        else{
            res.status(200).json({has_liked:true})
        }
})