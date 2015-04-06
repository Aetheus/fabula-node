var express = require("express");
var router = express.Router();
var verifylogin = require("../utility/verifylogin")


router.get("/", function (req, res, next){
	
	var returnObj = {
		isMember: false,
		name: "guest"
	}

	if (!(req.query.username && req.query.password)){
		returnObj.name = "careless guest";
		res.json(returnObj);
	}else{
		verifylogin(req.query.username, req.query.password, function (err, isVerified, userRow){
			if (err) return next(err);

			if(isVerified){
				returnObj.isMember = true;
				returnObj.name = req.query.username;
			}else{
				returnObj.name = "unauthorized guest";
			}

			res.json(returnObj);
		});
	}

});

//POST version of the prevoius one
router.post("/", function (req, res, next){
	
	var returnObj = {
		isMember: false,
		name: "guest"
	}

	if (!(req.body.username && req.body.password)){
		returnObj.name = "careless guest";
		res.json(returnObj);
	}else{
		verifylogin(req.body.username, req.body.password, function (err, isVerified, userRow){
			if (err) return next(err);

			if(isVerified){
				returnObj.isMember = true;
				returnObj.name = req.body.username;
			}else{
				returnObj.name = "unauthorized guest";
			}

			res.json(returnObj);
		});
	}

});



module.exports = router;