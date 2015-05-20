var express= require("express");
var router = express.Router();
var password = require("password-hash-and-salt");
var UserImporter = require("../model/User.js");


//get the question
router.get("/",function (req,res,next){
	if (!req.query.userid){
		return next(new Error("User ID must be provided!"));
	}

	var userid = req.query.userid;
	var UserTable = UserImporter();



	UserTable.select(["*"], {"usruserid" : userid}, function (err, result){
		if(err){
			return next(err);	
		}

		var secretQuestion = result.rows[0].usruserpasswordquestion;

		//usrUserPasswordQuestion
		//usrUserPasswordAnswer	

		res.end(secretQuestion);
	});
});

//test an answer
router.get("/answer",function (req,res,next){
	if (!req.query.userid){
		return next(new Error("User ID must be provided!"));
	}
	if (!req.query.answer){
		return next(new Error("Answer must be provided!"));
	}

	var userid = req.query.userid ? req.query.userid : "" ;
	var answer = req.query.answer ? req.query.answer : "" ;

	var UserTable = UserImporter();
	UserTable.select(["*"], {"usruserid" : userid, "usruserpasswordanswer": answer}, function (err, result){
		if(err){
			return next(err);	
		}

		if (result.rowCount == 0){
			return next(new Error("incorrect answer"));
		}

		//usrUserPasswordQuestion
		//usrUserPasswordAnswer	

		res.end("success");
	});
});


//reset a password
router.get("/reset",function (req,res,next){
	if (!req.query.userid){
		return next(new Error("User ID must be provided!"));
	}
	if (!req.query.answer){
		return next(new Error("Answer must be provided!"));
	}
	if (!req.query.password){
		return next(new Error("New password must be provided!"));
	}

	var userid = req.query.userid ? req.query.userid : "" ;
	var answer = req.query.answer ? req.query.answer : "" ;
	var newpw = req.query.password ? req.query.password : "" ;

	var UserTable = UserImporter();
	
	password(newpw).hash(function(err, hashedpw) {
		if(err){
			return next(err);
		}
		var updateDictionary = {"usrUserPassword" : hashedpw};
		var whereDictionary  = {"usruserid" : userid, "usruserpasswordanswer": answer};

		UserTable.update(updateDictionary, whereDictionary, function (err, result){
			if(err){
				return next(err);	
			}
	
			if (result.rowCount == 0){
				return next(new Error("incorrect answer"));
			}
			res.end("success");
		});		
	});		
});

module.exports = router;