﻿var express = require('express');
var AuthJS = express(),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    fs = require('fs');

var config = require('./config'); 

AuthJS.configure(function () {
    AuthJS.set('port', process.env.PORT || 3000);
    AuthJS.set('views', __dirname + '/views');
    AuthJS.set('view engine', 'ejs');
    AuthJS.use(express.favicon());
    AuthJS.use(express.logger('dev'));
    AuthJS.use(express.cookieParser());
    AuthJS.use(express.cookieSession({ secret: '65874653785634_StringThatIRandomlyTyped' }));
    AuthJS.use(express.bodyParser());
    AuthJS.use(express.methodOverride());
    AuthJS.use(AuthJS.router);
    AuthJS.use(express.static(path.join(__dirname, 'public')));
});

AuthJS.configure('development', function () {
    AuthJS.use(express.errorHandler());
});

AuthJS.get('/', function (req, res) {
    res.redirect(config.MainPageUrl + "?ReturnPort=" + process.env.PORT);
}
);

var service_provider;
for (var sp in config.AppRegistration) {
    service_provider = require('./ServiceProviders/' + sp);
    service_provider.setRoutes(AuthJS);
}

if (config.AuthJSSettings.scheme == "https") {
    var options = {
        key: fs.readFileSync('ssl-cert/key.pem'),
        cert: fs.readFileSync('ssl-cert/cert.pem')
    };
    https.createServer(options, AuthJS).listen(AuthJS.get('port'), function () {
        console.log("Express server listening on port " + AuthJS.get('port'));
    });
}
else {
    http.createServer(AuthJS).listen(AuthJS.get('port'), function () {
        console.log("Express server listening on port " + AuthJS.get('port'));
    });
}