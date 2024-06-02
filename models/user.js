const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const randomName = require("../utils/randomName")


const UserSchema = new Schema({
    display_name:{
        type:String,
        maxLength: 50,
        default: randomName() //user can change later on
    },
    email:{
        type:String,
        required:true,
    },
    is_admin:{
        type: Boolean,
        default: false
    },
    is_writer:{
        type: Boolean,
        default:false
    },
    provider_id:{
        type: String,
        unique: true,
        
    },
    hashed_password:{
        type: String
    }
})

module.exports = mongoose.model("User",UserSchema);

module.exports.encryptPassword = function(password){
    const salt = bcrypt.genSaltSync(10); //random salt
    const hash = bcrypt.hashSync(password,salt,null);
    return hash
}

module.exports.validPassword= function(password,hash){
    return bcrypt.compareSync(password,hash);
}
