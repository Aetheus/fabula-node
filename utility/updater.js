/*Updater :
	To be used in conjuction with scrape.js and cronjobs.js. 
	For every channel in tblFeedChannel, scrape the news. 
	Then, insert the news into tblFeedItem
*/

var FeedChannel = require(("../model/FeedChannel"))();
var FeedItemImporter = require("../model/FeedItem");
var scrape = require("./scrape");

var reservedwords = require("../utility/reservedwords");

/*remember, err.code == 23505 is the code for duplicate keys!*/

var exportVar = {
	updateAllFeeds: function (callback){
		FeedChannel.select(["*"], null, function (err, result){
			if (err)  console.error(err);

			scrape.scrapeFeedChannel(result.rows, function (err, newsArrayArray) {
				if (err) throw err;

				//the array returned by scrape has nested arrays arranged by feedchannelid; we need to flatten this table befoer passing it to our MultiInsert
				var flattenedNewsArray = [].concat.apply([],newsArrayArray);

				var FeedItem = FeedItemImporter();

				FeedItem.insertMulti(flattenedNewsArray, function (err, numInsertedRows){
					if (err) return callback(err);

					return callback(null,numInsertedRows);
				});				

				/*
				for (var i = 0; i < newsArrayArray.length; i++){
					(function (i,thisObj){ 	//closure to freeze the value of i (i.e: create a "block scope")
						var channelNews = newsArrayArray[i]; //array of news items - see scrape.js for definition.

						var FeedItem = FeedItemImporter();
						
						FeedItem.insertMulti(channelNews, function (err, numInsertedRows){
							if (err) return callback(err);

							return callback(null,numInsertedRows);
						});

						

					})(i,this); // end closure
				}*/
			});	
		});
	}	

}



module.exports = exportVar;