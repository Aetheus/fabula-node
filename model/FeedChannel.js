var boilerplate = (require("boilerplate.js"))();

function returnModel() {
	var FeedChannel = {
		/*basic insert*/
		insert: function (dictionary, callback) {
			var tablename = "tblFeedChannel"; 
			boilerplate(tablename, dictionary, callback);
		},

		select: function (columns,whereDictionary,callback) {
			var tablename = "tblFeedChannel";
			boilerplate(columns,tablename,whereDictionary,callback);
		}

	}

	return FeedChannel;
}



module.exports = returnModel();