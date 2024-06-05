const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Article = require("../models/article")

/**
 * This auth is for deleting, patching articles
 * ONLY
 * - admin
 * - author
 * of the articles shoud be authorized to do so
 * 
 * the req.parmss should have the article id 
 * //article id should be labelled: article_id
 * 
 * 
 * THERE SHOULD BE A SEPERATE AUTH FOR COMMENTS
 */

const requireArticleAuth = async(req,res,next) =>{
    const auth = req.headers.authorization;
    if (!auth){
        res.status(401).json({error:"Request not authroized"})
    }

    const token = auth.split(" ")[1];

    try{
        //the params will have the article id ?
        //

        const {_id} = jwt.verify(token,process.env.SECRET)
        const user = User.findById(_id).exec();

        // first if the user is admin, dont need to check if they wrote the article

        if (user.is_admin){
            req.user = user;
            next();
        }

        //not admin 
        const article = Article.findById(req.params.article_id).exec();
        if (article.author===_id){
            //not admin, but is the author
            req.user = user;
            next();
        }
        req.status(401).json({error:"Article auth failed."})

        //a
        //get the author of the aricle
        //
    } catch(err){
        console.log("article auth errors:")
        console.log(err)
        res.status(401).json({error:"Request for article auth not authorized"})
    }
}