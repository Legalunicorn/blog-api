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
        res.status(401).json({error:"Request not authorized"})
    }

    const token = auth.split(" ")[1];

    try{
        //the params will have the article id ?
        //
        let id;
        let hasJWTError = false;
        jwt.verify(token,process.env.SECRET, function(err,decoded){
            if (err){
                hasJWTError = true;
                console.log(err);
                res.status(401).json({error:"JWT token has expired. 301 unauthorized HTTP"});
                return;
            }
            id = decoded.id;
        })
    
        if (hasJWTError) return;

        const user = await User.findById(id).exec();
        if (user.is_admin){
            req.user = user; //set the id to req.user
            next();
            return;
        }

        //not admin 
        const article = await Article.findById(req.params.article_id).lean().populate("author","_id").exec();
        if (article===null){
            res.status(404).json({error:"article not found"})
            return;
        }
        if (article.author._id.toString()===id){
            //not admin, but is the author
            req.user = user; //auth pass the users 
            next();
            return
        }
        else res.status(401).json({error:"Article auth failed."})
        return;

        //a
        //get the author of the aricle
        //
    } catch(err){
        console.log("article auth errors:")
        console.log(err)
        res.status(401).json({error:"Request for article auth not authorized"})
    }
}

module.exports = requireArticleAuth