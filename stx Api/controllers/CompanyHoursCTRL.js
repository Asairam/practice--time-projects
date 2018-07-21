/**
 * Importing required modules
 */
var cfg = require('config');
var companyHoursSRVC = require('../services/CompanyHoursSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {
    /**
     * This API saves company hours
     */
    app.post('/api/setup/company/companyhours', function (req, res) {
        companyHoursSRVC.saveCompanyHours(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API gets company hours
     */
    app.get('/api/setup/company/companyhours', function (req, res) {
        companyHoursSRVC.getCompanyHours(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.put('/api/setup/company/companyhours/:id', function (req, res) {
        companyHoursSRVC.updateCompanyHours(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * Getting the custom hours timings
     */
    app.get('/api/setup/company/customhours/:id', function (req, res) {
        companyHoursSRVC.getCompanyCustomHours(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
/**
     * This API saves custom hours
     */
    app.post('/api/setup/company/customhours', function (req, res) {
        companyHoursSRVC.saveCustomHours(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
/**
     * Getting the custom hours timings
     */
    app.delete('/api/setup/company/customhours/:id', function (req, res) {
        companyHoursSRVC.deleteCompanyCustomHours(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * Getting the custom hours timings
     */
    app.put('/api/setup/company/customhours', function (req, res) {
        companyHoursSRVC.updateCompanyCustomHours(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

};
