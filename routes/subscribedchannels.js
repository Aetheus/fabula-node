var express = require("express");
var router = express.Router();
var tblFeedItem = (require("../model/FeedChannel"))();

var scrape = require("../utility/scrape");


//html version
router.get("/", function (req,res,next){
	var session = req.session;

	if (!session.userid){
		return next(new Error("You must be logged in to view subscribed feeds"));
	}

	var dictionary = { 
		"feduserid" : session.userid
	}
	
	tblFeedItem.select(["*"], dictionary, function (err, result){
		if (err) throw err;

		var newsarrayarray = [];


		for (var i = 0; i< result.rows.length ; i++){
			//console.log(JSON.stringify(result.rows[i]));
			newsarrayarray[newsarrayarray.length] = scrape.scrapeFeedChannel(result.rows[i]);
		}


		res.write("heya \n");
		res.write("" + JSON.stringify(result));
		res.end("\nhey ho");
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