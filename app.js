var express = require('express'),
    app = express(),
    cookieSession = require('cookie-session'),

    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),

    throng = require('throng'),
    WORKERS = process.env.WEB_CONCURRENCY || 1,

    User = require('./models/user'),

    seedDB = require('./seed'),

    authRoutes = require('./routes/auth'),
    indexRoutes = require('./routes/index'),
    proceduresRoutes = require('./routes/procedures'),
    contactRoutes = require('./routes/contact'),
    offersRoutes = require('./routes/offers'),
    galleryRoutes = require('./routes/gallery');

mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')),
app.use(flash());

// seedDB();

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

throng({
  workers: WORKERS,
  lifetime: Infinity,
  master: startMaster,
  start: startWorker
});

function startMaster() {
  console.log('Started master');
}

function startWorker(id) {
  console.log(`Started worker ${ id }`);

  process.on('SIGTERM', () => {
    console.log(`Worker ${ id } exiting...`);
    console.log('(cleanup would happen here)');
    process.exit();
  });
}

app.listen(process.env.PORT || 3000);