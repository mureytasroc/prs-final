var fs = require("fs");

var User = require(__dirname +'/../models/User');
var Villain = require(__dirname +'/../models/Villain');

exports.findResult = function(username, brows, user, villain) { //updates user data
   if (brows == user) {
		exports.tied(username, brows, user, villain);
		return "tied"
	}
	if (brows == "rock" && user == "scissors") {
		exports.lost(username, brows, user, villain);
		return "lost"
	}
	if (brows == "scissors" && user == "rock") {
		exports.won(username, brows, user, villain);
		return "won"
	}
	if (brows == "rock" && user == "paper") {
		exports.won(username, brows, user, villain);
		return "won"
	}
	if (brows == "paper" && user == "rock") {
		exports.lost(username, brows, user, villain);
		return "lost"
	}
	if (brows == "scissors" && user == "paper") {
		exports.lost(username, brows, user, villain);
		return "lost"
	}
	if (brows == "paper" && user == "scissors") {
		exports.won(username, brows, user, villain);
		return "won"
	}
}

exports.tied = function(username, browsC, throwC, villain) { //handles ties
	var userObject = User.getUserByName(username);
	userObject[throwC]++;
	userObject["games_played"]++;
	User.setUser(userObject);

	var villainObject = Villain.getVillainByName(villain);
	villainObject[browsC]++;
	villainObject["games_played"]++;
	Villain.setVillain(villainObject);

}

exports.won = function(username, browsC, throwC, villain) { //handles wins
	var userObject = User.getUserByName(username);
	userObject[throwC]++;
	userObject["games_played"]++;
	userObject["games_won"]++;
	User.setUser(userObject);

	var villainObject = Villain.getVillainByName(villain);
	villainObject[browsC]++;
	villainObject["games_played"]++;
	villainObject["games_lost"]++;
	Villain.setVillain(villainObject);
}

exports.lost = function(username, browsC, throwC, villain) { //handles losses
	var userObject = User.getUserByName(username);
	userObject[throwC]++;
	userObject["games_played"]++;
	userObject["games_lost"]++;
	User.setUser(userObject);

	var villainObject = Villain.getVillainByName(villain);
	villainObject[browsC]++;
	villainObject["games_played"]++;
	villainObject["games_won"]++;
	Villain.setVillain(villainObject);
}
