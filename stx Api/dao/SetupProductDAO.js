/**
 * Importing required modules
 */
var config = require('config');
var async = require('async');
var logger = require('../lib/logger');
var mysql = require('mysql');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var dateFns = require('./../common/dateFunctions');
var fs = require('fs');

module.exports = {
    /**
     * This method create a single record in data_base
     */
    saveSetupProduct: function (req, done) {
        try {
            var setupProductObj = JSON.parse(req.body.productData);
            var records = [];
            var productData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: config.booleanFalse,
                Name: setupProductObj.productName,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                Active__c: setupProductObj.productActive,
                Product_Code__c: setupProductObj.productSKU,
                Average_Cost__c: 1,
                Inventory_Group__c: setupProductObj.inventoryGroup,
                Minimum_Quantity__c: setupProductObj.minimumQuantity,
                Price__c: setupProductObj.price,
                Product_Line__c: setupProductObj.productLine,
                Professional__c: setupProductObj.professional,
                Quantity_On_Hand__c: setupProductObj.averageCostQuantityOnHand,
                Size__c: setupProductObj.size,
                Standard_Cost__c: setupProductObj.standardCost,
                Supplier_Minimum__c: setupProductObj.supplierMinimum,
                Taxable__c: setupProductObj.taxable,
                Unit_of_Measure__c: setupProductObj.productUnitOfMeasure
            }
            if (req.file) {
                productImagePath = config.productFilePath + '/' + productData.Name.split(' ').join('') + '.' + req.file.filename.split('.')[1];
                fs.rename(config.productFilePath + '/' + req.file.filename, productImagePath, function (err) {

                });
                productData.Product_Pic__c = productImagePath.split(' ').join('');
            }
            var selectQuery = ' SELECT max(Id) FROM Product__c';
            var sqlQuery = 'INSERT INTO ' + config.dbTables.setupProductTBL + ' SET ?';
            execute.query(sqlQuery, productData, function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Product_Code__c') > 0) {
                        done(err, { statusCode: '2043' });
                    } else {
                        logger.error('Error in SetupSuppliersDAO - saveSetupSuppliers:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    execute.query(selectQuery, function (err, result1, fields) {
                        if (err) {
                            logger.error('Error in SetupServices dao - saveSetupService:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            if (setupProductObj.suppliers.length > 0) {
                                for (var i = 0; i < setupProductObj.suppliers.length; i++) {
                                    records.push([uniqid(), uniqid(),
                                    config.booleanFalse,
                                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                                    dateFns.getUTCDatTmStr(new Date()),
                                    setupProductObj.suppliers[i].supplierData,
                                    productData.Id
                                    ]);
                                }
                                var insertQuery = 'INSERT INTO ' + config.dbTables.productSupplierTBL
                                    + ' (Id, OwnerId, IsDeleted,CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                    + ' SystemModstamp, Supplier__c, Product__c) VALUES ?';
                                execute.query(insertQuery, [records], function (err, result1, fields) {
                                    if (err) {
                                        logger.error('Error in SetupServices dao - setupResourceData:', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, result);
                                    }
                                });

                            } else {
                                done(err, result);
                            }
                        }
                    });
                }

            });
        } catch (err) {
            logger.error('Unknown error in SetupSuppliersDAO - saveSetupSuppliers:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method fetches all data from Product table
     */
    getSetupProducts: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.setupProductTBL + ' WHERE Product_Line__c = "' + req.params.productline + '" AND Inventory_Group__c = "' + req.params.group + '" and isDeleted=0';
            if (parseInt(req.params.inActive) === config.booleanTrue)
                sqlQuery = sqlQuery + ' AND Active__c = ' + req.params.inActive + ' ORDER BY `Product__c`.`Name` ASC';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupSuppliersDAO - getSetupSuppliers:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupSuppliersDAO - getSetupSuppliers:', err);
            done(err, null);
        }
    },
    getInventoryGroup: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.setupProductLineTBL;
            sqlQuery = sqlQuery + ' WHERE Id = "' + req.params.id + '" and isDeleted=0';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupSuppliersDAO - getSetupSuppliers:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupSuppliersDAO - getSetupSuppliers:', err);
            done(err, null);
        }
    },
    getSetupProduct: function (req, done) {
        try {
            var sqlQuery = 'SELECT  supp.Id as supId, supp.Name, ps.Id as psId from Product__c pro right join ProductSupplier__c as ps '
                + 'on ps.Product__c = pro.Id join Supplier__c as supp on supp.Id = ps.Supplier__c where '
                + 'pro.Id= "' + req.params.id + '"  And ps.IsDeleted = 0';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupSuppliersDAO - getSetupSuppliers:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupSuppliersDAO - getSetupSuppliers:', err);
            done(err, null);
        }
    },
    deleteSupplier: function (req, done) {
        var sqlQuery = 'UPDATE ProductSupplier__c'
            + ' SET IsDeleted = 1'
            + ' WHERE Id = "' + req.params.id + '"';
        execute.query(sqlQuery, function (err, result) {
            if (err) {
                logger.error('Error in SetupClassesDAO - deleteResource:', err);
                done(err, { statusCode: '9999' });
            } else {
                done(err, { statusCode: '2041' });
            }
        });
    },
    /**
     * This method edit single record by using id
     */
    editSetupProduct: function (req, done) {
        try {
            var updateObj = JSON.parse(req.body.productData);
            var queries = '';
            var indexParm = 0;
            var image;
            if (req.file) {
                productImagePath = config.productFilePath + '/' + updateObj.productName.split(' ').join('') + '.' + req.file.filename.split('.')[1];
                if (updateObj.Product_Pic__c) {
                    image = updateObj.filename.split(' ').join('');
                    var path = valuesJSON.image.split('.')[1];
                    if (fs.existsSync(path)) {
                        fs.unlinkSync(path, function (err) {
                        });
                    }
                }
                image = productImagePath;
                fs.rename(config.productFilePath + '/' + req.file.filename, productImagePath, function (err) {
                });
            }
            var sqlQuery = 'UPDATE ' + config.dbTables.setupProductTBL + ' SET  IsDeleted = "' + config.booleanFalse + '", Name = "'
                + updateObj.productName + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date()) + '", Active__c = "' + updateObj.productActive
                + '", Size__c = "' + updateObj.size + '", Unit_of_Measure__c = "' + updateObj.productUnitOfMeasure + '", Product_Line__c = "' + updateObj.productLine
                + '",Inventory_Group__c = "' + updateObj.inventoryGroup + '", Taxable__c = "' + updateObj.taxable + '", Professional__c = "' + updateObj.professional
                if (image !== '' && image !== null && image !== undefined) {
                    sqlQuery += '", Product_Pic__c = "' + image
                }
                sqlQuery += '",Price__c = "' + updateObj.price + '", Standard_Cost__c = "' + updateObj.standardCost + '", Quantity_On_Hand__c = "' + updateObj.averageCostQuantityOnHand
                + '",Supplier_Minimum__c = "' + updateObj.supplierMinimum + '", Product_Code__c = "' + updateObj.productSKU + '", Minimum_Quantity__c = "' + updateObj.minimumQuantity + '" WHERE Id = "' + req.params.id + '"';
                execute.query(sqlQuery, function (err, result) {
                if (err) {
                    if (err.sqlMessage.indexOf('Product_Code__c') > 0) {
                        indexParm++;
                        sendResponse(indexParm, err, { statusCode: '2043' }, done);
                    } else if (err.sqlMessage.indexOf('Name') > 0) {
                        indexParm++;
                        sendResponse(indexParm, err, { statusCode: '2033' }, done);
                    } else {
                        logger.error('Error in SetupSuppliersDAO - editSetupSuppliers:', err);
                        indexParm++;
                        sendResponse(indexParm, err, result, done);

                    }
                } else {
                    var updateQueries = '';
                    var records = [];
                    var deleteQueries = '';
                    /**
                     * to update and insert suppliers
                     */
                    if (updateObj.suppliers && updateObj.suppliers.length > 0) {
                        for (var i = 0; i < updateObj.suppliers.length; i++) {
                            if (updateObj.suppliers[i].psId !== '' && updateObj.suppliers[i].supId !== '') {
                                updateQueries += mysql.format('UPDATE ' + config.dbTables.productSupplierTBL
                                    + ' SET  Supplier__c="' + updateObj.suppliers[i].supId
                                    + '" WHERE Product__c="' + req.params.id + '" And Id="' + updateObj.suppliers[i].psId + '";');
                            }
                            if (updateObj.suppliers[i].psId === '' && updateObj.suppliers[i].supId !== '') {
                                records.push([uniqid(), uniqid(),
                                config.booleanFalse,
                                dateFns.getUTCDatTmStr(new Date()), uniqid(),
                                dateFns.getUTCDatTmStr(new Date()), uniqid(),
                                dateFns.getUTCDatTmStr(new Date()),
                                updateObj.suppliers[i].supId,
                                req.params.id
                                ]);
                            }

                        }
                        if (records && records.length > 0) {
                            var insertQuery = 'INSERT INTO ' + config.dbTables.productSupplierTBL
                                + ' (Id, OwnerId, IsDeleted,CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                + ' SystemModstamp, Supplier__c, Product__c) VALUES ?';
                            execute.query(insertQuery, [records], function (supErr2, supResult2) {
                                if (supErr2) {
                                    logger.error('Error in SetupServices dao - setupResourceData:', supErr2);
                                    done(supErr2, { statusCode: '9999' });
                                } else {
                                    indexParm++;
                                    sendResponse(indexParm, supErr2, supResult2, done);
                                }
                            });
                        }
                        if (updateQueries.length > 0) {
                            execute.query(updateQueries, function (supErr, supResult) {
                                indexParm++;
                                sendResponse(indexParm, supErr, supResult, done);
                            });
                        }
                    } else {
                        indexParm++;
                        sendResponse(indexParm, err, result, done);
                    }

                    /**
                     * to delete suppliers
                     */

                    if (updateObj.deleteSuppliers && updateObj.deleteSuppliers.length > 0) {
                        for (var i = 0; i < updateObj.deleteSuppliers.length; i++) {
                            deleteQueries += mysql.format('UPDATE ProductSupplier__c'
                                + ' SET IsDeleted = 1'
                                + ' WHERE Id = "' + updateObj.deleteSuppliers[i].psId + '";');
                        }
                        if (deleteQueries.length > 0) {
                            execute.query(deleteQueries, function (err, result) {
                                indexParm++;
                                sendResponse(indexParm, err, result, done);
                            });
                        } else {
                            indexParm++;
                            sendResponse(indexParm, null, null, done);
                        }
                    }
                }

            });
        } catch (err) {
            logger.error('Unknown error in SetupSuppliersDAO - editSetupSuppliers:', err);
            done(err, { statusCode: '9999' });
        }
    }
}
function sendResponse(indexParm, err, result, done) {
    if (indexParm === 4) {
        done(err, result);
    }
    if (indexParm === 1) {
        done(err, result);
    }
    if (indexParm === 2) {
        done(err, result);
    }
    if (indexParm === 3) {
        done(err, result);
    }
}