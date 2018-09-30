var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var friendsSchema = new mongoose.Schema({
    parties:[{type: mongoose.Schema.Types.ObjectId,ref:'user'}],
    request: {type: mongoose.Schema.Types.ObjectId,ref:'user'},
    status:{type:Number,
        enums:[
            0, //add friend
            1, // requested
            2, //pending
            3  //friends
            ] 
    }
});

module.exports = mongoose.model('Friends', friendsSchema);