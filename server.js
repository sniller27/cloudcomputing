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
var router = express.Router();
var server = http.createServer(app);

//db modules
var _mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var config = require('./config.js')[env];
//session modules
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
//socket io and chat module
var io = require('socket.io')(server);
var chat = require('./app/chat');

var routes = require('./routes.js');

/**
	PORT LISTEN
**/

server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

/**
	BIND MIDDLEWARE
**/
// using Express middleware for serving static files (the first URL is in application the other is the actual URL)
app.use('/style', express.static('stylesheets/style.css'));
app.use('/chatview', express.static('views/chatview.js'));
app.use('/signup', express.static('views/signup.html'));


/**
	SESSIONS
**/
var db = config.database;

var options = {
    host: db.HOST,
    port: 3306,
    user: db.MYSQL_USER,
    password: db.MYSQL_PASS,
    database: db.DATABASE
};
 
var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

// /**
// 	ROUTES
// **/
// //route handler "/" is called when we go to URL (get makes request for "/")
// router.get('/', function(req, res){
// 	//express: res.send('<h1>Hello world</h1>');   //node: res.write('<h1>Hello world</h1>');
// 	res.sendFile(__dirname + '/index.html');

// });

// //post form for sign up
// router.post('/signup', urlencodedParser, function (req, res) {
	
// 	console.log(req.body);

// 	var db = config.database;

// 	var connection = _mysql.createConnection({
// 	    host     : db.HOST,
// 	    user     : db.MYSQL_USER,
// 	    password : db.MYSQL_PASS,
// 	    database : db.DATABASE
// 	});

// 	connection.connect();

// 	connection.query("INSERT INTO `logindata`(`id`, `username`, `password`) VALUES (null, '"+req.body.signupusername+"', '"+req.body.signuppassword+"')", function (error, results, fields) {


// 	});

// 	connection.end();

// 	//after
// 	if (!req.body) return res.sendStatus(400)
// 	res.send('welcome, ' + req.body.signupusername)
// })

//apply routes to application
app.use('/', routes);

chat.chat(io);