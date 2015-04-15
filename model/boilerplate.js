var pg = require("pg");
var config = require("../utility/config");


//creates a new boilerplateDB template each time. 
function createBoilerplate(){
	var boilerplate = {
		/*	
		Boilerplate code to simplify query execution
			IMPORTANT NOTE: The callback MUST have the format of function (err, result) { ... }!
		function	: query
		statement	: "INSERT INTO tblFeedChannel (fedUserID,fedFeedChannelName,fedFeedChannelDesc,fedFeedChannelURL,fedFeedChannelTitleSelector,fedFeedChannelLinkSelector,fedFeedChannelDescriptionSelector, fedFeedChannelImageLinkSelector, fedFeedChannelAncestorSelector,fedFeedChannelIsActive,fedFeedChannelIsCustom) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)"
		args 		: [userid,channelname,descriptionSelector,siteURL,titleSelector,linkSelector,descriptionSelector,imageLinkSelector,ancestorSelector,true,channelIsCustom]
		callback	: 	function (err, result, next){
							if (err) return next(err);
				
							console.log("Succesfully inserted: " + result);
						}
[optnl] delayClientEnd: true (ONLY call this IF you want to delay executing client.end(). 
							in which case, the callback MUST have a signature of function () (null, result, client) and you MUST call client.end() in the callback )
		*/
		query: function (statement, args, callback, delayClientEnd){
		  	pg.connect(config.databaseurl, function(err, client, done) {
		  		if (err) return callback(err);
		  		
				console.log("Attempting to execute SQL query: [" +statement + "] \n\tWith arguments: [" + args + "]");
		  		//notice that client.query's callback has a param for RESULT. Don't confuse it with router.get's callback param, RES(PONSE)
				client.query(statement, args, function (err, result) {
					done();
					if (err) return callback(err);

					callback(null, result,client);

					if(!delayClientEnd){
						client.end();	
					}
				});
				
			});	
		},

		/* takes a key-value dictionary, spits out an object that contains a pair of "columns" and "values" arrays */
		splitDictionary: function (dictionary, callback){
			var columns = [];
			var values = [];
			for (var key in dictionary) {
			  	if (dictionary.hasOwnProperty(key)) {
			  	  	if (typeof key !== "string"){
			  	  		return callback(new Error("Error: ALL keys must be strings!"));
			  	  	}

			  	  	columns[columns.length] = key;  
			  	  	values[values.length] = dictionary[key];
			  	}
			}

			var returnObj = { columns:columns, values:values };
			return returnObj;
		},
	
		/*
		tblname		: A_table_name
		dictionary : { "userid":"bob", "channelname":"Webspace" }
		callback   : function (err, result) { done(); if (err) return next(err); "business logic goes here"; client.end();}!
		*/
		insert: function (tblname ,dictionary, callback){
			var columns = [];
			var values 	= [];

			if (Object.getOwnPropertyNames(dictionary).length === 0){
				return callback(new Error("Error@Insert: Dictionary cannot be an empty object!"));
			}

			var returnObj = this.splitDictionary(dictionary, callback);
			columns = returnObj.columns;
			values = returnObj.values;

			/*if there were 4 columns, this produces "$1,$2,$3,$4"*/
			var parametricColumns = "";
			for (var i = 0; i < columns.length ; i++){
				var n = i + 1;
				parametricColumns = parametricColumns + "," + "$" + n; 
			}
			parametricColumns = parametricColumns.slice(1);	//slice first ',' away.

			var columnString = columns.toString();

			var statement = "INSERT INTO " + tblname + " (" + columnString + ") VALUES (" + parametricColumns + ")";
			var args = values;
			

			
			this.query(statement,args,callback);
		},
	

		/*
		This is a BASIC select statement. No inherent support for INNER JOIN syntax queries
		tblname 		: "tblFeedChannel"
		columns 		: [ "fedFeedChannelName", "fedFeedChannelDesc"]
		whereDictionary	: { "fedFeedChannelID":1 } OR simply null if no "Where" condition needed
		callback 		: function (err, result) { .. }
		*/
		select: function (columns,tblName,whereDictionary, callback){
			if(columns.constructor !== Array){
				return callback(new Error("An array of columns to select must be provided!"));
			}
			if (columns.length == 0){
				return callback(new Error("You must supply at least one column to select from!"));
			}


			var columnString = columns.toString();
			var args = [];

			var statement = "SELECT " + columns + " FROM " + tblName;
			if (whereDictionary){
				var whereString = " WHERE ";

				var returnObj = this.splitDictionary(whereDictionary, callback);
				columns = returnObj.columns;
				values = returnObj.values;

				for (var i=0; i<columns.length; i++){
					whereString = whereString + columns[i] + "=" + "$" + (i+1) + " AND ";
				}
				whereString = whereString.slice(0,whereString.length-4);

				statement = statement + whereString;
				args = values;
			}

			this.query(statement,args,callback);
		},

		/*
		This is a BASIC update statement. No inherent support for INNER JOIN syntax queries
		tblname 		: "tblFeedChannel"
		updateDictionary: { "fedFeedChannelName: "bob"}
		whereDictionary	: { "fedFeedChannelID":1 } 
		callback 		: function (err, result) { .. }
		*/
		update: function (tblName, updateDictionary, whereDictionary, callback){
			if (Object.keys(updateDictionary).length == 0 || Object.keys(whereDictionary).length == 0){
				return callback(new Error("Update and Where dictionaries MUST be provided!"));
			}

			var splitUpdateDictionary = this.splitDictionary(updateDictionary, callback);
			var splitWhereDictionary = this.splitDictionary(whereDictionary, callback);

			var whereColumnName = splitWhereDictionary.columns;
			var whereColumnValue = splitWhereDictionary.values;


			var setColumnName = splitUpdateDictionary.columns;
			var setColumnValue = splitUpdateDictionary.values;


			var counter = 1;
			var setString = " SET ";
			for (var i= 0; i<setColumnName.length; i++){
				setString = setString + setColumnName[i] + "=" + "$" + counter + " ,";
				counter++;
			}
			setString = setString.slice(0,-1);


			var whereString = " WHERE ";
			for (var i=0; i<whereColumnName.length; i++){
					whereString = whereString + whereColumnName[i] + "=" + "$" + counter + " AND ";
					counter++;
			}
			whereString = whereString.slice(0,whereString.length-4);

			var parameters = setColumnValue.concat(whereColumnValue);


			var queryString = "UPDATE " + tblName + setString + " " + whereString;  
			this.query(queryString, parameters, callback);
		},

		upsert: function(tblName, upsertDictionary, whereDictionary, callback){
			if (Object.keys(upsertDictionary).length == 0 || Object.keys(whereDictionary).length == 0){
				return callback(new Error("Update and Where dictionaries MUST be provided!"));
			}

			/* Fiirst we start with the update part of our upsert. */
			var splitUpdateDictionary = this.splitDictionary(upsertDictionary, callback);
			var splitWhereDictionary = this.splitDictionary(whereDictionary, callback);

			var whereColumnName = splitWhereDictionary.columns;
			var whereColumnValue = splitWhereDictionary.values;


			var setColumnName = splitUpdateDictionary.columns;
			var setColumnValue = splitUpdateDictionary.values;


			var counter = 1;
			var setString = " SET ";
			for (var i= 0; i<setColumnName.length; i++){
				setString = setString + setColumnName[i] + "=" + "$" + counter + " ,";
				counter++;
			}
			setString = setString.slice(0,-1);


			var whereString = " WHERE ";
			for (var i=0; i<whereColumnName.length; i++){
					whereString = whereString + whereColumnName[i] + "=" + "$" + counter + " AND ";
					counter++;
			}
			whereString = whereString.slice(0,whereString.length-4);

			//copy the current setColumnValue
			var setColumnValueCopy = setColumnValue;

			var parameters = setColumnValue.concat(whereColumnValue);


			var updateQueryString = "UPDATE " + tblName + setString + " " + whereString;
			console.log("upsert: update querystring was: " + updateQueryString)




			/* Now we move onto the Insert part of our upsert */
			var insertQueryString = " INSERT INTO " + tblName + " (" + setColumnName.toString() + ")";
			
			var insertQuerySelectString = "";
			for (var i= 0; i<setColumnValueCopy.length; i++){
				insertQuerySelectString = insertQuerySelectString + "$" + (i + 1) + " ,";
			}
			insertQuerySelectString = insertQuerySelectString.slice(0,-1);
			
			insertQueryString   += 	" SELECT " + insertQuerySelectString
								+ 	" WHERE NOT EXISTS "
								+	" (SELECT 1 FROM " + tblName + whereString + " )"
			console.log("upsert: insert querystring was " + insertQueryString);


			//fail ... guess we need to split it?
			//var totalQueryString = updateQueryString + " ; " + insertQueryString;
			//this.query(totalQueryString, parameters, callback);

			var thisSpecificObject = this;
			var delayClientEnd = true;
			this.query(updateQueryString, parameters, function (err,result,client){
				if (err) return callback(err);

				console.log("Upsert: Update rowcount is " + result.rowCount);

				if(result.rowCount != 0){
					console.log("this record existed before and we're updating it");
					return callback(err, result);
				}

				thisSpecificObject.query(insertQueryString, parameters, function(err, result, passedclient){
					if (err) return callback(err);
					
					console.log("Upsert: Insert rowcount is " + result.rowCount);

					callback(err, result);

					passedclient.end();
				},true);
			}, delayClientEnd)

		  	/*pg.connect(config.databaseurl, function(err, client, done) {
		  		if (err) return callback(err);
		  		
				console.log("Attempting to execute SQL query: [" +statement + "] \n\tWith arguments: [" + args + "]");
				client.query(updateQueryString, parameters, function (err, result) {
					done();
					if (err) {return callback(err);};

					client.query(insertQueryString)

					client.end();
				});
				
			});*/
		}
	}

	return boilerplate;
}

module.exports = createBoilerplate;