var fs = require("fs");

exports.getUser = function(user_id) {
  console.log("Users.getUser: "+user_id);

  var user = createBlankUser();
  var all_users = getAllDatabaseRows();

  for(var i=1; i<all_users.length; i++){
    var u = all_users[i].split(',');
    if(u[0].trim()==user_id.trim()){
      user={
        name:u[0].trim(),
        games_played:u[1].trim(),
        lost:u[2].trim(),
        won:u[3].trim(),
        password:u[4].trim()
      }
    }
  }

  return user;
}

exports.updateUser = function(user_id, new_info) {
  console.log("Users.getUser");
  var user={
    name:"test"
  };

  return user;
}

var getAllDatabaseRows = function(){
  return fs.readFileSync(__dirname +'/../data/users.csv', 'utf8').split('\n');
}
var createBlankUser = function(){
  var user={
    name:"test",
    games_played:"test",
    lost:"test",
    won:"test",
    password:"test"
  };
  return user;
}
