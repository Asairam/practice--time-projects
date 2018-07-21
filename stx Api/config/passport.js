
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var UserLoginDAO = require('../dao/UserLoginDAO');
var CommonSRVC = require('../services/CommonSRVC');
var cfg = require('config');

var logger = require('../lib/logger');

module.exports = function(passport) {
// LOCAL LOGIN =============================================================
    passport.use('local-login', new LocalStrategy({
            usernameField: 'userId',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, userId, password, callback) {
            try {
                UserLoginDAO.userLogin(userId, function(err, resObj) {
                    var userObj = resObj;
                    if(err) {
                        callback({statusCode: '9999', result: {}});
                    } else if(userObj) {
                            if(userObj.isEnabled == 'Active'
                            && !userObj.isDeleted) {
                                CommonSRVC.passwordEncryption(password, userObj.salt, function(passwordObj) {
                                    if(passwordObj && passwordObj.passwordHash
                                        && passwordObj.passwordHash == userObj.password) {
                                            callback({statusCode: '1002', result: userObj});
                                        } else {
                                            callback({statusCode: '9951', result: {}});
                                        }
                                });
                            }else {
                                callback({statusCode: '9951', result: {}}); 
                            }
                    } else {
                        callback({statusCode: '9951', result: userObj});
                    }
                });
            } catch(err) {
                logger.error('Error in Passport - LocalLogin: ', err);
                callback({validStatus: '9999'});
            }
        }
    ));
};
