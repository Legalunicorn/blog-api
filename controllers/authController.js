const passport = require("passport")
const asyncHandler = require("express-async-handler")


exports.google_get = [
    passport.authenticate('google',{
    scope:['profile','email']
    })
    ,
    (req,res)=>{res.json({mssg:"google_get"})}
]
// exports.google_get = (req,res)=>{
//     res.json({mssg:"dude wrd"})
// }

exports.google_redirect_get = [
    passport.authenticate('google',{
        failureRedirect:"/login"
    }),
    (req,res)=>{
        res.json({mssg:"you have reacehd the redirect URI"})
    }

    // asyncHandler(async(req,res)=>{
    //     //do whatever fuck idk
    // })
]



// exports.login
// exports.signup