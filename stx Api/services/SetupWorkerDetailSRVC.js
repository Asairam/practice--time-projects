/**
 * Importing required modules
 */
var SetupWorkerDetailDAO = require('../dao/SetupWorkerDetailDAO');
var logger = require('../lib/logger');
module.exports = {
    editWorkerDetail: function (req, done) {
        SetupWorkerDetailDAO.editWorkerDetail(req, function (err, data) {
            if(data.statusCode == '1001') {
                done({ httpCode: 200, statusCode: '1001', result: data });
            } else if (data.statusCode == '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode == '2038') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err && err.errno === 1062) {
                done({ httpCode: 500, statusCode: '9998', result: err.sqlMessage });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: data});
            }
        });
    },
    getWorkerDetail: function (req, done) {
        SetupWorkerDetailDAO.getWorkerDetail(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    getWorkerservicesByUser: function (req, done) {
        SetupWorkerDetailDAO.getWorkerservicesByUser(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    // editWorkerService: function (req, done) {
    //     SetupWorkerDetailDAO.editWorkerService(req, function (err, data) {
    //         if (err) {
    //             done({ httpCode: 500, statusCode: '9999', result: {} });
    //         } else {
    //             done({ httpCode: 200, statusCode: '1001', result: data });
    //         }
    //     });
    // },
    // createWorker: function (req, done) {
    //     SetupWorkerDetailDAO.createWorker(req, function (err, data) {
    //         if (err && err.errno === 1062) {
    //             done({ httpCode: 500, statusCode: '9998', result: err.sqlMessage });
    //         } else if (err) {
    //             done({ httpCode: 500, statusCode: '9999', result: {} });
    //         } else {
    //             done({ httpCode: 200, statusCode: '1001', result: data });
    //         }
    //     });
    // }
};
