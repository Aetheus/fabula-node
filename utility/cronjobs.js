var cronJob = require("cron").CronJob;
var config = require("./config.js");

//5 second timer
//var mycron = new cronJob("*/5 * * * * *", function (){
//	console.log("This will appear every 5 seconds");
//}, null, true, "America/Los_Angeles");

//1 minute timer
var mycron = new cronJob("0 */1 * * * *", function (){
	console.log("This will appear every 1 minute");
}, null, true, "America/Los_Angeles");

mycron.start();