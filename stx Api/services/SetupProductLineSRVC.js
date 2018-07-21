/**
 * Importing required modules
 */
var SetupProductLineDAO = require('../dao/SetupProductLineDAO');

module.exports = {
    /**
     * DAO call to save SetupProductLine
     */
    saveSetupProductLine: function(req, done) {
        SetupProductLineDAO.saveSetupProductLine(req, function(err, data) {
            if(data.statusCode == '2042') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data.statusCode === '2033') {
                done({httpCode: 400, statusCode: '2033', result: {}});
            } else if(data === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This method edit record using id
     */
    editSetupProductLine: function (req, done) {
        SetupProductLineDAO.editSetupProductLine(req, function (err, data) {
            if(data.statusCode == '2042') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists SetupProductLine
     */
    getSetupProductLine: function(req, done) {
        SetupProductLineDAO.getSetupProductLine(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This function delet SetupProductLine 
     */
    deleteSetupProductLine: function(req, done) {
        SetupProductLineDAO.deleteSetupProductLine(req, function(err, data) {
            if (data.statusCode === '2040') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2041') {
                done({ httpCode: 200, statusCode: data.statusCode, result: {} });
            } else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    deleteInventoryGroup: function(req, done) {
        SetupProductLineDAO.deleteInventoryGroup(req, function(err, data) {
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
