var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var Posts   = require("../models/posts");
var middleware = require("../middleware/ware");

//index: show all posts
router.get("/",middleware.isLoggedIn,function(req,res){
    //Get all posts from friends
    Posts.find({},function(err, allPosts){
        if(err){
            console.log(err);
        }else{
            res.render("wall/index",{posts:allPosts});
        }
    });
});

//add new post to the wall
router.post("/",middleware.isLoggedIn,function(req,res){
    var text = req.body.usertext;
    //var image = req.body.image;
    
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newPost = {text: text,author:author};
    
    Posts.create(newPost,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
            res.redirect("wall/index");
        }
    });
    
});


//EDIT 

router.get("/:id/edit",middleware.checkPostOwnership,function(req,res){
    Posts.findById(req.params.id,function(err,foundPost){
        if(err){
            console.log(err);
        }
        res.render("posts/edit",{post:foundPost});
    });
});


//UPDATE POST

router.put("/:id",middleware.checkPostOwnership, function(req, res){
    // find and update the correct post
    Posts.findByIdAndUpdate(req.params.id, req.body.posts, function(err, updatedPost){
       if(err){
           res.redirect("/wall");
       } else {
           //redirect somewhere(show page)
           res.redirect("/wall/" + req.params.id);
       }
    });
});



module.exports = router;