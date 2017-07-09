var express = require('express'),
    app = express(),

    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    config = require('./config/webpack.dev.config'),
    compiler = webpack(config)


    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),

    //models
    // Comment = require('./models/comment'),
    // Group = require('./models/group'),
    User = require('./models/user'),

    seedDB = require('./seed');

var indexRoutes = require('./routes/index'),
    proceduresRoutes = require('./routes/procedures');

mongoose.connect('mongodb://localhost/skin_guide');
// mongoose.connect('mongodb://admin:Admin47@ds141232.mlab.com:41232/skinguide');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')),
app.use(flash());

// seedDB()

//==========
// PASSPORT CONFIG
//==========
app.use(require('express-session')({
  secret: '84sr9g84sv98e4gt4d65f7ewh84re89g7s4d5s',
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

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {colors: true}
}));

app.use(webpackHotMiddleware(compiler, {
    log: console.log
}))

app.listen(3000, function() {
  console.log('The SkinGuide Server Has Started!');
});
