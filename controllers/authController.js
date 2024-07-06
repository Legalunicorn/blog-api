const passport = require("passport")
//TODO use asynchandler for email controllers 
const asyncHandler = require("express-async-handler")
const {body,validationResult} = require("express-validator")
const jwt = require("jsonwebtoken");
const User = require("../models/user")


require("dotenv").config();

function generateToken(id){
    return jwt.sign({id},process.env.SECRET,{expiresIn:'2d'})
}


// exports.google_get = [
//     passport.authenticate('google',{

//     scope:['profile','email'],
//     state: 'mother'
        
//     })

// ]

exports.google_get = (req,res,next)=>{
    // const state = req.query.service;
    // const state = req.query.host;
    // console.log("----------------;-----")
    // console.log("req is : ",req.query);
    // console.log(req.query)
    // console.log(req.body)
    // console.log(req)
    const authenticator = passport.authenticate('google',{
        scope:['profile','email'],
        state:req.query.host
    })
    authenticator(req,res,next);

}



exports.google_redirect_get = [
    passport.authenticate('google',{
        // failureRedirect:"/login", //doesnt make sense to redirect inside an api 
        session: false,


    }),
    (req,res)=>{
    

        const token = generateToken(req.user._id)
        //testing
        console.log("===== AFTER GOOGLE REDIRECT ====")
        console.log(req.query)
        const host = req.query.state;
        //either "CLIENT" or "CMS"

        
        console.log("HOST IS ",host)


        if (host=="CMS"){
            console.log('bro');
            console.log(process.env.CMS_CLIENT_URL)
            res.redirect(`${process.env.CMS_CLIENT_URL}/login/?token=${token}&id=${req.user._id}`)
            // return;

        }
        else res.redirect(`${process.env.VIEWER_CLIENT_URL}/?token=${token}&id=${req.user._id}`)
    }

]
// make sign up a post, and login a get request

//Signup will automatically redirect the user to index


//TODO 
exports.email_signup_post = [
    body("display_name","Display name must be between 2 and 50 characters")
        .trim()
        .isLength({max:50,min:2})
        .escape(),
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .escape(),
    body("password","Password cannot be empty")
        .not().isEmpty(),



    async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).send({errors:errors.array()})
            return;
        }

        const {email,password,display_name} = req.body;
        //for our signup, we automatically log in the user as well
        try{
            const user = await User.emailSignup(email,password,display_name)
            const token = generateToken(user._id);
            res.status(200).json({id:user._id,token});
            //return the email and token 
        } catch(err){
            console.log(err);
            console.log("CHE BONG")
            console.log(err.message)
            res.status(400).json({error:err.message})
            //error sign up with local strategy
    }
}]


exports.email_login_get = [

    body("email","Invalid email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .escape(),
    body("password","Password cannot be empty")
    .not().isEmpty(),

    asyncHandler(async(req,res)=>{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.status(400).send({errors:errors.array()});
            return;
        }
        const {email,password} = req.body;
        // try{
            const user = await User.emailLogin(email,password);
            const token = generateToken(user._id);
            res.status(200).json({id:user._id,token})
        // } catch (err){
            // res.status(400).json({error:err.message})
        // }
})]

// exports.login
// exports.signup