var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var app = express();
var Campground=require("./models/campgrounds");
var Comment=require("./models/comment");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://127.0.0.1:27017/v7',{useNewUrlParser:true,useUnifiedTopology:true});


app.set("view engine","ejs");

// var newCamp={
//     name:"banglore",
//     image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2SO-eV7X7KZAAIzgav9OTQR6wcNNgPEiqNg&usqp=CAU",
//     desc:"iufi8dukckuyxtcyfc o;iugilucvuifv ;uiovfilc"
// }

// Campground.create(newCamp, function(err,a){
//     if(err)
//       console.log(err);
//       else
//       console.log(a);
// })



// var campgrounds=[{name:"banglore" ,image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80"},
// {name:"mumbai" ,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2SO-eV7X7KZAAIzgav9OTQR6wcNNgPEiqNg&usqp=CAU"},
// {name:"chennai" ,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToF7WAB1TG8aPChBtxnVZR5Cl5_c6yW3WveQ&usqp=CAU"}]


app.get("/", function(req,res){
   res.render("landing");
})

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,data){
        if(err)
        console.log(err)
        else 
        res.render("campgrounds",{campgrounds:data});
    });
    
})

app.get("/campgrounds/add",function(req,res){
     res.render("addcampgrounds");
})

app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.desc;
    var price=req.body.price;
    var newGround={name:name,image:image,desc:desc,price:price};
    Campground.create(newGround,function(err,data){
        if(err)
         console.log(err)
        else
        res.redirect("/campgrounds");
    })
})

app.get('/campground/:id',function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,data){
        if(err)
          console.log(err);
        else
        res.render("show",{campground:data});
    })
   
})

app.get("/campground/:id/comments/new", function(req,res){
   Campground.findById(req.params.id,function(err,data){
       if(err)
       console.log(err);
       else
        res.render("new",{campground:data});
   })
})

app.post("/campground/:id/comments",function(req,res){
    Campground.findById(req.params.id,function(err,data){
        if(err)
        console.log(err);
      else{
          Comment.create(req.body.comment,function(err,comment){
              if(err)
              console.log(err);
              else{
                  data.comments.push(comment);
                  data.save();
                  res.redirect("/campground/"+data._id);
              }
          })
      }

    })

})

app.listen("1900",function(){
    console.log("pack your bags started at 1900");
})