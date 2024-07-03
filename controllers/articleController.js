//controller, most likely need the the db and whatever
//in the 
const {validationResult, body,param} = require("express-validator");
const asyncHandler = require("express-async-handler");

const Article =  require("../models/article")
const Tag = require("../models/tag")
const Comment = require("../models/comment")

const is_valid_mongoID = require("../utils/validMongoId")
const processFormTags = require("../utils/processFormTags")

//custom middleware

//CMS

exports.all_articles_get = asyncHandler(async (req,res)=>{

    const top_articles = await Article.find({is_drafted:false}).sort({likes_count:-1}).populate("author").populate('tags','name').exec();
    const all_articles = await Article.find({is_drafted:false}).sort({createdAt:-1}).populate("author").populate('tags','name').exec();

    // const recent_articles = all_articles.slice(0,5); //show top 5 articles

    //TODO get all tags
    const tags = await Tag.find({}).sort({name:1}).exec()


    res.json(
        {all_articles,
        top_articles,
        tags
    }
    )
})


exports.articles_by_tag_get = asyncHandler(async(req,res)=>{
    const tag = req.params.tag_id;
    console.log("the tag looking for is ",tag);
    const sort = req.query.sort;
    console.log(req.query.sort,"URM what the sigma")

    let articles;
    if (sort=='recent'){
        console.log("sort by recent")
         articles = await Article
            .find({tags:tag,is_drafted:false})
            .sort({createdAt:-1})
            .populate("author")
            .populate("tags","name")
            .exec();
    } else{
        console.log("sort by TOp")
         articles = await Article
            .find({tags:tag,is_drafted:false})
            .sort({likes_count:-1})
            .populate("author")
            .populate("tags","name")
            .exec();        
    }
    console.log('articles are',articles)

    res.json({articles});
})

//CMS
//require is writer or is admin
//admins are writer by default


//TODO standarise the way you sanitise and hanlde data
/**
 * Comments -> Escaped and then output in react 
 */

//BUG REMOVE ANY UNNCESSARY ESCAPING. 
exports.artcles_post = [
    (req,res,next)=>{
        if (!Array.isArray(req.body.tag)){
            req.body.tag = typeof req.body.tag==="undefined"? []:[req.body.tag];
        }
        next();
    },

    body("title")
        .trim()
        .isLength({min:0,max:300})
        .withMessage("Title must be between 0 - 300 characters"),
        // .escape(), //TODO 
    body("body")
        .trim()
        .isLength({min:1})
        .withMessage("Article body cannot be empty")
        .isLength({max:80000})
        .withMessage('Article body cannot exceed 80,000 characters'),
    
        // .escape(),
    body("tag.*","Tags cannot exceed 100 characters long")
        .trim()
        .isLength({max:100})
        .escape(),
    // body("tag")
    //     .isArray({max:4}),
    body("image")
    //BUG this is dead ass chatgpt code. please review carefully 
        
        .isURL().withMessage("Invalid URL")
        .optional({ nullable: true , checkFalsy:true}),

        
    asyncHandler( async(req,res)=>{
        //get all tags from DB first
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log(errors);
            res.status(400).json({errors:errors.array()})
            return;
        } else {
            const tags = await processFormTags(req.body.tag);
            const article = new Article({
                title: req.body.title,
                body: req.body.body,
                tags:tags,
                image:req.body.image,
                likes_count:0,
                author: req.user,
                is_drafted: req.body.is_drafted
            })

            await article.save();
            console.log("THE NEW ARTICLE IS");
            console.log(article);
            res.status(200).json({article})
        }
    })
]

//CMS, low priorty
// actually it should be articles retrievable by user
// exports.get_articles_authorized_by_user

//auth scop

