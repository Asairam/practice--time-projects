/**
 * Importing required modules
 */
var SetupCompensationDAO = require('../dao/SetupCompensationScalesDAO');

module.exports = {
    /**
     * DAO call to save compensation sclae
     */
    saveSetupCompensation: function(req, done) {
        SetupCompensationDAO.saveSetupCompensation(req, function(err, data) {
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
    editSetupCompensation: function (req, done) {
        SetupCompensationDAO.editSetupCompensation(req, function (err, data) {
            if (data.statusCode === '2044') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }  else if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists compensation sclae
     */
    getSetupCompensation: function(req, done) {
        SetupCompensationDAO.getSetupCompensation(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This function delete compensation sclae 
     */
    deleteSetupCompensation: function(req, done) {
        SetupCompensationDAO.deleteSetupCompensation(req, function(err, data) {
            if (data.statusCode === '2044') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
}
