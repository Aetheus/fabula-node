var express = require("express");
var router = express.Router();
var pg = require('pg');

var myglobal = require("../utility/myglobal.js");


router.get('/', function (req, res) {
	//either heroku's set database_url env variable, or our local machine's db
	//postgres://localhost:5432/mydb
	//var databaseurl = process.env.DATABASE_URL || "postgres://postgres:remember@localhost:5432/mydb";

  	pg.connect(myglobal.databaseurl, function(err, client, done) {

  		if (err){
  			console.error(err); res.render('error', { message:err.message, error:err });
  		}

  		//notice that client.query's callback has a param for RESULT. Don't confuse it with router.get's callback param, RES(PONSE)
		client.query('SELECT * FROM test_table', function(err, result) {
			done();	//client pooling
  	    	
			if (err){ 
				console.error(err); res.render('error', { message:err.message, error:err }); 
			}
			
			res.send(result.rows); 
		});
	});

})

module.exports = router;