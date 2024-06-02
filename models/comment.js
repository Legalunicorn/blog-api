const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    body:{
        type: String,
        required:true,
        maxLength: 2
    }
})


modules.export = mongoose.model("Comment",CommentSchema)
//add to the collection "Comment" if u didnt know 