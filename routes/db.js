var express = require("express");
var router = express.Router();
var pg = require('pg');

var config = require("../utility/config.js");


router.get('/', function (req, res,next) {
	//either heroku's set database_url env variable, or our local machine's db
	//postgres://localhost:5432/mydb
	//var databaseurl = process.env.DATABASE_URL || "postgres://postgres:remember@localhost:5432/mydb";

  	pg.connect(config.databaseurl, function(err, client, done) {

  		if (err){
  			console.log(err);
  			next(err);
  		}

  		//notice that client.query's callback has a param for RESULT. Don't confuse it with router.get's callback param, RES(PONSE)
		client.query('SELECT * FROM test_table', function(err, result) {
			done();	//client pooling
  	    	
			if (err){ 
				console.log(err);
				client.end();
				next(err); 
			}else{
				if(typeof result !== "undefined"){
					res.send(result.rows); 
				}else{
					res.send("No rows found");
				}
				client.end();
			}
		});

	});

})

module.exports = router;