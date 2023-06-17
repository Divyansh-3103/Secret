//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb+srv://abc:123@cluster0.sodcdwu.mongodb.net/userDB',{usenewUrlParser: true});

const userSchema={
    email:String,
    password:String
}
const User=mongoose.model("user",userSchema);
var rval="hidden";
var lval="hidden";
var sec="Shhhh! I am a Drug Addict";
app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login",{val:lval});
    lval="hidden";
})

app.get("/register",function(req,res){
    res.render("register",{val:rval});
    rval="hidden";
})

app.get("/secrets",function(req,res){
    res.render("secrets",{secret:sec});
})

app.get("/logout",function(req,res){
    res.render("home");
})

app.get("/submit",function(req,res){
    res.render("submit");
})

app.post("/submit",function(req,res){
    sec=req.body.secret;
    res.render("secrets",{secret:sec});
})

app.post("/register",function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    User.findOne({email:username})
        .then((docs)=>{
            if(docs)
            {
                rval="visible";
                res.redirect("/register");
            }
            if(!docs)
            {
                const newUser=new User({
                    email:username,
                    password:password
                });
                newUser.save()
                .then(()=>{
                    res.redirect("secrets");
                })
                .catch((err)=>{
                    console.log(err);
                }); 
            }
        })
        .catch((err)=>{
            console.log(err);
        });
})

app.post("/login",function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    User.findOne({email:username})
    .then((docs)=>{
        if(docs)
        {
            if(docs.password===password)
            res.redirect("secrets");
            else
            {
                res.redirect("login");
                lval="visible";
            }
        }
        if(!docs)
        {
            lval="visible";
            res.redirect("login");
        }
    })
    .catch((err)=>{
        console.log(err);
    });
})


app.listen(3000,function(){
    console.log("server started on port 3000");
})