var express = require("express");
var router = express.Router();
var tblFeedChannelImporter = require("../model/FeedChannel");
var tblFeedItemImporter = require("../model/FeedItem");

var scrape = require("../utility/scrape");



//JSON version
router.get("/:userid",function (req,res,next){
	var session = req.session;
	var tblFeedChannel = tblFeedChannelImporter();
	var tblFeedItem = tblFeedItemImporter();

	var userid = req.params.userid;

	tblFeedItem.selectWhereUserID(userid, function (err, result){
		if (err) return next(err);

		res.json(result.rows);
		res.end();
	});
});



//html version
router.get("/HTML", function (req,res,next){
	var session = req.session;
	var tblFeedChannel = tblFeedChannelImporter();
	var tblFeedItem = tblFeedItemImporter();

	if (!session.userid){
		return next(new Error("You must be logged in to view subscribed feeds"));
	}
	
	tblFeedItem.selectWhereUserID(session.userid, function (err, result){
		if (err) return next(err);

		res.write(JSON.stringify(result.rows));
		res.end();
	});
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