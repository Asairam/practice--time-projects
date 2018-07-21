var cfg = require('config');
var NotificationsService = require('../services/NotificationsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function(app, passport) {
    // Start of create notifications
    app.post('/api/setup/appointmentsandemails/notifications', function(req, res) {
        NotificationsService.createNotifications(req, function(data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get notifications
     */
    app.get('/api/setup/appointmentsandemails/notifications', function (req, res) {
        NotificationsService.getNotifications(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get notifications
     */
    app.post('/api/setup/appointmentsandemails/sendemailnotifications', function (req, res) {
        NotificationsService.sendNotifications(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
