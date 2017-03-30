module.exports.normalmessage = function(io, socket, msg){

  io.emit('chat message', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' [' + socket.username + ']: '  + msg);

}