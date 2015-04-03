/*Updater :
	To be used in conjuction with scrape.js and cronjobs.js. 
	For every channel in tblFeedChannel, scrape the news. 
	Then, insert the news into tblFeedItem
*/

var FeedChannel = require("../model/FeedChannel");
var scrape = require("./scrape");

function updateFeeds(){
	tblFeedChannel.select(["*"], null, function (err, result){
		if (err) throw err;


		scrape.scrapeFeedChannel(result.rows, function (err, newsArrayArray) {
			if (err) throw err;

			console.log("" + JSON.stringify(newsArrayArray));
		});


		
	});

}