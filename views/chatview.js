    
//onload functionality
$('#myModal').modal({backdrop: 'static', keyboard: false});
$('#myModal').modal('show');
console.log("vis modal");
$('#messagebutton').prop('disabled', true);
$('#chatname').focus();

$(function () {

  //no URL in io() specified, since it defaults to trying to connect to the host that serves the page
  var socket = io();

  function scrollToBot(){
   $("html, body").animate({ scrollTop: $(document).height() }, 0); 
  }

  //user connects to chat
  $('#connectnameform').submit(function(){

    var parameters = { 
      username: $('#chatname').val(), 
      password: $('#password').val() 
    };

    socket.emit('user register', parameters, function(data){
      if(data){
        console.log(data);
        $('#myModal').modal('hide');
        $(':input[type="submit"]').prop('disabled', true);
        $(':input[type="text"]').prop('disabled', true);
        $('#messagebutton').prop('disabled', false);
        $("#messagebutton").focus();
      }else {
        $('#loginfeedback').text("Wrong username and password");
      }

    });

    
    
    return false;
  });

  //submit textmessage
  $('#sendmessageform').submit(function(){

      socket.emit('userinput', $('#messagebutton').val(), function(data){
        $('#messages').append($('<li class="red">').text(data));
        scrollToBot();
      });

    $('#messagebutton').val('');

    return false;
  });

  //append textmessage to chat
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    scrollToBot();
  });

  //whisper
  socket.on('whisper', function(msg){
    $('#messages').append($('<li class="green">').text(msg));
    scrollToBot();
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
    scrollToBot();
  });

});