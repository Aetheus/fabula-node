

var express = require("express");
var cheerio = require("cheerio");
var request = require("request");

var reservedwords = require("../utility/reservedwords");


var exportObj = {
	testMsg: "Successfully exported scrape.js",

	News: function(channelid, title,link,description, image){
		//object constructor
		//to call from within exportObj, just do this.createNews()

		this.fitfeedchannelid 			= channelid;
		this.fitfeeditemtitle 			= title;
		this.fitfeeditemlink  			= link;
		this.fitfeeditemdescription 	= description;
		this.fitfeeditemimagelink 		= image;
	},

	scrapeFeedChannel: function (feedchannelArray, callback) {
		//if unable to provide title, link or description, at least pass "null" as params
		//ancestor, title and link are all strings and jQuery selectors 
		
		var newsArrayArray =[];
		var completed = 0; //use this to keep track of compelted requests so we can exit for loop
		var errorArray =[]; //return this to the caller; if its empty at the end, we set it to null

		console.log("Scraping " + feedchannelArray.length + " sites for new news . . .");
		for (var i = 0; i < feedchannelArray.length; i++){
			
			(function (i, feedchannelArray, newsArrayArray, thisObj){	//start closure to create a block scope and freeze the value of "this"
				var feedchannelrow = feedchannelArray[i];

				var channelID = feedchannelrow.fedfeedchannelid;
				var userID = feedchannelrow.feduserid;
				
				var siteURL = feedchannelrow.fedfeedchannelurl; 
				var ancestor = feedchannelrow.fedfeedchannelancestorselector;
				var title = feedchannelrow.fedfeedchanneltitleselector;
				var link= feedchannelrow.fedfeedchannellinkselector; 
				var description = feedchannelrow.fedfeedchanneldescriptionselector;
				var image = feedchannelrow.fedfeedchannelimagelinkselector;

				//console.log("image for this row is: " + image);

				//console.log("Currently scraping: \n" + JSON.stringify(feedchannelrow) + "\n");
				request(siteURL, function(err,resp,body){
					completed++;	// one request completed; regardless of errorless or not
					
					if (err) { 
						errorArray[errorArray.length] = err; 
					}else{
						$ = cheerio.load(body);
	
						var searchBody = $(body);
						if (ancestor !== null){
							searchBody = $(ancestor);
						}
	
						var newsArray = [];
						
						//define a reverse function - we'll use this to reverse the searchBody so we start from *bottom* results and work our way *up*.
						$.prototype.reverse = [].reverse;
						
						//the each function actually isn't async at all, so this works
						searchBody.reverse().each(function (){
							var titleText 		= (title && title !== reservedwords.dbNULL) 			?  ($(this).find(title).text() 			? $(this).find(title).text()		: reservedwords.dbNULL)	: reservedwords.dbNULL;		
							var linkHref 		= (link && link   !== reservedwords.dbNULL) 			?  ($(this).find(link).attr("href") 	? $(this).find(link).attr("href") 	: reservedwords.dbNULL)	: reservedwords.dbNULL;
							var descriptionText = (description && description !== reservedwords.dbNULL) ?  ($(this).find(description).text() 	? $(this).find(description).text() 	: reservedwords.dbNULL)	: reservedwords.dbNULL;
							var imageSrc 		= (image && image !== reservedwords.dbNULL) 			?  ($(this).find(image).attr("src") 	? $(this).find(image).attr("src") 	: reservedwords.dbNULL)	: reservedwords.dbNULL;
	
							var newsItem = new thisObj.News(channelID, titleText,linkHref,descriptionText,imageSrc);
	
							newsArray[newsArray.length] = newsItem;
						});
	
						newsArrayArray[newsArrayArray.length] = newsArray;
					}

					if (completed == feedchannelArray.length){
						//format: function (errArray, newsArray){ ... }
						//console.log(JSON.stringify(newsArrayArray));

						if (errorArray.length == 0){ errorArray = null; }
						return callback(errorArray, newsArrayArray);
					}				
				});
			})(i, feedchannelArray, newsArrayArray, this);	//end closure
		}

	},

	scrapeMessages: function (siteURL, ancestor, title, link, description, callback){
		//if unable to provide title, link or description, at least pass "null" as params
		//ancestor, title and link are all strings and jQuery selectors 
		
		console.log(title);
		console.log(link);
		console.log(description);
		console.log("[space]");
		
		(function (thisObj){	//start closure to create a block scope and freeze the value of "this"
			request(siteURL, function(err,resp,body){
				if (err) return callback(err);
	
				$ = cheerio.load(body);

				var searchBody = $(body);
				if (ancestor !== null){
					searchBody = $(ancestor);
				}

				var newsArray = [];


				//the each function actually isn't async at all, so this works
				searchBody.each(function (){
					var titleEle = (title != null) ? $(this).find(title) : null;
					var linkEle = (link != null) ? $(this).find(link) : null;
					var descriptionEle = (description != null) ? $(this).find(description) : null;


					var newsItem = new thisObj.News(titleEle.text(),linkEle.attr("href"),descriptionEle.text());
					
					newsArray[newsArray.length] = newsItem;
				});

				//pass the newArray to callback
				//format: function (err, newsArray){ ... }
				callback(null, newsArray);
			});
		})(this);	//end closure
	},


}

module.exports = exportObj;
