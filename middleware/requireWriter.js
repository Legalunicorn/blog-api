const jwt = require('jsonwebtoken')
const User = require("../models/user")



const requireWriter = async (req,res,next)=>{

    const auth = req.headers.authorization //'Bearer dpfdsofijafsap"
    if (!auth){
        return res.status(401).json({error:'Authorization token required'})
    }

    const token = auth.split(' ')[1];

    try{
        const {id} = jwt.verify(token,process.env.SECRET, function(err,decoded){
            if (err){
                res.status(401).json({error:"JWT token has expired. 301 unauthorized HTTP"})
            }
        })        
        // const {id} = jwt.verify(token,process.env.SECRET) //just the id
        console.log("token is"+token)
        console.log("id from jwt is "+id)
        const user = await User.findOne({_id:id},['_id','is_writer']).exec();//throw the user in the request object
        //u only selected the id
        req.user = user._id;
        console.log("USER IS :  ")
        console.log(req.user)
        if (!req.user.is_writer){
            console.log("tf")
            console.log(req.user.is_writer)
            console.log(req.user)

            res.status(401).json({error:"Request only authorized for writers"})
        }
        
        else next() //acees granded, move on to the next middleware

    } catch(error){
        console.log(error);
         res.status(401).json({error:"Request not authorized"})
    }

}

module.exports = requireWriter