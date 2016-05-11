var config = require('../../config');
var communication = require("../../Common/communication");
import Facebook = require('./Facebook');

var RP = new Facebook.Facebook_RP(
            config.AppRegistration.Facebook.appId,
            config.rootUrl + 'callback/Facebook',
            config.AppRegistration.Facebook.appSecret,
            "https://www.facebook.com/v2.0/dialog/oauth"
        );
exports.setRoutes = function (app) {
    app.get('/login/Facebook', function (req, res) {
       
        var AuthorizationRequest = RP.createAuthorizationRequest();
        communication.redirect("get", "https://www.facebook.com/v2.0/dialog/oauth",
            req, res, AuthorizationRequest, ["client_id", "redirect_uri", "scope", "response_type"]);
    });
    app.get('/callback/Facebook', function (req, res) {
        res.redirect(config.MainPageUrl + "?ReturnPort111=" + process.env.PORT);
    });
};