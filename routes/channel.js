var express = require("express");
var router = express.Router();

var FeedItemImporter = require("../model/FeedItem.js");

//returns the contents (feed items) of a channel
router.get("/:id", function (req,res,next){
	var channelid = req.params.id;

	var feeditem = FeedItemImporter();

	feeditem.selectWhereChannelID(channelid, function (err, result){
		if (err) return next(err);

		res.json(result);
	});
});


module.exports = router;