var express = require("express");
var router = express.Router();

/*Enable CORS so that plugin can post to this route*/
router.all("/", function (req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

router.get("/", function (req,res,next){
	res.write("hello!");
	res.end();
});


module.exports = router;