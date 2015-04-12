var express= require("express");
var router = express.Router();

var FeedItemImporter = require("../model/FeedItem.js");



router.get("/:id",function (req,res,next){
	if (!req.params.id){
		return next(new Error("Item ID MUST be provided!"));
	}

	var feeditem = FeedItemImporter();
	var feeditemId = req.params.id;

	var tblName = "tblFeedItem"; 
	var updateDictionary = {"fitisread":"true"};
	var whereDictionary = {"fitfeeditemid":feeditemId};

	feeditem.update(updateDictionary, whereDictionary, function (err, result){
		var returnObj = {success:true};

		if(err){
			returnObj.success = false;
			res.json(returnObj);
		}

		res.json(returnObj);
	});
});

module.exports = router;