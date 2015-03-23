var express = require("express");
var router = express.Router();
var verifylogin = require("../utility/verifylogin");


router.get("/", function (req,res,next){
	var returnMsg = "Enter your details to login";
	var sess = req.session;

	if(sess.username){
		returnMsg = "You're already logged in, " + sess.username;
	}else{
		returnMsg = "Enter your details to login";
	}

	res.render("login", { message:returnMsg });
});

/*router.get("/makeerr", function (req,res,next){
	next(new Error("test for error handler. if you're seeing this, the error handler worked"));
});*/

router.post("/", function (req,res,next){
	console.log("made it to post");
	var sess = req.session;
	var returnMsg = "Default return message";

	if(req.body.username && req.body.password){
		verifylogin(req.body.username, req.body.password, function (err, isVerified, user){
			if (err){
				//this calls our error handler
				next(err);	
			} 

			
			if (isVerified){
				sess.username = req.body.username;
				returnMsg = "You're already logged in, " + sess.username;
				console.log("User signed in as " + sess.username);
			}else{
				returnMsg = "Incorrect username or password";
			}

			res.render("login", {message:returnMsg});
		});

	}else{
		returnMsg="Enter username and password to proceed";
		res.render("login", { message:returnMsg });
	}

})

module.exports = router;