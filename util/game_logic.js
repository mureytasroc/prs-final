var User = require(__dirname + '/../models/User');
var Villain = require(__dirname + '/../models/Villain');

exports.findResult = function (username, brows, user, villain, callback) { //updates user data
	if (brows == user) {
		exports.tied(username, brows, user, villain, function () {
			callback("tied");
		});
	}
	if (brows == "rock" && user == "scissors") {
		exports.lost(username, brows, user, villain, function () {
			callback("lost");
		});
	}
	if (brows == "scissors" && user == "rock") {

		exports.won(username, brows, user, villain, function () {
			callback("won");
		});
	}
	if (brows == "rock" && user == "paper") {

		exports.won(username, brows, user, villain, function () {
			callback("won");
		});
	}
	if (brows == "paper" && user == "rock") {
		exports.lost(username, brows, user, villain, function () {
			callback("lost");
		});
	}
	if (brows == "scissors" && user == "paper") {
		exports.lost(username, brows, user, villain, function () {
			callback("lost");
		});
	}
	if (brows == "paper" && user == "scissors") {

		exports.won(username, brows, user, villain, function () {
			callback("won");
		});
	}
}

exports.tied = function (username, browsC, throwC, villain, callback) { //handles ties
	User.getUserByName(username, function (userObject) {
		userObject[throwC]++;
		userObject["gamesplayed"] = parseInt(userObject["gamesplayed"]) + 1;
		User.setUserNoWait(userObject);
		Villain.getVillainByName(villain, function (villainObject) {
			villainObject[browsC]++;
			villainObject["gamesplayed"] = parseInt(villainObject["gamesplayed"]) + 1;
			Villain.setVillain(villainObject);
			callback();
		});

	});

}

exports.won = function (username, browsC, throwC, villain, callback) { //handles wins

	User.getUserByName(username, function (userObject) {


		userObject[throwC]++;
		userObject["gamesplayed"] = parseInt(userObject["gamesplayed"]) + 1;
		userObject["gameswon"] = parseInt(userObject["gameswon"]) + 1;
		User.setUserNoWait(userObject);
		Villain.getVillainByName(villain, function (villainObject) {
			villainObject[browsC]++;
			villainObject["gamesplayed"] = parseInt(villainObject["gamesplayed"]) + 1;
			villainObject["gameslost"] = parseInt(villainObject["gameslost"]) + 1;
			Villain.setVillain(villainObject);
			callback();
		});

	});

}

exports.lost = function (username, browsC, throwC, villain, callback) { //handles losses

	User.getUserByName(username, function (userObject) {
		userObject[throwC]++;
		userObject["gamesplayed"] = parseInt(userObject["gamesplayed"]) + 1;
		userObject["gameslost"] = parseInt(userObject["gameslost"]) + 1;
		User.setUserNoWait(userObject);
		Villain.getVillainByName(villain, function (villainObject) {
			villainObject[browsC]++;
			villainObject["gamesplayed"] = parseInt(villainObject["gamesplayed"]) + 1;
			villainObject["gameswon"] = parseInt(villainObject["gameswon"]) + 1;
			Villain.setVillain(villainObject);
			callback();
		});

	});
}