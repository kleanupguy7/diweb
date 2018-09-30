var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var likes = require("mongoose-likes");

var PostSchema = new mongoose.Schema({
    text: {type:String,sparse:true},
    image: {type:String,sparse:true},
    video: {type:String,sparse:true},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments"
        }
    ],
    date:{ type: Date, default: Date.now }
});


PostSchema.plugin(passportLocalMongoose);
PostSchema.plugin(likes);
module.exports = mongoose.model("Posts", PostSchema);