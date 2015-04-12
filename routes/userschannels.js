var express = require("express");
var router = express.Router();
var FeedChannelImporter = require("../model/FeedChannel");



router.get("/:id", function(req,res,next){
	var userid = req.params.id;

	var feedchannel = FeedChannelImporter();
	var whereDictionary = {"feduserid":userid};

	feedchannel.select(["*"],whereDictionary, function (err, result){
		if (err) return next(err);

		res.json(result);
	});
});




module.exports = router;