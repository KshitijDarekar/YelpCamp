var express= require("express");
var app= express();
var bodyparser =require("body-parser");

app.use(bodyparser.urlencoded({extended:true}));

app.set("view engine","ejs") ;
//,(error,response,body)=>{})

app.get("/",(req,res)=>{
res.render("landing");
});
var campgrounds =[
    {title :"ooty", image:"http://tiny.cc/y5vdoz"},
    {title :"ladhak", image:"http://tiny.cc/3vvdoz"},
    {title :"kutch", image:"http://tiny.cc/x0vdoz"},
    {title :"manali", image:"http://tiny.cc/g3vdoz",}
];

app.get("/campgrounds",(req,res)=>{
res.render("campgrounds",{anyname : campgrounds}); //here anyname can literally be given any name including campgrounds
});

app.post("/campgrounds",(req,res)=>{
    //get data from form and add to campgrounds array
    var name =req.body.title;
    var image =req.body.image;
    var newcampground ={title: name,image:image};
    campgrounds.push(newcampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});
app.get("/campgrounds/new",(req,res)=>{
    res.render("new.ejs");
});



app.listen(5000,()=>{
    console.log("THe Yelpcamp server Has started");
});