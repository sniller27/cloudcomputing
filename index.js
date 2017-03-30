//MODULES
//express module. initializes app as function handler.
var app = require('express')();
var http = require('http').Server(app);
//module for socket.io (passing the http object(the HTTP server))
var io = require('socket.io')(http);
//module for serving static files (CSS)
var express = require('express');

//own modules
var register = require('./app/registeruser');
var whisper1 = require('./app/chatcommands/whisper');

//http server listen on port from environment variable or else port 3000
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

//object for storing users data
var users = {};

// using Express middleware for serving static files (the first URL is in application the other is the actual URL)
app.use('/style', express.static('stylesheets/style.css'));

//route handler "/" is called when we go to URL (get makes request for "/")
app.get('/', function(req, res){
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');

});

//socket.io listens on the connection event for incoming sockets and executes when server receives request
io.on('connection', function(socket){

	// register(socket);
  socket.on('user register', function(name, callback){

    register.registeruser(name, callback, socket, users, io);
      
  });

	//prints message in console when user is disconnecting
	socket.on('disconnect', function(){
		delete users[socket.username];
		io.emit('chat message', socket.username + ' has left the chat.');
	});

  socket.on('userinput', function(msg, callback){
    //io.emit('chat message', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [John]: '  + msg);
    var whisper = msg.substring(0, 3);
    if (whisper === "/w ") {

      whisper1.whisper(msg, users, socket, callback);
      
    }else if(msg === '\\list'){
    	//make array in order to only send nescessary information to user instead of object
    	var userlist = [];
    	for (var key in users) {
		    userlist.push(users[key].username);
		}
    	users[socket.username].emit('get users', userlist);
    }else{
    	io.emit('chat message', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + ']: '  + msg);
    }
  });
});
