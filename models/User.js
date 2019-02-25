var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
var doc = new GoogleSpreadsheet('1AWi6mryVBu59Nx0Z9yszuou6xe9MetXxVZs1Om7FTps');

exports.setUser = function (name, ob, callback) { //updates user data
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (name == a[i]["name"]) {
				a[i] = ob;
				a[i]["lastupdate"] = Date();
				a[i].save(callback);
			}
		}
	});

}

exports.setUserNoWait = function (ob) { //updates user data
	//ob["lastupdate"]=Date();
	ob.save();

}

exports.deleteUser = function (name) {
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (name == a[i]["name"]) {
				a[i].del();
			}
		}
	});
}

exports.checkUsername = function (username, password, callback) { //handles login
	exports.getUsers(function (user_data) {
		var found = false;
		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["name"]) {
				found = true;
				if (password == user_data[i]["password"]) {
					callback("logged in");
				} else {
					callback("Wrong user/password");
				}
			}
		}
		if (!found) {
			callback("Wrong user/password");
		}

	});
}

exports.checkNewUser = function (username, password, password2, callback) { //checks whether new user is already taken
	exports.getUsers(function (user_data) {
		var found = false;
		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["name"]) {
				found = true;
				callback("User already taken");
			}
		}
		if (!found) {
			if (password != password2) {
				callback("Passwords do not match");
			} else {
				callback("Logged in");
			}
		}
	});
}

exports.createUser = function (username, password, fname, lname, callback) { //creates new user
	var user_object = new Object();
	user_object["name"] = username;
	user_object["password"] = password;
	user_object["gamesplayed"] = 0;
	user_object["gameswon"] = 0;
	user_object["gameslost"] = 0;
	user_object["paper"] = 0;
	user_object["rock"] = 0;
	user_object["scissors"] = 0;
	user_object["firstname"] = fname;
	user_object["lastname"] = lname;
	user_object["creationdate"] = Date();
	user_object["lastupdate"] = Date();
	doc.useServiceAccountAuth(creds, function (err) {
		doc.addRow(1, user_object, callback);
	});
}

exports.getUserByName = function (username, callback) { //returns user object by username

	exports.getUsers(function (user_data) {
		var found = false;
		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["name"]) {
				found = true;
				callback(user_data[i]);
			}
		}
		if (!found) {
			console.log("User.js line 89");
			callback(null);
		}
	});
}

exports.getUsers = function (callback) { //gets users data from users.csv

	doc.useServiceAccountAuth(creds, function (err) {
		doc.getRows(1, function (err, rows) {
			rows.map(function (el) {
				return el['points'] = el["gameswon"] * 3 + (el["gamesplayed"] - el["gameswon"] - el["gameslost"]);
			});
			callback(rows);

		});

	});
}

exports.getUsernames = function (callback) {
	exports.getUsers(function (user_data) {
		callback(user_data.map(function (a) {
			return a["name"];
		}));
	});
}

/*exports.sendUsers=function(user_data) { //updates users.csv
	var string = "username,password,games_played,games_won,games_lost,paper,rock,scissors,first name,last name";
	for (var i = 0; i < user_data.length; i++) {
		var a = ""
		a += "\n" + user_data[i]["name"] + "," + user_data[i]["password"] + "," + user_data[i]["games_played"] + "," + user_data[i]["games_won"] + "," + user_data[i]["games_lost"] + "," + user_data[i]["paper"] + "," + user_data[i]["rock"] + "," + user_data[i]["scissors"]+ "," + user_data[i]["fname"]+ "," + user_data[i]["lname"];
		string += a;
	}
	fs.writeFileSync("data/users.csv", string, "utf8");
}*/