/**
 * Importing required modules
 */
var cfg = require('config');
var SetupCompensationMethodsSRVC = require('../services/SetupCompensationMethodsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of setupcompensation Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save Setup Compensation
     */
    app.post('/api/setupworkers/setupcompensationmethods', function (req, res) {
        SetupCompensationMethodsSRVC.saveSetupCompensationMethods(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update Compensation data
     */
    app.put('/api/setupworkers/setupcompensationmethods/:id', function (req, res) {
        if (req.params.id) {
            SetupCompensationMethodsSRVC.editSetupCompensationMethods(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup Compensation
     */
    app.get('/api/setupworkers/setupcompensationmethods', function (req, res) {
        SetupCompensationMethodsSRVC.getSetupCompensationMethods(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
    app.delete('/api/setupworkers/setupcompensationmethods/:name', function (req, res) {
        if (req.params.name) {
            SetupCompensationMethodsSRVC.deleteSetupCompensation(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
}