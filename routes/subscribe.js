var express = require("express");
var router = express.Router();


router.post("/", function (req,res, next){

	var channelname = (req.body.name != undefined) ? req.body.name : null;
	var imageLinkSelector = (req.body.imageLink != undefined) ? req.body.imageLink : null;
	var channelIsCustom = (req.body.iscustom != undefined) ? req.body.iscustom : null;


	var titleSelector = (req.body.title != undefined) ? req.body.title : null;
	var linkSelector = (req.body.link != undefined) ? req.body.link : null;
	var descriptionSelector = (req.body.description != undefined) ? req.body.description : null;
	var ancestorSelector = (req.body.ancestor != undefined) ? req.body.ancestor : null;
	var siteURL = (req.body.site != undefined) ? req.body.site : null;


	var isValid = true;
	if (!siteURL || !(titleSelector || linkSelector || descriptionSelector || ancestorSelector) ){
		isValid= false;
	}

	/*if not valid, pass to error handler.*/
	if (!isValid){
		return next(new Error("Site URL and either Title,Link or Description must be provided to subscribe to a site!"));
	}
  		

  	pg.connect(config.databaseurl, function(err, client, done) {
  		if (err) return next(err);
  		

  		//notice that client.query's callback has a param for RESULT. Don't confuse it with router.get's callback param, RES(PONSE)
		client.query(
			"INSERT INTO tblFeedChannel (fedFeedChannelName,fedFeedChannelDesc,fedFeedChannelURL,fedFeedChannelTitleSelector,fedFeedChannelLinkSelector,fedFeedChannelDescriptionSelector, fedFeedChannelImageLinkSelector, fedFeedChannelAncestorSelector,fedFeedChannelIsActive,fedFeedChannelIsCustom) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
			, [channelname,descriptionSelector,siteURL,titleSelector,linkSelector,descriptionSelector,imageLinkSelector,ancestorSelector,true,channelIsCustom],		 
			function (err, result){
				done();
				if (err) return next(err);
	
			
				
	
	
	
	
				client.end();
			}
		);
	
	});	
});