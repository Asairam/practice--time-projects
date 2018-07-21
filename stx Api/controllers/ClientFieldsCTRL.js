/**
 * Importing required modules
 */
var cfg = require('config');
var clientFieldsSRVC = require('../services/ClientFieldsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
    /**
     * This API saves Client Preferences Client Fields
     */
    app.post('/api/setup/clientpreferences/clientfields', function (req, res) {
        clientFieldsSRVC.saveClientFields(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API gets Client Preferences Client Fields
     */
    app.get('/api/setup/clientpreferences/clientfields', function (req, res) {
        clientFieldsSRVC.getClientFields(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
