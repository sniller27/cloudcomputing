//register and degister modules
var register = require('./registeruser');
var deregister = require('./deregisteruser');

//command modules
var normalmessage = require('./chatcommands/normalmessage');
var whisper = require('./chatcommands/whisper');
var userlist = require('./chatcommands/userlist');


//object for storing users data
var users = {};


module.exports.chat = function(io){

  io.on('connection', function(socket){

    // register(socket);
    socket.on('user register', function(name, callback){

      register.registeruser(name, callback, socket, users, io);
        
    });

    //prints message in console when user is disconnecting
    socket.on('disconnect', function(){
      deregister.deregisteruser(io, socket, users);
    });

    socket.on('userinput', function(msg, callback){

      var detectwhisper = msg.substring(0, 3);
      if (detectwhisper === "/w ") {

        whisper.whisper(msg, users, socket, callback);

      }else if(msg === '\\list'){

        userlist.userlist(users, socket);

      }else{
        normalmessage.normalmessage(io, socket, msg);
      }

    });
  });

}