/**
 * Importing required modules
 */
var paymentTypesDAO = require('../dao/PaymentTypesDAO');
var config = require('config');
var fs = require('fs');
module.exports = {
    /**
     * Dao call to save PaymentTypes
     */
    savePaymentTypes: function (req, paymenttypesObj, done) {
        paymentTypesDAO.savePaymentTypes(req, paymenttypesObj, function (err, data) {
            if (data.statusCode === '2059') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2060') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2061') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (data) {
                var renameLoc = config.paymentTypesFilePath + '/' + paymenttypesObj.Name;
                if (!fs.existsSync(renameLoc)) {
                    fs.mkdirSync(renameLoc);
                }

                if (req.file) {
                    renameLoc = renameLoc + '/' + req.file.filename;
                    fs.rename(config.paymentTypesFilePath + '/' + paymenttypesObj.Name + '/'
                        + req.file.filename, renameLoc, function () {
                            fs.rmdir(config.paymentTypesFilePath + '/' + paymenttypesObj.Name, function (err) {
                            });
                        });
                }
                done({ httpCode: 200, statusCode: '1011', result: data });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to save PaymentTypes
     */
    editPaymentTypes: function (req, paymenttypesObj, done) {
        paymentTypesDAO.editPaymentTypes(req, paymenttypesObj, function (err, data) {
            if (data.statusCode === '2059') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2060') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2061') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else if (data) {
                var renameLoc = config.paymentTypesFilePath + '/' + paymenttypesObj.Name;
                if (!fs.existsSync(renameLoc)) {
                    fs.mkdirSync(renameLoc);
                }

                if (req.file) {
                    renameLoc = renameLoc + '/' + req.file.filename;
                    fs.rename(config.paymentTypesFilePath + '/' + paymenttypesObj.Name + '/'
                        + req.file.filename, renameLoc, function () {
                            fs.rmdir(config.paymentTypesFilePath + '/' + paymenttypesObj.Name, function (err) {
                            });
                        });
                }
                done({ httpCode: 200, statusCode: '1011', result: data });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to save PaymentTypes
     */
    editPaymentTypeSortorder: function (req, done) {
        paymentTypesDAO.editPaymentTypeSortorder(req, function (err, data) {
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
    getPaymentTypes: function (req, done) {
        paymentTypesDAO.getPaymentTypes(req, function (err, data) {
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
        paymentTypesDAO.deletePaymentType(req, function (err, data) {
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
