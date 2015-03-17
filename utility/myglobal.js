//Server wide globals
//to import into other modules/app.js, simply include the following: 
 /*	
	//in othermodule.js
	var myglobal = require("./utility/myglobal");
 	console.log(myglobal.testMsg);

  */

var exportObj = {
	testMsg: "Globals succesfully imported",
	testFunc: function(a){
		console.log("From globals:" + a);
	},

	//databaseURL for making connections to the postgresql db
	databaseurl: process.env.DATABASE_URL || "postgres://postgres:remember@localhost:5432/mydb"
}

module.exports = exportObj;
