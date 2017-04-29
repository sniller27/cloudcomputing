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

  //connect to database
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
          if (res) {

              var checknametaken = false;
              //check if username is in use
              for (var key in users) {
                if (users[key].username == username) {
                  checknametaken = true;
                }
              }

              if (checknametaken) {
                console.log('allerede taget');
                callback('taken');
              }else {
                // saves chat name to socket
                socket.username = username;
                //saves corresponding socket in users object
                users[socket.username] = socket;
                
                //returns data
                io.emit('chat message', socket.username + ' has joined the chat.');
                callback(true);
              }
          }else {
            callback(false);
          }
      });

    }else {
      callback(false);
    }
  });

  connection.end();

}