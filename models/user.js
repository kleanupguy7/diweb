var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    password:String,
    username:String,
    tel:String,
    photo: { data: Buffer, contentType: String }
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);