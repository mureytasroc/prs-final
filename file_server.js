var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');

var app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Server started at ' + new Date() + ', on port ' + port + '!');
});

app.use(require('./controllers/user'));
var User = require(__dirname +'/models/User');
var Villain = require(__dirname +'/models/Villain');

//////////////////////////////////////////////////////////////////////////////////////
///////////////////////GET request handling (largely uncommented)/////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.get('/', function (request, response) {
	response.status(200);
	response.setHeader('Content-Type', 'text/html')
	var users = User.getUsers().map(function (a) {
		return a["username"];
	});
	response.render('index', {
		users: users
	});
});

app.get('/login', function (request, response) {
	var res = User.checkUsername(request.query.player_name, request.query.player_password);
	var user_data = {
		username: request.query.player_name,
		password: request.query.player_password,
		result: res
	};
	if (res != "Wrong password") {
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

app.get('/:user/results', function (request, response) {
	var villain = request.query.villain;
	var browserChoice = browserOutcome(villain, request.query.weapon);
	var outcome = findResult(request.params.user, browserChoice, request.query.weapon, villain);
	var result = {
		name: request.params.user,
		weapon: request.query.weapon,
		browserChoice: browserChoice,
		outcome: outcome,
		villain: request.query.villain
	};
	response.status(200);
	response.setHeader('Content-Type', 'text/html')
	response.render('results', {
		username: request.params.user,
		results: result
	});
});

app.get('/rules', function (request, response) {
	response.status(200);
	response.setHeader('Content-Type', 'text/html')
	response.render('rules');
});

app.get('/about', function (request, response) {
	response.status(200);
	response.setHeader('Content-Type', 'text/html')
	response.render('about');
});

app.get('/game', function (request, response) {
	response.status(200);
	response.setHeader('Content-Type', 'text/html')
	response.render('game');
});

app.get('/contact', function (request, response) {
	response.status(200);
	response.setHeader('Content-Type', 'text/html')
	response.render('contact');
});

app.get('/stats', function (request, response) {
	var user_data = [];
	var user_file = fs.readFileSync("data/users.csv", "utf8");
	var user_lines = user_file.split('\n');
	var villains_file = fs.readFileSync("data/villains.csv", "utf8");
	var villains_lines = villains_file.split('\n');

	for (var i = 1; i < user_lines.length; i++) { //get user data
		var user_object = {};
		var single_user = user_lines[i].trim().split(',');
		user_object["username"] = single_user[0];
		user_object["games_played"] = single_user[2];
		user_object["games_won"] = single_user[3];
		user_object["games_lost"] = single_user[4];
		user_object["paper"] = single_user[5];
		user_object["rock"] = single_user[6];
		user_object["scissors"] = single_user[7];
		user_object["points"] = user_object["games_won"] * 3 + (user_object["games_played"] - user_object["games_lost"] - user_object["games_won"]);
		user_data.push(user_object);
	}

	for (var i = 1; i < villains_lines.length; i++) { //gets villain data
		var user_object = {};
		var single_user = villains_lines[i].trim().split(',');
		user_object["username"] = single_user[0];
		user_object["games_played"] = single_user[2];
		user_object["games_won"] = single_user[3];
		user_object["games_lost"] = single_user[4];
		user_object["paper"] = single_user[5];
		user_object["rock"] = single_user[6];
		user_object["scissors"] = single_user[7];
		user_object["isVillain"] = true;
		user_object["points"] = user_object["games_won"] * 3 + (user_object["games_played"] - user_object["games_lost"] - user_object["games_won"]);
		user_data.push(user_object);
	}

	user_data = user_data.sort(function (a, b) { //sorts users according to points in descending order
		return b["points"] - a["points"];
	});

	var userCount = 0;
	var maxNum;
	if (request.query.username) {
		maxNum = 20 - villains_lines.length - 1;
	} else {
		maxNum = 20 - villains_lines.length;
	}
	user_data = user_data.filter(function (a, i) {
		if (a["isVillain"]) {
			a["rank"] = i + 1;
			return true;
		} else if (a["username"] == request.query.username) {
			a["rank"] = i + 1;
			return true;
		} else if (userCount <= maxNum) {
			a["rank"] = i + 1;
			userCount++;
			return true;
		}
		return false;
	});

	var tableText = "";
	for (var i = 0; i < user_data.length; i++) { //writes HTML code for stats page
		if (user_data[i]['username'] == request.query.username) {
			tableText += "<tr id='currentUserRow'>";
		} else {
			tableText += "<tr>";
		}
		var playerType = "";
		var villainStrategy = "";
		if (user_data[i]['isVillain']) {
			playerType = "Villain";
			switch (user_data[i]['username']) {
				case "The Boss":
					villainStrategy = "Always wins";
					break;
				case "Bones":
					villainStrategy = "Always plays rock";
					break;
				case "Gato":
					villainStrategy = "Always plays paper";
					break;
				case "Manny":
					villainStrategy = "Always plays scissors";
					break;
				case "Mr. Modern":
					villainStrategy = "Random between scissors and paper";
					break;
				default:
					villainStrategy = "Random";
					break;
			}
		} else {
			playerType = "User";
		}
		tableText += "<td>" + user_data[i]['username'] + "</td>" + "<td>" + user_data[i]['rank'] + "</td>" + "<td>" + playerType + "</td>" + "<td>" + user_data[i]['games_played'] + "</td>" + "<td>" + user_data[i]['games_won'] + "</td>" + "<td>" + user_data[i]['games_lost'] + "</td>" + "<td>" + (user_data[i]['games_played'] - user_data[i]['games_won'] - user_data[i]['games_lost']).toString() + "</td>" + "<td>" + user_data[i]['paper'] + "</td>" + "<td>" + user_data[i]['rock'] + "</td>" + "<td>" + user_data[i]['scissors'] + "</td>" + "<td>" + user_data[i]['points'] + "</td>" + "<td>" + villainStrategy + "</td>" + "</tr>";
	}

	response.status(200);
	response.setHeader('Content-Type', 'text/html')
	response.render('stats', {
		tableText: tableText
	});
});

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////Helper Methods//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function findResult(username, brows, user, villain) { //computes game result
	if (brows == user) {
		tied(username, brows, user, villain);
		return "tied"
	}
	if (brows == "rock" && user == "scissors") {
		lost(username, brows, user, villain);
		return "lost"
	}
	if (brows == "scissors" && user == "rock") {
		won(username, brows, user, villain);
		return "won"
	}
	if (brows == "rock" && user == "paper") {
		won(username, brows, user, villain);
		return "won"
	}
	if (brows == "paper" && user == "rock") {
		lost(username, brows, user, villain);
		return "lost"
	}
	if (brows == "scissors" && user == "paper") {
		lost(username, brows, user, villain);
		return "lost"
	}
	if (brows == "paper" && user == "scissors") {
		won(username, brows, user, villain);
		return "won"
	}
}

function tied(username, browsC, throwC, villain) { //handles ties
	var userObject = getUserByName(username);
	userObject[throwC]++;
	userObject["games_played"]++;
	User.setUser(userObject);

	var villainObject = getVillainByName(villain);
	villainObject[browsC]++;
	villainObject["games_played"]++;
	Villain.setVillain(villainObject);

}

function won(username, browsC, throwC, villain) { //handles wins
	var userObject = getUserByName(username);
	userObject[throwC]++;
	userObject["games_played"]++;
	userObject["games_won"]++;
	User.setUser(userObject);

	var villainObject = getVillainByName(villain);
	villainObject[browsC]++;
	villainObject["games_played"]++;
	villainObject["games_lost"]++;
	Villain.setVillain(villainObject);
}

function lost(username, browsC, throwC, villain) { //handles losses
	var userObject = getUserByName(username);
	userObject[throwC]++;
	userObject["games_played"]++;
	userObject["games_lost"]++;
	User.setUser(userObject);

	var villainObject = getVillainByName(villain);
	villainObject[browsC]++;
	villainObject["games_played"]++;
	villainObject["games_won"]++;
	Villain.setVillain(villainObject);
}
