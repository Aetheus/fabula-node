var express = require("express");
var router = express.Router();



//html version
router.get("/", function (req,res,next)){
	
}


//JSON version
router.get("/JSON",function (req,res,next){
	res.header("Content-Type", "application/json");




});

function getDatabases(){
	
}


module.exports = router;