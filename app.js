//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB");
//TODO

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const secret = process.env.SECRET;

userSchema.plugin(encrypt, {secret:secret, encryptFields:["password"]});
const User = new mongoose.model("user",userSchema);

app.route("/")
.get(function(req, res){
res.render("home");
});

app.route("/register")

.get(function(req, res){
res.render("register");
})

.post(function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  const user = new User({
    email:email,
    password:password
  });
  user.save();
  res.render("secrets",{userName:email});
});

app.route("/login")
.get(function(req, res){
res.render("login");
})

.post(function(req, res){
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email:email}, function(err, foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets",{userName:email});
        }
      }
    }else{
      console.log(err);
    }
  })
});

app.route("/logout")

.get(function(req,res){
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
