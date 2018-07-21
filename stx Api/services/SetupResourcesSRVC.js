/**
 * Importing required modules
 */
var SetupResourcesDAO = require('../dao/SetupResourcesDAO');

module.exports = {
    /**
     * This method save single record
     */
    saveResources: function (req, done) {
        SetupResourcesDAO.saveResources(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This method edit record using id
     */
    editResources: function (req, done) {
        SetupResourcesDAO.editResources(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This method fetches total data from table
     */
    getResources: function (req, done) {
        SetupResourcesDAO.getResources(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    }
};
