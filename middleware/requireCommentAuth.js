const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Comment = require("../models/comment")
const { model } = require("mongoose");

//copied from article auth but changed to comment

const requireCommentAuth = async(req,res,next) =>{
    const auth = req.headers.authorization;
    if (!auth){
        res.status(401).json({error:"Request not authorized"})
    }
    console.log("TEST AUHT",auth);
    const token = auth.split(" ")[1];
    try{
        let id;
        let hasJWTError;
        jwt.verify(token,process.env.SECRET, function(err,decoded){
            if (err){
                hasJWTError = true;
                console.log(err.message);
                res.status(401).json({error:"JWT token has expired. 301 unauthorized HTTP"});
                return;
            }
            id = decoded.id;
        })     
        if (hasJWTError) return;  
        const user = await User.findById(id).exec();
        // first if the user is admin, dont need to check if they wrote the article
        if (user.is_admin){
            console.log("comment auth granted to admin")
            req.user = user;
            next();
            return;
        }

        const comment = await Comment.findById(req.params.comment_id).populate("author").exec();
        if (comment==null){
            console.log("comment auth failed. comment does not exist");
            res.status(404).json({error:"Requested to comment failed. comment does not exist"})
            return;
        }
        if (comment.author._id.toString()===id){
            console.log("comment auth granted to writer")
            req.user = user;
            next();
            return;
        }
        res.status(401).json({error:"Comment auth failed."})
     
    } catch(err){
        console.log("comment auth errors:")
        console.log(err)
        res.status(401).json({error:"Request for comment auth not authorized"})
    }
}

module.exports = requireCommentAuth;

/**
 * This auth is for deleting, patching comments
 * ONLY
 * - admin
 * - author
 * of the comments shoud be authorized to do so
 * 
 * the req.parmss should have the comment id 
 * //comment id should be labelled: comment_id
 * 
 * 
 * THERE SHOULD BE A SEPERATE AUTH FOR COMMENTS
 */
