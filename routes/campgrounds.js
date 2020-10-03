var express =require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//INDEX -show all campgrounds
//v7 all app.get replaced by router.get
router.get("/campgrounds",(req,res)=>{
    //get all campgrounds from db
    Campground.find({},function(err,allcampgrounds){
        if (err){console.log(err)}
       else{
           res.render(
           "campgrounds/index",{anyname : allcampgrounds,page:'campgrounds'}); //here anyname can literally be given any name including campgrounds} 
       }    // page is used in navbar for active nav                                               
    });
    });
    
    router.post("/campgrounds",middleware.isLoggedIn,(req,res)=>{
        //get data from form and add to campgrounds array
        var name =req.body.title;
        var price = req.body.price;
        var image =req.body.image;
        var desc = req.body.description;
        var author ={
            id : req.user._id,
            username:req.user.username
        }
        var newcampground ={title: name,price:price,image:image, description :desc,author:author};
        

        
        //Dont need anymore-campgrounds.push(newcampground);
        //Create a new campground and save to DB
        Campground.create(newcampground,function(err,newlycreated){
         if(err){console.log(err);}
         else{ res.redirect("/campgrounds"); } //redirect back to campgrounds page
         
      });
    });  
    // NEW - show form to create new campgrounds
    router.get("/campgrounds/new",middleware.isLoggedIn,(req,res)=>{
        res.render("campgrounds/new.ejs");
    
    });
    //SHOW-show info about specific ..
    
    router.get("/campgrounds/:id",(req,res)=>{
      //res.send("This will be the show page one day");
    //find the campground by provided id
    Campground.findById(req.params.id).populate("comments").exec((err,foundcampground)=>{
    if(err || !foundcampground){
        console.log(err);
        req.flash("error","Campground not found");
        res.redirect("back");
        }
        else{
                console.log(foundcampground);     
             res.render("campgrounds/show.ejs",{campground : foundcampground});
            }
    });
      
    });
//Edit campground routes
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
  Campground.findById(req.params.id,function(err,foundcampground){
      if(err){
        
        res.redirect("/campgrounds")
      }
      else{
        res.render("campgrounds/edit",{campground:foundcampground});
      }
  });

    
});
//Update Campground Routes
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    //find and update current campground
    
    Campground.findByIdAndUpdate(req.params.id,req.body.wrap,(err,updatedCampground)=>{
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);  
        }
    });
});
//destroy campground route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndDelete(req.params.id,(err)=>{
        if(err){res.redirect("/campgrounds");}
        else {
            res.redirect("/campgrounds");
        }
    })
});


    module.exports= router;