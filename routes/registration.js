var express = require('express');
var router = express.Router();
var register = require("../utility/register");


router.get('/getRoute', function(req, res, next){
	var userid = (req.query.userid != undefined) ? req.query.userid : null;
	var userpw = (req.query.userpw != undefined) ? req.query.userpw : null;
	var pwquestion = (req.query.pwquestion != undefined) ? req.query.pwquestion : null;
	var pwanswer = (req.query.pwanswer != undefined) ? req.query.pwanswer : null;

	register(userid, userpw, pwquestion, pwanswer, function (err, results){
		if (err){
			return next(err);
		}

		res.end("registration successful");
	});
});


router.post('/', function(req, res, next){
	var userid = (req.body.userid != undefined) ? req.body.userid : null;
	var userpw = (req.body.userpw != undefined) ? req.body.userpw : null;
	var pwquestion = (req.body.pwquestion != undefined) ? req.body.pwquestion : null;
	var pwanswer = (req.body.pwanswer != undefined) ? req.body.pwanswer : null;

	register(userid, userpw, pwquestion, pwanswer, function (err, results){
		if (err){
			return next(err);
		}

		res.end("registration successful");
	});
});

module.exports = router;
