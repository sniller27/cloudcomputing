// //MODULES
// //express module. initializes app as function handler.
// var app = require('express')();
// //http module
// var http = require('http').Server(app);

// //module for socket.io (passing the http object(the HTTP server))
// var io = require('socket.io')(http);
// //module for serving static files (CSS)
// var express = require('express');
// //chatfunctionality module
// var chat = require('./app/chat');

// //http server listen on port from environment variable or else port 3000
// http.listen(process.env.PORT || 3000, function(){
//   console.log('listening on *:3000');
// });

//above could also have been done this way (change listen and io to server)
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
//for post form
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//db
var _mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var config = require('./config.js')[env];


var io = require('socket.io')(server);
var chat = require('./app/chat');

server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

/** ---------------------------------------- **/
// DATABASE
// var _mysql = require('mysql');

// var HOST = 'localhost';
// var PORT = 8080;
// var MYSQL_USER = 'root';
// var MYSQL_PASS = '';
// var DATABASE = 'chatclientdb';
// var TABLE = 'logindata';

// var connection = _mysql.createConnection({
//   host     : HOST,
//   user     : MYSQL_USER,
//   password : MYSQL_PASS,
//   database : DATABASE
// });

// connection.connect();

// connection.query("SELECT * FROM logindata AS solution WHERE username='bo' AND password='lol'", function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results);
// });

// var mysql = _mysql.createClient({
//     host: HOST,
//     port: PORT,
//     user: MYSQL_USER,
//     password: MYSQL_PASS,
// });

// mysql.query('use ' + DATABASE);
/** ---------------------------------------- **/

// using Express middleware for serving static files (the first URL is in application the other is the actual URL)
app.use('/style', express.static('stylesheets/style.css'));
app.use('/chatview', express.static('views/chatview.js'));
app.use('/signup', express.static('views/signup.html'));

//route handler "/" is called when we go to URL (get makes request for "/")
app.get('/', function(req, res){
	//express: res.send('<h1>Hello world</h1>');   //node: res.write('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');

});

//post form for sign up
app.post('/signup', urlencodedParser, function (req, res) {
	
	console.log(req.body);

	var db = config.database;

	var connection = _mysql.createConnection({
	    host     : db.HOST,
	    user     : db.MYSQL_USER,
	    password : db.MYSQL_PASS,
	    database : db.DATABASE
	});

	connection.connect();

	connection.query("INSERT INTO `logindata`(`id`, `username`, `password`) VALUES (null, '"+req.body.signupusername+"', '"+req.body.signuppassword+"')", function (error, results, fields) {


	});

	connection.end();

	//after
	if (!req.body) return res.sendStatus(400)
	res.send('welcome, ' + req.body.signupusername)
})

chat.chat(io);