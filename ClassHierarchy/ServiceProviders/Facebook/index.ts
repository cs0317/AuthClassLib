var config = require('../../config');
exports.setRoutes = function (app) {
    app.get('/login/Facebook', function (req, res) {
        res.redirect(config.MainPageUrl + "?ReturnPort111=" + process.env.PORT);
    });
    app.get('/callback/Facebook', function (req, res) {
        res.redirect(config.MainPageUrl + "?ReturnPort111=" + process.env.PORT);
    });
};