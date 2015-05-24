var boilerplate = (require("./boilerplate.js"))();


function returnModel() {
	var FeedChannel = {

		tableName:"tblUserAppSettings",

		modelObj: function (rowobj){
			return null;
		},

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