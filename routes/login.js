var express = require("express");
var router = express.Router();

router.get("/", function (req,res,next){
	res.render("login", { items:"goHere" });
});

module.exports = router;