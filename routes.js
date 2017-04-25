/**
	ROUTES (moved from server.js)
**/
var express = require('express');
var router = express.Router();
//modules for post form
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//db modules
var _mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var config = require('./config.js')[env];
//password hashing module
var bcrypt = require('bcrypt');

//route handler "/" is called when we go to URL (get makes request for "/")
router.get('/', function(req, res){
	//express: res.send('<h1>Hello world</h1>');   //node: res.write('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');

	// for templates/view engines
	// res.render('index');

});

//post form for sign up
router.post('/signup', urlencodedParser, function (req, res) {
	
	//set salt and generate hash
	const saltRounds = 10;

	//sql insert inside to ensure everything getting called after the hash is made
	bcrypt.hash(req.body.signuppassword, saltRounds, function(err, hash) {
		console.log(req.body);

		var db = config.database;

		var connection = _mysql.createConnection({
		    host     : db.HOST,
		    user     : db.MYSQL_USER,
		    password : db.MYSQL_PASS,
		    database : db.DATABASE
		});

		connection.connect();

			connection.query("INSERT INTO `logindata`(`id`, `username`, `password`) VALUES (null, '"+req.body.signupusername+"', '"+hash+"')", function (error, results, fields) {
			});

		connection.end();
	});

	//after
	if (!req.body) return res.sendStatus(400)
	res.send('welcome, ' + req.body.signupusername)
})
	

module.exports = router;

