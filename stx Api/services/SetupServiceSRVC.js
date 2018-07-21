/**
 * Importing required modules
 */
var setupServiceDAO = require('../dao/SetupServiceDAO');

module.exports = {
    /**
     * DAO call to save Setup Services
     */
    setupService: function (req, done) {
        setupServiceDAO.setupService(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2034') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err || data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists the Setup Service record by Group Name
     */
    getSetupServiceByGroupName: function (req, done) {
        setupServiceDAO.getSetupServiceByGroupName(req, function (err, data) {
            if (err || data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists the Setup Service Active/Inactive records
     */
    getSetupServiceActiveInactiveList: function (req, done) {
        setupServiceDAO.getSetupServiceActiveInactiveList(req, function (err, data) {
            if (err || data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists the Setup Classes Active/Inactive records
     */
    getSetupClassActiveInactiveList: function (req, done) {
        setupServiceDAO.getSetupClassActiveInactiveList(req, function (err, data) {
            if (err || data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists the Setup Classes Active/Inactive records
     */
    getServiceRecord: function (req, done) {
        setupServiceDAO.getServiceRecord(req, function (err, data) {
            if (err || data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Update Setup Services
     */
    updateSetupService: function (req, done) {
        setupServiceDAO.updateSetupService(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2034') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err || data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function is to deete service details record
     */
    deleteSetupService: function (req, done) {
        setupServiceDAO.deleteSetupService(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    }
};
