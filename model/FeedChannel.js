var boilerplate = (require("./boilerplate.js"))();

// how to use this class (and other models):
//require it as usual: 
//		var feedchannelmodel = require("../model/FeedChannel");
//in the route that requires it, init it:
//		var feedchannel = feedchannelmodel();
//		feedchannel.insert( ... );
// or maybe not? idk anymore. gdi

function returnModel() {
	var FeedChannel = {
		modelObj: function (rowobj){
			return null;
		},
		
		/*basic insert*/
		insert: function (dictionary, callback) {
			var tablename = "tblFeedChannel"; 
			boilerplate.insert(tablename, dictionary, callback);
		},

		select: function (columns,whereDictionary,callback) {
			var tablename = "tblFeedChannel";
			boilerplate.select(columns,tablename,whereDictionary,callback);
		},

		upsert: function (upsertDictionary, whereDictionary, callback) {
			var tblName = "tblFeedChannel";
			boilerplate.upsert(tblName, upsertDictionary, whereDictionary, callback);
		}
	}

	return FeedChannel;
}



module.exports = returnModel;