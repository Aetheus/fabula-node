var express = require("express");
var router = express.Router();
var pg = require("pg");
var config = require("../utility/config");
var verifylogin = require("../utility/verifylogin");
var reservedwords = require("../utility/reservedwords");

var feedchannel = (require("../model/FeedChannel"))();


//https://fabula-node.herokuapp.com/supervisordemo?title=DIV.subject&link=A&description=DIV.author&ancestor=DIV.topic.firstpost.starter&channelname=Webspace&imagelink=IMG&iscustom=true&site=http%3A%2F%2Fwebspace.apiit.edu.my%2F
//remove this route eventually. its no longer necessary for us.

router.post("/", function (req, res, next){
	var channelname = (req.body.channelname != undefined) 		? req.body.channelname : null;
	var channelIsCustom = (req.body.iscustom != undefined) 		? req.body.iscustom : true;

	var titleSelector = (req.body.title != undefined) 			? req.body.title : reservedwords.dbNULL;
	var linkSelector = (req.body.link != undefined) 			? req.body.link : reservedwords.dbNULL;
	var descriptionSelector = (req.body.description != undefined) ? req.body.description : reservedwords.dbNULL;
	var imageLinkSelector = (req.body.imagelink != undefined) 	? req.body.imagelink : reservedwords.dbNULL;
	

	var tags = (req.body.tags != undefined) 	? req.body.tags : reservedwords.dbNULL;

	var ancestorSelector = (req.body.ancestor != undefined) 	? req.body.ancestor : null;
	var siteURL = (req.body.site != undefined) 					? req.body.site : null;
	

	var session = req.session;
	var userid = (req.body.username != undefined) ? req.body.username : null;
	var password= (req.body.password != undefined) ? req.body.password : null;


	if (!userid){
		return next(new Error("You must be signed in to subscribe to a feed!"));
	}
	if (!siteURL || !(titleSelector || linkSelector || descriptionSelector || ancestorSelector) ){
		return next(new Error("Site URL and either Title,Link or Description must be provided to subscribe to a site!"));
	}


	verifylogin(userid,password, function (err, isVerified, user){
		if (err) return next(err);

		if (!isVerified) return next(new Error("Invalid login details provided!"));
	
		var insertDictionary = {
			"fedUserID":userid,
			"fedFeedChannelName":channelname,
			"fedFeedChannelDesc":descriptionSelector,
			"fedFeedChannelURL":siteURL,
			"fedFeedChannelTitleSelector":titleSelector,
			"fedFeedChannelLinkSelector":linkSelector,
			"fedFeedChannelDescriptionSelector":descriptionSelector,
			"fedFeedChannelImageLinkSelector" : imageLinkSelector,
			"fedFeedChannelAncestorSelector" : ancestorSelector,
			"fedFeedChannelIsActive" : true,
			"fedFeedChannelIsCustom" : channelIsCustom,
			"fedFeedChannelTags"	 : tags
		}

		/*var whereDictionary = {
			"fedUserID":userid,
			"fedFeedChannelURL":siteURL
		}*/
		
		feedchannel.insert(insertDictionary, function (err, result){
			if (err){
				if (err.code == 23505){
					return next(new Error("Duplicate key error!"));		
				}else{
					return next(err);		
				}
			} 
	
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result));
		})

	})

  	
});


router.get("/hidden", function (req,res, next){
	var channelname = (req.query.channelname != undefined) ? req.query.channelname : null;
	var imageLinkSelector = (req.query.imagelink != undefined) ? req.query.imagelink : null;
	var channelIsCustom = (req.query.iscustom != undefined) ? req.query.iscustom : null;


	var titleSelector = (req.query.title != undefined) ? req.query.title : null;
	var linkSelector = (req.query.link != undefined) ? req.query.link : null;
	var descriptionSelector = (req.query.description != undefined) ? req.query.description : null;
	var ancestorSelector = (req.query.ancestor != undefined) ? req.query.ancestor : null;
	var siteURL = (req.query.site != undefined) ? req.query.site : null;

	var session = req.session;
	var userid = (session.userid != undefined) ? session.userid : null;

	var isValid = true;
	if (!userid){
		return next(new Error("You must be signed in to subscribe to a feed!"));
	}
	if (!siteURL || !(titleSelector || linkSelector || descriptionSelector || ancestorSelector) ){
		return next(new Error("Site URL and either Title,Link or Description must be provided to subscribe to a site!"));
	}

	
  		

  	pg.connect(config.databaseurl, function(err, client, done) {
  		if (err) return next(err);
  		

  		//notice that client.query's callback has a param for RESULT. Don't confuse it with router.get's callback param, RES(PONSE)
		client.query(
			"INSERT INTO tblFeedChannel (fedUserID,fedFeedChannelName,fedFeedChannelDesc,fedFeedChannelURL,fedFeedChannelTitleSelector,fedFeedChannelLinkSelector,fedFeedChannelDescriptionSelector, fedFeedChannelImageLinkSelector, fedFeedChannelAncestorSelector,fedFeedChannelIsActive,fedFeedChannelIsCustom) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)"
			, [userid,channelname,descriptionSelector,siteURL,titleSelector,linkSelector,descriptionSelector,imageLinkSelector,ancestorSelector,true,channelIsCustom],		 
			function (err, result){
				done();
				if (err) return next(err);
	
				console.log("Succesfully inserted: " + result);

				client.end();
				res.redirect("/index");
			}
		);
	
	});	
});


module.exports = router;