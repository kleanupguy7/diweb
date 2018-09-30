var mongoose = require("mongoose");

var conversationSchema = new mongoose.Schema({
    users:[{
       user:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
    }],
    message:[{
       type: mongoose.Schema.Types.ObjectId,
       ref: "Messages"
    }]
    });

module.exports = mongoose.model('Conversations',conversationSchema);