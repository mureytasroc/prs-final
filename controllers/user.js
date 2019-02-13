var express = require('express');
var router = express.Router();

var User = require(__dirname +'/../models/User');
var Villain = require(__dirname +'/../models/Villain');
var GameLogic = require(__dirname +'/../util/game_logic');

router.get('/user/:id', function(req, res){
  console.log('Request- /user/'+req.params.id);

  var u = User.getUserByName(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});


router.get('/user/new', function(req, res){
  console.log('Request- /user/'+req.params.id);

  var u = User.getUserByName(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});



router.get('/users/:id/edit', function(req, res){
  console.log('Request- /user/'+req.params.id);

  var u = User.getUserByName(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.get('/users/game', function(req, res){
  console.log('Get- /user/'+req.params.id);

  var u = User.getUserByName(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});


router.get('/user/:id/results', function (request, response) {
	var villain = request.query.villain;
	var browserChoice = Villain.browserOutcome(villain, request.query.weapon);
	var outcome = GameLogic.findResult(request.params.id, browserChoice, request.query.weapon, villain);
	var result = {
		name: request.params.id,
		weapon: request.query.weapon,
		browserChoice: browserChoice,
		outcome: outcome,
		villain: request.query.villain
	};
	response.status(200);
	response.setHeader('Content-Type', 'text/html')
	response.render('results', {
		username: request.params.id,
		results: result
	});
});




router.put('/users/:id', function(req, res){
  console.log('Put- /user/'+req.params.id);

  var u = User.getUserByName(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.delete('/users/:id', function(req, res){
  console.log('Delete- /user/'+req.params.id);

  var u = User.getUserByName(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});





router.post('/users', function(req, res){
  console.log('Post- /user/'+req.params.id); //logs stuff to console
  console.log(req.query);
  console.log(req.body);
  response = User.checkNewUser(req.body.id, req.body.password, req.body.password2); //gives response on whether this is a proper new user
  var user_data = {
    result: response
  };

  console.log(response);

  var users = User.getUsers().map(function (a) {
		return a["username"];
	});

  console.log("in post route method");

  if ((response == "User already taken") || (response == "Passwords do not match")) { //if new user isn't valid
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {new:user_data}); //lets login page show error message by sendinb back user information with result information
  } else { //if new user is valid
    User.createUser(req.body.id, req.body.password, req.body.fname, req.body.lname); //creates new user
    var u = User.getUserByName(req.params.id); //creates object of new user
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('index', {user:u, users:users}); //sends you to index with your logged in user information.
  }
});





router.get('/login', function (request, response) {
	var res = User.checkUsername(request.query.player_name, request.query.player_password);
	var user_data = {
		username: request.query.player_name,
		password: request.query.player_password,
		result: res
	};
	if (res != "Wrong user/password") {
		response.status(200);
		response.setHeader('Content-Type', 'text/html')
		response.render('game', {
			user: user_data
		});
	} else {
		var users = User.getUsers().map(function (a) {
			return a["username"];
		});
		response.status(200);
		response.setHeader('Content-Type', 'text/html')
		response.render('index', {
			user: user_data,
			users: users
		}); //lets login page show error message
	}
});


module.exports = router;
