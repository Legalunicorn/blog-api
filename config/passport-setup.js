const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user")
require("dotenv").config(); //google client id and secret
console.log("ahem",process.env.GOOGLE_CLIENT_SECRET)



//rememeber to passport.use() this in the app.jszzxx
//TODO config local strategy


//TODO config google oauth strategy
passport.use(
    new GoogleStrategy({
        callbackURL: '/auth/google/redirect',
        //TODO create client ID and secret 
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET

    }, async(accessToken,refreshToken,profile,done)=>{

        //email: 


        //this is the call back function after passport interacts with google and retreive the information
        //we pass this on to the next middleware etc with the done function
        console.log(profile.id);
        console.log(profile.emails[0].value);
        // return done();
        //rofile.displayname

        // const existingGoogleUser = await User.findOne({provider_id:profile.id}).exec();
        // if (existingGoogleUser!==null){
        //     //return such user
        //     done(null,existingGoogleUser)
        // }
        // const existingEmailUser = await User.findOne({email:})
        // add google id to existing email user and return user
        // else create a new user 

    })
)