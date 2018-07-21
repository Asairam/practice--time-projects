/**
 * Importing required modules
 */
var cfg = require('config');
var SetupSuppliersSRVC = require('../services/SetupSuppliersSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save setup suppliers
     */
    app.post('/api/setupinventory/setupsuppliers', function (req, res) {
        SetupSuppliersSRVC.saveSetupSuppliers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update suppliers data
     */
    app.put('/api/setupinventory/setupsuppliers/:id', function (req, res) {
        if (req.params.id) {
            SetupSuppliersSRVC.editSetupSuppliers(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // 
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup suppliers
     */
    app.get('/api/setupinventory/setupsuppliers/:inActive', function (req, res) {
        if (req.params.inActive) {
            SetupSuppliersSRVC.getSetupSuppliers(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // 
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    app.delete('/api/setupinventory/setupsuppliers/:id/:name/:type', function (req, res) {
        if (req.params.id) {
            SetupSuppliersSRVC.deleteSetupSuppliers(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
}