var config = require('config');

exports.sendResponse = function(response, httpCode, status, result) {
    config.responseTemplte.status = status;
    config.responseTemplte.message = config.statusCodes[status];
    config.responseTemplte.result = result;
    response.status(httpCode).send(config.responseTemplte);
};
