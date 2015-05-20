var password = require("password-hash-and-salt");
var pg = require("pg");
var config = require("../utility/config");
var UserImporter = require("../model/User");

var register = function (userid, userpw, pwquestion, pwanswer, next){
	if (typeof userid === undefined || userid === null || userid === ""){
		return next(new Error("Username not provided"));
	}
	if (typeof userpw === undefined || userpw === null || userpw === ""){
		return next(new Error("Password not provided"));
	}
	if (typeof pwquestion === undefined || pwquestion === null || pwquestion === ""){
		return next(new Error("Password question not provided"));
	}
	if (typeof pwanswer === undefined || pwanswer === null || pwanswer === ""){
		return next(new Error("Password answer not provided"));
	}


	var userTable = UserImporter();

	userTable.select(["*"], {"usrUserID" : userid}, function (err,results){
		if(err){
			return next(err);
		}
		if(results.rowCount > 0){
			return next(new Error("username is already in use"));
		}

		password(userpw).hash(function(err, hashedpw) {
			if(err){
				return next(err);
			}
	
			var insertDictionary = {
			"usrUserID" 				:userid,				
			"usrUserPassword"			:hashedpw,
			"usrUserPasswordQuestion"	:pwquestion,
			"usrUserPasswordAnswer"		:pwanswer,
			"usrUserIsActive"			:true
			};
	
			userTable.insert(insertDictionary, function (err, results){
				if(err){
					return next(err);
				}			
	
				return next(null,results);	
			});
		});			
	});



}

module.exports = register;