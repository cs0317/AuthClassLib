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




