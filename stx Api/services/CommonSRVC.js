var cfg = require('config');
var moment = require('moment');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var logger = require('../lib/logger');

module.exports = {
    /**
     * Pasword Encryption Code.
     * @param {String} password given password for encryption.
     * @param {String} salt given salt for encryption.
     * @param {function} callback return callback function.
     */
    passwordEncryption: function (password, salt, callback) {
        var hash = crypto.createHmac('sha512', salt); // Hashing algorithm sha512
        hash.update(password);
        var value = hash.digest('hex');
        callback({
            salt: salt,
            passwordHash: value
        });
    },
    // Gives Current UTC DateTime
    getCurrentUTC: function () {
        return new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
    },

    getCurrentDateTime: function () {
        return new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    },

    getDelCurrentUTC: function () {
        return '_DEL_' + moment.utc().format('YYYYMMDD_HHmmss');
    },

    getDelCurrentUTCNumber: function () {
        return moment.utc().format('YYYYMMDDHHmmss');
    },

    // todo - time zone and dateformat taken from user preferences
    formatDate: function (date) {
        if (date !== null)
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        else
            return '';
    },

    titleCase: function (word) {
        if (typeof (word) != String) {
            word = String(word);
            if (word.length > 0) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            } else {
                return '';
            }
        } else {
            if (word.length > 0) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            } else {
                return '';
            }
        }
    },
    getInitCapString: function (param) {
        if (!param) {
            return param;
        } else {
            var param1 = param.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
                return m.toUpperCase();
            });
            return param1.replace(/\s+/g, ' ');
        }
    },
    getDateRange: function (date) {
        var startDate = new Date(date + ' ' + '00:00:00');
        var endDate = new Date(date + ' ' + '23:59:59');
        return { startDate: startDate, endDate: endDate };
    },
    getWeekDateRange: function () {
        var startOfWeek = moment().startOf('isoweek').toDate();
        var endOfWeek = moment().endOf('isoweek').toDate();
        return { startDate: startOfWeek, endDate: endOfWeek };
    },
    getMonthDateRange: function () {
        var utcDate = new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
        var month = utcDate.getUTCMonth();
        var year = utcDate.getUTCFullYear();
        var startDate = new Date(moment([year, month]));
        var endDate = new Date(moment(startDate).endOf('month'));
        return { startDate: startDate, endDate: endDate };
    },

    generateToken(res, tokenData, cb) {
        try {
            jwt.sign({
                data: tokenData
            }, cfg.RSAKeyPassword, { expiresIn: 60 * 60 }, function (err, token) {
                if (token) {
                    res.header('token', token);
                    cb(null, token)
                } else {
                    cb(err, null)
                }
            });
        } catch (err) {
            logger.error('Error in CommonSRVC - tokenGeneration: ', err);
            return cb(err, null);
        }
    },

    validateToken(token, res, cb) {
        try {
            jwt.verify(token, cfg.RSAKeyPassword, function (err, decoded) {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, decoded);
                }
            });
        } catch (err) {
            logger.error('Error in CommonSRVC - tokenValidation: ', err);
            return cb(err, null);
        }
    }
};
