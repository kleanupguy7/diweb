var express = require("express");
var router = express.Router();
var passport = require("passport");
var multer = require("multer");
var User = require("../models/user");
var middleware = require("../middleware/ware");

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname);
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
    console.log(req.file);
    var newUser = new User({firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, tel: req.body.tel, userAvatar: req.file.filename});
    // newUser.photo.data = fs.readFileSync(req.files.userPhoto.path)
    if(req.body.username == "admin" && req.body.password == "admin")
        newUser.isAdmin = true;
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           req.flash("error", err.message);
           return res.render("register", {error: err.message});
       }
      passport.authenticate("local")(req, res,function(){
          req.flash("success", "Welcome to LinkedOut " + user.firstname);
          res.redirect("/wall");
      });
   });
});


//TO BE CHANGED!!!
router.get("/index", function(req, res) {
   res.render("index", {page: "index"}); 
});
router.get("/advertisements", function(req, res) {
   res.render("advertisements", {page: "advertisements"}); 
});
router.get("/discussions", function(req, res) {
   res.render("discussions", {page: "discussions"}); 
});
router.get("/network", function(req, res) {
   res.render("network", {page: "network"}); 
});







//LOGIN
router.get("/login", function(req, res) {
   res.render("login", {page: "login"}); 
});


//login logic
router.post("/login", passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash:true
            }),function(req,res){
                
                User.findOne({username: req.body.username}, function(err, user){
                    if(user.isAdmin == true)
                        res.redirect("/admin");
                    else
                        res.redirect("/wall");
                });
});



//TODO::: MIDDLEWARE για /admin.αν ενας απλος χρηστης ειναι loggedin μπορει να μπει στη /admin!!

router.get("/admin", function(req, res) {
    User.find({},function(err, allUsers){
        if(err){
            console.log(err);
        }else{
            res.render("admin",{user:allUsers});
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