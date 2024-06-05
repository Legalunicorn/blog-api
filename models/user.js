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
    },
    //dont think i neeed this?..
    // token:{ //for the jwt ? .. 
    //     type:String,
    //     default: ""
    // }
})

UserSchema.static.emailSignup = async (email,password,display_name)=>{
    const exist = await this.findOne({email}).exec();
    if (exist){
        throw Error('Email already in use')
    } else{
        const user = new this.create({
            display_name,
            email,
            hashed_password: encryptPassword(password)
        })
        
        await user.save();
        return user;

    }
}

UserSchema.static.emailLogin = async(email,password)=>{
    //check both fields
    if (!email || !password){
        throw Error("All fields must be field")
    }

    const user = await this.findOne({email}).exec();
    if (!user){
        throw Error("Incorrect email")
    }

    isValid = validPassword(password,user.hashed_password)
    if (!isValid){
        throw Error("Password is Incorrect.")
    }

    //good to go
    return user;
}


module.exports = mongoose.model("User",UserSchema);

module.exports.encryptPassword = function(password){
    const salt = bcrypt.genSaltSync(10); //random salt
    const hash = bcrypt.hashSync(password,salt,null);
    return hash
}

module.exports.validPassword= function(password,hash){
    return bcrypt.compareSync(password,hash);
}
