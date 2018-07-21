/**
 * Importing required modules
 */
var SetupSuppliersDAO = require('../dao/SetupSuppliersDAO');

module.exports = {
    /**
     * DAO call to save Setup Suppliers
     */
    saveSetupSuppliers: function(req, done) {
        SetupSuppliersDAO.saveSetupSuppliers(req, function(err, data) {
            if(data.statusCode === '2033') {
                done({httpCode: 400, statusCode: '2033', result: {}});
            } else if(err || data.statusCode === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    /**
     * This method edit record using id
     */
    editSetupSuppliers: function (req, done) {
        SetupSuppliersDAO.editSetupSuppliers(req, function (err, data) {
            if (data.statusCode === '2033') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err || data.statusCode === '9999') {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * This function lists Setup Suppliers
     */
    getSetupSuppliers: function(req, done) {
        SetupSuppliersDAO.getSetupSuppliers(req, function(err, data) {
          if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    deleteSetupSuppliers: function(req, done) {
        SetupSuppliersDAO.deleteSetupSuppliers(req, function(err, data) {
            if (data.statusCode === '2040') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (data.statusCode === '2041') {
                done({ httpCode: 200, statusCode: data.statusCode, result: {} });
            } else if(err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
}
