var Posts = require("../models/posts");
var Ads = require("../models/ads");
var User = require("../models/user");

var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Posts.findById(req.params.id, function(err, foundPost){
           if(err){
               req.flash("error", "Post not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundPost.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkAdOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Ads.findById(req.params.comment_id, function(err, foundAd){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundAd.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isAdmin = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.body.username == "admin"){
            return next();
        }
        else{
            req.flash("error", "You need to be admin to move to that page");
            res.redirect("wall");
        }
        
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;