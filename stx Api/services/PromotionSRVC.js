/**
 * Importing required modules
 */
var promotionDAO = require('../dao/PromotionDAO');
var config = require('config');
var fs = require('fs');
module.exports = {
    /**
     * Dao call to save PaymentTypes
     */
    savePromotion: function (req, done) {
        promotionDAO.savePromotion(req, function (err, data) {
            if (data.statusCode === '2073') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2074') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2075') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to save PaymentTypes
     */
    editPromotion: function (req, done) {
        promotionDAO.editPromotion(req, function (err, data) {
            if (data.statusCode === '2059') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2060') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2061') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to save PaymentTypes
     */
    editPromotionSortOrder: function (req, done) {
        promotionDAO.editPromotionSortOrder(req, function (err, data) {
            if (data.statusCode === '2061') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '1001') {
                done({ httpCode: 200, statusCode: '1001', result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: {} });
            }
        });
    },
    /**
     * Dao call to lists the PaymentTypes
     */
    getPromotions: function (req, done) {
        promotionDAO.getPromotions(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function delet PaymentTypes 
     */
    deletePaymentType: function (req, done) {
        promotionDAO.deletePaymentType(req, function (err, data) {
            if (data.statusCode === '2040') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2041') {
                done({ httpCode: 200, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
};
