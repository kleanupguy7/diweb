var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Posts = require("../models/posts");
var Ads = require("../models/ads");
var Convos = require("../models/conversations");
var Message = require("../models/messages");
var middleware = require("../middleware/ware");



//ADD A FRIEND
router.post("/friends/:friendId",function(req,res){
    User.requestFriend(req.user.id,req.params.friendId,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/users/friends"); 
        }
    });
   
});

//SHOW FRIENDS ROUTE
router.get("/friends",middleware.isLoggedIn, function(req, res){
    User.find({},function(err, allUsers){
        if(err){
            console.log(err);
        }else{
            User.findById(req.user.id,function(err, foundUser) {
                if(err){
                    console.log(err);
                }
                else{
                    User.getFriends(foundUser, function (err, friendships) {
                            if(err){
                                console.log(err);
                            }
                          else{
                                res.render("users/friends",{user:allUsers,friendships:friendships});
                          }
                          
                    });
                }
            });
        }
        
    });
});

//ADD A FRIEND
router.get("/notifications/add/:friendId",function(req,res){
    User.requestFriend(req.user.id,req.params.friendId,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/users/notifications"); 
        }
    });
   
});

//REMOVE A FRIEND
router.get("/notifications/remove/:friendId",function(req,res){
    User.findById(req.user.id,function(err,loggedInUser){
        if(err){
            console.log(err);
        }else {
            User.findById(req.params.friendId,function(err,friendUser){
               if(err){
                   console.log(err);
               }else {
                   User.removeFriend(loggedInUser, friendUser, function(err){
                       if(err){
                           console.log(err);
                       }else {
                           res.redirect("/users/notifications");
                       }
                   });
               }
            });
        }
    });
});

//SHOW NOTIFICATIONS ROUTE
router.get("/notifications",middleware.isLoggedIn, function(req, res){
    User.findById(req.user.id,function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            User.getFriends(foundUser, function (err, friendships) {
                if(err){
                    console.log(err);
                }else {
                    Posts.find({}).where("author.id").equals(foundUser.id).populate("comments").exec(function(err, allPosts){
                        if(err){
                            console.log(err);
                        }else {
                            var likers = [];
                            allPosts.forEach(function(post){
                                post.likers.forEach(function(liker){
                                    likers.push(liker);
                                });
                            });
                            var promises = [];
                            var users =[];
                            for(var i=0; i<likers.length; i++){
                                promises.push(User.findById(likers[i],function(err, foundUser) {
                                    if(err){
                                        console.log(err);
                                    }else{
                                        users.push(foundUser.firstname);
                                    }
                               }));  
                                
                            }
                            Promise.all(promises).then(function () {
                                res.render("users/notifications", {friendships: friendships, posts: allPosts, likers: users});
                            });
                        }
                    });
                }
                 
            });
        }
    });
});



//SHOW NETWORK
router.get("/network",middleware.isLoggedIn, function(req, res){
    User.find({},function(err, allUsers){
        if(err){
            console.log(err);
        }else{
            User.findById(req.user.id,function(err, foundUser) {
                if(err){
                    console.log(err);
                }
                else{
                    User.getFriends(foundUser, function(err, friendships) {
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.render("users/network",{user:allUsers,friendships:friendships});
                        }
                    });
                }
            });
        }
    });
});

//SHOW PAGE FOR SEARCH BUTTON
router.get("/network/search",middleware.isLoggedIn, function(req, res) {
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        User.find({firstname: regex}, function(err, allUsers) {
           if(err){
               console.log(err);
           }else {
            User.getFriends(req.user._id,function(err,friends){
                if(err){
                    console.log(err);
                }else{
                    var friendsArray = [];
                    for(var k in friends){
                        if(friends[k].status == "accepted"){
                            friendsArray.push(friends[k]._id);
                        }
                    }
                    res.render("users/search",{users:allUsers , friendsList : friendsArray});
                }
                       
            });
           }
        });
        
    }else{
        res.redirect("/users/network");
    }
});




//SHOW ME ROUTE
router.get("/me",middleware.isLoggedIn, function(req, res){
    User.findById(req.user.id,function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            res.render("users/show", {user: foundUser});
        }
    });
});

//UPDATE ME ROUTE
router.put("/me", function(req, res) {
        User.findByIdAndUpdate(req.user.id, req.body.user, function(err, updatedUser){
          if(err){
              console.log(err);
              res.redirect("back");
          }
          else{
              var userSkills = req.body.skills;
              var skillsArray = userSkills.split(/(?:,)+/);
              
              skillsArray.forEach(function(skill){
                  updatedUser.skills.push(skill);
              });

              updatedUser.save();
              
              req.flash("success","Successfully Updated!");
              res.redirect("/users/me");
          }
        });
});

//SHOW NOTIFICATIONS ROUTE
router.get("/advertisements",middleware.isLoggedIn,function(req,res){
    Ads.find(function(err,ads){
        if(err){
            console.log(err);
        }else{
            User.findById(req.user.id, function(err, user) {
                if(err){
                    console.log(err);
                }else {
                    res.render("users/advertisements",{adverts:ads, user:user});
                }
            });
            
        }
    });
});

//GET NEW AD FORM

router.get("/newAd",middleware.isLoggedIn,function(req,res){
    res.render("users/newAd");
});


//POST AD DATA

router.post("/newAd",function(req,res){
   var title = req.body.title;
   var skills = req.body.skills;
   var desc = req.body.desc;
   var company = req.body.company;
   var author = {
       id:req.user._id,
       username:req.user.username
   };
   
   var newAd ={title:title,skills:skills,desc:desc,author:author,company:company};
   Ads.create(newAd,function(err,newlyCreated){
      if(err){
          console.log(err);
      }else{
        res.redirect("/users/advertisements");
      }
   });
   
   
});

