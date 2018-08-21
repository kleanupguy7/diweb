var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res){
   res.render("landing");
});

//REGISTER
router.get("/register", function(req, res){
   res.render("register", {page: "register"}); 
});

//FIX'D : Πρέπει να έχεις username για να μπει στο DB
//******************** Πρεπει να σετάρουμε το user name να ειναι mail ***************
//create user
router.post("/register", function(req, res) {
    var newUser = new User({firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, tel: req.body.tel, photo: req.body.photo});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           req.flash("error", err.message);
           return res.render("register", {error: err.message});
       }
       passport.authenticate("local")(req, res,function(){
           req.flash("success", "Welcome to LinkedOut " + user.firstname);
           res.render("welcomepage");
       });
   });
});

//login form

router.get("/login",function(req,res){
    res.render("/login");
});

//login logic
router.post("/login",passport.authenticate("local",
            {
                successRedirect: "/wall",
                failureRedirect: "/login"
            }),function(req,res){
});

//logout

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged Out Successfully");
    res.redirect("/welcomepage");
});


module.exports = router;