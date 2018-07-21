var OnlineBookingService = require('../services/OnlineBookingSRVC');
var utils = require('../lib/util');

// --- Start of Controller
module.exports.controller = function(app, passport) {
    app.post('/api/appointments/onlinebooking', function(req, res) {
        OnlineBookingService.createOnlineBooking(req, function(data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get Client Preferences onlinebooking
     */
    app.get('/api/appointmentandemails/onlinebooking', function (req, res) {
        OnlineBookingService.getOnlinebooking(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