//SHOW DISCUSSIONS ROUTE
router.get("/discussions",middleware.isLoggedIn,function(req,res){
        var convlist = [];
        User.findById(req.user.id).populate("openchats").exec(function(err, curUser) {
            if(err){
                console.log(err);
            }else{
                    convlist = curUser.openchats;
                    res.render("users/discussions",{convos:convlist});
            }
        });
});

router.post("/discussions/:recipientId/oldmessage",middleware.isLoggedIn,function(req,res){
    
   User.findById(req.params.recipientId).populate("openchats").exec(function(err,otherUser){
       if(err){
           console.log(err);
       }else{
           User.findById(req.user.id).populate("openchats").exec(function(err,curUser){
               if(err){
                   console.log(err);
               }else{
                    var indexcur = curUser.openchats.indexOf(otherUser);
                    var indexother = otherUser.openchats.indexOf(curUser);
                    
                    curUser.openchats.splice(indexcur,1);
                    otherUser.openchats.splice(indexother,1);
                    
                    curUser.openchats.unshift(otherUser);
                    otherUser.openchats.unshift(curUser);
                    
                    curUser.save();
                    otherUser.save();

                    
                    res.redirect("/users/discussions");
               }
            });
        }
    });
});

router.post("/discussions/:recipientId/message",middleware.isLoggedIn,function(req,res){
       User.findById(req.params.recipientId).populate("openchats").exec(function(err,otherUser){
       if(err){
           console.log(err);
       }else{
           User.findById(req.user.id).populate("openchats").exec(function(err,curUser){
               if(err){
                   console.log(err);
               }else{
                    var participants = [];
                    participants.push(curUser);
                    participants.push(otherUser);
                    
                    var newConv = new Convos({users:participants});
                    var promises = [];
                    
                    promises.push(Convos.create(newConv,function(err,convo){
                        if(err){
                          console.log(err);
                        }else{
                          curUser.discussions.push(otherUser.id);
                          otherUser.discussions.push(curUser.id);
                          otherUser.openchats.unshift(curUser.id);
                          curUser.openchats.unshift(otherUser.id);
                          curUser.save();
                          otherUser.save();
                          newConv.save();
                          console.log("we here");
                          res.redirect("/users/discussions");
                        }
                    }));
                        
               }
            });
        }
    });
  
});

router.get("/discussions/:friendId/chat",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.friendId).populate("openchats").exec(function(err, otherUser) {
        if(err){
          console.log(err);
        }
        User.findById(req.user.id).populate("openchats").exec(function(err,curUser){
            if(err){
                console.log(err);
            }
            Convos.findOne(({users:{"$all" : [curUser,otherUser]}})).populate("message")
            .exec(function(err,conv){
                if(err){
                    console.log(err);
                }else{
                var promises = [];
                var messages = [];
                var convos = curUser.openchats;
                promises.push(conv.message.forEach(function(msg){
                    messages.push(msg);
                }));
                Promise.all(promises).then(function(){
                    res.render("users/chat",{allMessages:messages,friend:otherUser,convos:convos});
                });
            }
            });
        });
        
    });
});

router.post("/discussions/:friendId",function(req,res){
    User.findById(req.user.id,function(err,curUser){
        if(err){
            console.log(err);
        }else{
        
        User.findById(req.params.friendId,function(err,otherUser){
            if(err){
                console.log(err);
            }else{
            Convos.findOne(({users:{"$all" : [curUser,otherUser]}}))
            .exec(function(err,foundConv){
                if(err){
                    console.log(err);
                }else{
                    
                    Message.create(req.body.reply,function(err, newMessage){
                        if(err){
                            console.log(err);
                        }else{
                            newMessage.author.id = req.user._id;
                            newMessage.author.username = req.user.firstname;
                            newMessage.save();
                            foundConv.message.push(newMessage);
                            foundConv.save();
                            res.redirect("/users/discussions/" + req.params.friendId + "/chat");
                        }
                    });
                
                }
            });
            }  
        });
        }
    });
    
});

router.post("/discussions/:convid",function(req,res){
    var reply = new Message({
        conversationId:req.params.conversationId,
        body:req.body.composedMessage,
        author:req.user._id
    });
    
    reply.save(function(err,sentReply){
        if(err){
            console.log(err);
        }
        res.send(reply);
    });
});

//SHOW SETTINGS ROUTE
router.get("/settings",middleware.isLoggedIn, function(req, res){
   res.render("users/settings"); 
});

//UPDATE SETTINGS ROUTE
router.put("/settings",middleware.isLoggedIn, function(req, res){
    User.findById(req.user.id, function(err, user){
       if(err){
           console.log(err);
           res.redirect("back");
       }
        
        var newmail = req.body.username;
        
        
        user.setPassword(req.body.password,function(err){
            if(err){
                console.log(err);
            }else{
                user.username = newmail;
                user.save(function(err){
                    if(err){
                        res.redirect("/");
                    }
                    res.redirect("/wall");
                });
            }
        });
        
    });
});


router.get("/editvisibility",middleware.isLoggedIn,function(req,res){
   res.render("users/editvisibility"); 
});

router.post("/:id/editvisibility",middleware.isLoggedIn,function(req,res){
    console.log(req.body.firstname);
    res.redirect("/wall");
});

//SHOW OTHER USERS PROFILES
router.get("/:friendId/profile",middleware.isLoggedIn, function(req,res){
    User.findById(req.params.friendId, function(err, user){
       if(err){
           console.log(err);
       }else {
           res.render("users/profile", {user: user});
       }
    });
    
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}



module.exports = router;