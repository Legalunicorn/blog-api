//controller, most likely need the the db and whatever
//in the 
const {validationResult, body,param} = require("express-validator");
const asyncHandler = require("express-async-handler");

const Article =  require("../models/article")
const Tag = require("../models/tag")

const is_valid_mongoID = require("../utils/validMongoId")
const processFormTags = require("../utils/processFormTags")

//custom middleware


exports.all_articles_get = asyncHandler(async (req,res)=>{
    const top_articles = await Article.find({}).sort({likes_count:1}).exec();
    const all_articles = await Article.find({}).sort({createdAt:-1}).exec();
    const recent_articles = all_articles.slice(0,5); //show top 5 articles

    res.json(
        {all_articles,
        top_articles,
        recent_articles}
    )
})

//takes in alot from the body 

//title
//body
//tags ->convert to array
//image url
//TODO add authentication that only the moderator with author id OR an admin can do this
//
exports.artcles_post = [
    (req,res,next)=>{
        if (!Array.isArray(req.body.tag)){
            req.body.tag = typeof req.body.tag==="undefined"? []:[req.body.tag];
        }
        next();
    },

    body("title")
        .trim()
        .isLength({max:300})
        .withMessage("Title must not exceed 300 characters")
        .escape(),
    body("body")
        .trim()
        .isLength({max:50000})
        .withMessage("Article should be less than 50,000 characters")
        .escape(),
    body("tag.*","Tags cannot exceed 100 characters long")
        .trim()
        .isLength({max:100})
        .escape(),
    body("image")
        .trim()
        .escape(),
        
        
    asyncHandler( async(req,res)=>{
        //get all tags from DB first
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).json({error:errors.array()})
            return;
        }
        const tags = await processFormTags(req.body.tag);
        try{
            const article = new Article({
                title: req.body.title,
                body: req.body.body,
                tags:tags,
                // image: req.body.image.replaceAll("&#x2F;","/").replaceAll("&amp;","&"),
                //no need to unescape.. html can load your escaped elements as a src, please note
                // author:
                image:req.body.image,
                likes_count:0
            })

            await article.save();
            res.json(article)
        } catch(err){
            console.log("an error while making new document")
            res.status(400).json({error:err.message}) //status 400 for bad request
        }
    })
]

//TODO write a function that returns only articles written by a user
//TODO write another function that returns all articles to the CMS? -> require admin auth 

exports.article_get = asyncHandler(async(req,res)=>{
    //check if the if is a valid mongoDB id

    //alternative, can use express-validator
    // pararams().isMongoId, which is discovered after creating this util function
    if (!is_valid_mongoID(req.params.id)){ //actuall you can do this with express-validator
        return res.status(404).json({error:"No such article"})
    }
    // load the article content
    const article = await Article.findById(req.params.id).exec();

    if (article===null){
        res.status(404).json({error: "No such article"})
    }
    else{
        res.json(article);
    }
})
//TODO add authentication that only the moderator with author id OR an admin can do this
exports.article_delete = asyncHandler(async(req,res)=>{
    //TODO delete article

    //first make sure the id is valid
    if (!is_valid_mongoID(req.params.id)){
        res.status(404).json({error:"Article not found"})
    }

    try{
        const article = await Article.findByIdAndDelete(req.params.id).exec();
        if (article===null){
            res.status(404).json({error:"Article not found"})
        }
        res.json(article) //send back article information, to update react context 
    } catch(error){
        res.status(400).json({error:error.message})
    }
})

//TODO add authentication that only the moderator with author id OR an admin can do this
exports.article_patch = [

    //make the tags an array first
    //custom middleware
    (req,res,next)=>{
        if (!Array.isArray(req.body.tag)){
            req.body.tag = typeof req.body.tag==="undefined"? []:[req.body.tag];
        }
        next();
    },

    body("title")
        .trim()
        .isLength({max:300})
        .withMessage("Title must not exceed 300 characters")
        .escape(),
    body("body")
        .trim()
        .isLength({max:50000})
        .withMessage("Article should be less than 50,000 characters")
        .escape(),
    body("tag.*","Tags cannot exceed 100 characters long")
        .trim()
        .isLength({max:100})
        .escape(),
    body("image")
        .trim()
        .escape(),
    param("id")
        .isMongoId(),
        
        
    asyncHandler( async(req,res)=>{
        res.json({mssg:"hi"})
        //get all tags from DB first
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).json({error:errors.array()})
            return;
        }

        //check if id 

        const tags = await processFormTags(req.body.tag); //you should make sure the Article exists first before doing this, as you will unnecessarily create new tags for an aarticle that dont exists,
        //ACTUALLY, no, because your front end will make a GET to /articles/:id, and you wouldnt reach here if the article doesnt exist in the first place?!
        try{
            const article = new Article({
                title: req.body.title,
                body: req.body.body,
                tags:tags,
                image:req.body.image,
                likes_count:0,
                id_: req.params.id
            })

            // await article.save();
            // res.json(article)
        } catch(err){
            console.log("an error while making new document")
            res.status(400).json({error:err.message}) //status 400 for bad request
        }
    })
]