var express = require("express");
var router  = express.Router();
var Posts = require("../models/posts");
var middleware = require("../ware");

//index: show all posts
router.get("/",function(req,res){
    //get all posts from db
    Posts.find({},function(err,allPosts){
        if(err){
            console.log(err);
        }else{
            res.render("wall/index",{posts:allPosts});
        }
    });
});

//add new post to the wall
router.post("/",middleware.isLoggedIn,function(req,res){
    var text = req.body.text
    
})