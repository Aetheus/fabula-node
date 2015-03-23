var express = require("express");
var router = express.Router();


router.get("/", function (req,res,next){
	var sess = req.session;

	if (sess.username){
		sess.username = null;
	}

	res.redirect("/index");	
});


module.exports = router;