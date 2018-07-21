/**
 * Importing required modules
 */
var SetupProductDAO = require('../dao/SetupProductDAO');

module.exports = {
    /**
     * DAO call to save SetupProductLine
     */
    saveSetupProduct: function(req, done) {
        SetupProductDAO.saveSetupProduct(req, function(err, data) {
            if(data.statusCode === '2043') {
                done({httpCode: 400, statusCode: '2043', result: {}});
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
    editSetupProduct: function (req, done) {
        SetupProductDAO.editSetupProduct(req, function (err, data) {
            if (data.statusCode === '2043') {
                done({ httpCode: 400, statusCode: '2043', result: {} });
            } else if (data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists SetupProductLine 
     */
    getSetupProducts: function(req, done) {
        SetupProductDAO.getSetupProducts(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    getInventoryGroup: function(req, done) {
        SetupProductDAO.getInventoryGroup(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    getSetupProduct: function(req, done) {
        SetupProductDAO.getSetupProduct(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    deleteSupplier: function(req, done) {
        SetupProductDAO.deleteSupplier(req, function(err, data) {
            if(data.statusCode == '2041') {
                done({httpCode: 200, statusCode: data.statusCode, result: {}});
            } else if(data == '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
      });
    }
}
