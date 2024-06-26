const router = require("express").Router();
const authController = require("../controllers/authController")
// const passport = require("passport")
// const GoogleStrategy = require("passport-google-oauth20")


// //NOTE: the base url is "/auth"
router.get("/google",authController.google_get)

//maye like /google/redirect/:source
router.get("/google/redirect",authController.google_redirect_get)

// //TODO create login and signup functions
router.post("/email/signup",authController.email_signup_post)
router.post("/email/login",authController.email_login_get)

module.exports = router