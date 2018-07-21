/**
 * Importing required modules
 */
var cfg = require('config');
var SetupCompensationSRVC = require('../services/SetupCompensationScalesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of setupcompensation Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save Setup Compensation scale
     */
    app.post('/api/setupworkers/setupcompensation', function (req, res) {
        SetupCompensationSRVC.saveSetupCompensation(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update compensation sclae data
     */
    app.put('/api/setupworkers/setupcompensation/:id', function (req, res) {
        if (req.params.id) {
            SetupCompensationSRVC.editSetupCompensation(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup compensation sclae
     */
    app.get('/api/setupworkers/setupcompensation/:inActive?', function (req, res) {
            SetupCompensationSRVC.getSetupCompensation(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
}