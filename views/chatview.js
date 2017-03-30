    
//onload functionality
$('#myModal').modal({backdrop: 'static', keyboard: false});
$('#myModal').modal('show');
$('#messagebutton').prop('disabled', true);
$('#chatname').focus();

$(function () {

  //no URL in io() specified, since it defaults to trying to connect to the host that serves the page
  var socket = io();

  //user connects to chat
  $('#connectnameform').submit(function(){

    var samename;
    
    socket.emit('user register', $('#chatname').val(), function(data){
        $('#messages').append($('<li class="red">').text(data));
        // $('#myModal').modal('show');
        // $(':input[type="submit"]').prop('disabled', false);
        // $(':input[type="text"]').prop('disabled', false);
        // $('#messagebutton').prop('disabled', true);
        // $("#chatname").focus();
    });

    $('#myModal').modal('hide');
    $(':input[type="submit"]').prop('disabled', true);
    $(':input[type="text"]').prop('disabled', true);
    $('#messagebutton').prop('disabled', false);
    $("#messagebutton").focus();
    
    return false;
  });

  //submit textmessage
  $('#sendmessageform').submit(function(){

      socket.emit('userinput', $('#messagebutton').val(), function(data){
        $('#messages').append($('<li class="red">').text(data));
      });

    $('#messagebutton').val('');
    return false;
  });

  //append textmessage to chat
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  //whisper
  socket.on('whisper', function(msg){
    $('#messages').append($('<li class="green">').text(msg));
  });

  //getting users list
  socket.on('get users', function(userlist){
    var allusers;
    allusers = '<li>----- Online users -----</li>';

    for(i = 0; i < userlist.length;i++){
      allusers += '<li>' + userlist[i] + '</li>';
    }
    allusers += '<li>-----------------------------</li>';

    //appends all at once
    $('#messages').append(allusers);
  });

});