
//THIS SHOULD NOT BE A ROUTE. IT SHOULD BE A UTILITY FUNCTION. REDO THIS AFTER SUPERVISOR MEETING,.

var express = require("express");
var cheerio = require("cheerio");
var request = require("request");


var exportObj = {
	testMsg: "Succesfully exported scrape.js",

	createNews: function(title,link,description){
		//object constructor
		//to call from within exportObj, just do this.createNews()
		this.title = title;
		this.link = link;
		this.description = description;
	},

	scrapeMessages: function (siteURL, ancestor, title, link, description, callback){
		//if unable to provide title, link or description, at least pass "null" as params
		//ancestor, title and link are all strings and jQuery selectors 
		request(siteURL, function(err,resp,body){
			if (err) return err;

			$ = cheerio.load(body);

			var searchBody = $(body);
			if (ancestor !== null){
				searchBody = $(ancestor);
			}

			var newsArray = [];

			//the each function actually isn't async at all, so this works
			searchBody.each(function (){
				var title = (title != null) ? $(this).find(title) : null;
				var link = (link != null) ? $(this).find(link) : null;
				var description = (description != null) ? $(this).find(description) : null;

				var newsItem = this.createNews(title,link,description);

				newsArray[newsArray.length] = newsItem;
			});

			//pass the newArray to callback
			//format: function (err, newsArray){ ... }
			callback(null, newsArray);
		});

	},


}

module.exports = exportObj;
