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
//sanitizer
var sanitizer = require('sanitizer');

//route handler "/" is called when we go to URL (get makes request for "/")
router.get('/', function(req, res){
	//express: res.send('<h1>Hello world</h1>');   //node: res.write('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');

	// for templates/view engines
	// res.render('index');

});

//post form for sign up
router.post('/signup', urlencodedParser, function (req, res) {

	//sanitize
	var username = sanitizer.escape(req.body.signupusername);
	var userpassword = sanitizer.escape(req.body.signuppassword);
	
	//set salt and generate hash
	const saltRounds = 10;

	//sql insert inside to ensure everything getting called after the hash is made
	bcrypt.hash(userpassword, saltRounds, function(err, hash) {
		console.log(req.body);

		var db = config.database;

		var connection = _mysql.createConnection({
		    host     : db.HOST,
		    user     : db.MYSQL_USER,
		    password : db.MYSQL_PASS,
		    database : db.DATABASE
		});

		connection.connect();

		//check if user exists
		connection.query("SELECT * FROM logindata AS solution WHERE username='"+username+"'", function (error, results, fields) {
			if (error) throw error;
			var rowsfound = Object.keys(results).length;

			if (rowsfound != 0) {
				res.sendFile(__dirname + '/views/signup.html');
				console.log('user already exists');
			}else {
				var db = config.database;

				var connection = _mysql.createConnection({
					host     : db.HOST,
					user     : db.MYSQL_USER,
					password : db.MYSQL_PASS,
					database : db.DATABASE
				});

				connection.connect();
				//insert user
				connection.query("INSERT INTO `logindata`(`id`, `username`, `password`) VALUES (null, '"+username+"', '"+hash+"')", function (error, results, fields) {
					if (!req.body) return res.sendStatus(400)
					res.send('welcome, ' + username)
				});
				connection.end();
			}
		});
		connection.end();
	});
})

module.exports = router;

