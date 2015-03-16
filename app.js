var express = require('express');
var session = require('express-session');
var bodyParser = require("body-parser");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cronjobs = require("./utility/cronjobs.js");

//importing myglobals
var myglobal = require("./utility/myglobal.js");
console.log(myglobal.testMsg + " in app.js")

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


//*****************************************************************************************
//setting the routers/controllers
//You could add routes this way too: var users = require('./routes/users'); app.use('/users', users);
app.use('/', require("./routes/index"));
app.use('/index', require("./routes/index"));
app.use('/users', require("./routes/users"));
app.use("/login", require("./routes/login"));
app.use("/scrape", require("./routes/scrape"));
app.use("/user", require("./routes/user"));
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
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
}); 


module.exports = app;
