var express = require("express"),
    router = express.Router(),
    passport = require("passport"),

    User = require("../models/user");

//REGISTER
router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  if(req.body.password === req.body.confirmPass) {
    var newUser = new User({
      username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        return res.render('register');
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      });
    });
  } else {
    req.flash("error", "Wpisałeś dwa różne hasła.");
    res.redirect('/register');
  }
});

//LOGIN
router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: 'Podałeś niepoprawną nazwę użytkownika lub hasło.'
}), function(req, res) {});

//LOGOUT
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Zostałeś pomyślnie wylogowany.");
  res.redirect("/login");
});

module.exports = router;