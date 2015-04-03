var cronJob = require("cron").CronJob;
var config = require("./config.js");
var updater = require("../utility/updater");

//5 second timer
//var mycron2 = new cronJob("*/5 * * * * *", function (){
//	console.log("This will appear every 5 seconds");
//}, null, true, "UTC");
//mycron2.start();

//1 minute timer
var mycron = new cronJob("0 */1 * * * *", function (){
	console.log("This will appear every 1 minute");
}, null, true, "UTC");


//call to updater; occurs every 1 minute; maybe increase to 2 or more minutes, consider how expensive the update process is resource-wise?
var update = new cronJob("0 */1 * * * *", function(){
	console.log("Beginning Feed Updater . . .");
	updater.updateAllFeeds(function (err, numInsertedRows){
		if (err) console.error(err);

		console.log("Updater successfully ran. Number of new inserted rows: " + numInsertedRows);
	})
},null, true, "UTC");

mycron.start();
