/**
 * Importing required modules
 */
var cfg = require('config');
var paymentTypesSRVC = require('../services/PaymentTypesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var multer = require('multer');
var fs = require('fs');

module.exports.controller = function (app, passport) {
    /**
     * To upload paymentTypes Logo
     */
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            var paymentObj = '';
            try {
                paymentObj = JSON.parse(req.body.paymentListNew);
            } catch (err) {
                paymentObj = req.body.paymentListNew;
            }
            var uplLoc = cfg.paymentTypesFilePath + '/' + paymentObj.Name;
            if (!fs.existsSync(uplLoc)) {
                fs.mkdirSync(uplLoc);
            }
            callback(null, uplLoc);
        }, filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
    var uploadPaymentTypesLogo = multer({ storage: storage }).single('paymentLogo');
    /**
     * This API saves paymentTypes
     */
    app.post('/api/setup/company/paymenttypes', function (req, res) {
        uploadPaymentTypesLogo(req, res, function (err) {
            try {
                paymenttypesObj = JSON.parse(req.body.paymentListNew);
            } catch (err) {
                paymenttypesObj = req.body.paymentListNew;
            }
            if (err) {
                logger.error('Error uploading paymentTypes Logo', err);
            } else {
                paymentTypesSRVC.savePaymentTypes(req, paymenttypesObj, function (data) {
                    utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
                });
            }
        });
    });
    /**
     * This API gets paymentTypes
     */
    app.get('/api/setup/company/paymenttypes', function (req, res) {
        paymentTypesSRVC.getPaymentTypes(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to DELETE setup paymentType
     */
    app.delete('/api/setup/company/paymenttypes/:id/:type/:name/:abbrevation/:order', function (req, res) {
        if (req.params.id) {
            paymentTypesSRVC.deletePaymentType(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API edit paymentTypes
     */
    app.put('/api/setup/company/paymenttypes/:id', function (req, res) {
        uploadPaymentTypesLogo(req, res, function (err) {
            try {
                paymenttypesObj = JSON.parse(req.body.paymentListNew);
            } catch (err) {
                paymenttypesObj = req.body.paymentListNew;
            }
            if (err) {
                logger.error('Error uploading paymentTypes Logo', err);
            } else {
                paymentTypesSRVC.editPaymentTypes(req, paymenttypesObj, function (data) {
                    utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
                });
            }
        });

    });
    /**
    * This API edit paymentTypes
    */
    app.put('/api/setup/company/paymenttype/sortorder', function (req, res) {
        paymentTypesSRVC.editPaymentTypeSortorder(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
