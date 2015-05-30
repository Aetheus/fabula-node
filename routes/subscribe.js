//var express = require("express") tells our program to include the express module into this script.
//likewise, require("../utility/config") tells our program to include the config.js file into this script
//similar in concept to the "import" keyword in Java and the "include" keyword in C++
var express = require("express");
var router = express.Router();
var pg = require("pg");
var config = require("../utility/config");
var verifylogin = require("../utility/verifylogin");
var reservedwords = require("../utility/reservedwords");
var feedchannel = (require("../model/FeedChannel"))();


//this creates a "route". When a POST request is sent to "https://fabula-node.herokuapp.com/subscribe.js", 
//it will be bound to this route and execute the callback function shown below.
router.post("/", function (req, res, next){	// << this is the callback function 

	//req.body is an object that holds the value of parameters that were sent with the POST request
	//therefore, the variables below this are being assigned the value of  parameters sent with the POST request
	//for instance, req.body.channelname is retrieving the "channelname" parameter from the post request	
	var channelname = (req.body.channelname != undefined) 		? req.body.channelname : null;
	var channelIsCustom = (req.body.iscustom != undefined) 		? req.body.iscustom : true;

	var titleSelector = (req.body.title != undefined) 			? req.body.title : reservedwords.dbNULL;
	var linkSelector = (req.body.link != undefined) 			? req.body.link : reservedwords.dbNULL;
	var descriptionSelector = (req.body.description != undefined) ? req.body.description : reservedwords.dbNULL;
	var imageLinkSelector = (req.body.imagelink != undefined) 	? req.body.imagelink : reservedwords.dbNULL;	
	var tags = (req.body.tags != undefined) 	? req.body.tags : reservedwords.dbNULL;

	var ancestorSelector = (req.body.ancestor != undefined) 	? req.body.ancestor : null;
	var siteURL = (req.body.site != undefined) 					? req.body.site : null;
	
	var userid = (req.body.username != undefined) ? req.body.username : null;
	var password= (req.body.password != undefined) ? req.body.password : null;


	//if the user ID was NOT sent with the POST request, return an error.
	if (!userid){
		return next(new Error("You must be signed in to subscribe to a feed!"));
	}
	if (!siteURL || !(titleSelector || linkSelector || descriptionSelector || ancestorSelector) ){
		return next(new Error("Site URL and either Title,Link or Description must be provided to subscribe to a site!"));
	}


	//verify the user's login, and then execute the callback function below
	verifylogin(userid,password, function (err, isVerified, user){	//<< callback function, to be executed only after verification
		//if an error occured, return the error
		if (err) return next(err);	

		//if the user could not be verified, return a custom error informing them that they entered invalid details
		if (!isVerified) return next(new Error("Invalid login details provided!"));
	
		//create a key-value pair object that holds values to be inserted into the tblFeedChannel table in our database
		//this key-value pair object holds the values of the parameters we extracted from the POST request.
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

		//this is for our upsert function - if there already exists a feed channel for this specific user and URL,
		//we will UPDATE that feed channel. Otherwise, we will INSERT a new one.
		var whereDictionary = {
			"fedUserID":userid,
			"fedFeedChannelURL":siteURL,
		}


		//we've written a handy "upsert" function for our tables. This allows us to INSERT a row ONLY IF a row matching the columns
		//of our whereDictionary object doesn't exist in our database. If such a row exists, this function performs an UPDATE instead.
		feedchannel.upsert(insertDictionary, whereDictionary, function (err, result){
			if (err){
				return next(err);		
				/*if (err.code == 23505){return next(new Error("Duplicate key error!"));}else{}*/
			} 
		
			//set the response header to JSON and return the results of this subscription back to the requester
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result));
		})

	})
	
});

/*
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
*/

//make the export target the router object. 
//Now, whenever another script has the statement "var susbcribe = request('/routes/subscribe.js')" in it, 
//our route will be assigned as the value of "var subscribe", essentially "Exporting" our route object out.
module.exports = router;