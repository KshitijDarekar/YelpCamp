var express =require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",(req,res)=>{
    res.render("landing");
    });
//========================
//AUTH ROUTES
//=========================
// SHOW REGISTER FORM
router.get("/register",(req,res)=>{
    res.render("register");
});

router.post("/register",(req,res)=>{
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");

           // return res.render("register",{"error":err.message});// alternative
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome to Yelpcamp"+user.username);
            res.redirect("/campgrounds")
        });
    });
});

//show login form
router.get("/login",(req,res)=>{
    //res.render("login",{"success":"Welcome back"});
    //return res.render("login",{"success":"Welcome back"});
      res.render("login");
})
//app.post("login",middleware,callback();
router.post("/login",passport.authenticate("local",
{
       successRedirect:"/campgrounds" ,
       failureRedirect : "/login",
       //successFlash: true
       
       
}),(req,res)=>{
});;

//logout route
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged out Successfully!!")
    res.redirect("/campgrounds");
});


module.exports= router;

