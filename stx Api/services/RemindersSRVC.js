
var RemindersDAO = require('../dao/RemindersDAO');
var config = require('config');
var fs = require('fs');

module.exports = {
    sendReminders: function(req, done) {
        RemindersDAO.sendReminders(req, function(err, data) {
            if (err) {
                    done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    getReminders: function(req, done) {
        RemindersDAO.getReminders(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    sendemailReminders: function(req, done) {
        RemindersDAO.sendemailReminders(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '2057', result: data});
            }
        });
    }
};
