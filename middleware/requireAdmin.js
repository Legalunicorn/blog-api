const jwt = require('jsonwebtoken')
const User = require("../models/user")



const requireAdmin = async (req,res,next)=>{

    const auth = req.headers.authorization //'Bearer dpfdsofijafsap"
    if (!auth){
        return res.status(401).json({error:'Authorization token required'})
    }

    const token = auth.split(' ')[1];

    try{
        const {_id} = jwt.verify(token,process.env.SECRET)
        req.user = await User.findById({_id}).select("_id") //throw the user in the request object
        if (!user.is_admin){
            res.status(401).json({error:"Request only authorized for admins"})
        }
        next() //acees granded, move on to the next middleware

    } catch(error){
        console.log(error);
        res.status(401).json({error:"Request not authorized"})
    }


}