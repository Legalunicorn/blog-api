const mongoose = require("mongoose");

function is_valid_mongoID(id){
    return (mongoose.Types.ObjectId.isValid(id))
}

module.exports = is_valid_mongoID