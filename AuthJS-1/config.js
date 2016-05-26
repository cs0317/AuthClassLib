var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

if (typeof process.env.PORT == 'undefined') 
    process.env.PORT = config.AuthJSSettings.port;

config.rootUrl = config.AuthJSSettings.scheme+"://"+config.WebAppSettings.hostname+':'+ process.env.PORT + '/';
config.MainPageUrl = "http://" + config.WebAppSettings.hostname + ':' + config.WebAppSettings.port + '/' + "Auth.JS/platforms/aspx/AllInOne.aspx";

module.exports = config;
