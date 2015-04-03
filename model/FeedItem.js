var boilerplate = (require("./boilerplate.js"))();


var returnVar = {
	tablename: "tblFeedItem",

	select: function (columns,whereDictionary,callback) {
		boilerplate.select(columns,tablename,whereDictionary,callback);
	},

	/*remember, err.code == 23505 is the code for duplicate keys!*/
	insert: function (dictionary, callback) {
		boilerplate.insert(tablename,dictionary,callback);
	}

};

module.exports = returnVar;