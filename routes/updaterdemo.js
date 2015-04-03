var express = require('express');
var router = express.Router();
var updater = require("../utility/updater");


router.get('/', function(req, res, next){
	updater.updateAllFeeds(function (err, numInsertedRows){

		console.log("Number of inserted rows: " + numInsertedRows);	
	});
	res.end("That's all folks!");
});

module.exports = router;
