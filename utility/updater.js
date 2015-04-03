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
	updateAllFeeds: function (){

		FeedChannel.select(["*"], null, function (err, result){
			if (err)  console.error(err);

			scrape.scrapeFeedChannel(result.rows, function (err, newsArrayArray) {
				if (err) throw err;

				for (var i = 0; i < newsArrayArray.length; i++){
					(function (i,thisObj){ 	/*closure to freeze the value of i (i.e: create a "block scope")*/
						var channelNews = newsArrayArray[i]; //array of news items - see scrape.js for definition.

						for (var j = 0; j < channelNews.length; j++){
							(function (j){	/*another enclosure to freeze each news item in a newsChannel*/
								var newsItem = channelNews[j]; //news item - see scrape.js for definition.

								var insertDictionary = {
									fitfeedchannelid 		: newsItem.fitfeedchannelid,
									fitfeeditemtitle 		: (newsItem.fitfeeditemtitle && newsItem.fitfeeditemtitle != reservedwords.dbNULL) 				? newsItem.fitfeeditemtitle		: reservedwords.dbNULL,
									fitfeeditemlink  		: (newsItem.fitfeeditemlink && newsItem.fitfeeditemlink != reservedwords.dbNULL) 				? newsItem.fitfeeditemlink		: reservedwords.dbNULL, 
									fitfeeditemdescription 	: (newsItem.fitfeeditemdescription && newsItem.fitfeeditemdescription != reservedwords.dbNULL) 	? newsItem.fitfeeditemdescription: reservedwords.dbNULL,
									fitfeeditemimagelink 	: (newsItem.fitfeeditemimagelink && newsItem.fitfeeditemimagelink != reservedwords.dbNULL) 		? newsItem.fitfeeditemimagelink	: reservedwords.dbNULL,
									fittimestamp 			: "now()"
								};

								var FeedItem = FeedItemImporter();
								FeedItem.insert(insertDictionary, function (err, result){
									/*remember, err.code == 23505 is the code for duplicate keys!*/
									if (err){

										if (err == 23505){ 
											var returnErr = new Error("Duplicate insert for tblFeedItem! Probably safely ignorable");
											console.error(returnErr); return returnErr;
										} else { 
											console.error(err); return err; 
										}



										console.log("Succesfully inserted an entry into channel " + newsItem.channelid);
									}
								})

							})(j);
						}

					})(i,this); // end closure
				}
			});


			
		});
	}	

}



module.exports = exportVar;