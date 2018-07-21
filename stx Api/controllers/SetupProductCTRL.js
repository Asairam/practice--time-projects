/**
 * Importing required modules
 */
var cfg = require('config');
var SetupProductRVC = require('../services/SetupProductSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var multer = require('multer');
var fs = require('fs');

// --- Start of SetupProductLine Controller
module.exports.controller = function (app, passport) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            var uplLoc = cfg.productFilePath;
            if (!fs.existsSync(uplLoc)) {
                fs.mkdirSync(uplLoc);
            }
            callback(null, uplLoc);
        }, filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
    var uploadProductImage = multer({ storage: storage }).single('filename');
    /**
     * This API is to save setup suppliers
     */
    app.post('/api/setupinventory/setupproduct', function (req, res) {
        uploadProductImage(req, res, function (err) {
            console.log(req.file, req.files)
            if (err) {
                logger.error('Error uploading product Logo', err);
            } else {
                SetupProductRVC.saveSetupProduct(req, function (data) {
                    utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
                });
            }
        });
    });
    /**
     * This method is to update suppliers data
     */
    app.put('/api/setupinventory/setupproduct/:id', function (req, res) {
        if (req.params.id) {
            uploadProductImage(req, res, function (err) {
                if (err) {
                    logger.error('Error uploading product Logo', err);
                } else {
                    SetupProductRVC.editSetupProduct(req, function (data) {
                        utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
                    });
                }
            });
        } else {
            // 
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup product
     */
    app.get('/api/setupinventory/setupproducts/:inActive/:productline/:group', function (req, res) {
        if (req.params.inActive) {
            SetupProductRVC.getSetupProducts(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // 
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup inventory groups
     */
    app.get('/api/setupinventory/setupproducts/inventorygroup/:id', function (req, res) {
        if (req.params.id) {
            SetupProductRVC.getInventoryGroup(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // 
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    app.get('/api/setupinventory/setupproduct/:id', function (req, res) {
        if (req.params.id) {
            SetupProductRVC.getSetupProduct(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // 
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    app.delete('/api/setupinventory/setupproduct/:id', function (req, res) {
        SetupProductRVC.deleteSupplier(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
}