/**
 * Importing required modules
 */
var cfg = require('config');
var fs = require('fs');
var SetupResourcesSRVC = require('../services/SetupResourcesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    /**
     * This method is to create resources
     */
    app.post('/api/setupservices/resources', function (req, res) {
        SetupResourcesSRVC.saveResources(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This method is to update resources data
     */
    app.put('/api/setupservices/resources/:id', function (req, res) {
        if (req.params.id) {
            SetupResourcesSRVC.editResources(req, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } else {
            // The specified user data is invalid
            utils.sendResponse(res, 400, '2039', {});
        }
    });
    /**
     * This method is to fetch all data from resources table
     */
    app.get('/api/setupservices/resources/:isActive', function (req, res) {
        SetupResourcesSRVC.getResources(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};