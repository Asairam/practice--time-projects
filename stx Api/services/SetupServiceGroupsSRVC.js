/**
 * Importing required modules
 */
var SetupServiceGroupsDAO = require('../dao/SetupServiceGroupsDAO');

module.exports = {
    saveServiceGroups: function(req, done) {
        SetupServiceGroupsDAO.saveServiceGroups(req, function(err, data) {
            if(data.statusCode === '2033') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data.statusCode === '2034') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(err || data.statusCode === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    editServiceGroups: function(req, done) {
        SetupServiceGroupsDAO.editServiceGroups(req, function(err, data) {
            if(data.statusCode === '2033') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data.statusCode === '2034') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    /**
     * This function delet SetupProductLine 
     */
    deleteServiceGroups: function(req, done) {
        SetupServiceGroupsDAO.deleteServiceGroups(req, function(err, data) {
            if (data.statusCode === '2040') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    getServiceGroups: function(req, done) {
        SetupServiceGroupsDAO.getServiceGroups(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getServicesData: function(req, done) {
        SetupServiceGroupsDAO.getServicesData(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            }
      });
    }
};


