/**
 * Importing required modules
 */
var cfg = require('config');
var SetupPosDevicesSRVC = require('../services/SetupPosDevicesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of SetupProductLine Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save POS Devices
     */
    app.post('/api/setup/ticketpreferences/posdevices', function (req, res) {
        SetupPosDevicesSRVC.savePosDevices(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update POS Devices data
     */
    app.put('/api/setup/ticketpreferences/posdevices/:id', function (req, res) {
        if (req.params.id) {
            SetupPosDevicesSRVC.editPosDevices(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get POS Devices
     */
    app.get('/api/setup/ticketpreferences/posdevices', function (req, res) {
            SetupPosDevicesSRVC.getPosDevices(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        
    });

    /**
     * This API is to get POS
     */
    app.get('/api/setup/ticketpreferences/pos', function (req, res) {
        SetupPosDevicesSRVC.getPos(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    
});
/**
     * This API is to save POS Devices
     */
    app.post('/api/setup/ticketpreferences/pos', function (req, res) {
        SetupPosDevicesSRVC.savePos(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
}