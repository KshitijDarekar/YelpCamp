var express =require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment   = require("../models/comment");
var middleware = require("../middleware/index.js");
// COMMENTS new
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err|| !campground){
            console.log(err);
            req.flash("error","Campground not found");
            return res.redirect("back");
        }
        else{
            res.render("comments/new",{campground:campground});
        }
    });   
    
});
// create new comment
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,(req,res)=>{
//lookup campground using ID
Campground.findById(req.params.id,(err,campground)=>{
   if(err){
       console.log(err);
       req.flash("error","Something went Wrong");
       return res.redirect("/campgrounds");
   } 
   else{
       Comment.create(req.body.comment,(err,comment)=>{
           if(err){console.log(err);}
           else{ 
               //add username and id to comment
               comment.author.id= req.user._id;
               comment.author.username= req.user.username;               
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success","Comment Added Succesfully");
               res.redirect("/campgrounds/"+campground._id);
             }
       });
   }
});

});
//Comment Edit Route
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
   Campground.findById(req.params.id,(err,foundCampground)=>{
       if(err || !foundCampground){
        req.flash("error","Campground not found");
        return res.redirect("back");
       }
       Comment.findById(req.params.comment_id,(err,foundcomment)=>{
            if(err){
              res.redirect("back");
            }else{
              res.render("comments/edit",{campground_id: req.params.id,comment:foundcomment});          
        }
      })
   })
});
//Comment Updte Route
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    //res.send("You hit the update route for comment"); 
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedcomment)=>{
        if(err){
            res.redirect("/campgrounds");

        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });

});
//COMMENT DESTROY
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
   // res.send("this is the destroy comment route");
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err){res.redirect("back");}
        else{
            req.flash("success","Comment deleted Sucessfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports= router;