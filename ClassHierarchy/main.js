var express = require('../../Auth.JS/node_modules/express');
var AuthJS = express(),
    path = require('path'),
    http = require('http'),
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

http.createServer(AuthJS).listen(AuthJS.get('port'), function () {
    console.log("Express server listening on port " + AuthJS.get('port'));
});