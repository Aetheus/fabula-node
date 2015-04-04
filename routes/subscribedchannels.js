var express = require("express");
var router = express.Router();
var tblFeedChannelImporter = require("../model/FeedChannel");
var tblFeedItemImporter = require("../model/FeedItem");

var scrape = require("../utility/scrape");


//html version
router.get("/", function (req,res,next){
	var session = req.session;
	var tblFeedChannel = tblFeedChannelImporter();

	if (!session.userid){
		return next(new Error("You must be logged in to view subscribed feeds"));
	}

	var dictionary = { 
		"feduserid" : session.userid
	};
	
	tblFeedItem.select(["*"], dictionary, function (err, result){
		if (err) next(err);

		res.write(JSON.stringify(result.rows));
		res.end();
	});
});


//JSON version
router.get("/JSON",function (req,res,next){
	res.header("Content-Type", "application/json");




});

//hidden
router.get("/hidden", function (req,res,next){
	var dictionary = { 
		"id" 	: 2,
		"name" 	: "Hello from my new shiny insert function!" 
	}

	dictionary = null;
	tblFeedItem.select(["*"], dictionary, function (err, result){
		if (err) throw err;

		res.write("heya \n");
		res.write("" + JSON.stringify(result));
		res.end("\nhey ho");
	});
});

module.exports = router;