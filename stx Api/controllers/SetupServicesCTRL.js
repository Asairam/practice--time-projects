/**
 * Importing required modules
 */
var cfg = require('config');
var setupServiceSRVC = require('../services/SetupServiceSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save setup services
     */
    app.post('/api/setup/setupservice', function (req, res) {
        setupServiceSRVC.setupService(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get setup services by Group Name
     */
    /* app.get('/api/setup/setupservice/:serviceGroupName', function (req, res) {
        setupServiceSRVC.getSetupServiceByGroupName(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    }); */
    /**
     * This API is to get setup services Active/Inactive List
     */
    app.get('/api/setup/setupservice/activeinactive/:active/:serviceGroupName', function (req, res) {
        if (req.params.active && req.params.serviceGroupName) {
            setupServiceSRVC.getSetupServiceActiveInactiveList(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // The specified user data is invalid
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup classes Active/Inactive List
     */
    app.get('/api/setup/setupclass/activeinactive', function (req, res) {
        // if (req.params.type) {
            setupServiceSRVC.getSetupClassActiveInactiveList(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        // } else {
        //     // The specified user data is invalid
        //     utils.sendResponse(res, 400, '2039', {});
        // }
    });
    /**
     * This API is to fetch Service Record to edit
     */
    app.get('/api/setup/service/:id', function (req, res) {
        if (req.params.id) {
            setupServiceSRVC.getServiceRecord(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // The specified user data is invalid
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup classes Active/Inactive List
     */
    app.put('/api/setup/setupservice/:id', function (req, res) {
        if (req.params.id) {
            setupServiceSRVC.updateSetupService(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // The specified user data is invalid
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This function is to deete service details record
     */
    app.delete('/api/setup/setupservice/:id/:name', function (req, res) {
        if (req.params.id) {
            setupServiceSRVC.deleteSetupService(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
};
