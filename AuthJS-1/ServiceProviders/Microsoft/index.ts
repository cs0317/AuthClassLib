var config = require('../../config');
var utils = require("../../Common/utils");
var Step = require('step');
var request = require("request");
import Microsoft = require('./Microsoft');

var RP = new Microsoft.Microsoft_RP(
            config.AppRegistration.Microsoft.clientId,
            config.rootUrl + 'callback/Microsoft',
            config.AppRegistration.Microsoft.clientSecret,
            "https://login.live.com/oauth20_authorize.srf",
            "https://login.live.com/oauth20_token.srf",
            "https://apis.live.net/v5.0/me"
        );
exports.setRoutes = function (app) {
    app.get('/login/Microsoft', function (req, res) {
        RP.AuthorizationCodeFlow_Login_Start(req, res);
    });

    app.post('/callback/Microsoft', function (req, res) {
       RP.AuthorizationCodeFlow_Login_Callback(req,res);
       /* Step(
            function () {
                let code = req.body.code;
                if (code == null) {
                    return res.send('login-error ' + ':invalid authorization code');
                }
                var rawReq = {
                    url: "https://login.live.com/oauth20_token.srf",
                    method: "post",
                    form: {
                        client_id: config.AppRegistration.Microsoft.clientId,
                        redirect_uri: config.rootUrl + 'callback/Microsoft',
                        client_secret: config.AppRegistration.Microsoft.clientSecret,
                        code: code,
                        grant_type: "authorization_code"
                    }
                };
                request(rawReq, this);
            },
            function (err, RawAccessTokenResponse) {
                let jsonobj = utils.parseHttpMessage(RawAccessTokenResponse);
                if (jsonobj == null)
                    return res.send('login-error ' + ':invalid access token');
                let access_token = jsonobj.access_token;
                if (access_token == null)
                    return res.send('login-error ' + ':invalid access token');
                var rawReq = {
                    url: "https://apis.live.net/v5.0/me?access_token=" + access_token,
                    method: "get"
                };
                request(rawReq, this);
            },
            function (err, RawUserProfileResponse) {
                let inputMSG = utils.parseHttpMessage(RawUserProfileResponse);
             //   var conclusion = self.createConclusion(inputMSG);
             //   utils.AbandonAndCreateSession(conclusion, req, res);
            }
        )*/
    });
};