exports.articles_written_by_user= asyncHandler(async(req,res)=>{
    //req.user in the auth will sufficer
    if (!is_valid_mongoID(req.user._id)) {
        return res.status(400).json({error:"Invalid User ID;"})
    }

    //TODO fetch two posts, one for drafted and one for posted
    const articles = await Article
        .find({author:req.user._id})
        .populate('tags','name')
        .sort({createdAt:-1}).exec();
    console.log("hi",articles);
    console.log(req.user._id.toString())


    //filter the articles herhe

    const posted = []
    const drafted = []
    articles.forEach(article=>{
        if (article.is_drafted) drafted.push(article)
        else posted.push(article)
    })
    //find all articles written by user
    // filter then in the frontend
    res.status(200).json({
        posted,
        drafted
    });
})


exports.articles_require_admin_get = asyncHandler(async(req,res)=>{
    if (!is_valid_mongoID(req.user._id)){
        res.status(400).json({error:"Invalid User ID."})
    }

    const all_articles = await Article.find({}).sort({createAt:-1}).exec();
    res.status(200).json({
        all_articles
    })
})





exports.article_get = asyncHandler(async(req,res)=>{
    //check if the if is a valid mongoDB id
    console.log(req.params.article_id)

    //alternative, can use express-validator
    // pararams().isMongoId, which is discovered after creating this util function
    if (!is_valid_mongoID(req.params.article_id)){ //actuall you can do this with express-validator
        return res.status(404).json({error:"No such article (id)"})
    }
    // load the article content

    //TODO use a promose.all or somethin to make parallel calls 
    const article = await Article
        .findById(req.params.article_id)
        .populate("author","display_name")
        .populate("tags","name")
        .exec();
    const comments = await Comment
        .find({article:req.params.article_id})
        .populate("author")
        .sort({createdAt:-1})
        .exec();

    //if null an error wont be thrown, thus we handle the error like this
    if (article===null){
        res.status(404).json({error: "No such article"})
    }
    else{
        console.log('yup',article)
        res.json({article,comments});
    }
})
exports.article_delete = asyncHandler(async(req,res)=>{
    //first make sure the id is valid
    if (!is_valid_mongoID(req.params.article_id)){
        return res.status(404).json({error:"Article not found"})
    }
    // try{
        const article = await Article.findByIdAndDelete(req.params.article_id).exec();
        if (article===null){
            return res.status(404).json({error:"Article not found"})
        }
        res.status(200).json(article) //send back article information, to update react context 
    // } catch(error){
    //     res.status(400).json({error:error.message})
    // }
})

exports.article_patch = [

    //make the tags an array first
    //custom middleware
    (req,res,next)=>{
        if (!Array.isArray(req.body.tag)){
            req.body.tag = typeof req.body.tag==="undefined"? []:[req.body.tag];
        }
        next(); //next is line 1333
    },

    body("title")
        .trim()
        .isLength({max:300})
        .withMessage("Title must not exceed 300 characters"),
    body("body")
        .trim()
        .isLength({max:50000})
        .withMessage("Article should be less than 50,000 characters"),
    body("tag.*","Tags cannot exceed 100 characters long")
        .trim()
        .isLength({max:100})
        .escape(),
    body("image")
        .trim()
    
        .isURL()
        .optional({ nullable: true }),
    param("article_id")
        .isMongoId(),
        
    //TODO santise tags to be max length of 4;
    asyncHandler( async(req,res)=>{
        console.log("IN PATCH!!")
        // res.json({mssg:"hi"})
        //get all tags from DB first
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log(errors);
            res.status(400).json({error:errors.array()})
            return;
        }
        const tags =  await processFormTags(req.body.tag); //you should make sure the Article exists first before doing this, as you will unnecessarily create new tags for an aarticle that dont exists,
        const article = new Article({
            title: req.body.title,
            body: req.body.body,
            author:req.user,
            tags:tags,
            image:req.body.image,
            likes_count:0,
            is_drafted: req.body.is_drafted,
            _id: req.params.article_id
        })
        console.log("new article",article);
        // await article.save();
        await Article.findByIdAndUpdate(req.params.article_id,article);
        res.json({article});

    })
]