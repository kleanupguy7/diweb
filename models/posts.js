var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var PostSchema = new mongoose.Schema({
    text: String,
    id: { type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    username:String
});


PostSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Post", PostSchema);