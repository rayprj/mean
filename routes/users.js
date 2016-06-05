var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var user = require('../models/user.js');

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


router.post('/', function(req, res, next) {
  user.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
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
