var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware/ware");


//ADD A FRIEND
router.post("/:id/friends/:friendId",function(req,res){
    User.requestFriend(req.params.id,req.params.friendId,function(err){
        if(err){
            console.log(err);
        }else{
            User.findById(req.params.friendId,function(err,foundUser){
                if(err){
                    console.log(err);
                }else{
                    User.getFriends(foundUser, function (err, friendships) {
                        if(err){
                            console.log(err);
                        }
                      // friendships looks like:
                      // [{status: "requested", added: <Date added>, friend: user2}]
                      
                      console.log(friendships[0].status);
                    });
                }
            });
            res.redirect("/users/" + req.params.id + "/friends"); 
        }
    });
   
});

//SHOW FRIENDS ROUTE
router.get("/:id/friends",middleware.isLoggedIn, function(req, res){
    User.find({},function(err, allUsers){
        if(err){
            console.log(err);
        }else{
            User.findById(req.params.id,function(err, foundUser) {
                if(err){
                    console.log(err);
                }
                else{
                    User.getFriends(foundUser, function (err, friendships) {
                            if(err){
                                console.log(err);
                            }
                          // friendships looks like:
                          // [{status: "requested", added: <Date added>, friend: user2}]
                          else{
                                res.render("users/friends",{user:allUsers,friendships:friendships});
                          }
                          
                        });
                }
            });
        }
        
    });
});

//SHOW NOTIFICATIONS ROUTE
router.get("/:id/notifications",middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            User.getFriends(foundUser, function (err, friendships) {
                if(err){
                    console.log(err);
                }
                res.render("users/notifications", {friendships: friendships}); 
            });
        }
    });
});



//SHOW ME ROUTE
router.get("/:id/me",middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            res.render("users/show", {user: foundUser});
        }
    });
});

//UPDATE ME ROUTE
router.put("/:id/me", function(req, res) {
        User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
          if(err){
              console.log(err);
              res.redirect("back");
          }
          else{
              req.flash("success","Successfully Updated!");
              res.redirect("/users/" + req.params.id + "/me");
          }
        });
});

//SHOW SETTINGS ROUTE
router.get("/:id/settings",middleware.isLoggedIn, function(req, res){
   res.render("users/settings"); 
});

//UPDATE SETTINGS ROUTE
router.put("/:id/settings",middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
       if(err){
           console.log(err);
           res.redirect("back");
       }

        user.username = req.body.username;
        user.setPassword(req.body.password, function(err) {
            if(err){
                console.log(err);
            }
            user.save(function(err,updatedUser){
                if(err){
                    console.log(err);
                }
                passport.authenticate("local")(req, res, function(){
                    req.flash("success","Successfully Updated username to :"+ updatedUser.username + "pass :" + updatedUser.password);
                    res.redirect("back");   
                });
                    
            });
        });
    });
});



module.exports = router;