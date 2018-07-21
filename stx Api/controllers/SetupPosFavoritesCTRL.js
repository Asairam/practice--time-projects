/**
 * Importing required modules
 */
var cfg = require('config');
var setupPosFavoritesSRVC = require('../services/SetupPosFavoritesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    /**
     * This API saves Pos Favorites
     */
    app.post('/api/setup/ticketpreferences/posfavorites', function (req, res) {
        setupPosFavoritesSRVC.saveFavorites(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API is to get Pos Favorites
     */
    app.get('/api/setup/ticketpreferences/posfavorites', function (req, res) {
        setupPosFavoritesSRVC.getFavorites(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};