/**
 * Importing required modules
 */
var ReportsDAO = require('../dao/ReportsDAO');
var config = require('config');
var fs = require('fs');

module.exports = {
    /**
     * Dao call to book appointment
     */

    getTicketReports: function (req, done) {
        ReportsDAO.getTicketReports(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    getCashInOutRecords: function (req, done) {
        ReportsDAO.getCashInOutRecords(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1011', result: data });
            }
        });
    },
    getDailyCashDrawerRecords: function (req, done) {
        ReportsDAO.getDailyCashDrawerRecords(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1012', result: data });
            }
        });
    },
    getDailyTotalSheetRecords: function (req, done) {
        ReportsDAO.getDailyTotalSheetRecords(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1012', result: data });
            }
        });
    },
    getServiceSalesRecords: function (req, done) {
        ReportsDAO.getServiceSalesRecords(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1012', result: data });
            }
        });
    }

    };
