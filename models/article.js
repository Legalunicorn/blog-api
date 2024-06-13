const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title:{
        type: String,
        maxLength:300,
        require: true,
    },
    body:{
        type: String, //this is markdown
        maxLength: 50000,
        required:true,
    },
    tags:{
        type:[Schema.Types.ObjectId],
        ref: "Tag"
    },
    image:{
        //url to image
        type: String,
    },
    likes_count:{
        type: Number,
        require:true,
        default:0,
        min:0,
        
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
},{
    timestamps:true //createdAt and updatedAt automatically
})

module.exports= mongoose.model("Article",ArticleSchema);