const jwt = require('jsonwebtoken')
const User = require("../models/user")



// req.headers.authroization is from the frontend, which extracts t

const requireAuth = async (req,res,next)=>{
    /**
     * Whatever route that needs auth, should have the user object in the 
     * req.headers.authorization
     * we take that and use jwt . reverify 
     */
    const auth = req.headers.authorization //'Bearer dpfdsofijafsap"
    if (!auth){
        console.log("BRO")
        return res.status(401).json({error:'Authorization token required'})
    }

    const token = auth.split(' ')[1];

    try{
        // const {id} = jwt.verify(token,process.env.SECRET) //just the id
        let id;
        let hasJWTError = false;
        jwt.verify(token,process.env.SECRET, function(err,decoded){
            if (err){
                hasJWTError = true;
                console.log(token);
                console.log(err);
                //TODO return an error and reset the AuthContext and local Storage? 
                //TODO find a way to use refresh tokens 
                res.status(401).json({error:"JWT token has expired. 301 unauthorized HTTP"})
                return;
            }
            id = decoded.id;
        })
        if (hasJWTError) return;

        //jwt.
        req.user = await User.findById(id).select("_id") //throw the user in the request object
        next() //acees granded, move on to the next middleware

    } catch(error){
        console.log("dude wtf")
        console.log(error);
        res.status(401).json({error:"Request not authorized"})
    }


}

module.exports = requireAuth