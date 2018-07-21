/**
 * Importing required modules
 */
var cfg = require('config');
var appointmentsBookingSRVC = require('../services/AppointmentsBookingSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
    /**
     * This api is to book appointment
     */
    app.post('/api/appointmentsandemails/booking', function(req, res) {
        appointmentsBookingSRVC.appointmentsBooking(req, function(data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
    app.get('/api/appointmentsandemails/booking', function(req, res) {
        appointmentsBookingSRVC.getApptBookingData(req, function(data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
};
