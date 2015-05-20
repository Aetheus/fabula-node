var express = require("express");
var router = express.Router();
var FeedChannelImporter = require("../model/FeedChannel");


//gets all the channels belonging to the user who's userid matches the id
router.get("/:id", function(req,res,next){
	var userid = req.params.id;

	var feedchannel = FeedChannelImporter();
	var whereDictionary = {"feduserid":userid};

	feedchannel.select(["*"],whereDictionary, function (err, result){
		if (err) return next(err);

		//res.json(result);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
});




//edits the channel that has the channelid matching the provided id
router.get("/edit/:channelid", function (req,res,next) {
	var channelid = req.params.channelid;
	var channelname = (req.query.channelname != undefined) ? req.query.channelname : null;
	var channeldesc = (req.query.channeldesc != undefined) ? req.query.channeldesc : null;
	var channeltags = (req.query.channeltags != undefined) ? req.query.channeltags : null;


	
	var feedchannel = FeedChannelImporter();
	var updateDictionary = {	
			"fedfeedchannelname": channelname,  
			"fedfeedchanneldesc": channeldesc,
			"fedfeedchanneltags": channeltags
	};
	var whereDictionary = {"fedfeedchannelid" : channelid}

	feedchannel.update(updateDictionary,whereDictionary, function (err, result){
		if (err) return next(err);

		//res.json(result);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
});

//deletes the channel that has the channelid matching the provided id
router.get("/delete/:channelid", function (req,res,next) {
	var channelid = req.params.channelid;

	var feedchannel = FeedChannelImporter();
	var whereDictionary = {"fedfeedchannelid" : channelid}
	feedchannel.del(whereDictionary, function (err, result){
		if (err) return next(err);

		//res.json(result);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
});




module.exports = router;