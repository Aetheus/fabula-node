var express = require("express");
var router = express.Router();
var pg = require('pg');

var config = require("../utility/config.js");

var feedchannelimporter = require("../model/FeedChannel");

router.get("/", function (req,res,next){
	//tblName, upsertDictionary, whereDictionary, callback

	//var tblName = "tblfeedchannel";
	var upsertDictionary = {
		"fedfeedchannelname" : "webspace updated via upsert"
	}
	var whereDictionary = {
		"feduserid" : "superuser",
		"fedfeedchannelurl" : "http://webspace.apiit.edu.my/"
	}

	var feedchannel = feedchannelimporter();
	feedchannel.upsert(upsertDictionary, whereDictionary, function (err, result){
		if (err) return next(err);

		res.write(" " + JSON.stringify(result));
		res.end("we did it! or did we ...");
	})

});

module.exports = router;