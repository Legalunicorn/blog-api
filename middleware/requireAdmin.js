const jwt = require('jsonwebtoken')
const User = require("../models/user")



const requireAdmin = async (req,res,next)=>{

    const auth = req.headers.authorization //'Bearer dpfdsofijafsap"
    if (!auth){
        return res.status(401).json({error:'Authorization token required'})
    }

    const token = auth.split(' ')[1];

    try{
        // const {id} = jwt.verify(token,process.env.SECRET) //just the id
        let id;
        jwt.verify(token,process.env.SECRET, function(err,decoded){
            if (err){
                res.status(401).json({error:"JWT token has expired. 301 unauthorized HTTP"})
            }
            id = decoded.id;
        })        

        const user = await User.findOne({_id:id},['_id','is_admin']).exec();//throw the user in the request object
        if (!user.is_admin){
            res.status(401).json({error:"Request only authorized for admins"})
        }
        req.user = user._id;
        next() //acees granded, move on to the next middleware

    } catch(error){
        console.log(error);
         res.status(401).json({error:"Request not authorized"})
    }

}

module.exports = requireAdmin