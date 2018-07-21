/**
 * Importing required modules
 */
var cfg = require('config');
var favoritesSRVC = require('../services/SetupFavoritesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
    /**
     * This API saves Favorites
     */
    app.put('/api/setupticketpreferences/favorites/:order', function (req, res) {
        favoritesSRVC.updateFavorites(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API gets favorites
     */
    app.get('/api/setupticketpreferences/favorites', function (req, res) {
        favoritesSRVC.getFavorites(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API gets services , Product and Promotion
     */
    app.get('/api/setupticketpreferences/favorites/:type', function (req, res) {
        favoritesSRVC.gettypes(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API gets services , Product and Promotion
     */
    app.get('/api/setupticketpreferences/favorites/types/:type/:name', function (req, res) {
        favoritesSRVC.getselecttypes(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API gets favorites
     */
    app.get('/api/setupticketpreferences/favorites/search/:searchstring', function (req, res) {
        favoritesSRVC.getFavoritesBySearch(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
