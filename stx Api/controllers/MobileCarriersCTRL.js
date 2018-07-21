/**
 * Importing required modules
 */
var cfg = require('config');
var mobileCarriersSRVC = require('../services/MobileCarriersSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    app.post('/api/setup/clientpreferences/mobilecarriers', function (req, res) {
        mobileCarriersSRVC.savemobileCarriers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/setup/clientpreferences/mobilecarriers', function (req, res) {
        mobileCarriersSRVC.getMobileCarriers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};