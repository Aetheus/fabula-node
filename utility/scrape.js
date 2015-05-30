// import our required modules
// cheerio is crucial to this script. It allows us to use jQuery on our server-side to process web pages.
var express = require("express");
var cheerio = require("cheerio");
var request = require("request");

var reservedwords = require("../utility/reservedwords");
var hrefQualifier = require("../utility/hrefqualifier");


var exportObj = {
	testMsg: "Successfully exported scrape.js",

	//simple "constructor" function to create an object with member variables of channelid, title, link, description, image
	News: function(channelid, title,link,description, image){
		//object constructor
		//to call from within exportObj, just do this.createNews()

		this.fitfeedchannelid 			= channelid;
		this.fitfeeditemtitle 			= title;
		this.fitfeeditemlink  			= link;
		this.fitfeeditemdescription 	= description;
		this.fitfeeditemimagelink 		= image;
	},

	//function that scrapes all existing news channels in the database for news items, and inserts those news items back into the DB
	scrapeFeedChannel: function (feedchannelArray, callback) {

		var newsArrayArray = [];	//an array that stores arrays of news items collected by separate feed channels
		var completed = 0; 			//use this to keep track of compelted requests so we can exit for loop
		var errorArray =[]; 		//return this to the caller; it's an array of errors that have occured. if its empty at the end, we set it to null

		console.log("Scraping " + feedchannelArray.length + " sites for new news . . .");
		for (var i = 0; i < feedchannelArray.length; i++){
			
			(function (i, feedchannelArray, newsArrayArray, thisObj){	//start closure to create a block scope and freeze the value of "this"
				
				//retrieve data from the columns of a row in tblFeedChannels and set them to variables.
				//these columns contain relevant data such as the address of the website and the news format
				//"title", "link", "description", "image" and "ancestor" are all just jQuery selector strings. E.g: title might be "DIV.headlineClass"				
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

				//make a request to the siteURL of the feed channel. upon request completion, process the results using the below callback function
				request(siteURL, function(err,resp,body){	// << callback function
					completed++;	// one request completed; regardless of errorless or not, keep track of it
					
					//if there's an error, add it to our errorArray. Else, continue.
					if (err) { 
						errorArray[errorArray.length] = err; 
					}else{
						//load the html for cheerio/jQuery
						$ = cheerio.load(body);
						var searchBody = $(body);
						if (ancestor !== null){
							searchBody = $(ancestor);
						}


						//create an array that will store all our news items
						var newsArray = [];
						
						//define a reverse function - we'll use this to reverse the searchBody so we start from *bottom* results and work our way *up*.
						$.prototype.reverse = [].reverse;
						
						
						//the each function actually isn't async, so this works as-is
						//for each occurence of a container that matches our FeedChannel's news item format, perform the below callback function
						searchBody.reverse().each(function (){
							//extract the title, link, description and image link. if any of these don't exist, replace them with a dummy null string
							var titleText 		= (title && title !== reservedwords.dbNULL) 			?  ($(this).find(title).text() 			? $(this).find(title).text()		: reservedwords.dbNULL)	: reservedwords.dbNULL;		
							var linkHref 		= (link && link   !== reservedwords.dbNULL) 			?  ($(this).find(link).attr("href") 	? $(this).find(link).attr("href") 	: reservedwords.dbNULL)	: reservedwords.dbNULL;
							var descriptionText = (description && description !== reservedwords.dbNULL) ?  ($(this).find(description).text() 	? $(this).find(description).text() 	: reservedwords.dbNULL)	: reservedwords.dbNULL;
							var imageSrc 		= (image && image !== reservedwords.dbNULL) 			?  ($(this).find(image).attr("src") 	? $(this).find(image).attr("src") 	: reservedwords.dbNULL)	: reservedwords.dbNULL;
	
							if(linkHref != reservedwords.dbNULL){
								 linkHref = hrefQualifier(linkHref, siteURL);
							}

							//trim the description and title
							titleText 		= (titleText 		&& titleText 		!== reservedwords.dbNULL) ? titleText.trim() 		: reservedwords.dbNULL;
							descriptionText = (descriptionText 	&& descriptionText 	!== reservedwords.dbNULL) ? descriptionText.trim() 	: reservedwords.dbNULL;

							//create a news item using our previously defined "constructor" function
							var newsItem = new thisObj.News(channelID, titleText,linkHref,descriptionText,imageSrc);
							
							//add that news item to the newsArray
							newsArray[newsArray.length] = newsItem;
						});

						//add that news array into the newsArrayArray
						newsArrayArray[newsArrayArray.length] = newsArray;
					}

					//if the number of "completed" requests equals to the number of feedchannels in the database, return the results
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
