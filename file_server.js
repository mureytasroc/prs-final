var express = require('express');
var favicon = require('serve-favicon');

var app = express();

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));

var Admin = require(__dirname + '/models/Admin');


app.use(express.urlencoded());

var methodOverride = require('method-override');
app.use(methodOverride('_method'));


app.use(require('./controllers/user'));


var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Server started at ' + new Date() + ', on port ' + port + '!');
});

var User = require(__dirname + '/models/User');
var Villain = require(__dirname + '/models/Villain');
var GameLogic = require(__dirname + '/util/game_logic');

//////////////////////////////////////////////////////////////////////////////////////
///////////////////////GET request handling (largely uncommented)/////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.get('/', function (request, response) {

	Admin.getPageStats(function (s) {
        s[0]["num"]++;
		s[0].save();
    });

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/"
    }
    Admin.logData(log);
    console.log(log);

    User.getUsernames(function (users) {
        response.status(200);
        response.setHeader('Content-Type', 'text/html')
        response.render('index', {
            users: users
        });
    });


});

app.get('/rules', function (request, response) {

	Admin.getPageStats(function (s) {
        s[1]["num"]++;
		s[1].save();
    });

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/rules"
    }
    Admin.logData(log);
    console.log(log);

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('rules');

});

app.get('/about', function (request, response) {

	Admin.getPageStats(function (s) {
        s[3]["num"]++;
		s[3].save();
    });

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/about"
    }

    Admin.logData(log);
    console.log(log);

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('about');

});

app.get('/game', function (request, response) {

	Admin.getPageStats(function (s) {
        s[4]["num"]++;
		s[4].save();
    });

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/game"
    }
    Admin.logData(log);
    console.log(log);

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('game');

});

app.get('/contact', function (request, response) {
	Admin.getPageStats(function (s) {
        s[6]["num"]++;
		s[6].save();
    });

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/contact"
    }
    Admin.logData(log);
    console.log(log);


    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('contact');
    
});

app.get('/stats', function (request, response) {

	Admin.getPageStats(function (s) {
        s[2]["num"]++;
		s[2].save();
    });

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/stats"
    }
    Admin.logData(log);
    console.log(log);

    User.getUsers(function (userD) {
        Villain.getVillains(function (villains_lines) {

            //console.log(userD);

            var user_data = userD.concat(villains_lines); //gets/combines users/villains

            user_data = user_data.sort(function (a, b) { //sorts users according to points in descending order
                return b["points"] - a["points"];
            });

            var userCount = 0;
            var maxNum;
            if (request.query.username) {
                maxNum = 20 - villains_lines.length - 1;
            } else {
                maxNum = 20 - villains_lines.length;
            }
            user_data = user_data.filter(function (a, i) {
                if (a["isVillain"]) {
                    a["rank"] = i + 1;
                    return true;
                } else if (a["name"] == request.query.username) {
                    a["rank"] = i + 1;
                    return true;
                } else if (userCount <= maxNum) {
                    a["rank"] = i + 1;
                    userCount++;
                    return true;
                }
                return false;
            });

            var tableText = "";
            for (var i = 0; i < user_data.length; i++) { //writes HTML code for stats page
                if (user_data[i]["name"] == request.query.username) {
                    tableText += "<tr id='currentUserRow'>";
                } else {
                    tableText += "<tr>";
                }
                var playerType = "";
                var villainStrategy = "";
                if (user_data[i]['isVillain']) {
                    playerType = "Villain";
                    villainStrategy = user_data[i]['strategy'];
                } else {
                    playerType = "User";
                }
                tableText += "<td>" + user_data[i]["name"] + "</td>" + "<td>" + user_data[i]['rank'] + "</td>" + "<td>" + playerType + "</td>" + "<td>" + user_data[i]['gamesplayed'] + "</td>" + "<td>" + user_data[i]['gameswon'] + "</td>" + "<td>" + user_data[i]['gameslost'] + "</td>" + "<td>" + (user_data[i]['gamesplayed'] - user_data[i]['gameswon'] - user_data[i]['gameslost']).toString() + "</td>" + "<td>" + user_data[i]['paper'] + "</td>" + "<td>" + user_data[i]['rock'] + "</td>" + "<td>" + user_data[i]['scissors'] + "</td>" + "<td>" + user_data[i]['points'] + "</td>" + "<td>" + villainStrategy + "</td>" + "</tr>";
            }

            Admin.getPageStats(function (s) {
                var usageTableText = "<tr>";
                s.forEach(function (e) {
                    usageTableText += "<td>" + e["num"] + "</td>"
                });
                usageTableText += "</td>"

                response.status(200);
                response.setHeader('Content-Type', 'text/html')
                response.render('stats', {
                    tableText: tableText,
                    usageTableText: usageTableText
                });
            });
        });

    });

});