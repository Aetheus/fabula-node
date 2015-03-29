var express = require("express");
var router = express.Router();
var boilerplate = (require("../model/boilerplate.js"))();


//html version
router.get("/", function (req,res,next){
	var dictionary = { 
		"name": "bob",
		"age" : 12,
		"mexican" : true
	}

	boilerplate.insert("tblFeedChannel", dictionary, function (err, result){
		if (err) throw err;

		console.log("we didnt eplode. its a mackeral.");

		res.end("hey ho");
	});
});


//JSON version
router.get("/JSON",function (req,res,next){
	res.header("Content-Type", "application/json");




});

function getDatabases(){


}


module.exports = router;