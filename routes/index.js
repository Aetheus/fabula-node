var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
	var session = req.session;

	if (session.username){
		res.render('index', { title: 'Express', username:session.username });
	}else{
		res.render('index', { title: 'Express' });
	}
  	
});

module.exports = router;
