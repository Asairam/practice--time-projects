/**
 * Importing required modules
 */
var clientFlagsDAO = require('../dao/ClientFlagsDAO');

module.exports = {
    /**
     * Dao call to save Client Flags
     */
    saveClientFlags: function(req, done) {
        clientFlagsDAO.saveClientFlags(req, function(err, data) {
            if (data.statusCode === '2050') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2051') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * Dao call to list Client Flags
     */
    getClientFlags: function(req, done) {
        clientFlagsDAO.getClientFlags(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
};
