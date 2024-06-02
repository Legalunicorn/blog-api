const jwt = require('jsonwebtoken')
const User = require("../models/user")

const requireAuth = async (req,res,next)=>{
    const auth = req.headers.authorization
    //first check if this even exists

    if (!auth){
        return res.status(401).json({error:'Authorization token required'})
    }

    const token = auth.split(' ')[1];

    try{
        //try to verify the token
        //jwt.verify -> returns token payload
        const {_id} = jwt.verify(token,process.env.SECRET)
        req.user = await User.findById({_id}).select("_id")
        next()

    } catch(error){
        console.log(error);
        res.status(401).json({error:"Request not authorized"})
    }


}