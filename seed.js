var mongoose = require("mongoose");
var User = require("./models/user");
//var Comment   = require("./models/comment");

var data = [
    {
        firstname: "Panos", 
        lastname: "Panagiotidis",
        password: "panos",
        photo: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        username:  "panos@panos.org",
    },
    {
        firstname: "Stefanos", 
        lastname: "Dianellos",
        password: "stefanos",
        photo: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        username:  "stefanos@stefanos.com",
    },
    {
        firstname: "Randomas",
        lastname: "Random",
        password: "random",
        photo: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        username:  "random@random.gr",
    }
]

// function seedDB(){
//     User.remove({},function(err){
//         if(err){
//             console.log("error1");
//         }
//         console.log("Removed Users");
//     //adding users
//     data.forEach(function(seed){
//         User.create(seed,function(err,user){
//             if(err){
//                 console.log("error2");
//             }else{
//                 console.log("Added User");
//             }
//         })
//     })
//     })
// }


function seedDB(){
   //Remove all campgrounds
   User.remove({}, function(err){
        if(err){
            console.log("error1");
        }
        console.log("removed User!");
         //add a few campgrounds
        data.forEach(function(seed){
            User.create(seed, function(err, user){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a User");
                    //create a comment
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;