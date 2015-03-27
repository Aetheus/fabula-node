

var express = require("express");
var cheerio = require("cheerio");
var request = require("request");


var exportObj = {
	testMsg: "Successfully exported scrape.js",

	News: function(title,link,description){
		//object constructor
		//to call from within exportObj, just do this.createNews()


		this.title = title;
		this.link = link;
		this.description = description;
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
