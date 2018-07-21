/**
 * Importing required modules
 */
var visitTypesDAO = require('../dao/VisitTypesDAO');

module.exports = {
    saveVisitTypes: function(req, done) {
        visitTypesDAO.saveVisitTypes(req, function(err, data) {
            if (data.statusCode === '2048') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2049') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This function lists the Client Visit Types 
     */
    getVisitTypes: function(req, done) {
        visitTypesDAO.getVisitTypes(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This function lists the ActiveVisitTypes
     */
    getActiveVisitTypes: function(req, done) {
        visitTypesDAO.getActiveVisitTypes(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
};


