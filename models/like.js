const mongoose = require("mongoose");
const Scehma = mongoose.Schema;

const LikeSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    post:{
        types: Schema.Types.ObjectId,
        ref: "Post",
        required:true,
    }
})


exports.module = mongoose.model("Like",LikeSchema);