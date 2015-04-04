var boilerplate = (require("./boilerplate.js"))();
var pg = require("pg");
var config = require("../utility/config");

function returnFeedItem() {
	var FeedItem = {
		tablename: "tblFeedItem",
		
		// simple select
		select: function (columns,whereDictionary,callback) {
			boilerplate.select(columns,this.tablename,whereDictionary,callback);
		},
	
		/*remember, err.code == 23505 is the code for duplicate keys!*/
		/* simple insert: ONLY ONLY ONLY USE THIS IF INSERTING ---ONE--- ROW AT A TIME!*/
		insert: function (dictionary, callback) {
			boilerplate.insert(this.tablename,dictionary,callback);
		},

		// select by userID
		//callback format: function (err, result)
		selectWhereUserID: function (userid, callback){
			pg.connect(config.databaseurl, function (err, client, done){
				client.query("SELECT tblfeeditem.* FROM tblfeedchannel, tblfeeditem WHERE tblfeedchannel.fedfeedchannelid = tblfeeditem.fitfeedchannelid AND tblfeedchannel.feduserid = $1",
				 	[userid], 
				 	function (err, result){
				 		done();
						if (err) return callback(err);
						

						callback(null, result);
						client.end();
				 	}
				);

			});
			//select tblfeeditem.*, tblfeedchannel.feduserid from tblfeedchannel, tblfeeditem where tblfeedchannel.fedfeedchannelid = tblfeeditem.fitfeedchannelid AND tblfeedchannel.feduserid = 'superuser';
		},
	
		/*remember, err.code == 23505 is the code for duplicate keys!*/
		//callback: function (err, numSuccessfulInserts) << note: number of succesful inserts currently does not work as intended
		insertMulti: function (dictionaryArray, callback){
			pg.connect(config.databaseurl, function (err, client, done){
				var success = 0;
				var completed = 0;
				for (var i =0; i < dictionaryArray.length; i++){
					(function (i){
						var currentItem = dictionaryArray[i];

						console.log("Attempting to insert new feed item for channel of ID: " + currentItem.fitfeedchannelid);
						client.query("INSERT INTO tblFeedItem (fitfeedchannelid,fitfeeditemtitle,fitfeeditemlink,fitfeeditemdescription,fitfeeditemimagelink,fittimestamp,fitisread) VALUES ($1,$2,$3,$4,$5,$6,$7)",
							[currentItem.fitfeedchannelid,currentItem.fitfeeditemtitle,currentItem.fitfeeditemlink,currentItem.fitfeeditemdescription,currentItem.fitfeeditemimagelink,"now()",false], 
							function (err,result){
								done();
								completed++;
								if (err){
									if (err.code == 23505){
										console.log("Attempting to insert duplicate of existing news item; Safely ignoring.");
									}else { 
										return callback(err); 
									}
								}else{
									success++;
								}

								if (completed == dictionaryArray.length){ 
									return callback(null,success);
									client.end(); 
								}
							}
						);						
					})(i);
				}
			});
		}
	};
	
	return FeedItem;
}


module.exports = returnFeedItem;