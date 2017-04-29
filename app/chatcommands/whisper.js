module.exports.whisper = function(msg, users, socket, callback){

  msg = msg.substring(3);
  var spaceindex = msg.indexOf(" ");

  if (spaceindex !== -1) {
    var receiver = msg.substring(0,spaceindex);
    msg = msg.substring(spaceindex + 1);

    if(receiver in users){
      if (socket.username == receiver) {
        callback('you can\'t whisp to yourself');
      }else {
        users[receiver].emit('whisper', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' from [' + socket.username + ']: ' + msg);
        users[socket.username].emit('whisper', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + '] -->' + ' [' + receiver + ']: ' + msg);
      }
    }else {
      callback('user doesn\'t exist');
    }
  }else{
    callback('wrong syntax');
  }

}