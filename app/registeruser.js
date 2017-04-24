module.exports.registeruser = function(registerparameters, callback, socket, users, io){

var _mysql = require('mysql');

var HOST = 'localhost';
var PORT = 8080;
var MYSQL_USER = 'root';
var MYSQL_PASS = '';
var DATABASE = 'chatclientdb';
var TABLE = 'logindata';
var rowsfound;

var connection = _mysql.createConnection({
  host     : HOST,
  user     : MYSQL_USER,
  password : MYSQL_PASS,
  database : DATABASE
});

connection.connect();

connection.query("SELECT * FROM logindata AS solution WHERE username='"+registerparameters.username+"' AND password='"+registerparameters.password+"'", function (error, results, fields) {
  if (error) throw error;

  rowsfound = Object.keys(results).length;

  if (rowsfound != 0) {
    console.log('correct password!!');
    // saves chat name to socket
    socket.username = registerparameters.username;
    //saves corresponding socket in users object
    users[socket.username] = socket;
    //returns data
    io.emit('chat message', socket.username + ' has joined the chat.');

  }else{
    console.log("wrong");
    callback(false);
  }
  
});

  

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