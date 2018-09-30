var express = require("express");
var router = express.Router();
var passport = require("passport");
var multer = require("multer");
var User = require("../models/user");
var middleware = require("../middleware/ware");
var builder = require('xmlbuilder');
var fs     = require('fs');
var dirPath =__dirname + "/../xmlfiles/UserData.xml";

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


//ROOT ROUTE
router.get("/", function(req, res){

        res.render("landing");

});

//REGISTER
router.get("/register", function(req, res){
   res.render("register", {page: "register"}); 
});


//create user
router.post("/register",upload.single("userAvatar"), function(req, res) {
    var newUser;
    if(req.file){
        newUser = new User({firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, tel: req.body.tel, userAvatar: req.file.filename});
    } else {
        newUser = new User({firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, tel: req.body.tel });
    }
    User.register(newUser, req.body.password, function(err, user){
       if((err) || (req.body.username=="admin")){
           req.flash("error", err.message);
           return res.render("register", {error: err.message});
       }
      passport.authenticate("local")(req, res,function(){
          req.flash("success", "Welcome to LinkedOut " + user.firstname);
          res.redirect("/wall");
      });
   });
});


//LOGIN
router.get("/login", function(req, res) {
   res.render("login", {page: "login"}); 
});


//login logic
router.post("/login", passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash:true,
            }),function(req,res){
                User.findOne({username: req.body.username}, function(err, user){
                    if(user.isAdmin == true)
                        res.redirect("/admin");
                    else
                        res.redirect("/wall");
                });
});


router.get("/admin",middleware.isAdmin,function(req, res) {
    User.find({},function(err, allUsers){
        if(err){
            console.log(err);
        }else{
            res.render("admin",{user:allUsers});
        }
    });
});

router.get("/admin/users",middleware.isAdmin,function(req, res) {
    User.find({},function(err, allUsers){
        if(err){
            console.log(err);
        }else{
            var xml = builder.create('UserData');
            allUsers.forEach(function(user,index){
                xml.ele("User")
                    .ele("firstname", user.firstname).up()
                    .ele("lastname", user.lastname).up()
                    .ele("Work", user.work).up()
                    .ele("Job", user.job).up()
                    .ele("Skills", user.skills.toString()).up()
                    .ele("Company", user.company).up()
                    .ele("Education", user.education).up()
                    .ele("Phone", user.tel).end({ pretty: true});        
            });
            fs.writeFile(dirPath, xml, function(err) {
                if(err) {
                    return console.log(err);
                }
                res.redirect("/admin");
            });
        }
    });
});


//logout
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged Out Successfully");
    res.redirect("/");
});


module.exports = router;