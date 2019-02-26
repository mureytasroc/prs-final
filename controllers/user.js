var express = require('express');
var router = express.Router();

var User = require(__dirname + '/../models/User');
var Villain = require(__dirname + '/../models/Villain');
var GameLogic = require(__dirname + '/../util/game_logic');
var Admin = require(__dirname + '/../models/Admin');

router.get('/user/new', function (req, res) {
    Admin.getPageStats(function (s) {
        s[5]["num"]++;
		s[5].save();
    });
        
    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/user/new"
    }
    Admin.logData(log);
    console.log(log);

    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details');
});

router.get('/users/:id/edit', function (req, res) {
	Admin.getPageStats(function (s) {
        s[5]["num"]++;
		s[5].save();
    });

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': req.params.id,
        'route': "/user/:id/edit"
    }
    Admin.logData(log);
    console.log(log);


    User.getUserByName(req.params.id, function (u) {
        res.status(200);
        res.setHeader('Content-Type', 'text/html')
        res.render('user_details', {
            user: u
        });
    });
});

router.get('/user/:id/results', function (request, response) {
	var log = {
		'timestamp': Date(),
		'httpverb': "GET",
		'username': request.params.id,
		'route': "/user/:id/results"
	}
	Admin.logData(log);
	console.log(log);

	var villain = request.query.villain;
	var browserChoice = Villain.browserOutcome(villain, request.query.weapon);
	GameLogic.findResult(request.params.id, browserChoice, request.query.weapon, villain, function (outcome) {
		User.getUserByName(request.params.id, function (usar) {
			var fname = usar["firstname"];
			var result = {
				name: request.params.id,
				fname: fname,
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
	})
});

router.put('/users/:id', function (req, res) {
    
    Admin.getPageStats(function (s) {
        s[5]["num"]++;
		s[5].save();
    });
    
	var log = {
		'timestamp': Date(),
		'httpverb': "PUT",
		'username': req.body.id,
		'route': "/users/:id"
	}
	Admin.logData(log);
	console.log(log);

	User.getUserByName(req.params.id, function (u) {
		User.getUsers(function (users) {
			var found = false;
			users.forEach(function (a) {
				if (a["name"] == req.body.id && req.body.id != req.params.id) {
					found = true;
				}
			});
			if (found) {
				u['response'] = "<p class='red'>Username taken.</p>";
				res.status(200);
				res.setHeader('Content-Type', 'text/html')
				res.render('user_details', {
					user: u
				});
			} else if (req.body.password == req.body.password2) {
				var updatedUser = "";
				if (req.body.id != req.params.id) {
					updatedUser = req.body.id;
				}
				u['name'] = req.body.id;

				u['firstname'] = req.body.fname;
				u['lastname'] = req.body.lname;
				u['password'] = req.body.password;
				User.setUser(req.params.id, u, function () {
					console.log("read");
					User.getUserByName(req.body.id, function (us) {
						us['response'] = "<p class='green'>User details updated.</p>";
						res.status(200);
						res.setHeader('Content-Type', 'text/html')
						res.render('user_details', {
							updatedUser: updatedUser,
							user: us
						});
					});
				});
			} else {
				u['response'] = "<p class='red'>Entered passwords did not match.</p>";
				res.status(200);
				res.setHeader('Content-Type', 'text/html')
				res.render('user_details', {
					user: u
				});
			}
		})
	});
});

router.delete('/users/:id', function (req, res) {
	
    Admin.getPageStats(function (s) {
        s[0]["num"]++;
		s[0].save();
    });
    
    var log = {
		'timestamp': Date(),
		'httpverb': "DELETE",
		'username': req.params.id,
		'route': "/users/:id"
	}
	Admin.logData(log);
	console.log(log);

	User.deleteUser(req.params.id); //need to make a deleteUser function

	User.getUsers(function (u) {
		res.status(200);
		res.setHeader('Content-Type', 'text/html')
		res.render('index', {
			newuser: req.params.id,
			users: u
		});
	});
});

router.post('/users', function (req, res) {
    
    Admin.getPageStats(function (s) {
        s[0]["num"]++;
		s[0].save();
    });
    
	var log = {
		'timestamp': Date(),
		'httpverb': "POST",
		'username': req.body.id,
		'route': "/users"
	}
	Admin.logData(log);
	console.log(log);

	User.checkNewUser(req.body.id, req.body.password, req.body.password2, function (response) {

		if ((response == "User already taken") || (response == "Passwords do not match")) { //if new user isn't valid
			res.status(200);
			res.setHeader('Content-Type', 'text/html')
			res.render('user_details', {
				response2: response
			}); //lets login page show error message by sendinb back user information with result information
		} else { //if new user is valid
			User.createUser(req.body.id, req.body.password, req.body.fname, req.body.lname, function () {
				User.getUsernames(function (users) {
					res.status(200);
					res.setHeader('Content-Type', 'text/html')
					res.render('index', {
						newuser: req.body.id,
						users: users
					}); //sends you to index
				}); //creates new user
			}); //creates object of new user
		}
	}); //gives response on whether this is a proper new user
});

router.get('/login', function (request, response) {
    
    Admin.getPageStats(function (s) {
        s[0]["num"]++;
		s[0].save();
    });
    
    
	var log = {
		'timestamp': Date(),
		'httpverb': "GET",
		'username': request.query.player_name,
		'route': "/login"
	}
	Admin.logData(log);
	console.log(log);

	User.checkUsername(request.query.player_name, request.query.player_password, function (res) {
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
			User.getUsers(function (users) {
				response.status(200);
				response.setHeader('Content-Type', 'text/html')
				response.render('index', {
					user: user_data,
					users: users
				}); //lets login page show error message
			});
		}
	});
});

module.exports = router;