
/**
 * Importing required modules
 */
var SetupMembershipsDao = require('../dao/SetupMembershipsDAO');

module.exports = {
    /**
     * DAO call to save Memberships
     */
    saveMemberships: function(req, done) {
        SetupMembershipsDao.saveMemberships(req, function(err, data) {
            if(data.statusCode === '2033') {
                done({httpCode: 400, statusCode: '2033', result: {}});
            } else if(data === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This method edit record using id
     */
    editMemberships: function (req, done) {
        SetupMembershipsDao.editMemberships(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists Memberships
     */
    getMemberships: function(req, done) {
        SetupMembershipsDao.getMemberships(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
}
