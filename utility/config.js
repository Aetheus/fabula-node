//Server wide globals
//to import into other modules/app.js, simply include the following: 
 /*	
	//in othermodule.js
	var config = require("./utility/config");
 	console.log(config.testMsg);

  */

var exportObj = {
	testMsg: "Globals succesfully imported",
	testFunc: function(a){
		console.log("From globals:" + a);
	},

	//databaseURL for making connections to the postgresql db
	//DATABASE_URL=$(heroku config:get DATABASE_URL -a fabula-node) node .\bin\www
	databaseurl: process.env.DATABASE_URL || "you forgot to set the DATABASE_URL environment! read config for more info!"
	//"postgres://postgres:remember@localhost:5432/mydb"
}

module.exports = exportObj;
