const router = require("express").Router();
const authController = require("../controllers/authController")
// const passport = require("passport")
// const GoogleStrategy = require("passport-google-oauth20")
// require("dotenv").config(); //google client id and secret


// //NOTE: the base url is "/auth"
router.get("/google",authController.google_get)


router.get("/google/redirect",authController.google_redirect_get)

//TODO create login and signup functions
// router.post("login",authController.login_post)
// router.post("signup",authController.signup_post)

module.exports = router