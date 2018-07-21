/**
 * Importing required modules
 */
var cfg = require('config');
var marketingSetSRVC = require('../services/MarketingSetSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var multer = require('multer');
var fs = require('fs');

module.exports.controller = function (app, passport) {
    app.post('/api/marketing/marketingset', function (req, res) {
        marketingSetSRVC.saveMarketingset(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API gets marketingset
     */
    app.get('/api/marketing/marketingset/:active', function (req, res) {
        marketingSetSRVC.getMarketingsets(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
     /**
     * This API gets marketingset by Id
     */
    app.get('/api/marketing/marketingsetbyid/:id', function (req, res) {
        marketingSetSRVC.getMarketingsetById(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
     /**
     * This API gets marketingset
     */
    app.get('/api/marketing/marketingset/email/retrievemarketingemaillist', function (req, res) {
        marketingSetSRVC.getEmailList(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API edit marketingset
     */
    app.put('/api/marketing/marketingset/:id', function (req, res) {
        marketingSetSRVC.editMarketingset(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });

    });
     /**
     * This API delete marketingset
     */
    app.delete('/api/marketing/marketingset/:id', function (req, res) {
        marketingSetSRVC.deleteMarketingset(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
      /**
     * This API to get rewards
     */
    app.get('/api/marketing/rewards', function (req, res) {
        marketingSetSRVC.getrewards(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
     /**
     * This API to get rewards based on client
     */
    app.get('/api/marketing/rewards/:id/:date', function (req, res) {
        marketingSetSRVC.getClientRewards(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * This API to post rewards
     */
    app.post('/api/marketing/rewardspost', function (req, res) {
        marketingSetSRVC.saveRewards(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    /**
     * This API to put rewards
     */
    app.put('/api/marketing/rewardsUpdate/:id', function (req, res) {
        marketingSetSRVC.updateRewards(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    
    /**
     * This API to get preference
     */
    app.get('/api/marketing/preference/:name', function (req, res) {
        marketingSetSRVC.getPreference(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};
