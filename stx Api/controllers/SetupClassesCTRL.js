/**
 * Importing required modules
 */
var cfg = require('config');
var fs = require('fs');
var SetupClassesSRVC = require('../services/SetupClassesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

// --- Start of Controller
module.exports.controller = function (app, passport) {
    app.put('/api/setupservices/classes/:id', function (req, res) {
        SetupClassesSRVC.editClasses(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/setupservices/resource/:id', function (req, res) {
        SetupClassesSRVC.getResource(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.post('/api/setupclasses/classes', function (req, res) {
        SetupClassesSRVC.saveClasses(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.delete('/api/setupservices/resource/:srId', function (req, res) {
        SetupClassesSRVC.deleteResource(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.delete('/api/setupservices/classes/:id/:type/:name', function (req, res) {
        SetupClassesSRVC.deleteClasses(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};