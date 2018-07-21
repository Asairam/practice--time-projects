/**
 * Importing required modules
 */
var SetupServicePackagesDAO = require('../dao/SetupServicePackagesDAO');

module.exports = {
    saveServicePackages: function(req, done) {
        SetupServicePackagesDAO.saveServicePackages(req, function(err, data) {
            if(data.statusCode == '2033') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data.statusCode == '2038') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data == '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    editServicePackages: function(req, done) {
        SetupServicePackagesDAO.editServicePackages(req, function(err, data) {
            if(data.statusCode == '2033') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data.statusCode == '2038') {
                done({httpCode: 400, statusCode: '2038', result: {}});
            }else if(data == '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getServicePackages: function(req, done) {
        SetupServicePackagesDAO.getServicePackages(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getSetupService :function(req, done) {
        SetupServicePackagesDAO.getSetupService(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    }
};


