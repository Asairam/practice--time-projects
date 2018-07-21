/**
 * Importing required modules
 */
var SetupCompensationMethodsDAO = require('../dao/SetupCompensationMethodsDAO');

module.exports = {
    /**
     * DAO call to save compensationmethod
     */
    saveSetupCompensationMethods: function(req, done) {
        SetupCompensationMethodsDAO.saveSetupCompensationMethods(req, function(err, data) {
           if(data.statusCode === '2033') {
                done({httpCode: 400, statusCode: '2033', result: {}});
            } else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This method edit record using id
     */
    editSetupCompensationMethods: function (req, done) {
        SetupCompensationMethodsDAO.editSetupCompensationMethods(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists compensationmethod
     */
    getSetupCompensationMethods: function(req, done) {
        SetupCompensationMethodsDAO.getSetupCompensationMethods(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This function delete compensationmethod 
     */
    deleteSetupCompensation: function(req, done) {
        SetupCompensationMethodsDAO.deleteSetupCompensation(req, function(err, data) {
            if (data.statusCode === '2040') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
}
