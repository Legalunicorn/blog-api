const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user")
// const token = require("jsonwebtoken")

const genToken = require("../utils/genereateToken")
require("dotenv").config(); //google client id and secret





passport.use(
    new GoogleStrategy({
        callbackURL: '/api/auth/google/redirect',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET

    }, async(accessToken,refreshToken,profile,done)=>{

        const existingGoogleUser = await User.findOne({provider_id:profile.id}).exec();

        //User has used google login with this gmail before
        if (existingGoogleUser!==null){
            return done(null,existingGoogleUser)

        }

        const existingEmail = await User.findOne({email:profile.emails[0].value}).exec();
        if (existingEmail!==null){

            existingEmail.provider_id = profile.id; //the google id
            await existingEmail.save();
            return done(null,existingEmail)
        }

        // User is completely new
        try{
            const newUser = new User({ //i dont escape anything
                display_name: profile.displayName,
                email: profile.emails[0].value,
                provider_id: profile.id
            })

            //JWT PORTION
            // newUser is attached to `req.user`
            // what we are doing is saving the jwt to the newUser
            // the sending 
    
            await newUser.save();

            // const jwt = genToken(newUser.id);
            // newUser.token = jwt;

            console.log("testing no save:")
            console.log()
            console.log(newUser)
            // await newUser.save(); //i dont need to do this?
            return done(null,newUser)            
        } catch(err){
            console.log(err.message)
            return(false,null)
        }


    })
)