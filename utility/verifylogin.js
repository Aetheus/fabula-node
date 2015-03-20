var password = require("password-hash-and-salt");
var pg = require("pg");
var myglobal = require("../utility/myglobal");

//next function has the format of function (err, isVerified, user)
var verifyLogin = function (providedusername, providedpassword, next){
	if (typeof providedusername === undefined || providedusername === null){
		next(new Error("Username not provided"));
	}

	if (typeof providedpassword === undefined || providedpassword === null){
		next(new Error("Password not provided"));
	}

	pg.connect(myglobal.databaseurl, function(err, client, done) {
		if (err){
			console.error(err);
			next(err); 
		}

		//notice that client.query's callback has a param for RESULT. Don't confuse it with router.get's callback param, RES(PONSE)
		client.query("SELECT * FROM tblUser WHERE usrUserID=$1",[providedusername], function(err, result) {
			done();	//client pooling
			if (err){ 
				console.error(err);
				next(err);
			}

			//result.rows

			if (result.rows[0] !== undefined){
				var dbpw = result.rows[0].usruserpassword;

				password(providedpassword).verifyAgainst(dbpw, function(err, verified){
					if(verified){
						next(null,true,result.rows[0]);
					}else{
						next(null,false,null);
					}
				});
			}else{
				next(null,false,null);
			}
		});

	});

}

module.exports = verifyLogin;
