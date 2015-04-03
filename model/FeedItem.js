var boilerplate = (require("./boilerplate.js"))();
var pg = require("pg");
var config = require("../utility/config");

function returnFeedItem() {
	var FeedItem = {
		tablename: "tblFeedItem",
	
		select: function (columns,whereDictionary,callback) {
			boilerplate.select(columns,this.tablename,whereDictionary,callback);
		},
	
		/*remember, err.code == 23505 is the code for duplicate keys!*/
		/* ONLY ONLY ONLY USE THIS IF INSERTING ---ONE--- ROW AT A TIME!*/
		insert: function (dictionary, callback) {
			boilerplate.insert(this.tablename,dictionary,callback);
		},
	
		/*remember, err.code == 23505 is the code for duplicate keys!*/
		//callback: function (err, numSuccessfulInserts) << note: number of succesful inserts currently does not work as intended
		insertMulti: function (dictionaryArray, callback){
			pg.connect(config.databaseurl, function (err, client, done){
				var success = 0;
				for (var i =0; i < dictionaryArray.length; i++){
					(function (i){
						var currentItem = dictionaryArray[i];

						console.log("Attempting to insert new feed item for channel of ID: " + currentItem.fitfeedchannelid);
						client.query("INSERT INTO tblFeedItem (fitfeedchannelid,fitfeeditemtitle,fitfeeditemlink,fitfeeditemdescription,fitfeeditemimagelink,fittimestamp) VALUES ($1,$2,$3,$4,$5,$6)",
							[currentItem.fitfeedchannelid,currentItem.fitfeeditemtitle,currentItem.fitfeeditemlink,currentItem.fitfeeditemdescription,currentItem.fitfeeditemimagelink,"now()"], 
							function (err,result){
								done();
								if (err){
									if (err.code == 23505){
										console.log("Attempting to insert duplicate of existing news item; Safely ignoring.");
									}else { 
										return callback(err); 
									}
								}else{
									success++;
								}

								if (i == dictionaryArray.length -1){ 
									callback(null,success);
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