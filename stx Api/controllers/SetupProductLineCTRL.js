/**
 * Importing required modules
 */
var cfg = require('config');
var SetupProductLineSRVC = require('../services/SetupProductLineSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of SetupProductLine Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save setup productline
     */
    app.post('/api/setupinventory/setupproductline', function (req, res) {
        SetupProductLineSRVC.saveSetupProductLine(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update productline data
     */
    app.put('/api/setupinventory/setupproductline/:id', function (req, res) {
        if (req.params.id) {
            SetupProductLineSRVC.editSetupProductLine(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup productline
     */
    app.get('/api/setupinventory/setupproductline/:inActive', function (req, res) {
        if (req.params.inActive) {
            SetupProductLineSRVC.getSetupProductLine(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup productline
     */
    app.delete('/api/setupinventory/setupproductline/:id/:type/:name', function (req, res) {
        if (req.params.id) {
            SetupProductLineSRVC.deleteSetupProductLine(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    app.delete('/api/setupinventory/inventorygroup/:name', function (req, res) {
        if (req.params.name) {
            SetupProductLineSRVC.deleteInventoryGroup(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
}