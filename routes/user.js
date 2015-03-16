var express = require("express");
var router = express.Router();

var cheerio = require("cheerio");


router.get("/:username", function (req,res,next){
	var username = req.params.username;

	res.write("Hello, " + username);
	res.end();

});

module.exports=router;