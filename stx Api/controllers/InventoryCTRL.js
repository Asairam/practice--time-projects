/**
 * Importing required modules
 */
var cfg = require('config');
var InventorySRVC = require('../services/InventorySRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');

module.exports.controller = function (app, passport) {

    /**
     * This api is to get products by SKU
     */
    app.get('/api/inventory/usage/:sku', function (req, res) {
        InventorySRVC.getproductsBySKU(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
     * listing only products from products
     */
    app.get('/api/inventory/products', function (req, res) {
        InventorySRVC.getProductsList(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    /*
    * This api is for save the inventory usage data into inventory usage table
    */
    app.post('/api/Inventory/usage', function (req, res) {
        InventorySRVC.saveInventoryUsageData(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    /*
    * This api to get purchase orders data for listing
    */
    app.get('/api/Inventory/purcahseorders', function (req, res) {
        InventorySRVC.getPurchaseOrdersData(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
       * This api to Edit the purchase orders data
       */
    app.put('/api/Inventory/purcahseorders/:id', function (req, res) {
        InventorySRVC.editPurchaseData(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });

    /*
    * This api to get suppliers data from suppliers table for create purchase order dropdown
    */
    app.get('/api/Inventory/purcahseorders/suppliers', function (req, res) {
        InventorySRVC.getsuppliers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
       * This api to get suppliers data from suppliers table for create purchase order dropdown
       */
    app.get('/api/Inventory/purcahseorders/productsbysuppliers/:sku/:supplierid', function (req, res) {
        InventorySRVC.getProductsBySuppliers(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
        * This api to check the uniqness for supplier and orderDate - purchaseorders
        */
    app.get('/api/inventory/purcahseorders/supplieridandorderdate/:supplierid/:orderdate', function (req, res) {
        InventorySRVC.checkIfSupplierAndOrderDateisExist(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.post('/api/Inventory/purcahseorders', function (req, res) {
        InventorySRVC.savePurchaseOrdersData(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    app.get('/api/Inventory/purcahseorders/:id', function (req, res) {
        InventorySRVC.PurchaseOrdersDataBySupplierId(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
    * Manage Inventory 
    */
    app.post('/api/setupinventory/manage/searchproducts', function (req, res) {
        InventorySRVC.searchProducts(req, function (data) {
            utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
        });
    });
    /*
    * Update Manage Inventory 
    */
   app.put('/api/setupinventory/manage/products', function (req, res) {
    InventorySRVC.updateProducts(req, function (data) {
        utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
    });
});

};
