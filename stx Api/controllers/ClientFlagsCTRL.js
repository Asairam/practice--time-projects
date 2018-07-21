/**
 * Importing required modules
 */
var cfg = require('config');
var clientFlagsSRVC = require('../services/ClientFlagsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save Client Preferences Client Flags
     */
    app.post('/api/setup/clientpreferences/clientflags', function (req, res) {
        clientFlagsSRVC.saveClientFlags(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get Client Flags
     */
    app.get('/api/setup/clientpreferences/clientflags', function (req, res) {
        clientFlagsSRVC.getClientFlags(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
