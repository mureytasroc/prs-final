var fs = require("fs");

var GoogleSpreadsheet = require('google-spreadsheet');

var creds = require('./client_secret.json');

var doc = new GoogleSpreadsheet('1AWi6mryVBu59Nx0Z9yszuou6xe9MetXxVZs1Om7FTps');


exports.setUser=function(ob) { //updates user data
	exports.getUsers(function(a){
		var username = ob["name"];
		for (var i = 0; i < a.length; i++) {
			if (username == a[i]["name"]) {
				a[i] = ob;
				a[i].save();
			}
		}
	});
}

exports.deleteUser=function(username){
	exports.getUsers(function(a){
		for (var i = 0; i < a.length; i++) {
			if (username == a[i]["name"]) {

			}
		}
	});
}

exports.checkUsername=function(username, password, callback) { //handles login
	exports.getUsers(function(user_data){
		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["username"]) {
				if (password == user_data[i]["password"]) {
					callback("logged in");
				} else {
					callback("Wrong user/password");
				}
			}
		}
		callback("Wrong user/password");
	});
}

exports.checkNewUser=function(username, password, password2, callback) { //checks whether new user is already taken
		exports.getUsers(function(user_data){
			for (var i = 0; i < user_data.length; i++) {
	        if (username == user_data[i]["username"]) {
	            callback("User already taken");
	        }
	    }
	    if (password != password2) {
	        callback("Passwords do not match");
	    }
	    callback("Logged in");
		});
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
		exports.getUsers(function(a){
			doc.addRow(1, a, function(err) {
		if(err) {
			console.log(err);
		}
		});
		});



}

exports.getUserByName=function(username, callback) { //returns user object by username
	exports.getUsers(function(user_data){
		for (var i = 0; i < user_data.length; i++) {
			if (username == user_data[i]["name"]) {
				callback(user_data[i]);
			}
		}
	});
}

exports.getUsers=function(callback) { //gets users data from users.csv
	getAllDatabaseRows(function(users){
		callback(users);
	});
}

exports.sendUsers=function(user_data) { //updates users.csv

}

var getAllDatabaseRows=function(callback){
	doc.useServiceAccountAuth(creds, function (err) {
	  doc.getRows(1, function (err, rows) {
	    //console.log(rows);
			callback(rows);
	  });
	});
}
