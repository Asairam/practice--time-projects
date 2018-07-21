/**
 * Importing required modules
 */
var cfg = require('config');
var ReportsSRVC = require('../services/ReportsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {
    /**
     * This api is to book appointment
     */
    app.post('/api/reports/ticket/date', function (req, res) {
        ReportsSRVC.getTicketReports(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.post('/api/reports/cashinout/date', function (req, res) {
        ReportsSRVC.getCashInOutRecords(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    // Daily Cash Drawer
    app.get('/api/reports/dailyCashDrawer/:seledate', function (req, res) {
        ReportsSRVC.getDailyCashDrawerRecords(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
	 *  This action method retrieves the daily report sheet for selected date
	 */
    app.get('/api/reports/dailytotalsheet/:begindate/:enddate', function (req, res) {
        ReportsSRVC.getDailyTotalSheetRecords(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
	 *  This action method retrieves the service slaes report sheet for selected data
	 */
    app.post('/api/reports/serviceslaes', function (req, res) {
        ReportsSRVC.getServiceSalesRecords(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
