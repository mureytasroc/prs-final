var fs = require("fs");

var GoogleSpreadsheet = require('google-spreadsheet');

var creds = require('./client_secret.json');



// Create a document object using the ID of the spreadsheet - obtained from its URL.

var doc = new GoogleSpreadsheet('1AWi6mryVBu59Nx0Z9yszuou6xe9MetXxVZs1Om7FTps');

exports.setUser=function(ob) { //updates user data
	var a = exports.getUsers();
	var username = ob["name"];
	for (var i = 0; i < a.length; i++) {
		if (username == a[i]["name"]) {
			a[i] = ob;
		}
	}
	exports.sendUsers(a);
}

exports.checkUsername=function(username, password,callback){ //handles login
	exports.getUsers(function(user_data){
        var found=false;
		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["name"]) {
                found=true;
				if (password == user_data[i]["password"]) {
					callback("logged in");
				} else {
					callback("Wrong user/password");
				}
			}
		}
        if(!found){
            callback("Wrong user/password");
        }
		
	});
}

exports.checkNewUser=function(username, password, password2) { //checks whether new user is already taken
    user_data = exports.getUsers();
    for (var i = 0; i < user_data.length; i++) {
        if (username == user_data[i]["name"]) {
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
	user_object["name"] = username;
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

exports.getUserByName=function(username, callback) { //returns user object by username

	exports.getUsers(function(user_data){

		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["name"]) {
				callback(user_data[i]["name"]);
			}
		}
		callback(null);
	});
}

exports.getUsers=function(callback) { //gets users data from users.csv

	doc.useServiceAccountAuth(creds, function (err) {
	  doc.getRows(1, function (err, rows) {
	    callback(rows);

	  });

	});
}

exports.getUsernames=function(callback) {
    exports.getUsers(function(user_data){
    var us=users.map(function(a){
            return a["name"];
        });
        callback(us);
    }
}

exports.sendUsers=function(user_data) { //updates users.csv
	var string = "username,password,games_played,games_won,games_lost,paper,rock,scissors,first name,last name";
	for (var i = 0; i < user_data.length; i++) {
		var a = ""
		a += "\n" + user_data[i]["name"] + "," + user_data[i]["password"] + "," + user_data[i]["games_played"] + "," + user_data[i]["games_won"] + "," + user_data[i]["games_lost"] + "," + user_data[i]["paper"] + "," + user_data[i]["rock"] + "," + user_data[i]["scissors"]+ "," + user_data[i]["fname"]+ "," + user_data[i]["lname"];
		string += a;
	}
	fs.writeFileSync("data/users.csv", string, "utf8");
}
