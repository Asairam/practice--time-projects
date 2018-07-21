/**
 * Importing required modules
 */
var cfg = require('config');
var SetupServicePackagesSRVC = require('../services/SetupServicePackagesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    app.post('/api/setupservices/servicepackages', function (req, res) {
        SetupServicePackagesSRVC.saveServicePackages(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.put('/api/setupservices/servicepackages/:id', function (req, res) {
        SetupServicePackagesSRVC.editServicePackages(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get setup services
     */
    app.get('/api/setupservices/servicepackages/:type?', function (req, res) {
        SetupServicePackagesSRVC.getServicePackages(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/setupservices/setupservice/:serviceid?', function (req, res) {
        SetupServicePackagesSRVC.getSetupService(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};