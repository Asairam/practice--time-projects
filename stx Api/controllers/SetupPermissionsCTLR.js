/**
 * Importing required modules
 */
var cfg = require('config');
var SetupPermissionsSRVC = require('../services/SetupPermissionsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of setupcompensation Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save Setup Permission
     */
    app.post('/api/setupworkers/setuppermissions', function (req, res) {
        SetupPermissionsSRVC.saveSetupPermissions(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update Permission
     */
    app.put('/api/setupworkers/setuppermissions/:id', function (req, res) {
        if (req.params.id) {
            SetupPermissionsSRVC.editSetupPermissions(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get Permission
     */
    app.get('/api/setupworkers/setuppermissions', function (req, res) {
        SetupPermissionsSRVC.getSetupPermissions(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
}