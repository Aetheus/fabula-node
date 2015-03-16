var express = require("express");
var router = express.Router();
var scrape = require("../utility/scrape")

/*Enable CORS so that plugin can post to this route*/
router.all("/", function (req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

router.get("/", function (req,res,next){
	res.write("hello!");

	var fruits = ["apples", "bananas", "starfruit"];
	res.write(fruits);
	res.end();
});

router.post("/", function (req,res,next){
	var sess = req.session;

	res.write("hello from post!\n");

	var titleSelector = (req.body.title != undefined) ? req.body.title : null;
	var linkSelector = (req.body.link != undefined) ? req.body.link : null;
	var descriptionSelector = (req.body.description != undefined) ? req.body.description : null;
	var ancestorSelector = (req.body.ancestor != undefined) ? req.body.ancestor : null;
	var siteURL = req.body.site;

	//siteURL, ancestor, title, link, description, callback
	scrape.scrapeMessages(siteURL, ancestorSelector,titleSelector,linkSelector,descriptionSelector, function(err, newsArray){
		res.write(newsArray);
		res.end();
	});
});


module.exports = router;