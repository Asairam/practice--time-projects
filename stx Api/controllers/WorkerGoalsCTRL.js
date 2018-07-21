/**
 * Importing required modules
 */
var cfg = require('config');
var workerGoalsSRVC = require('../services/WorkerGoalsSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function(app, passport) {
    /**
     * This API saves workergoals
     */
    app.post('/api/setup/workers/workergoals', function (req, res) {
        workerGoalsSRVC.saveWorkerGoals(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API gets workergoals
     */
    app.get('/api/setup/workers/workergoals/:type/:id', function (req, res) {
        workerGoalsSRVC.getWorkerGoals(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.put('/api/setup/workers/workergoals/calculategoal/:id', function (req, res) {
        workerGoalsSRVC.updtaeCalculateGoal(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
