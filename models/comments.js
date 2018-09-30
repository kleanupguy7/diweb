var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts"
        },
        username: String
    }
});


commentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Comments", commentSchema);