var express= require("express");
var app= express();
var bodyparser =require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelpcamp",{ useNewUrlParser: true, useUnifiedTopology: true });



app.use(bodyparser.urlencoded({extended:true}));

app.set("view engine","ejs") ;
//,(error,response,body)=>{})

//schema setup
var campgroundSchema =new mongoose.Schema({
    title : String,
    image : String,
    description : String,
});
var Campground =mongoose.model("Campground",campgroundSchema);
//CREATE - Create new campgrounds
Campground.create(
    {title :"ooty", image:"http://tiny.cc/y5vdoz",description: "WELCOME TO INDIA",},
    function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log("Newly created campground");
            console.log(campground);
        }
    

});
app.get("/",(req,res)=>{
res.render("landing");
});
var campgrounds =[
    {title :"ooty", image:"http://tiny.cc/y5vdoz",description: "WELCOME TO INDIA",},
    {title :"ladhak", image:"http://tiny.cc/3vvdoz",description: "WELCOME TO INDIA",},
    {title :"kutch", image:"http://tiny.cc/x0vdoz",description: "WELCOME TO INDIA",},
    {title :"manali", image:"http://tiny.cc/g3vdoz",description: "WELCOME TO INDIA",}
];
//INDEX -show all campgrounds
app.get("/campgrounds",(req,res)=>{
//get all campgrounds from db
Campground.find({},function(err,allcampgrounds){
    if (err){console.log(err)}
   else{res.render("index",{anyname : allcampgrounds}); //here anyname can literally be given any name including campgrounds} 
   }
});
});

app.post("/campgrounds",(req,res)=>{
    //get data from form and add to campgrounds array
    var name =req.body.title;
    var image =req.body.image;
    var desc = req.body.description;
    var newcampground ={title: name,image:image, description :desc};
    
    //Dont need anymore-campgrounds.push(newcampground);
    //Create a new campground and save to DB
    Campground.create(newcampground,function(err,newlycreated){
     if(err){console.log(err);}
     else{ res.redirect("/campgrounds"); } //redirect back to campgrounds page
     
  });
});  
// NEW - show form to create new campgrounds
app.get("/campgrounds/new",(req,res)=>{
    res.render("new.ejs");

});
//SHOW-show info about specific ..

app.get("/campgrounds/:id",(req,res)=>{
  //res.send("This will be the show page one day");
//find the campground by provided id
Campground.findById(req.params.id,(err,foundcampground)=>{
if(err){
    console.log(err);}
    else{res.render("show.ejs",{campground : foundcampground});}
});
  
});


app.listen(5000,()=>{
    console.log("THe Yelpcamp server Has started");
});