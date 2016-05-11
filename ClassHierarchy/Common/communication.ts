exports.redirect = function (method: string, Url, req, res, request, fields) {
    var args: string = "?";
    switch (method.toLowerCase()) {
        case "get":
            for (var i = 0; i < fields.length; i++) {
                if (i != 0)
                     args += "&";
                args += (fields[i] + "=" + request[fields[i]]);
            }
            args = encodeURI(args);
            res.redirect(Url + args);
            break;
        case "post":
            break;
        default:
            console.log("Unsupported HTTP method.");
            return;
    }
};

