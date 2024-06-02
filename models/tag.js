const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    name:{
        type:String,
        required: true,
        maxLength: 100,
        unique: true,
    }
})


module.exports = mongoose.model("Tag",TagSchema);