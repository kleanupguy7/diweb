var mongoose = require("mongoose");
var User = require("./models/user");
var Posts   = require("./models/posts");




function seedDB(){
    var firstname="Panos";
    var lastname = "Panagiotidis";
    var username = "admin";
    var password = "admin";
    var tel = "6982431412";
    var isAdmin = true;
    
    var newUser = new User({firstname:firstname,lastname:lastname,username:username,tel:tel,isAdmin:isAdmin});
    
    User.register(newUser,password,function(err,user){
       if(err){
           console.log(err);
       } 
       console.log("admin registered");
    });
}

module.exports = seedDB;