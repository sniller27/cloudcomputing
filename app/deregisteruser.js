module.exports.deregisteruser = function(io, socket, users){

	if (socket.username != undefined){
		delete users[socket.username];
		io.emit('chat message', socket.username + ' has left the chat.');
	}

}