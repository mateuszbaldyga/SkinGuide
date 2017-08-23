var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    passwordValidator = require('password-validator'),
    usernameSchema = new passwordValidator(),
    passwordSchema = new passwordValidator(),

    User = require('../models/user');

    usernameSchema
      .is().max(15)
      .has().not().spaces();

    passwordSchema
      .is().min(6)
      .has().lowercase()
      .has().digits()
      .has().not().spaces();

//REGISTER
router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  if(req.body.password === req.body.confirmPass) {

    if(!usernameSchema.validate(req.body.username)) {
      req.flash('error', 'Nazwa użytkownika zawiera niedozwolone znaki.');
      res.redirect('/register');
    }

    else if(!passwordSchema.validate(req.body.password)) {
      req.flash('error', 'Hasło musi składać się z kombinacji co najmniej 6 znaków w tym przynajmniej 1 litery i 1 cyfry.');
      res.redirect('/register');
    }

    else {
      var newUser = new User({
        username: req.body.username
      });
      User.register(newUser, req.body.password, function(err, user) {
        if (err) {
          console.log(err);
          req.flash('error', 'Podana nazwa użytkownika istnieje.');
          res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function() {
          res.redirect('/');
        });
      });
    }

  } else {
    req.flash('error', 'Wpisałeś dwa różne hasła.');
    res.redirect('/register');
  }
});

//LOGIN
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Podałeś niepoprawną nazwę użytkownika lub hasło.'
}), function(req, res) {});

//LOGOUT
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Zostałeś pomyślnie wylogowany.');
  res.redirect('/login');
});

module.exports = router;