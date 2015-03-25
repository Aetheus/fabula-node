var express = require("express");
var router = express.Router();
var scrape = require("../utility/scrape");
var config = require("../utility/config");

/*Enable CORS so that plugin can post to this route*/
router.all("/", function (req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

router.get("/", function (req,res,next){
	var sess = req.session;

	if (config.hasOwnProperty("newsArray")){
		res.render("supervisordemo", { newsArray:config.newsArray });
	}

	//localhost:3000/supervisordemo?title=DIV.subject&link=IMG&description=DIV.author&ancestor=DIV.topic.firstpost.starter&site=http%3A%2F%2Fwebspace.apiit.edu.my%2F
	var titleSelector = (req.query.title != undefined) ? req.query.title : null;
	var linkSelector = (req.query.link != undefined) ? req.query.link : null;
	var descriptionSelector = (req.query.description != undefined) ? req.query.description : null;
	var ancestorSelector = (req.query.ancestor != undefined) ? req.query.ancestor : null;
	var siteURL = req.query.site;

	//siteURL, ancestor, title, link, description, callback
	scrape.scrapeMessages(siteURL, ancestorSelector,titleSelector,linkSelector,descriptionSelector, function(err, newsArray){
		//like everything else in this demo, storing to global is TEMPORARY. in the real system, will read/write from/to postgresql
		config.newsArray = newsArray;
		res.render("supervisordemo", { newsArray:newsArray });
	});
	
});

router.post("/", function (req,res,next){
	var sess = req.session;

	//localhost:3000/supervisordemo?title=DIV.subject&link=IMG&description=DIV.author&ancestor=DIV.topic.firstpost.starter&site=http%3A%2F%2Fwebspace.apiit.edu.my%2F
	var titleSelector = (req.query.title != undefined) ? req.query.title : null;
	var linkSelector = (req.query.link != undefined) ? req.query.link : null;
	var descriptionSelector = (req.query.description != undefined) ? req.query.description : null;
	var ancestorSelector = (req.query.ancestor != undefined) ? req.query.ancestor : null;
	var siteURL = req.query.site;

	//siteURL, ancestor, title, link, description, callback
	scrape.scrapeMessages(siteURL, ancestorSelector,titleSelector,linkSelector,descriptionSelector, function(err, newsArray){
		//like everything else in this demo, storing to global is TEMPORARY. in the real system, will read/write from/to postgresql
		config.newsArray = newsArray;
		res.render("supervisordemo", { newsArray:newsArray });
	});
});


module.exports = router;