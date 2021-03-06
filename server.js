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
	HTTPS redirect
**/
// var forceHTTPS = function () {
//   return function(req, res, next) {
//     if (!req.secure) {
//       if (app.get('env') === 'development') {
//          return res.redirect('https://localhost:3001' + req.url);
//       } else {
//         return res.redirect('https://' + req.headers.host + req.url);
//       }
//     } else {
//       return next();
//     }
//   };
// };

//apply routes to application
app.use('/', routes);

chat.chat(io);