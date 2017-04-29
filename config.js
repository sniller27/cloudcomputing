config = {

	development: {

	    database:{
			HOST : 'localhost',
			PORT : 8080,
			MYSQL_USER : 'root',
			MYSQL_PASS : '',
			DATABASE : 'chatclientdb',
			TABLE : 'logindata'
		}

	},
	production: {

	    database: {
			HOST : 'us-cdbr-iron-east-03.cleardb.net',
			PORT : 8080,
			MYSQL_USER : 'b184b3354efb4f',
			MYSQL_PASS : 'b1a8dab4',
			DATABASE : 'ad_792424820412a5f',
			TABLE : 'logindata'
	    }
	    
	}

}
module.exports = config;