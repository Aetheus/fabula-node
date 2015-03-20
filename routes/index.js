var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var sess = req.session;

	if (sess.username){
		res.render('index', { title: 'Express', username:sess.username });
	}else{
		res.render('index', { title: 'Express' });
	}
  	
});

module.exports = router;
