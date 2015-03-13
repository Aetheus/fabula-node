var express = require("express");
var router = express.Router();

router.get("/", function (req,res,next){
	res.render("login", { message:"Enter your details to login" });
});

router.post("/", function (req,res,next){
	var sess = req.session;

	if(req.body.username){
		sess.username = req.body.username;
		console.log("User signed in as " + sess.username);

		var returnMsg = "You're already logged in, " + sess.username;
		res.render("login", { message:returnMsg })
	}else{
		res.location("./login");
	}
})

module.exports = router;