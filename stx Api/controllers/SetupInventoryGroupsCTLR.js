/**
 * Importing required modules
 */
var cfg = require('config');
var SetupInventoryGroupsSRVC = require('../services/SetupInventoryGroupsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of SetupProductLine Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save setup inventorygroups
     */
    app.post('/api/setupinventory/inventorygroups', function (req, res) {
        SetupInventoryGroupsSRVC.saveInventoryGroups(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update inventorygroups data
     */
    app.put('/api/setupinventory/inventorygroups/:oldInventoryName/:updateInventoryName', function (req, res) {
        if (req.params.oldInventoryName && req.params.updateInventoryName ) {
            SetupInventoryGroupsSRVC.editInventoryGroups(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // 
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup inventorygroups
     */
    app.get('/api/setupinventory/inventorygroups/:groupname?', function (req, res) {
            SetupInventoryGroupsSRVC.getInventoryGroups(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
}