var express = require("express");
var router = express.Router();
var UserAppSettingsImporter = require("../model/UserAppSettings");


//gets the (app) globalSettings belonging to the user who's userid matches the id
router.get("/:id", function(req,res,next){
	var userid = req.params.id;

	var UserAppSettings = UserAppSettingsImporter();
	var whereDictionary = {"uasuserid":userid};

	UserAppSettings.select(["*"],whereDictionary, function (err, result){
		if (err) return next(err);

		if(result.rowCount > 0){
			var globalSettings = result.rows[0].uasglobalsettings;
			var jsonObj = JSON.parse(globalSettings);
			console.log("retrieved globalSettings is " + JSON.stringify(jsonObj));		

			//if its an empty json obj for some reason, return the isEmpty flag
			if(JSON.stringify(jsonObj) == "{}"){
				jsonObj = {"isEmptyFlag" : true};
			}

			res.json(jsonObj);
			res.end();
		}else{
			res.json({"isEmptyFlag" : true});
			res.end();
		}

	});
});


//set the (app) globalSettings belonging to the user 
router.get("/set/:id", function(req,res,next){
	var userid = req.params.id;
	var globalSettings = (req.query.globalSettings != undefined) ? req.query.globalSettings : null;

	var preparedGlobalSettings = JSON.stringify ( JSON.parse(globalSettings) );

	var UserAppSettings = UserAppSettingsImporter();
	var updateDictionary = {"uasuserid" : userid, "uasglobalsettings" : globalSettings};
	var whereDictionary = {"uasuserid":userid};

	UserAppSettings.upsert(updateDictionary,whereDictionary, function (err, result){
		if (err) return next(err);

		if (result.rowCount > 0){
			res.end("success");
		}else{
			res.end("failure");
		}
	});
});

module.exports = router;