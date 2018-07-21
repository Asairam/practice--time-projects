var cfg = require('config');
var fs = require('fs');
var referFriendService = require('../services/ReferFriendSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function(app, passport) {
    app.post('/api/appointment/referfriend', function(req, res) {
        referFriendService.referFriend(req, function(data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/appointment/referfriend', function(req, res) {
        referFriendService.getreferFriend(req, function(data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
