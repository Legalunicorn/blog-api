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
        
            // const jwt = genToken(existingGoogleUser.id);
            // existingGoogleUser.token = jwt;
            // await existingGoogleUser.save();
            return done(null,existingGoogleUser)

        }

        //Search for existing email account because we can merge
        const existingEmail = await User.findOne({email:profile.emails[0].vale}).exec();
        if (existingEmail!==null){

            // const jwt = genToken(existingEmail.id);

            /**
             * Actually we can generate the jwt on the authcontroller side
             */

            // existingEmail.token = jwt;

            existingEmail.provider_id = profile.id; //the google id
            await existingEmail.save();
            return done(null,existingEmail)
        }

        // User is completely new
        try{
            const newUser = new User({
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
            console.log(newUser)
            // await newUser.save(); //i dont need to do this?
            return done(null,newUser)            
        } catch(err){
            console.log(err.message)
            return(false,null)
        }


    })
)