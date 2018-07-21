/**
 * Importing required modules
 */
var cfg = require('config');
var fs = require('fs');
var setupServiceGroupSRVC = require('../services/SetupServiceGroupsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    /**
     * This API saves Client Preferences Service Groups
     */
    app.post('/api/setupservices/servicegroups', function (req, res) {
        setupServiceGroupSRVC.saveServiceGroups(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.put('/api/setupservices/servicegroups/:oldServiceGroupName/:oldOnlineName', function (req, res) {
       setupServiceGroupSRVC.editServiceGroups(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to delete setup servicegroups
     */
    app.delete('/api/setupservices/servicegroups/:oldServiceGroupName', function (req, res) {
        if (req.params.oldServiceGroupName) {
            setupServiceGroupSRVC.deleteServiceGroups(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get Client Preferences Service Groups
     */
    app.get('/api/setupservices/servicegroups/:active?', function (req, res) {
            setupServiceGroupSRVC.getServiceGroups(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
    app.get('/api/setupservices/services/:oldServiceGroupName', function (req, res) {
        setupServiceGroupSRVC.getServicesData(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
});
};