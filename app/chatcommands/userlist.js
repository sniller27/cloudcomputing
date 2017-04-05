module.exports.userlist = function(users, socket){

  var userlist = [];
  for (var key in users) {
    userlist.push(users[key].username);
  }
  users[socket.username].emit('get users', userlist);

}