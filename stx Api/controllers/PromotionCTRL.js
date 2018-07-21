/**
 * Importing required modules
 */
var cfg = require('config');
var promotionSRVC = require('../services/PromotionSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var multer = require('multer');
var fs = require('fs');

module.exports.controller = function (app, passport) {
    /**
     * This API is to save Promotion
     */
    app.post('/api/marketing/promotion', function (req, res) {
        promotionSRVC.savePromotion(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API gets Promotion
     */
    app.get('/api/marketing/promotion', function (req, res) {
        promotionSRVC.getPromotions(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to DELETE setup paymentType
     */
    app.delete('/api/setup/company/Promotion/:id/:type/:name/:abbrevation/:order', function (req, res) {
        if (req.params.id) {
            promotionSRVC.deletePaymentType(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API edit Promotion
     */
    app.put('/api/marketing/promotion/:id', function (req, res) {
        promotionSRVC.editPromotion(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });

    });
    /**
    * This API edit Promotion
    */
    app.put('/api/marketing/promotion/sortorder', function (req, res) {
        promotionSRVC.editPromotionSortOrder(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
