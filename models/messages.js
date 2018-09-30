var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
    text:
    {
        type:String,
        required:true
    },
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username:String
    }
},
    {
        timestamps:true
    });

module.exports = mongoose.model('Messages',messageSchema);