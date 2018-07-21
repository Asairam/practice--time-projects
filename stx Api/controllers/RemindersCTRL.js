var cfg = require('config');
var RemindersService = require('../services/RemindersSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');
// --- Start of Controller
module.exports.controller = function(app, passport) {
    // Start of Reminders
    app.post('/api/setup/appointmentsandemails/reminders', function(req, res) {
        RemindersService.sendReminders(req, function(data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
     /**
     * This API is to get Reminders
     */
    app.get('/api/setup/appointmentsandemails/reminders', function (req, res) {
        RemindersService.getReminders(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get Reminders
     */
    app.post('/api/setup/appointmentsandemails/sendemailreminders', function (req, res) {
        RemindersService.sendemailReminders(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
