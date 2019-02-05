var fs = require("fs");

exports.setUser=function(ob) { //updates user data
	var a = exports.getUsers();
	var username = ob["username"];
	for (var i = 0; i < a.length; i++) {
		if (username == a[i]["username"]) {
			a[i] = ob;
		}
	}
	exports.sendUsers(a);
}

exports.checkUsername=function(username, password) { //handles login
	user_data = exports.getUsers();
	for (var i = 0; i < user_data.length; i++) {
		if (username == user_data[i]["username"]) {
			if (password == user_data[i]["password"]) {
				return "logged in";
			} else {
				return "Wrong user/password";
			}
		}
	}
	return "Wrong user/password";
}

exports.checkNewUser=function(username, password, password2) { //checks whether new user is already taken
    user_data = exports.getUsers();
    for (var i = 0; i < user_data.length; i++) {
        if (username == user_data[i]["username"]) {
            return "User already taken";
        }
    }
    if (password != password2) {
        return "Passwords do not match";
    }
    return "Logged in";
}

exports.createUser=function(username, password, fname, lname) { //creates new user
	var user_object = new Object();
	user_object["username"] = username;
	user_object["password"] = password;
	user_object["games_played"] = 0;
	user_object["games_won"] = 0;
	user_object["games_lost"] = 0;
	user_object["paper"] = 0;
	user_object["rock"] = 0;
	user_object["scissors"] = 0;
    user_object["fname"]=fname;
    user_object["lname"]=lname;
	var a = exports.getUsers();
	a.push(user_object);
	exports.sendUsers(a);
}

exports.getUserByName=function(username) { //returns user object by username
	var user_data = exports.getUsers();
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
        user_object["fname"] = single_user[8];
        user_object["lname"] = single_user[9];
        
        user_object["points"]=user_object["games_won"]*3+user_object["games_played"]-user_object["games_won"]-user_object["games_lost"];
		user_data.push(user_object);
	}
	return user_data;
}

exports.sendUsers=function(user_data) { //updates users.csv
	var string = "username,password,games_played,games_won,games_lost,paper,rock,scissors,first name,last name";
	for (var i = 0; i < user_data.length; i++) {
		var a = ""
		a += "\n" + user_data[i]["username"] + "," + user_data[i]["password"] + "," + user_data[i]["games_played"] + "," + user_data[i]["games_won"] + "," + user_data[i]["games_lost"] + "," + user_data[i]["paper"] + "," + user_data[i]["rock"] + "," + user_data[i]["scissors"]+ "," + user_data[i]["fname"]+ "," + user_data[i]["lname"];
		string += a;
	}
	fs.writeFileSync("data/users.csv", string, "utf8");
}