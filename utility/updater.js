/*Updater :
	To be used in conjuction with scrape.js and cronjobs.js. 
	For every channel in tblFeedChannel, scrape the news. 
	Then, insert the news into tblFeedItem
*/

var FeedChannel = require("../model/FeedChannel");
var FeedItem = require("../model/FeedItem");
var scrape = require("./scrape");

/*remember, err.code == 23505 is the code for duplicate keys!*/

var exportVar = {
	updateAllFeeds: function (){
		tblFeedChannel.select(["*"], null, function (err, result){
			if (err)  console.error(err);

			scrape.scrapeFeedChannel(result.rows, function (err, newsArrayArray) {
				if (err) throw err;

				for (var i = 0; i < newsArrayArray.length; i++){
					(function (i,thisObj){ 	/*closure to freeze the value of i (i.e: create a "block scope")*/
						var channelNews = newsArrayArray[i]; //array of news items - see scrape.js for definition.

						for (var j = 0; j < newsArrayArray.length; j++){
							(function (){	/*another enclosure to freeze each news item in a newsChannel*/
								var newsItem = channelNews[j];

								var insertDictionary = {
									fitfeedchannelid 		: newsItem.channelid,
									fitfeeditemtitle 		: newsItem.title,
									fitfeeditemlink  		: newsItem.link, 
									fitfeeditemdescription 	: newsItem.description,
									fitfeeditemimagelink 	: newsItem.image,
									fittimestamp 			: "now()"
								};

								FeedItem.insert(insertDictionary, function (err, result){
									/*remember, err.code == 23505 is the code for duplicate keys!*/
									if (err){
										if (err == 23505){ 
											var returnErr = new Error("Duplicate insert for tblFeedItem! Probably safely ignorable");
											console.error(returnErr); return returnErr;
										} else { console.error(err); return err; }

										console.log("Succesfully inserted an entry into channel " + newsItem.channelid);
									}
								})

							})();
						}

					})(i,this); // end closure
				}
			});


			
		});
	}	

}



module.exports 