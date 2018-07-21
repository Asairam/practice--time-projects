var logger = require('../lib/logger');
var bcrypt = require('bcrypt');
var execute = require('../db_connection/db');
module.exports = {
    // --- Start of code for Login
    userLogin: function (req, res, done) {
        const saltRounds = 10;

        var userName = req.body.userName;
        query = 'SELECT * FROM User__c WHERE Username = "' + userName + '"';
        execute.query(query, function (error, results) {
            if (error) {
                logger.error('Error in getting userLogin: ', error);
                done(error, '');
            } else {
                if (results.length !== 0) {
                    var passwordHash = results[0].Password__c;
                    var userPassword = req.body.password;
                } else {
                    var passwordHash = '';
                    var userPassword = '';
                }
                bcrypt.compare(userPassword, passwordHash, function (err, res) {
                    if (res === true) {
                        done(null, results[0]);
                    } else if (res === false || res === undefined || res === 'undefined') {
                        done(error, '2001');
                    }
                });
            }
        });
    },
    // --- End of code for Login

    // --- Start of code to update User Password ---//
    updatePassword: function (userId, password, res, done) {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function (err, hash) {
            query = 'UPDATE User__c SET Password__c="' + hash + '" WHERE Id="' + userId + '"';
            execute.query(query, function (error, result) {
                if (error) {
                    logger.error('Error in getting userLogin: ', error);
                    done(error, '');
                } else {
                    done(null, result);
                }
            });
        });
    },
    // --- End of code to update User Password ---//

    // --- Start of code to Validate Username ---//
    validateUsername: function (username, res, done) {
        query = 'SELECT * FROM User__c WHERE Username ="' + username + '"';
        execute.query(query, function (error, result) {
            if (error) {
                logger.error('Error in validateUserName: ', error);
                done(error, '');
            } else {
                done(null, result);
            }
        });
    }
    // --- End of code to Validate Username ---//
};
