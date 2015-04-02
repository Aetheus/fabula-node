

var express = require("express");
var cheerio = require("cheerio");
var request = require("request");

var feedchannel = require("../model/FeedChannel");

var exportObj = {
	testMsg: "Successfully exported scrape.js",

	News: function(title,link,description, image){
		//object constructor
		//to call from within exportObj, just do this.createNews()


		this.title = title;
		this.link = link;
		this.description = description;
		this.image = image;
	},

	scrapeFeedChannel: function (feedchannelArray, callback) {
		//if unable to provide title, link or description, at least pass "null" as params
		//ancestor, title and link are all strings and jQuery selectors 
		
		var newsArrayArray =[];

		console.log("lenght is " + feedchannelArray.length);
		for (var i = 0; i < feedchannelArray.length; i++){
			
			(function (i, feedchannelArray, newsArrayArray, thisObj){	//start closure to create a block scope and freeze the value of "this"
				var feedchannelrow = feedchannelArray[i];
				var siteURL = feedchannelrow.fedfeedchannelurl; 
				var ancestor = feedchannelrow.fedfeedchannelancestorselector;
				var title = feedchannelrow.fedfeedchanneltitleselector;
				var link= feedchannelrow.fedfeedchannellinkselector; 
				var description = feedchannelrow.fedfeedchanneldescriptionselector;
				var image = feedchannelrow.fedfeedchannelimageselector;

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
						var imageEle = (image != null) ? $(this).find(image) : null;

						var newsItem = new thisObj.News(titleEle.text(),linkEle.attr("href"),descriptionEle.text(),imageElelinkEle.attr("src"));
						
						newsArray[newsArray.length] = newsItem;
					});

					//this is the new stuff i added. if somethings up, delte these
					newsArrayArray[newsArrayArray.length] = newsArray;
					if (i == feedchannelArray.length - 1){
						//pass the newArray to callback
						//format: function (err, newsArray){ ... }
						return callback(null, newsArrayArray);
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
