/**
 * Importing required modules
 */
var SetupGoalsDAO = require('../dao/SetupGoalsDAO');

module.exports = {
    /**
     * DAO call to save Setup Goals
     */
    saveSetupGoals: function(req, done) {
        SetupGoalsDAO.saveSetupGoals(req, function(err, data) {
           if(data.statusCode === '2033') {
                done({httpCode: 400, statusCode: '2033', result: {}});
            } else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This method edit record using id
     */
    editSetupGoals: function (req, done) {
        SetupGoalsDAO.editSetupGoals(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists Setup Goals
     */
    getSetupGoals: function(req, done) {
        SetupGoalsDAO.getSetupGoals(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
}
