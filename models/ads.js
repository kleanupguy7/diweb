var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var AdSchema = new mongoose.Schema({
    text: String,
    id: { type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    username:String
});


AdSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Post", AdSchema);