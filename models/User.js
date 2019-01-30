var fs = require("fs");

exports.setUser=function(ob) { //updates user data
	var a = getUsers();
	var username = ob["username"];
	for (var i = 0; i < a.length; i++) {
		if (username == a[i]["username"]) {
			a[i] = ob;
		}
	}
	sendUsers(a);
}

exports.checkUsername=function(username, password) { //handles login
	user_data = getUsers();
	for (var i = 0; i < user_data.length; i++) {
		if (username == user_data[i]["username"]) {
			if (password == user_data[i]["password"]) {
				return "logged in";
			} else {
				return "Wrong password";
			}
		}
	}
	createUser(username, password);
	return "created new user";
}

exports.createUser=function(username, password) { //creates new user
	var user_object = new Object();
	user_object["username"] = username;
	user_object["password"] = password;
	user_object["games_played"] = 0;
	user_object["games_won"] = 0;
	user_object["games_lost"] = 0;
	user_object["paper"] = 0;
	user_object["rock"] = 0;
	user_object["scissors"] = 0;
	var a = getUsers();
	a.push(user_object);
	sendUsers(a);
}

exports.getUserByName=function(username) { //returns user object by username
	var user_data = getUsers();
	for (var i = 0; i < user_data.length; i++) {
		if (username == user_data[i]["username"]) {
			return user_data[i];
		}
	}
	return null;
}

exports.getUsers=function() { //gets users data from users.csv
	var user_data = [];
	var user_file = fs.readFileSync("data/users.csv", "utf8");
	var user_lines = user_file.split('\n');
	for (var i = 1; i < user_lines.length; i++) {
		var user_object = {};
		var single_user = user_lines[i].trim().split(',');
		user_object["username"] = single_user[0];
		user_object["password"] = single_user[1];
		user_object["games_played"] = single_user[2];
		user_object["games_won"] = single_user[3];
		user_object["games_lost"] = single_user[4];
		user_object["paper"] = single_user[5];
		user_object["rock"] = single_user[6];
		user_object["scissors"] = single_user[7];
		user_data.push(user_object);
	}
	return user_data;
}

exports.sendUsers=function(user_data) { //updates users.csv
	var string = "username,password,games_played,games_won,games_lost,paper,rock,scissors";
	for (var i = 0; i < user_data.length; i++) {
		var a = ""
		a += "\n" + user_data[i]["username"] + "," + user_data[i]["password"] + "," + user_data[i]["games_played"] + "," + user_data[i]["games_won"] + "," + user_data[i]["games_lost"] + "," + user_data[i]["paper"] + "," + user_data[i]["rock"] + "," + user_data[i]["scissors"];
		string += a;
	}
	fs.writeFileSync("data/users.csv", string, "utf8");
}