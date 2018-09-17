var LocalStrategy = require('passport-local').Strategy;
var User = require('../src/server/models/User');
var cookies = require('react-cookie');

var host = process.env.NODE_ENV !== 'production' ? 'localhost:4000' : 'rrschat.herokuapp.com'

module.exports = function(passport) {

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne({ 'local.username': username}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false);
      } else {
        var newUser = new User();
        newUser.local.username = username;
        newUser.local.password = newUser.generateHash(password);
        newUser.save(function(err, user) {
          if (err) {
            throw err;
          }
          return done(null, newUser);
        });
      }
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne({ 'local.username': username}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.validPassword(password)) {
        return done(null, false)
      }
      return done(null, user);
    });
  }));

passport.use('google-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    console.log("username",username); 
    User.findOne({ 'local.username': username}, function(err, user) {
      if (err) {
        console.log('err',err);
        var newUser = new User();
        newUser.local.username = username;
        newUser.local.password = newUser.generateHash(password);
        newUser.save(function(err2, user) {

          if (err2) {
            console.log('err2',err2);
            throw err2;
          }
          return done(null, newUser);
        });
      }
      if (!user) {
        console.log("false");
        return done(null, false);
      }
      console.log('endlogged',user);
      return done(null, user);
    });
  }));

}
