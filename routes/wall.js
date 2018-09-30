var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var Posts   = require("../models/posts");
var Comments = require("../models/comments");
var middleware = require("../middleware/ware");
var multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null,new Date().toISOString() + file.fieldname);
    }
});

var fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
    
};

var upload = multer({
    storage: storage,
    limits: {
        filesize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


//add new post to the wall
router.post("/",middleware.isLoggedIn,upload.single("image"),function(req,res){
    
    var author = {
        id: req.user._id,
        username:req.user.firstname
    };
    var npost;
    if(req.file){
        npost = new Posts({text:req.body.usertext,author : author ,image: req.file.filename});
    }else {
        npost = new Posts({text:req.body.usertext,author : author });
    }
        
    
    Posts.create(npost,function(err,post){
        if(err){
            req.flash("error","ERROR PERSON");
            console.log(err);
        }else{
            res.redirect("/wall");
        }
    });
});


//index: show all posts
router.get("/",middleware.isLoggedIn,function(req,res){
    //Get all posts from friends
    Posts.find({}).sort({date: -1}).exec(function(err, allPosts){
        if(err){
            console.log(err);
        }else{
            User.getFriends(req.user._id,function(err,friends){
                if(err){
                    console.log(err);
                }else{
                    var friendsarray = [];
                    for(var k in friends){
                        if(friends[k].status == "accepted"){
                            friendsarray.push(friends[k]._id);
                        }
                    }
                    res.render("wall/index",{posts:allPosts , friendships : friendsarray});
                }
                       
            });
           
        }
    });
});


//COMMENT A POST
router.get("/post/:id",middleware.isLoggedIn, function(req,res){
    Posts.findById(req.params.id).populate("comments").exec(function(err, currentPost){
        if(err){
            console.log(err);
            res.redirect("/wall");
        }
        else{
            User.findById(currentPost.author.id, function(err, user) {
                if(err){
                    console.log(err);
                }else {
                    res.render("wall/post", {post: currentPost, user:user});
                }
            });
        }
    });
});


router.post("/post/:id",middleware.isLoggedIn, function(req,res){
    Posts.findById(req.params.id, function(err, currentPost){
        if(err){
            console.log(err);
            res.redirect("/wall");
        }
        else{
            Comments.create(req.body.comment, function(err, comment){
               if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.firstname;
                   comment.save();
                   currentPost.comments.push(comment);
                   currentPost.save();
                   req.flash("success", "Successfully added comment");
                   res.redirect("/wall/post/" + currentPost._id);       
               }
            });
            
        }
    });
});

//LIKE A POST
router.post("/post/:id/like",middleware.isLoggedIn, function(req,res){
    Posts.findById(req.params.id,function(err,foundpost){
        if(err){
            console.log(err);
        }else{
            Posts.like(foundpost,req.user.id,function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect("back");
                }
            });
        }
    });
});

//DISLIKE A POST
router.post("/post/:id/dislike",middleware.isLoggedIn, function(req,res){
    Posts.findById(req.params.id,function(err,foundpost){
        if(err){
            console.log(err);
        }else{
            Posts.dislike(foundpost,req.user.id,function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect("back");
                }
            });
        }
    });
});





module.exports = router;