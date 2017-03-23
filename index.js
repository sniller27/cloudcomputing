//modules

//app is function handler (assigned by express)
var app = require('express')();
var http = require('http').Server(app);

//route handler "/" is called when we go to URL
app.get('/', function(req, res){
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');

});


//http server listen on port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});


//EXECUTE: node index.js