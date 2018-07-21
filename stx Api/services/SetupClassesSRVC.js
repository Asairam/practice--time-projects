/**
 * Importing required modules
 */
var SetupClassesDAO = require('../dao/SetupClassesDAO');

module.exports = {
    /**
     * DAO call to save Classes
     */
    saveClasses: function (req, done) {
        SetupClassesDAO.saveClasses(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2034') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err || data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    editClasses: function(req, done) {
        SetupClassesDAO.editClasses(req, function(err, data) {
            if(data.statusCode == '2033') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data.statusCode == '2045') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data.statusCode == '2046') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data.statusCode == '2047') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data == '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            }else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    getResource: function(req, done) {
        SetupClassesDAO.getResource(req, function(err, data) {
             if(data == '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    deleteResource: function(req, done) {
        SetupClassesDAO.deleteResource(req, function(err, data) {
            if(data.statusCode == '2041') {
                done({httpCode: 200, statusCode: data.statusCode, result: {}});
            } else if(data == '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    },
    deleteClasses: function(req, done) {
        SetupClassesDAO.deleteClasses(req, function(err, data) {
            if(data.statusCode == '2041') {
                done({httpCode: 200, statusCode: data.statusCode, result: {}});
            }if(data.statusCode == '2040') {
                done({httpCode: 400, statusCode: data.statusCode, result: {}});
            } else if(data == '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    }
};


