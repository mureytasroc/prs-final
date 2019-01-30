var express = require('express');
var router = express.Router();

var Users = require('../models/User');

router.get('/user/:id', function(req, res){
  console.log('Request- /user/'+req.params.id);

  var u = Users.getUser(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});


router.get('/user/new', function(req, res){
  console.log('Request- /user/'+req.params.id);

  var u = Users.getUser(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});



router.get('/users/:id/edit', function(req, res){
  console.log('Request- /user/'+req.params.id);

  var u = Users.getUser(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.get('/users/game', function(req, res){
  console.log('Get- /user/'+req.params.id);

  var u = Users.getUser(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});





router.put('/users/:id', function(req, res){
  console.log('Put- /user/'+req.params.id);

  var u = Users.getUser(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.delete('/users/:id', function(req, res){
  console.log('Delete- /user/'+req.params.id);

  var u = Users.getUser(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.post('/users', function(req, res){
  console.log('Post- /user/'+req.params.id);

  var u = Users.getUser(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});


module.exports = router;
