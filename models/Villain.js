var fs = require("fs");

exports.sendVillains=function(browser_data) { //updates villains.csv   
	var string = "name,special,games_played,games_won,games_lost,paper,rock,scissors";
	for (var i = 0; i < browser_data.length; i++) {
		var a = ""
		a += "\n" + browser_data[i]["username"] + "," + browser_data[i]["special"] + "," + browser_data[i]["games_played"] + "," + browser_data[i]["games_won"] + "," + browser_data[i]["games_lost"] + "," + browser_data[i]["paper"] + "," + browser_data[i]["rock"] + "," + browser_data[i]["scissors"];
		string += a;
	}
	fs.writeFileSync("data/villains.csv", string, "utf8");
}

exports.browserOutcome=function(villain, weapon) { //decides browser choice
	var rand = Math.random();
	if (villain == "Bones") {
		return "rock";
	} else if (villain == "Gato") {
		return "paper";
	} else if (villain == "Manny") {
		return "scissors";
	} else if (villain == "Mr. Modern") {
		if (rand > .5) {
			return "scissors";
		} else {
			return "paper";
		}
	} else if (villain == "The Boss") {
		if (weapon == "rock") return "paper";
		else if (weapon == "paper") return "scissors";
		else return "rock";
	} else {
		if (rand > 0.66) {
			return "rock";
		}
		if (rand > 0.33) {
			return "scissors";
		}
		return "paper";
	}
}

exports.getVillains=function() { //gets villains data from villains.csv
	
    doc.useServiceAccountAuth(creds, function (err) {
	  doc.getRows(1, function (err, rows) {
	    callback(rows);

	  });

	});
    
    
    var villain_data = [];
	var villain_file = fs.readFileSync("data/villains.csv", "utf8");
	var villain_lines = villain_file.split('\n');
	for (var i = 1; i < villain_lines.length; i++) {
		var villain_object = {};
		var single_villain = villain_lines[i].trim().split(',');
		villain_object["username"] = single_villain[0];
		villain_object["strategy"] = single_villain[1];
		villain_object["games_played"] = single_villain[2];
		villain_object["games_won"] = single_villain[3];
		villain_object["games_lost"] = single_villain[4];
		villain_object["paper"] = single_villain[5];
		villain_object["rock"] = single_villain[6];
		villain_object["scissors"] = single_villain[7];
        villain_object["strategy"]  = "Random";
        villain_object['isVillain'] = true;
        villain_object['points'] =  villain_object["games_won"]*3+(villain_object["games_played"]-villain_object["games_won"] -villain_object["games_lost"]);
        
        switch (villain_object["username"]) {
				case "The Boss":
					villain_object["strategy"] = "Always wins";
					break;
				case "Bones":
					villain_object["strategy"] = "Always plays rock";
					break;
				case "Gato":
					villain_object["strategy"] = "Always plays paper";
					break;
				case "Manny":
					villain_object["strategy"] = "Always plays scissors";
					break;
				case "Mr. Modern":
					villain_object["strategy"] = "Random between scissors and paper";
					break;
				default:
					villain_object["strategy"] = "Random";
					break;
        }
        
		villain_data.push(villain_object);
	}
	return villain_data;
}

exports.setVillain=function(villainObject) { //updates villain data
	var a = exports.getVillains();
	var name = villainObject["username"];
	for (var i = 0; i < a.length; i++) {
		if (name == a[i]["username"]) {
			a[i] = villainObject;
		}
	}
	exports.sendVillains(a);
}

exports.getVillainByName=function(name) { //returns villain object by name
	var villain_data = exports.getVillains();
	for (var i = 0; i < villain_data.length; i++) {
		if (name == villain_data[i]["username"]) {
			return villain_data[i];
		}
	}
	return null;
}