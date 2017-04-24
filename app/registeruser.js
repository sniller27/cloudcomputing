//database
var _mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var dbconfig = require('../config.js')[env];
// var config = require('../config.js')[env];

module.exports.registeruser = function(registerparameters, callback, socket, users, io){

console.log("env: " + env);
// var db = config.env.database;
var db = config.development.database;

var connection = _mysql.createConnection({
    host     : db.HOST,
    user     : db.MYSQL_USER,
    password : db.MYSQL_PASS,
    database : db.DATABASE
});

connection.connect();

connection.query("SELECT * FROM logindata AS solution WHERE username='"+registerparameters.username+"' AND password='"+registerparameters.password+"'", function (error, results, fields) {
  if (error) throw error;

  var rowsfound = Object.keys(results).length;

  if (rowsfound != 0) {
    console.log('correct password!!');
    // saves chat name to socket
    socket.username = registerparameters.username;
    //saves corresponding socket in users object
    users[socket.username] = socket;
    //returns data
    io.emit('close modal', socket.username + ' has joined the chat.');
    io.emit('chat message', socket.username + ' has joined the chat.');

  }else{
    console.log("wrong");
    callback(false);
  }

});

connection.end();

  // if(registerparameters in users){
  //   // doesnt work
  //   callback(false);
  //   //io.emit('chat message', 'username already exists');
  // }else {
  //   // saves chat name to socket
  //   socket.username = registerparameters.username;
  //   //saves corresponding socket in users object
  //   users[socket.username] = socket;
  //   //returns data
  //   io.emit('chat message', socket.username + ' has joined the chat.');
  // }

}