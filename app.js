var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    seedDB      = require("./seed"),
    bodyParser = require("body-parser"),
    Posts = require("./models/posts"),
    Ads = require("./models/ads");
    
var indexRoute = require("./routes/index");
//var wallRoute = require("./routes/wall");
    
mongoose.connect("mongodb://localhost/LinkedOut",{ useNewUrlParser: true });
    
mongoose.Promise = require('bluebird');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());


//seedDB();


app.use(require("express-session")({
    secret: "Whatever",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/",indexRoute);
//app.use("/wall",wallRoute);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started");
});