const passport = require("passport")
//TODO use asynchandler for email controllers 
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(id){
    return jwt.sign({id},process.env.SECRET,{expiresIn:'1d'})
}


exports.google_get = [
    passport.authenticate('google',{
    scope:['profile','email']
    })
]


//we have to handle the redirect here

/**
 * on the frontend side: we mangage the user state wuth a AuthContext()
 * for the CMS:
 * the home route will either show the index element or login element dependong on the user state 
 * -> user logged in -> user state updated -> login change to home
 * 
 * for the viewer
 * -> we can do the same. 
 * -> for the /login , if the user is logeed in (will updated when they log in), we negaitve to "/" instead of 
 *    displaying the <Login/> page
 * 
 * So we dont have to redirect on the backend. 
 */


exports.google_redirect_get = [
    passport.authenticate('google',{
        // failureRedirect:"/login", //doesnt make sense to redirect inside an api 
        session: false
    }),
    (req,res)=>{
 
        // res.redirect("/auth/google") //for testing only, in the react app we will redirect to the home page when needed
        // res.json()
        //test this, the req.user 
        //the user should have the json web token
        const token = generateToken(req.user._id)
        //testing
        console.log("===== AFTER GOOGLE REDIRECT ====")
        console.log(req.user)
        console.log(token)
        //i cant really do this, i need to redirect
        // res.status(200).json({
        //     email: req.user.email,
        //     token
        // })

        //redirect to VIEWER or CMS dependong on req(?)
        //TODO change the redirect depending on which frontend client is logging in 
        //for now we just redirect to the viewer,

        // res.json({token})
        // console.log("hey noob"+process.env.VIEWER_CLIENT_URL)
        // console.log(process.env)
        // res.redirect('http://localhost:5173/?token='+token)
        res.redirect(`${process.env.VIEWER_CLIENT_URL}/?token=${token}`)
    }

]



// make sign up a post, and login a get request

//Signup will automatically redirect the user to index
//handle the redirect on the front end with <Link>
exports.email_signup_post = async(req,res)=>{
    //TODO add server side validation to req.boy
    const {email,password,display_name} = req.body;
    //for our signup, we automatically log in the user as well
    try{
        const user = await User.emailSignup(email,password,display_name)
        const token = generateToken(user._id);
        //u res the email and token here..
        res.status(200).json({email,token});
        //TODO on the frontend: update the AuthState once token received
        //return the email and token 
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