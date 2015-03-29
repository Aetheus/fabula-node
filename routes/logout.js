var express = require("express");
var router = express.Router();


router.get("/", function (req,res,next){
	var session = req.session;

	if (session.userid){
		session.userid = null;
	}

	res.redirect("/index");	
});


module.exports = router;