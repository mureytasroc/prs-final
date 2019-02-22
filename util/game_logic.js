var fs = require("fs");

var User = require(__dirname +'/../models/User');
var Villain = require(__dirname +'/../models/Villain');

exports.findResult = function(username, brows, user, villain, callback) { //updates user data
   if (brows == user) {
		exports.tied(username, brows, user, villain, function(){
            callback("tied");
        });
	}
	if (brows == "rock" && user == "scissors") {
		exports.lost(username, brows, user, villain, function(){
            callback("lost");
        });
	}
	if (brows == "scissors" && user == "rock") {

		exports.won(username, brows, user, villain, function(){
            callback("won");
        });
	}
	if (brows == "rock" && user == "paper") {

		exports.won(username, brows, user, villain, function(){
            callback("won");
        });
	}
	if (brows == "paper" && user == "rock") {
		exports.lost(username, brows, user, villain, function(){
            callback("lost");
        });
	}
	if (brows == "scissors" && user == "paper") {
		exports.lost(username, brows, user, villain, function(){
            callback("lost");
        });
	}
	if (brows == "paper" && user == "scissors") {

		exports.won(username, brows, user, villain, function(){
            callback("won");
        });
	}
}

exports.tied = function(username, browsC, throwC, villain, callback) { //handles ties
	User.getUserByName(username,function(userObject){
           userObject[throwC]++;
	       userObject["games_played"]++;
	       User.setUser(userObject);
            Villain.getVillainByName(villain,function(villainObject){
                	villainObject[browsC]++;
	villainObject["games_played"]++;
	Villain.setVillain(villainObject);
                callback();
            });
            
    });

}

exports.won = function(username, browsC, throwC, villain, callback) { //handles wins
    
    	User.getUserByName(username,function(userObject){
            
            
           userObject[throwC]++;
	   userObject["games_played"]++;
	   userObject["games_won"]++;
	       User.setUser(userObject);
            Villain.getVillainByName(villain,function(villainObject){
                	villainObject[browsC]++;
	villainObject["games_played"]++;
	villainObject["games_lost"]++;
	Villain.setVillain(villainObject);
                callback();
            });
            
    });
    
}

exports.lost = function(username, browsC, throwC, villain, callback) { //handles losses

        	User.getUserByName(username,function(userObject){
           userObject[throwC]++;
	userObject["games_played"]++;
	userObject["games_lost"]++;
	       User.setUser(userObject);
            Villain.getVillainByName(villain,function(villainObject){
                	villainObject[browsC]++;
	villainObject["games_played"]++;
	villainObject["games_won"]++;
	Villain.setVillain(villainObject);
                callback();
            });
            
    });
}
