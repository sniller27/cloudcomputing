module.exports.registeruser = function(name, callback, socket, users, io){

  if(name in users){
    // doesnt work
    callback(false);
    //io.emit('chat message', 'username already exists');
  }else {
    
    // saves chat name to socket
    socket.username = name;
    //saves corresponding socket in users object
    users[socket.username] = socket;
    //returns data
    io.emit('chat message', socket.username + ' has joined the chat.');
  }

}