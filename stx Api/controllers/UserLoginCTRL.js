var UserLoginService = require('../services/UserLoginSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    // --- Start of code to login into application
    app.post('/api/users/login', function (req, res) {
        if (req.body.userName && req.body.password) {
            UserLoginService.userLogin(req, res);
        } else {
            logger.error('Error in UserLoginController - User Login: ' +
                'Missing mandatory field data');
            utils.sendResponse(res, 400, '9995', {});
        }
    });
    // --- End of code to login into application
    // --- Start of code to update User Password ---//
    app.put('/api/users/password/:id', function (req, res) {
        if (req.params.id && req.body.password && req.headers.token) {
            UserLoginService.updatePassword(req, res);
        } else {
            logger.error('Error in UserLoginController - User Password Update: ' +
                'Missing mandatory field data');
            utils.sendResponse(res, 400, '9995', {});
        }
    });
    // --- End of code to update User Password ---//

    // --- Start of code to Forgot Password ---//
    app.post('/api/users/forgot', function (req, res) {
        if (req.body.username) {
            UserLoginService.validateUsername(req, res, function (userObj) {
                UserLoginService.sendForgotMail(req, userObj, res);
                // utils.sendResponse(res, 200, '1001', resObj);
            });
        } else {
            logger.error('Error in UserLoginController - User Password Update: ' +
                'Missing mandatory field data');
            utils.sendResponse(res, 400, '9995', {});
        }
    });
    // --- End of code to Forgot Password ---//

    // --- Start of code to Rest Password ---//
    app.post('/api/users/restpassword', function (req, res) {
        if (req.body.password && req.headers.token) {
            UserLoginService.restPassword(req, res);
        } else {
            logger.error('Error in UserLoginController - Rest Password: ' +
                'Missing mandatory field data');
            utils.sendResponse(res, 400, '9995', {});
        }
    });
    // --- End of code to Rest Password ---//
};

