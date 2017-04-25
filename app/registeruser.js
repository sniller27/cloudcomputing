//environment check
var env = process.env.NODE_ENV || 'development';
//database modules
var _mysql = require('mysql');
var config = require('../config.js')[env];
//password hashing module
var bcrypt = require('bcrypt');
//sanitizer
var sanitizer = require('sanitizer');

module.exports.registeruser = function(registerparameters, callback, socket, users, io){

//sanitize
var username = sanitizer.escape(registerparameters.username);
var userpassword = sanitizer.escape(registerparameters.password);

console.log(username);
console.log(userpassword);

var db = config.database;

var connection = _mysql.createConnection({
    host     : db.HOST,
    user     : db.MYSQL_USER,
    password : db.MYSQL_PASS,
    database : db.DATABASE
});

connection.connect();

connection.query("SELECT * FROM logindata AS solution WHERE username='"+username+"'", function (error, results, fields) {
  if (error) throw error;
  var rowsfound = Object.keys(results).length;

  if (rowsfound != 0) {

    var hash = results[0].password;
    bcrypt.compare(userpassword, hash, function(err, res) {
        // res == true 
        if (res) {

            console.log('correct password!!');

            // saves chat name to socket
            socket.username = username;
            //saves corresponding socket in users object
            users[socket.username] = socket;
            //returns data
            io.emit('close modal', socket.username + ' has joined the chat.');
            io.emit('chat message', socket.username + ' has joined the chat.');

        }else {
          console.log("wrong");
          callback(false);
        }
    });

  }else {
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
  //   socket.username = username;
  //   //saves corresponding socket in users object
  //   users[socket.username] = socket;
  //   //returns data
  //   io.emit('chat message', socket.username + ' has joined the chat.');
  // }

}