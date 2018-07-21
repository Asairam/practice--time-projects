/**
 * Importing required modules
 */
var cfg = require('config');
var SetupGoalsSRVC = require('../services/SetupGoalsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of setupcompensation Controller
module.exports.controller = function (app, passport) {
    /**
     * This API is to save Setup Goals
     */
    app.post('/api/setupworkers/setupgoals', function (req, res) {
        SetupGoalsSRVC.saveSetupGoals(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update Goals
     */
    app.put('/api/setupworkers/setupgoals/:id', function (req, res) {
        if (req.params.id) {
            SetupGoalsSRVC.editSetupGoals(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This API is to get Goals
     */
    app.get('/api/setupworkers/setupgoals', function (req, res) {
        SetupGoalsSRVC.getSetupGoals(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
    });
}