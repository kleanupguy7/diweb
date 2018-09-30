var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var PostSchema = new mongoose.Schema({
    text: String,
    image: String,
    author: String
    // author:{
    //     id:{
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:"User"
    //     },
    //     username:String
    // }
});


PostSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Posts", PostSchema);