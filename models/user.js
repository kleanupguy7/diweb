var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var friends = require("mongoose-friends");

var UserSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    password:String,
    username:{type:String, unique:true , sparse: true},
    tel:String,
    userAvatar:String,
    work:String,
    education:String,
    skills:[{type:String}],
    job:String,
    company:String,
    isAdmin:{type: Boolean ,default:false},
    discussions:[
        {type:mongoose.Schema.Types.ObjectId,
            default: []
        }
    ],
    openchats:[{
        type:mongoose.Schema.Types.ObjectId
        ,ref:"User"
        ,default:[]
    }],
    visibility:{
        firstname:{type:Boolean,default:true},
        lastname:{type:Boolean,default:true},
        tel:{type:Boolean,default:true},
        company:{type:Boolean,default:true},
        job:{type:Boolean,default:true},
        skills:{type:Boolean,default:true},
        education:{type:Boolean,default:true}
    }
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(friends());
module.exports = mongoose.model('User',UserSchema);