/**
 * Importing required modules
 */
var workerGoalsDAO = require('../dao/WorkerGoalsDAO');

var SetupWorkerDetailDAO = require('../dao/SetupWorkerDetailDAO');

module.exports = {
    /**
     * Dao call to save WorkerGoals
     */
    saveWorkerGoals: function(req, done) {
        SetupWorkerDetailDAO.editWorkerDetail(req, function(err, data) {
            if (data.statusCode === '2070') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }else if(data.statusCode == '2041') {
                done({httpCode: 200, statusCode: data.statusCode, result: {}});
            } else if(data == '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * Dao call to lists the eWorkerGoals
     */
    getWorkerGoals: function(req, done) {
        workerGoalsDAO.getWorkerGoals(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    updtaeCalculateGoal: function(req, done) {
        workerGoalsDAO.updtaeCalculateGoal(req, function(err, data) {
            if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            }else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    }
};
