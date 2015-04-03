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
		insert: function (dictionary, callback) {
			boilerplate.insert(this.tablename,dictionary,callback);
		},
	

		insertMulti: function (dictionaryArray, callback){
			pg.connect(config.databaseurl, function (err, client, done){
				var success = 0;
				for (var i =0; i < dictionaryArray.length; i++){
					(function (i){
						var currentItem = dictionaryArray[i];

						client.query("INSERT INTO tblFeedItem (fitfeedchannelid,fitfeeditemtitle,fitfeeditemlink,fitfeeditemdescription,fitfeeditemimagelink,fittimestamp) VALUES ($1,$2,$3,$4,$5,$6)",
							[currentItem.fitfeedchannelid,currentItem.fitfeeditemtitle,currentItem.fitfeeditemlink,currentItem.fitfeeditemdescription,currentItem.fitfeeditemimagelink,currentItem.fittimestamp], 
							function (err,result){
								if (err){
									return callback(err);
								}else{
									success++;
								}

								if (i == dictionarArray-1){ 
									callback(err,result);
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