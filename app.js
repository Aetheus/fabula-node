var express = require('express');
var session = require('express-session');
var bodyParser = require("body-parser");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cronjobs = require("./utility/cronjobs.js");
var pg = require('pg');
var password = require("password-hash-and-salt");

//importing configs
var config = require("./utility/config.js");
console.log(config.testMsg + " in app.js");
console.log("DATABASEURL set to: " + config.databaseurl);

//set pool size of postgresql
pg.defaults.poolSize = 20;

//init app as express server object
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//initialize session using secret for express-session's cookie handling
app.use(session({secret: "this sentence is supposed to be the secret for cookie handling in the web app the longer it is the better haha im stretching this out pretty long huh"}));


//middleware to make res/req objects accessible by our EJS template files
//do NOT move this lower in the code hiereachy. It NEEDS to come before all the regular routes
app.use(function(req, res, next){
    if (!res.locals.req || !res.locals.res){
        res.locals.req = req; 
        res.locals.res = res;   
    }
    

    next();
    //next(req, res, next);
});


//CORS to enable cross domain requests
app.use(function(req, res, next) {
    //note, res.header(...) is an alias for res.set(...)
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});


//*****************************************************************************************
//setting the routers/controllers
//You could add routes this way too: var users = require('./routes/users'); app.use('/users', users);
app.use('/', require("./routes/index"));
app.use('/index', require("./routes/index"));
app.use('/users', require("./routes/users"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/db", require("./routes/db"));
app.use("/subscribe", require("./routes/subscribe"));
app.use("/subscribedchannels", require("./routes/subscribedchannels"));
app.use("/readitem", require("./routes/readitem"));
app.use('/greet', require("./routes/greet"));


app.use("/supervisordemo", require("./routes/supervisordemo"));
app.use("/updaterdemo", require("./routes/updaterdemo"));
//*****************************************************************************************




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.error(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.error("Production Error: " + err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
}); 


module.exports = app;
