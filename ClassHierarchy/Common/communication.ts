var request = require("request");
var config = require('../config');

exports.makeQueryString = function (request, fields) {
    var args: string = "";
    for (var i = 0; i < fields.length; i++) {
        if (i != 0)
            args += "&";
        args += (fields[i] + "=" + request[fields[i]]);
    }
    return encodeURI(args);
}

exports.redirect = function (method: string, Url, res, request, fields) {
    fields.push("SymT", "SignedBy");
    switch (method.toLowerCase()) {
        case "get":
            res.redirect(Url + "?" + this.makeQueryString(request, fields));
            break;
        case "post":
            break;
        default:
            console.log("Unsupported HTTP method.");
            return;
    }
}

exports.AbandonAndCreateSession = function (conclusion,req,res) {
    request({
        url: 'http://localhost/Auth.JS/platforms/' + config.WebAppSettings.platform.name + '/CreateNewSession.' + config.WebAppSettings.platform.fileExtension,
        method: 'POST'
    }, function (error, response, body) {
        request({
            url: 'http://localhost/Auth.JS/platforms/' + config.WebAppSettings.platform.name + '/CreateNewSession.' + config.WebAppSettings.platform.fileExtension,
            method: 'POST',
            form: conclusion
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                var setcookie = response.headers["set-cookie"];
                res.setHeader('Set-Cookie', setcookie);
                return res.redirect(req.cookies["LoginPageUrl"]);
            }
        });
    });
}




