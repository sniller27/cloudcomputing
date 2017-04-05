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

var io = require('socket.io')(server);
var chat = require('./app/chat');

server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

/** ---------------------------------------- **/

// using Express middleware for serving static files (the first URL is in application the other is the actual URL)
app.use('/style', express.static('stylesheets/style.css'));
app.use('/chatview', express.static('views/chatview.js'));

//route handler "/" is called when we go to URL (get makes request for "/")
app.get('/', function(req, res){
	//express: res.send('<h1>Hello world</h1>');   //node: res.write('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');

});

chat.chat(io);