var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var friends = require("mongoose-friends");
var posts = require("./posts");

var UserSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    password:String,
    username:String,
    tel:String,
    userAvatar:String,
    work:String,
    education:String,
    skills:String,
    isAdmin:{type: Boolean ,default:false}
    //interests:[]
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(friends());
module.exports = mongoose.model('User',UserSchema);