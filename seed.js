var mongoose = require("mongoose");
var User = require("./models/user");
var Posts   = require("./models/posts");

// var userdata = [
//     {
//         firstname: "Panos", 
//         lastname: "Panagiotidis",
//         password: "panos",
//         photo: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
//         username:  "panos@panos.org",
//     },
//     {
//         firstname: "Stefanos", 
//         lastname: "Dianellos",
//         password: "stefanos",
//         photo: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
//         username:  "stefanos@stefanos.com",
//     },
//     {
//         firstname: "Randomas",
//         lastname: "Random",
//         password: "random",
//         photo: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
//         username:  "random@random.gr",
//     }
// ]


var admindata = [
    
    {
        firstname: "7",
        lastname: "7",
        password: "7",
        username: "7",
        isAdmin: true
    }
    
];

var postdata = [
    {
        text:"Sample Post #1",
        author:"Your Daddy"
    },
     {
        text:"Sample Post #2",
        author:"PLEASE DONT TOUCH MY RAF"
    },
     {
        text:"Sample Post #3",
        author:"HOE DON'T STEP ON MY RAF SIMMONS"
    },
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
    //Add admin
    User.remove({},function(err){
         if(err){
             console.log("error1");
         }
         console.log("Removed Users");
        User.create(admindata[0],function(err,user){
            if(err){
                console.log(err);
            }else{
                console.log(admindata);
            }
        });
    })
}
    
    
    
//   //Remove posts
   
//   Posts.remove({}, function(err){
//         if(err){
//             console.log("error1");
//         }
//         console.log("removed posts!");
//          //add a few campgrounds
//         postdata.forEach(function(seed){
//             Posts.create(seed, function(err, post){
//                 if(err){
//                     console.log(err);
//                 } else {
//                     post.save();
//                     console.log("added a Post");
//                 }
//             });
//         });
//     }); 
//     //add a few comments

module.exports = seedDB;