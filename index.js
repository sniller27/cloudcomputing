//MODULES
//express module. initializes app as function handler.
var app = require('express')();
var http = require('http').Server(app);
//module for socket.io (passing the http (the HTTP server) object)
var io = require('socket.io')(http);

//route handler "/" is called when we go to URL
app.get('/', function(req, res){
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');

});

//socket.io listens on the connection event for incoming sockets...executes when server receives request
io.on('connection', function(socket){

	//console.log('a user connected');

  socket.on('chat message', function(msg){
	//"redirects" users input to console
    //console.log('message: ' + msg);

    //prints on website
    io.emit('chat message', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [John]: '  + msg);
  });

  socket.on('user connected', function(msg){
    //prints on website
    io.emit('chat message', '[John] has joined the chat.');
  });

  //prints message in console when user is disconnecting
  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('chat message', '[John] has left the chat.');
  });
});

//http server listen on port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});
