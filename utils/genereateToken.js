const jwt = require("jsonwebtoken")

module.exports = function generateToken(id){
    return jwt.sign({id},process.env.SECRET,{expiresIn:'10m'})
}