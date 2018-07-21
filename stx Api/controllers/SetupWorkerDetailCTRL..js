/**
 * Importing required modules
 */
var cfg = require('config');
var SetupWorkerDetailSRVC = require('../services/SetupWorkerDetailSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var multer = require('multer');
var fs = require('fs');
// --- Start of Controller
module.exports.controller = function (app, passport) {
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            var uplLoc = cfg.workerFilePath;
            if (!fs.existsSync(uplLoc)) {
                fs.mkdirSync(uplLoc);
            }
            callback(null, uplLoc);
        }, filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
    var uploadWorkerImage = multer({ storage: storage }).single('workerImage');
    app.put('/api/setupworkers/setupworkerdetail/:id?', function (req, res) {
        uploadWorkerImage(req, res, function (err) {
            if (err) {
                logger.error('Error uploading Company Logo', err);
            } else {
                SetupWorkerDetailSRVC.editWorkerDetail(req, function (data) {
                    utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
                });
            }
        });

    });
    app.get('/api/setupworkers/setupworkerdetail', function (req, res) {
        SetupWorkerDetailSRVC.getWorkerDetail(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    app.get('/api/setupworkers/setupworkerdetail/workerservices/:id?', function (req, res) {
        SetupWorkerDetailSRVC.getWorkerservicesByUser(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.put('/api/setupworkers/setupworkerservice', function (req, res) {
        SetupWorkerDetailSRVC.editWorkerService(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /**
     * To Create Worker
     */
    app.post('/api/setupworkers', function (req, res) {
        SetupWorkerDetailSRVC.createWorker(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
};