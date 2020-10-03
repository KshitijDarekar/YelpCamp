var express= require("express");
var app= express();
var bodyparser =require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy =require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash =require("connect-flash");

var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment   = require("./models/comment");
//seedDB();



app.use(flash());
//Requiring Routes
var commentRoutes =require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Charizrad",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentuser=req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// local mongodb setup
//mongoose.connect("mongodb://localhost:27017/yelpcamp",{ useNewUrlParser: true, useUnifiedTopology: true });

const url = process.env.DATABASEURL || "mongodb://localhost:27017/yelpcamp" ;
// Mongodb Atlas Setup (Cloud)
mongoose.connect(url,
{ useNewUrlParser: true, useUnifiedTopology: true 
}).then( ()=>{
    console.log("Connected to DB!");
}).catch( err=>{
    console.log("Error :",err.message);
});




app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

app.set("view engine","ejs") ;
app.use(methodOverride("_method"));

//,(error,response,body)=>{})

//schema setup
// var campgroundSchema =new mongoose.Schema({
//     title : String,
//     image : String,
//     description : String,
// });
// var Campground =mongoose.model("Campground",campgroundSchema);
//CREATE - Create new campgrounds
// Campground.create(
//     {title :"ooty", image:"http://tiny.cc/y5vdoz",description: "WELCOME TO INDIA",},
//     function(err,campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("Newly created campground");
//             console.log(campground);
//         }
    

// });
app.get("/",(req,res)=>{
res.render("landing");
});
var campgrounds =[
    {title :"ooty", image:"http://tiny.cc/y5vdoz",description: "WELCOME TO INDIA",},
    {title :"ladhak", image:"http://tiny.cc/3vvdoz",description: "WELCOME TO INDIA",},
    {title :"kutch", image:"http://tiny.cc/x0vdoz",description: "WELCOME TO INDIA",},
    {title :"manali", image:"http://tiny.cc/g3vdoz",description: "WELCOME TO INDIA",}
];
// //INDEX -show all campgrounds
// app.get("/campgrounds",(req,res)=>{
// //get all campgrounds from db
// Campground.find({},function(err,allcampgrounds){
//     if (err){console.log(err)}
//    else{res.render("campgrounds/index",{anyname : allcampgrounds}); //here anyname can literally be given any name including campgrounds} 
//    }                                                   
// });
// });

// app.post("/campgrounds",(req,res)=>{
//     //get data from form and add to campgrounds array
//     var name =req.body.title;
//     var image =req.body.image;
//     var desc = req.body.description;
//     var newcampground ={title: name,image:image, description :desc};
    
//     //Dont need anymore-campgrounds.push(newcampground);
//     //Create a new campground and save to DB
//     Campground.create(newcampground,function(err,newlycreated){
//      if(err){console.log(err);}
//      else{ res.redirect("/campgrounds"); } //redirect back to campgrounds page
     
//   });
// });  
// // NEW - show form to create new campgrounds
// app.get("/campgrounds/new",(req,res)=>{
//     res.render("campgrounds/new.ejs");

// });
// //SHOW-show info about specific ..

// app.get("/campgrounds/:id",(req,res)=>{
//   //res.send("This will be the show page one day");
// //find the campground by provided id
// Campground.findById(req.params.id).populate("comments").exec((err,foundcampground)=>{
// if(err){
//     console.log(err);}
//     else{
//             console.log(foundcampground);     
//          res.render("campgrounds/show.ejs",{campground : foundcampground});
//         }
// });
  
// });
// ///=======================================================================================================
// // COMMENTS ROUTES
// ///=======================================================================================================
// app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
//     Campground.findById(req.params.id,(err,campground)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             res.render("comments/new",{campground:campground});
//         }
//     });   
    
// });

// app.post("/campgrounds/:id/comments",isLoggedIn,(req,res)=>{
// //lookup campground using ID
// Campground.findById(req.params.id,(err,campground)=>{
//    if(err){
//        console.log(err);
//        res.redirect("/campgrounds");
//    } 
//    else{
//        Comment.create(req.body.comment,(err,comment)=>{
//            if(err){console.log(err);}
//            else{ 
//                campground.comments.push(comment);
//                campground.save();
//                res.redirect("/campgrounds/"+campground._id);
//              }
//        });
//    }
// });

// });
// //========================
// //AUTH ROUTES
// //=========================
// // SHOW REGISTER FORM
// app.get("/register",(req,res)=>{
//     res.render("register");
// });

// app.post("/register",(req,res)=>{
//     var newUser = new User({username:req.body.username});
//     User.register(newUser,req.body.password,(err,user)=>{
//         if(err){
//             console.log(err);
//             return res.render("register");
//         }
//         passport.authenticate("local")(req,res,()=>{
//             res.redirect("/campgrounds")
//         });
//     });
// });

// //show login form
// app.get("/login",(req,res)=>{
//     res.render("login");
// })
// //app.post("login",middleware,callback();
// app.post("/login",passport.authenticate("local",
// {
//        successRedirect:"/campgrounds",
//        failureRedirect : "/login"
// }),(req,res)=>{
// });;

// //logout route
// app.get("/logout",(req,res)=>{
//     req.logout();
//     res.redirect("/campgrounds");
// });
// //MIDDLE WARE FUNCTION FOR CHECKING IF USER IS LOGGED IN
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//              return next();
//     }
//     res.redirect("/login");
// }

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT,()=>{
    console.log("THe Yelpcamp server Has started");
 });