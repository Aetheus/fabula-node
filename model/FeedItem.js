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

		/* simple update*/
		update: function (updateDictionary, whereDictionary, callback){
			boilerplate.update(this.tablename, updateDictionary, whereDictionary, callback);
		},

		/* simple delete */
		del: function (whereDictionary, callback){
			boilerplate.delete(this.tablename, whereDictionary, callback);
		},

		// select by userID
		//e.g: optionaTimeRange = {start:"2015-04-16", end:"NOW()"}
		//e.g: optionalOrderBy  = {column:tblfeeditem.fittimestamp, order:ASC }	//order by fittimestamp in descending order
		//e.g: optionalRowLimit = {offset:5, limit:10} 				//return 10 rows starting from row 5
		//callback format: function (err, result)
		selectWhereUserID: function (userid, callback, optionalTimeRange, optionalOrderBy, optionalRowLimit, optionalTags,optionalSearch){
			pg.connect(config.databaseurl, function (err, client, done){
				var queryString = "SELECT tblfeeditem.*, tblfeedchannel.fedfeedchannelurl,tblfeedchannel.fedfeedchannelcolour FROM tblfeedchannel, tblfeeditem WHERE tblfeedchannel.fedfeedchannelid = tblfeeditem.fitfeedchannelid AND tblfeedchannel.feduserid = $1";
				var parameters = [userid];
				var numSqlParams = 1;	//used to track SQL params. there's always at least one SQL param (userid)


				if(optionalTags){
					numSqlParams += 1;
					queryString += " AND LOWER(tblfeedchannel.fedfeedchanneltags) LIKE $" + numSqlParams + "";
					parameters[parameters.length] = "%"+optionalTags.toLowerCase()+"%";
					isTagsUsed = true;
				}

				if(optionalTimeRange && optionalTimeRange.start && optionalTimeRange.end){
					queryString += " AND tblfeeditem.fittimestamp BETWEEN $" + (numSqlParams+1) + "AND $" + (numSqlParams+2);
					numSqlParams += 2;

					parameters[parameters.length] = optionalTimeRange.start;
					parameters[parameters.length] = optionalTimeRange.end;
				}

				if(optionalSearch){
					queryString += " AND (LOWER(fitfeeditemdescription) LIKE $" + (numSqlParams+1) + " OR LOWER(fitfeeditemtitle) LIKE $" + (numSqlParams+1) + ")";					
					numSqlParams += 1;
					parameters[parameters.length] = "%"+optionalSearch.toLowerCase()+"%";
				}



				if(optionalOrderBy && optionalOrderBy.column && optionalOrderBy.order){
					queryString += " ORDER BY " + optionalOrderBy.column + " " + optionalOrderBy.order;

					if(optionalRowLimit && optionalRowLimit.limit){
						queryString += " LIMIT " + optionalRowLimit.limit;
						if(optionalRowLimit.offset){
							queryString += " OFFSET " + optionalRowLimit.offset;
						}
					}
				}


				console.log("attempting to execute SQL: " + queryString);
				console.log("	with the following params: " + parameters);
				client.query(queryString, parameters, 
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


		selectWhereChannelID: function(channelid, callback){
			pg.connect(config.databaseurl, function (err, client,done){
				client.query("SELECT tblfeeditem.*, tblfeedchannel.fedfeedchannelurl FROM tblfeeditem, tblfeedchannel WHERE tblfeedchannel.fedfeedchannelid = $1",
					[channelid],
					function (err, result){
						done();
						if (err) return callback(err);

						callback(null, result);
						client.end();
					});
			});
			//SELECT tblfeeditem.*, tblfeedchannel.fedfeedchannelurl FROM tblfeeditem, tblfeedchannel WHERE tblfeedchannel.fedfeedchannelid = $1;
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

						//console.log("Attempting to insert new feed item for channel of ID: " + currentItem.fitfeedchannelid);
						client.query("INSERT INTO tblFeedItem (fitfeedchannelid,fitfeeditemtitle,fitfeeditemlink,fitfeeditemdescription,fitfeeditemimagelink,fittimestamp,fitisread) VALUES ($1,$2,$3,$4,$5,$6,$7)",
							[currentItem.fitfeedchannelid,currentItem.fitfeeditemtitle,currentItem.fitfeeditemlink,currentItem.fitfeeditemdescription,currentItem.fitfeeditemimagelink,"now()",false], 
							function (err,result){
								done();
								completed++;
								if (err){
									if (err.code == 23505){
										//console.log("Attempting to insert duplicate of existing news item; Safely ignoring.");
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