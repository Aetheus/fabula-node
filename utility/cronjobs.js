var cronJob = require("cron").CronJob;

var mycron = new cronJob("*/5 * * * * *", function (){
	console.log("This will appear every 5 seconds");
}, null, true, "America/Los_Angeles");

mycron.start();