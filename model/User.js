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
		
		tableName: "tblUser",

		/*basic insert*/
		insert: function (dictionary, callback) {
			boilerplate.insert(this.tableName, dictionary, callback);
		},

		select: function (columns,whereDictionary,callback) {
			boilerplate.select(columns,this.tableName,whereDictionary,callback);
		},

		update: function (updateDictionary, whereDictionary, callback) {
			boilerplate.update(this.tableName, updateDictionary, whereDictionary, callback);
		},

		upsert: function (upsertDictionary, whereDictionary, callback) {
			boilerplate.upsert(this.tableName, upsertDictionary, whereDictionary, callback);
		},

				/* simple delete */
		del: function (whereDictionary, callback){
			boilerplate.del(this.tableName, whereDictionary, callback);
		},
	}

	return FeedChannel;
}



module.exports = returnModel;