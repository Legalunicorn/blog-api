const passport = require("passport")
const asyncHandler = require("express-async-handler")

function generateToken(id){
    return jwt.sign({id},process.env.SECRET,{expiresIn:'10m'})
}


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
        failureRedirect:"/login",
        session: false
    }),
    (req,res)=>{
        // console.log("here u fuck")
        // console.log(req.user)
        // console.log(req.user.token)
        res.redirect("/auth/google")
        // res.json()
        //test this, the req.user 
        //the user should have the json web token
        const jwt = req.user.token;
        req.token = jwt;
        res.json()
        // console.log("TOKEN",req.token)
        // res.status(200).redirect('/'); //goes to the index page.
        
        //after this you wan tto redirect to the home page


        // res.json({mssg:"you have reacehd the redirect URI"})
    }

]



// make sign up a post, and login a get request
exports.email_signup_post = async(req,res)=>{
    const {email,password,display_name} = req.body;
    //for our signup, we automatically log in the user as well
    try{
        const user = await User.emailSignup(email,password,display_name)
        const token = generateToken(user._id);
        res.status(200).json({email,token});
    } catch(err){
        res.status(400).json({error:err.message})
        //error sign up with local strategy
    }
}


exports.email_login_get = async(req,res)=>{
    //frontend to save the token the LOCALSTORAGE
    const {email,password} = req.body;
    try{
        const user = await User.emailLogin(email,password);
        const token = generateToken(user._id);
        res.status(200).json({email,token})
    } catch (err){
        res.status(400).json({error:err.message})
    }
}

// exports.login
// exports.signup