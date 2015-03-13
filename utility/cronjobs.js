var cronJob = require("cron").CronJob;
var myglobal = require("myglobal");

var mycron = new cronJob("*/5 * * * * *", function (){
	console.log("This will appear every 5 seconds: " + myglobal.testMsg);
}, null, true, "America/Los_Angeles");

mycron.start();