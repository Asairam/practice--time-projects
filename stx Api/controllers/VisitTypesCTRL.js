/**
 * Importing required modules
 */
var cfg = require('config');
var visitTypesSRVC = require('../services/VisitTypesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    /**
     * This API saves Client Visit Types
     */
    app.post('/api/setup/clientpreferences/visittypes', function (req, res) {
        visitTypesSRVC.saveVisitTypes(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get Client Visit Types
     */
    app.get('/api/setup/clientpreferences/visittypes', function (req, res) {
        visitTypesSRVC.getVisitTypes(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
     /**
     * This API is to get Client Visit Types
     */
    app.get('/api/setup/clientpreferences/visittype/active', function (req, res) {
        visitTypesSRVC.getActiveVisitTypes(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};