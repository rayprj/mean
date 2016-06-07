var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var user = require('../models/user.js');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

router.post('/duplicatecheck', function(req, res, next) {
  user.find({username:req.body.username}, function(err, user) {
     if (err) {
       return next(err)
     }
     
     if (user.length>0) {
        var err = new Error('Username already exists! Please try another username');
        err.status = 500;
        return next(err);
     } else {
       res.json({status:'success'});
     }
           
  });
  
  
});

//register user 
router.post('/', function(req, res, next) {
  
  var u = new user();

  u.name = req.body.username;
  u.email = req.body.email;

  u.setPassword(req.body.password);

  u.save(function(err, post) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
  
});

router.get('/login', function(req, res, next) {
  
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      return next(err);
    }

    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
  
  
});


router.get('/profile', auth, function(req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    user
      .findById(req.payload._id)
      .exec(function(err, user) {
        res.json(user);
      });
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  
  user.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
  
});


module.exports = router;
