var express = require('express'),
    app = express(),
    cookieSession = require('cookie-session'),

    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),

    User = require('./models/user'),

    seedDB = require('./seed');

var authRoutes = require('./routes/auth'),
    indexRoutes = require('./routes/index'),
    proceduresRoutes = require('./routes/procedures'),
    contactRoutes = require('./routes/contact');
    offersRoutes = require('./routes/offers');
    galleryRoutes = require('./routes/gallery');

mongoose.connect('mongodb://admin:Admin47@ds141232.mlab.com:41232/skinguide');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')),
app.use(flash());

seedDB();

//==========
// PASSPORT CONFIG
//==========
app.use(cookieSession({
  name: 'session',
  keys: ['gjeoisgf49ds489rv4ds489'],
  maxAge: 48*60*60*1000,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passes currentUser to every template
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(authRoutes);
app.use(indexRoutes);
app.use(proceduresRoutes);
app.use(contactRoutes);
app.use(offersRoutes);
app.use(galleryRoutes);

app.listen(3000, function() {
  console.log('The SkinGuide Server Has Started!');
});
