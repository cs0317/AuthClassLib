var config = require('../../config');
import Facebook = require('./Facebook');

var RP = new Facebook.Facebook_RP(
            config.AppRegistration.Facebook.appId,
            config.rootUrl + 'callback/Facebook',
            config.AppRegistration.Facebook.appSecret,
            "https://www.facebook.com/v2.0/dialog/oauth",
            "https://graph.facebook.com/v2.3/oauth/access_token"
        );
exports.setRoutes = function (app) {
    app.get('/login/Facebook', function (req, res) {
        RP.AuthorizationCodeFlow_Login_Start(req, res);
    });

    app.get('/callback/Facebook', function (req, res) {
        RP.AuthorizationCodeFlow_Login_Callback(req,res);
    });
};