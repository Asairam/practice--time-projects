/**
 * Importing required modules
 */
var InventoryDAO = require('../dao/InventoryDAO');
var config = require('config');
var fs = require('fs');

module.exports = {
    /**
     * Dao call to book appointment
     */

    getproductsBySKU: function (req, done) {
        InventoryDAO.getproductsBySKU(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },

    getProductsList: function (req, done) {
        InventoryDAO.getProductsList(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    saveInventoryUsageData: function (req, done) {
        InventoryDAO.saveInventoryUsageData(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    getPurchaseOrdersData: function (req, done) {
        InventoryDAO.getPurchaseOrdersData(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    }, 
    editPurchaseData:  function (req, done) {
        InventoryDAO.editPurchaseData(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    getsuppliers: function (req, done) {
        InventoryDAO.getsuppliers(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    getProductsBySuppliers:function (req, done) {
        InventoryDAO.getProductsBySuppliers(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    checkIfSupplierAndOrderDateisExist:function (req, done) {
        InventoryDAO.checkIfSupplierAndOrderDateisExist(req, function (err, data) {
            if(data.statusCode === '2033') {
                done({httpCode: 400, statusCode: '2033', result: {}});
            } else if(data === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    },
    savePurchaseOrdersData:function (req, done) {
        InventoryDAO.savePurchaseOrdersData(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    PurchaseOrdersDataBySupplierId: function (req, done) {
        InventoryDAO.PurchaseOrdersDataBySupplierId(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    searchProducts: function (req, done) {
        InventoryDAO.searchProducts(req, function (err, data) {
            if (err) {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1011', result: data});
            }
        });
    },
    updateProducts: function (req, done) {
        InventoryDAO.updateProducts(req, function (err, data) {
            if(data.statusCode === '2043') {
                done({httpCode: 400, statusCode: '2043', result: {}});
            } else if(data === '9999') {
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else {
                done({httpCode: 200, statusCode: '1001', result: data});
            }
        });
    }
};
