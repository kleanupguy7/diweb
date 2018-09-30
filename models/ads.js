var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var AdSchema = new mongoose.Schema({
    title:String,
    desc: String,
    skills:[{type:String}],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    company:String
});


AdSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Ad', AdSchema);