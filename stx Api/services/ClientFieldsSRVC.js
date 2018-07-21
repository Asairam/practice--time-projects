/**
 * Importing required modules
 */
var clientFieldsDAO = require('../dao/ClientFieldsDAO');

module.exports = {
    /**
     * Dao call to save Client Fields
     */
    saveClientFields: function(req, done) {
        clientFieldsDAO.saveClientFields(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * Dao call to lists the Client Fields
     */
    getClientFields: function(req, done) {
        clientFieldsDAO.getClientFields(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
};
