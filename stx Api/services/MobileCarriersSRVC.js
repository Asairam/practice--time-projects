/**
 * Importing required modules
 */
var mobileCarriersDAO = require('../dao/MobileCarriersDAO');

module.exports = {
    savemobileCarriers: function(req, done) {
        mobileCarriersDAO.savemobileCarriers(req, function(err, data) {
            if (data.statusCode === '2054') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2055') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    getMobileCarriers: function(req, done) {
        mobileCarriersDAO.getMobileCarriers(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
};


