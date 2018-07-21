var UserLoginDAO = require('../dao/UserLoginDAO')
var CommonSRVC = require('../services/CommonSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var mail = require('../config/sendMail');
var cfg = require('config');
var fs = require('fs');

module.exports = {

    // --- Start of code for Login
    userLogin: function (req, res) {
        // --- This is to authenticate login credentials and gives the response
        UserLoginDAO.userLogin(req, res, function (error, resObj) {
            if (error) {
                utils.sendResponse(res, 500, '9999', {});
            } else if (resObj === '2001') {
                utils.sendResponse(res, 401, '2001', {});
            } else {
                var tokenData = {'id': resObj.Id, 'userName': resObj.Username,
            'firstName': resObj.FirstName, 'lastName': resObj.LastName};
                CommonSRVC.generateToken(res, tokenData, function (err, result) {
                    if (err) {
                        utils.sendResponse(res, 500, '9999', {});
                    } else {
                        utils.sendResponse(res, 200, '1001', result);
                    }
                });
            }
        });

    },
    // --- End of code for Login

    // --- Start of code to update User Password ---//
    updatePassword: function (req, res, next) {
        CommonSRVC.validateToken(req.headers.token, res, function(err, decodedToken) {
            if(decodedToken && decodedToken.data) {
                UserLoginDAO.updatePassword(req.params.id, req.body.password, res, function (error, resObj) {
                    if (error) {
                        utils.sendResponse(res, 500, '9999', {});
                    } else {
                        utils.sendResponse(res, 200, '1001', {});
                    }
                });
            } else {
                utils.sendResponse(res, 400, '2071', {});
            }
        });
    },
    // --- End of code to update User Password ---//

    // --- Start of code to Validate Username ---//
    validateUsername: function (req, res, next) {
        UserLoginDAO.validateUsername(req.body.username, res, function (error, resObj) {
            if (error) {
                utils.sendResponse(res, 500, '9999', {});
            } else {
                if(resObj.length == 0) {
                    utils.sendResponse(res, 400, '2073', {});
                } else {
                    next(resObj[0]);
                }
            }
        });
    },
    // --- End of code to Validate Username ---//

    // --- Start of code to send Forgot Password Mail ---//
    sendForgotMail: function (req, userObj, res) {
        fs.readFile(cfg.forgotHTML, function (err, data) {
            if(err) {
                logger.error('Error in reading HTML template:', err);
                utils.sendResponse(res, 500, '9999', {});
            } else {
                var emailTempalte = data.toString();
                emailTempalte = emailTempalte.replace("{{name}}", userObj.FirstName + " " + userObj.LastName);
                var tokenData = {'id': userObj.Id, 'userName': userObj.Username}
                CommonSRVC.generateToken(res, tokenData, function (err2, token) {
                    emailTempalte = emailTempalte.replace("{{action_url}}", cfg.bseURL + cfg.resetLink + token);
                    // emailTempalte = emailTempalte.replace(/{{action_url}}/g,cfg.bseURL + cfg.resetLink + token);
                    mail.sendemail(userObj.Email, emailTempalte, cfg.forgotSubject, function(err, result){
                        if(err) {
                            utils.sendResponse(res, 500, '9999', {});
                        } else {
                            utils.sendResponse(res, 200, '2057', {});
                        }
                    });
                });
            }
        });
        
    },
    // --- End of code to send Forgot Password Mail ---//

    // --- Start of code to Reset Password ---//
    restPassword: function (req, res, next) {
        CommonSRVC.validateToken(req.headers.token, res, function(err, decodedToken) {
            if(err) {
                utils.sendResponse(res, 400, '2071', {});
            } else {
                UserLoginDAO.updatePassword(decodedToken.data.id, req.body.password, res, function (error, resObj) {
                    if (error) {
                        utils.sendResponse(res, 500, '9999', {});
                    } else {
                        utils.sendResponse(res, 200, '1001', {});
                    }
                });
            }
        });
    },
    // --- End of code to Reset Password ---//

};
