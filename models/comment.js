const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//comment has no author

const CommentSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    article:{
        type: Schema.Types.ObjectId,
        ref:"Article",
        required:true
    },
    body:{
        type: String,
        required:true,
        maxLength: 3000
    }
})


module.exports = mongoose.model("Comment",CommentSchema)
//add to the collection "Comment" if u didnt know 