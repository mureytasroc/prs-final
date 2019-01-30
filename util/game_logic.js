var fs = require("fs");

exports.findResult = function(username, brows, user, villain) { //updates user data
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
