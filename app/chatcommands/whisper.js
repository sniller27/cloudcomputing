module.exports.whisper = function(msg, users, socket, callback){

  msg = msg.substring(3);
  var spaceindex = msg.indexOf(" ");

  if (spaceindex !== -1) {
    var receiver = msg.substring(0,spaceindex);
    msg = msg.substring(spaceindex + 1);

    if(receiver in users){
      //io.emit('whisper', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + ']: ' + msg);
      users[receiver].emit('whisper', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + ']: ' + msg);
      users[socket.username].emit('whisper', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + ']: ' + msg);
      //socket.to(socket.username).emit('hey', 'I just met you');
    }else {
      callback('user doesn\'t exist');
    }
  }else{
    callback('wrong syntax');
  }

}