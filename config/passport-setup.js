const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user")
// const token = require("jsonwebtoken")

const genToken = require("../utils/genereateToken")
require("dotenv").config(); //google client id and secret



//rememeber to passport.use() this in the app.jszzxx
//TODO config local strategy


//TODO config google oauth strategy
passport.use(
    new GoogleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET

    }, async(accessToken,refreshToken,profile,done)=>{

        // console.log(profile);
        // console.log(profile.id);
        // console.log(profile.emails[0].value);
        // return done();
        //rofile.displayname

        const existingGoogleUser = await User.findOne({provider_id:profile.id}).exec();

        //User has used google login with this gmail before
        if (existingGoogleUser!==null){
        
            const jwt = genToken(existingGoogleUser.id);
            existingGoogleUser.token = jwt;
            await existingGoogleUser.save();
            return done(null,existingGoogleUser)

        }

        //Search for existing email account because we can merge
        const existingEmail = await User.findOne({email:profile.emails[0].vale}).exec();
        if (existingEmail!==null){
            //we register this email account to have a google id 
            //we also generate a toke n
            const jwt = genToken(existingEmail.id);
            existingEmail.token = jwt;
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
    
            await newUser.save();
            const jwt = genToken(newUser.id);
            newUser.token = jwt;
            await newUser.save();
            return done(null,newUser)            
        } catch(err){
            console.log(err.message)
            return(false,null)
        }


    })
)