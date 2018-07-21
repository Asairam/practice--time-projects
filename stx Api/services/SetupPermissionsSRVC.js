/**
 * Importing required modules
 */
var SetupPermissionsDAO = require('../dao/SetupPermissionsDAO');

module.exports = {
    /**
     * DAO call to save Setup Permissions
     */
    saveSetupPermissions: function(req, done) {
        SetupPermissionsDAO.saveSetupPermissions(req, function(err, data) {
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
    editSetupPermissions: function (req, done) {
        SetupPermissionsDAO.editSetupPermissions(req, function (err, data) {
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
    getSetupPermissions: function(req, done) {
        SetupPermissionsDAO.getSetupPermissions(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
}
