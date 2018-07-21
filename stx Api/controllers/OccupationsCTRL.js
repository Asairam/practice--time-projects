/**
 * Importing required modules
 */
var cfg = require('config');
var fs = require('fs');
var occupationsSRVC = require('../services/OccupationsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    /**
     * This API serves Client Preferences Occupations
     */
    app.post('/api/setup/clientpreferences/occupations', function (req, res) {
        occupationsSRVC.saveOccupations(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get Client Preferences Occupations
     */
    app.get('/api/setup/clientpreferences/occupations', function (req, res) {
        occupationsSRVC.getOccupations(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};