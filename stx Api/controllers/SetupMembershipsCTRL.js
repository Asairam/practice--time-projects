/**
 * Importing required modules
 */
var cfg = require('config');
var SetupMembershipsSRVC = require('../services/SetupMembershipsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of SetupMemberships Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save setup memberships
     */
    app.post('/api/setupmemberships', function (req, res) {
        SetupMembershipsSRVC.saveMemberships(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update setup memberships data
     */
    app.put('/api/setupmemberships/:id', function (req, res) {
        if (req.params.id) {
            SetupMembershipsSRVC.editMemberships(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // 
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get setup memberships
     */
    app.get('/api/setupmemberships/:inActive', function (req, res) {
            SetupMembershipsSRVC.getMemberships(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
}