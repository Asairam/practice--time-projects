/**
 * Importing required modules
 */
var occupationsDAO = require('../dao/OccupationsDAO');

module.exports = {
    /**
     * Client preferences Occupations DAO call
     */
    saveOccupations: function(req, done) {
        occupationsDAO.saveOccupations(req, function(err, data) {
            if (data.statusCode === '2052') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2053') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    /**
     * This function lists the Client preferences Occupations
     */
    getOccupations: function(req, done) {
        occupationsDAO.getOccupations(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
};


