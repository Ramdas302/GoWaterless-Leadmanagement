var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
// var favicon = require('static-favicon');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
var mongoose = require('./config/Development');
var AuthTemplate = require('./src/api/CRM/Auth/UserTemplate');
var LeadTemplate = require('./src/api/CRM/Marketing/LeadTemplate');
var ContactTemplate = require('./src/api/CRM/Marketing/ContactTemplate');
var MeetingTemplate = require('./src/api/CRM/Marketing/MeetingTemplate');
var AccountTemplate = require('./src/api/CRM/Marketing/AccountTemplate');
var ProposalTemplate = require('./src/api/CRM/Marketing/ProposalTemplate');
var CallsTemplate = require('./src/api/CRM/Marketing/CallsTemplate');
var EmailServiceTemplate = require('./src/api/CRM/Marketing/EmailserviceTemplate');
var userSchema = require('./app/models/Users');
var app = express();
app.set('view engine', 'pug')
app.use(session({
  name: 'session-id',
  secret: '123-456-789',
  saveUninitialized: false,
  resave: false
}));
// passport.use(new LocalStrategy(function(username, password, done) {
//   UserModel.findOne({ username: username }, function(err, user) {
//     if (err) return done(err);
//     if (!user) return done(null, false, { message: 'Incorrect username.' });
//     user.comparePassword(password, function(err, isMatch) {
//       if (isMatch) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//     });
//   });
// }));
app.use(passport.initialize());
app.use(passport.session());


var UserModel = mongoose.model('user');
passport.use(new LocalStrategy(UserModel.authenticate()));

// app.use(favicon());
app.use(logger('dev'));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(bodyParser.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));
app.use('/api',AuthTemplate);
app.use('/api',LeadTemplate);
app.use('/api',ContactTemplate);
app.use('/api',MeetingTemplate);
app.use('/api',AccountTemplate);
app.use('/api',ProposalTemplate);
app.use('/api',CallsTemplate);
app.use('/api',EmailServiceTemplate);
app.get('/', (req, res) => {
  res.json("welcome to crm");
})
app.use(function (req, res,next){
  res.locals.currentUser = req.user;
  next();
})

const port = process.env.PORT || 3232;
app.listen(port, () => {
    console.log('Connected to port ' + port)
  })