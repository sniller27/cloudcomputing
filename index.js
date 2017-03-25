//MODULES
//express module. initializes app as function handler.
var app = require('express')();
var http = require('http').Server(app);
//module for socket.io (passing the http (the HTTP server) object)
var io = require('socket.io')(http);

//lists
// var users = [];
var users = {};
var connections = [];

//route handler "/" is called when we go to URL
app.get('/', function(req, res){
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');

});

//socket.io listens on the connection event for incoming sockets...executes when server receives request
io.on('connection', function(socket){

	socket.on('user register', function(name){

		if(name in users){
			console.log('eksiterer allerede');
		}

	socket.username = name;
	connections.push(socket);
	//users.push(socket.username);
	users[socket.username] = socket;

	console.log('number of connections: ' + connections.length);

    //prints on website
    io.emit('chat message', socket.username + ' has joined the chat.');
    //io.emit('get users', users);
  	});

	//prints message in console when user is disconnecting
	socket.on('disconnect', function(){
		//deregister user
		//clients.splice(clients.indexOf(client), 1);
		//feedback
		// users.splice(users.indexOf(socket.username), 1);
		delete users[socket.username];
		connections.splice(connections.indexOf(socket), 1);
		
		io.emit('chat message', socket.username + ' has left the chat.');

		console.log('number of connections: ' + connections.length);
	});


	//console.log('a user connected');

  socket.on('userinput', function(msg){
	//"redirects" users input to console
    //console.log('message: ' + msg);

    //prints on website
    //io.emit('chat message', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [John]: '  + msg);
    var whisper = msg.substring(0, 3);
    if (whisper === "/w ") {
    	msg = msg.substring(3);
    	var spaceindex = msg.indexOf(" ");

    	if (spaceindex !== -1) {
    		var receiver = msg.substring(0,spaceindex);
    		msg = msg.substring(spaceindex + 1);
    		console.log('modtager: ' + receiver);
    		console.log('besked: ' + msg);

    		if(receiver in users){
    			//console.log('godkendt bruger');
    			//io.emit('whisper', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + ']: ' + msg);
    			users[receiver].emit('chat message', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + ']: ' + msg);
    			users[socket.username].emit('chat message', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + ']: ' + msg);
    			//socket.to(socket.username).emit('hey', 'I just met you');
    		}

    	}else{
    		console.log('wrong syntax');
    	}
    }else{
    	io.emit('chat message', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + ']: '  + msg);
    }


  });


	//LIST
	// socket.on('ready', function() {
 //        // UPDATE N rows with client_id in column checkout.
 //        // Then SELECTS * from table where checkout = client_id
 //        clients.forEach(function(client, index) {
 //            var client_id = index; // Just use the index in the clients array for now
 //            getListings(client_id, function(listings) {
 //                socket.emit('job', listings);   // send jobs
 //            });
 //        });
 //    });


});

//http server listen on port from environment variable or else port 3000?
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});
