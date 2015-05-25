var express = require("express");
var router = express.Router();
var tblFeedChannelImporter = require("../model/FeedChannel");
var tblFeedItemImporter = require("../model/FeedItem");

var scrape = require("../utility/scrape");
var verifylogin = require("../utility/verifylogin");


//verifiable, POST based JSON version
router.post("/", function (req,res,next){
	var userid = req.body.userid;
	var password = req.body.password;
	var tblFeedItem = tblFeedItemImporter();
	var timeRange = (req.body.timerange) ? req.body.timerange : null;
	var tags = (req.body.tags) ? req.body.tags : null;

	//optionalRowLimit.limit;
	//optionalRowLimit.offset;
	var RowLimit = (req.body.rowlimit) ? req.body.rowlimit : null;	

	var isRowCheckOnly = (req.body.isrowcheckonly) ? true : false;

	console.log("timerange was: " + JSON.stringify(timeRange));
	console.log("tags were: " + tags);

	verifylogin(userid,password, function (err, isVerified, next){
		if (err) return next(err);

		

		var OrderByCondition = {column:"tblfeeditem.fittimestamp", order:"DESC"};
		

		tblFeedItem.selectWhereUserID(userid, function (err, result){
			if (err){
				console.log(err);
				return next(err);	
			} 
	
			//if they only requested for rows, then that's what we give em. else, we give em all the results
			if(isRowCheckOnly){
				var returnObj = {"rowCount" : result.rowCount };

				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(returnObj));				
			}else{
				res.json(result.rows);
				res.end();				
			}
		},timeRange, OrderByCondition,RowLimit,tags);
	});
});

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