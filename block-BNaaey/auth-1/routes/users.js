var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('users');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('/register', function (req, res, next) {
  User.create(req.body, (err, user) => {
    console.log(err, user);
    if (err) return next(err);
    res.redirect('/users/login');
  });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    console.log(err, user);
    if (err) return next(err);
    if (!user) {
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      console.log(err, result);
      if (err) return next(err);
      if (!result) {
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/dashboard');
    });
  });
});

module.exports = router;
