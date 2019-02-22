var express = require('express');
var router = express.Router();

var User = require(__dirname +'/../models/User');
var Villain = require(__dirname +'/../models/Villain');
var GameLogic = require(__dirname +'/../util/game_logic');

router.get('/user/:id', function(req, res){
  console.log('Request- /user/'+req.params.id);

  User.getUserByName(req.params.id,function(u){
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {user:u});
  });
});


router.get('/user/new', function(req, res){
  console.log('Request- /user/'+req.params.id);

  User.getUserByName(req.params.id,function(u){
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {user:u});
  });
});



router.get('/users/:id/edit', function(req, res){
  console.log('Request- /user/'+req.params.id);

  User.getUserByName(req.params.id,function(u){
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {user:u});
  });
});

router.get('/users/game', function(req, res){
  console.log('Get- /user/'+req.params.id);

  User.getUserByName(req.params.id,function(u){
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {user:u});
  });
});


router.get('/user/:id/results', function (request, response) {
	var villain = request.query.villain;
	var browserChoice = Villain.browserOutcome(villain, request.query.weapon);
	GameLogic.findResult(request.params.id, browserChoice, request.query.weapon, villain,function(outcome){
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
});




router.put('/users/:id', function(req, res){
  console.log('Put- /user/'+req.params.id);


  //use req.body.id
    
    


  //use call back stuff

  User.getUserByName(req.params.id, function(u){
      if(req.body.password==req.body.password2){
                u['name']=req.body.id;
      u['firstname']=req.body.fname;
      u['lastname']=req.body.lname;
      u['password']=req.body.password;
        User.setUser(u);
          u['response']="<p class='green'>User details updated.</p>"
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {user:u});
      }
      else{
          u['response']="<p class='red'>Entered passwords did not match.</p>";
              res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {user:u});
      }
  });
});

router.delete('/users/:id', function(req, res){
   console.log('Delete- /user/'+req.params.id);

   User.deleteUser(req.params.id); //need to make a deleteUser function

   User.getUsers(function(u){
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render('index', {users:u});
   });
});





router.post('/users', function(req, res){
  console.log('Post- /users'); //logs stuff to console
  User.checkNewUser(req.body.id, req.body.password, req.body.password2, function(response){

  if ((response == "User already taken") || (response == "Passwords do not match")) { //if new user isn't valid
      res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {response2:response}); //lets login page show error message by sendinb back user information with result information
  } else { //if new user is valid
    User.createUser(req.body.id, req.body.password, req.body.fname, req.body.lname,function(){
        User.getUsernames(function(users){
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render('index', {newuser:req.body.id,users:users}); //sends you to index
    }); //creates new user
    }); //creates object of new user
  }
  }); //gives response on whether this is a proper new user
});





router.get('/login', function (request, response) {
	User.checkUsername(request.query.player_name, request.query.player_password,function(res){
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
      User.getUsers(function(users){
        response.status(200);
        response.setHeader('Content-Type', 'text/html')
        response.render('index', {
          user: user_data,users:users
        }); //lets login page show error message
      });
    }
  });
});


module.exports = router;
