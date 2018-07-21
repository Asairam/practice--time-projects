var cfg = require('config');
var OnlineGiftsService = require('../services/OnlineGiftsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function(app, passport) {
    app.post('/api/appointment/onlinegifts', function(req, res) {
        OnlineGiftsService.saveOnlineGifts(req, function(data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/appointment/onlinegifts', function(req, res) {
        OnlineGiftsService.getOnlineGifts(req, function(data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
