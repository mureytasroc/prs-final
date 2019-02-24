var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
var doc = new GoogleSpreadsheet('1AWi6mryVBu59Nx0Z9yszuou6xe9MetXxVZs1Om7FTps');

/*exports.sendVillains=function(browser_data) { //updates villains.csv   
		var string = "name,special,games_played,games_won,games_lost,paper,rock,scissors";
	for (var i = 0; i < browser_data.length; i++) {
		var a = ""
		a += "\n" + browser_data[i]["name"] + "," + browser_data[i]["special"] + "," + browser_data[i]["games_played"] + "," + browser_data[i]["games_won"] + "," + browser_data[i]["games_lost"] + "," + browser_data[i]["paper"] + "," + browser_data[i]["rock"] + "," + browser_data[i]["scissors"];
		string += a;
	}
	fs.writeFileSync("data/villains.csv", string, "utf8");
}*/

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

exports.getVillains=function(callback) { //gets villains data from villains.csv
	
    doc.useServiceAccountAuth(creds, function (err) {
	  doc.getRows(2, function (err, rows) {
	    
          rows=rows.map(function(villain_object){
        villain_object["strategy"]  = "Random";
        villain_object['isVillain'] = true;
        villain_object['points'] =  villain_object["gameswon"]*3+(villain_object["gamesplayed"]-villain_object["gameswon"] -villain_object["gameslost"]);
        
        switch (villain_object["name"]) {
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
        
		return villain_object;
          });
          callback(rows);

	  });

	});
}

exports.setVillain=function(villainObject) { //updates villain data
	exports.getVillains(function(a){
                        var name = villainObject["name"];
	for (var i = 0; i < a.length; i++) {
		if (name == a[i]["name"]) {
			a[i] = villainObject;
            a[i].save();
		}
	}
                        });
}

exports.getVillainByName=function(name, callback) { //returns villain object by name
	exports.getVillains(function(villain_data){
        var found=false;
    villain_data.forEach(function(a){
        if (name == a["name"]) {
			callback(a);
            found=true;
		}
    });
        if(!found){
            callback(null);
        }
    });
}