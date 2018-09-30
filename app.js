var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    seedDB      = require("./seed"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    https = require("https"),
    fs = require("fs"),
    url = require("url");

    
var indexRoute = require("./routes/index");
var wallRoute = require("./routes/wall");
var userRoute = require("./routes/users");
    
    

mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true });
// mongoose.connect("mongodb://Stefanos:STF7833ftbl@ds215563.mlab.com:15563/linkedout",{ useNewUrlParser: true });
// mongodb://Stefanos:STF7833ftbl@ds215563.mlab.com:15563/linkedout

mongoose.set('useCreateIndex', true);
    
mongoose.Promise = require('bluebird');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use("/uploads",express.static(__dirname + "/uploads"));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); //add admin


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


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/",indexRoute);
app.use("/users",userRoute);
app.use("/wall",wallRoute);

// var options = {
//     key: fs.readFileSync('csr.pem'),
//     cert: fs.readFileSync('server.crt')
// };

// https.createServer(options, function(req, res) {

//     console.log("This works!");

//     res.writeHead(200);
//     res.end("Hello world from Cloud9! Url:"+req.url);

// }).listen(process.env.PORT,process.env.IP,function(){
//     console.log("Server Started");
// });

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started");
});