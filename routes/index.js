var express = require("express"),
    router = express.Router(),
    passport = require("passport"),

    Comment = require("../models/comment"),
    User = require("../models/user");

//==========
// ROUTES
//==========
router.get("/", function(req, res) {
  res.redirect("/skinguide");
});

router.get('/skinguide', function(req, res) {
  Comment.find({}, function(err, allComments) {
    if (!err) {
      console.log('znaleziono wszystkie komentarze');
    };
    res.render("index", {
      comments: allComments
    });
  })
});

router.post('/skinguide', isLoggedIn, function(req, res) {
  console.log('text:', req.body.text)
  var newComment = {
        text: req.body.commentText,
        author: {
          id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar
        },
      rating: req.body.numOfStars,
      }
    console.log('text:', newComment)
    console.log('RATE: ', req.body);
    Comment.create(newComment, function(err, newComment) {
      if (!err) {
        console.log('Success!');
        res.send(req.body);
      }
    })
});

//==========
//AUTH ROUTES
//==========
//show sign up form
router.get("/register", function(req, res) {
  res.render("register");
});
//handling user sign up
router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/skinguide");
    });
  });
});

// LOGIN ROUTES
//render login form
router.get("/login", function(req, res) {
  res.render("login");
});
//login logic
//middleware
router.post("/login", passport.authenticate("local", {
  successRedirect: "/skinguide",
  failureRedirect: "/login"
}), function(req, res) {});

//logout logic
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/skinguide");
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
