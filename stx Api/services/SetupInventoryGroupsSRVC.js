/**
 * Importing required modules
 */
var SetupInventoryGroupsDAO = require('../dao/SetupInventoryGroupsDAO');

module.exports = {
    /**
     * DAO call to save InventoryGroups
     */
    saveInventoryGroups: function(req, done) {
        SetupInventoryGroupsDAO.saveInventoryGroups(req, function(err, data) {
            if(data.statusCode === '2033') {
                done({httpCode: 400, statusCode: '2033', result: {}});
            } else if(data.statusCode === '2036'){
                done({httpCode: 400, statusCode: '2036', result: {}});
            }else if(data === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This method edit record using id
     */
    editInventoryGroups: function (req, done) {
        SetupInventoryGroupsDAO.editInventoryGroups(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if(data.statusCode === '2036'){
                done({httpCode: 400, statusCode: '2036', result: {}});
            } else if (data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists InventoryGroups
     */
    getInventoryGroups: function(req, done) {
        SetupInventoryGroupsDAO.getInventoryGroups(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
}
