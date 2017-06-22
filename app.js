var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Comment = require("./models/comment"),
  Group = require("./models/group"),
  // Procedure   = require("./models/comment"),
  seedDB = require("./seed")


mongoose.connect("mongodb://localhost/skin_guide");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// seedDB()


//====================================//
// ROUTES //
app.get("/", function(req, res) {
  res.render("landing");
});

app.get('/skinguide', function(req, res) {
  Comment.find({}, function(err, allComments) {
    if (!err) {
      console.log('znaleziono wszystkie komentarze');
    };
    res.render("index", {
      comments: allComments
    });
  })
});

app.post('/skinguide', function(req) {

  newComment = {
    text: req.body.text,
    author: 'MATI', //req.user.username,
    rating: req.body.rate,
  }
  console.log('RATE: ', req.body);
  Comment.create(newComment, function(err, newComment) {
    if (!err) {
      console.log('Success!');
    };
  })
})

app.get('/skinguide/procedures', function(req, res) {
  Group.find({}, function(err, allGroups) {
    if (!err) {
      console.log('znaleziono wszystkie grupy');
    };
    res.render("procedures/show", {
      groups: allGroups
    });
  })
});


// =================================================




app.listen(3000, function() {
  console.log("The SkinGuide Server Has Started!");
});
