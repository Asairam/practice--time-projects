
var NotificationsDAO = require('../dao/NotificationsDAO');
var config = require('config');
var fs = require('fs');

module.exports = {
    createNotifications: function(req, done) {
        NotificationsDAO.createNotifications(req, function(err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    getNotifications: function(req, done) {
        NotificationsDAO.getNotifications(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    sendNotifications: function(req, done) {
        NotificationsDAO.sendNotifications(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '2057', result: data});
            }
        });
    }
};
