var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),

    //models
    // Comment = require("./models/comment"),
    // Group = require("./models/group"),
    User = require("./models/user"),

    seedDB = require("./seed");

var indexRoutes = require('./routes/index'),
    proceduresRoutes = require('./routes/procedures');

mongoose.connect("mongodb://localhost/skin_guide");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// seedDB()

//==========
// PASSPORT CONFIG
//==========
app.use(require("express-session")({
  secret: "Rusty is the best and cutest dog in the world",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passes currentUser to every template
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(proceduresRoutes);

app.listen(3000, function() {
  console.log("The SkinGuide Server Has Started!");
});
