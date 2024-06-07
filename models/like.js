const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: "Article",
        required:true,
    }
})


module.exports= mongoose.model("Like",LikeSchema);