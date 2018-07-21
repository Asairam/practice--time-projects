/**
 * Importing required modules
 */
var appointmentsBookingDAO = require('../dao/AppointmentsBookingDAO');
var config = require('config');
var fs = require('fs');

module.exports = {
    /**
     * Dao call to book appointment
     */
    appointmentsBooking: function(req, done) {
        appointmentsBookingDAO.appointmentsBooking(req, function(err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    getApptBookingData: function(req, done) {
        appointmentsBookingDAO.getApptBookingData(req, function(err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    }
};
