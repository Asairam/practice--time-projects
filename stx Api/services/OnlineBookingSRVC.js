
var OnlineBookingDAO = require('../dao/OnlineBookingDAO');
var config = require('config');
var fs = require('fs');

module.exports = {
    createOnlineBooking: function(req, done) {
        OnlineBookingDAO.createOnlineBooking(req, function(err, data) {
            if(data === '2035') {
                done({httpCode: 400, statusCode: '2035', result: {}});
            }else if (err) {
                    done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    /**
     * This function lists the Client preferences OnlineBooking
     */
    getOnlinebooking: function(req, done) {
        OnlineBookingDAO.getOnlinebooking(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
};
