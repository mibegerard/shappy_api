const responseTime = require("response-time");
const {restResponseTimeHistogram} = require("./metrics.js");

responseTime(function (req, res, time) {
    if (req?.route?.path) {
        restResponseTimeHistogram.observe({method: req.method, route: req.route.path, status_code: res.statusCode},
            time * 1000
        );
    }
})