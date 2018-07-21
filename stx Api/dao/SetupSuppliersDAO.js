/**
 * Importing required modules
 */
var config = require('config');
var async = require('async');
var logger = require('../lib/logger');
var mysql = require('mysql');
var moment = require('moment');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * This method create a single record in data_base
     */
    saveSetupSuppliers: function (req, done) {
        try {
            var setupInventoryObj = req.body.suppliersData;
            var suppliersData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: config.booleanFalse,
                Name: setupInventoryObj.name,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                Active__c: setupInventoryObj.active,
                Account_Number__c: setupInventoryObj.accountNumber,
                Email__c: setupInventoryObj.email,
                Phone__c: setupInventoryObj.phone,
                Sales_Consultant_1__c: setupInventoryObj.salesConsultant

            }
            var sqlQuery = 'INSERT INTO ' + config.dbTables.suppliersTBL + ' SET ?';
            execute.query(sqlQuery, suppliersData, function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2033' });
                    } else {
                        logger.error('Error in SetupSuppliersDAO - saveSetupSuppliers:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    done(err, result);
                }

            });
        } catch (err) {
            logger.error('Unknown error in SetupSuppliersDAO - saveSetupSuppliers:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method fetches all data from Supplier__c table
     */
    getSetupSuppliers: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.suppliersTBL + ' WHERE IsDeleted = 0';
            if (parseInt(req.params.inActive) === config.booleanTrue) {
                sqlQuery = sqlQuery + ' AND Active__c = ' + req.params.inActive + ' order by Name asc';
            } else {
                sqlQuery += ' order by Name asc';
            }
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
    /**
     * This method edit single record by using id
     */
    editSetupSuppliers: function (req, done) {
        try {
            var updateObj = req.body.editSuppliersData;
            var sqlQuery = 'UPDATE ' + config.dbTables.suppliersTBL + ' SET  IsDeleted = "' + config.booleanFalse + '", Name = "'
                + updateObj.name + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date()) + '", Active__c = "' + updateObj.active
                + '", Account_Number__c = "' + updateObj.accountNumber
                + '",Phone__c = "' + updateObj.phone
                + '",Email__c = "' + updateObj.email
                + '",Sales_Consultant_1__c = "' + updateObj.salesConsultant + '" WHERE Id = "' + req.params.id + '"';
            execute.query(sqlQuery, function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2033' });
                    } else {
                        logger.error('Error in SetupSuppliersDAO - editSetupSuppliers:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupSuppliersDAO - editSetupSuppliers:', err);
            done(err, { statusCode: '9999' });
        }
    },
    deleteSetupSuppliers: function (req, done) {
        try {
            var date = new Date();
            var newDate = moment(date).format('YYYY-MM-DD HH:MM:SS');
            var name = req.params.name + '-' + newDate
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.productSupplierTBL;
            sqlQuery = sqlQuery + ' WHERE Supplier__c = "' + req.params.id + '" and isDeleted=0';
            if (req.params.type === 'Edit') {
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in SetupProductLineDAO - getSetupProductLine:', err);
                        done(err, result);
                    } else if (result.length > 0) {
                        done(err, { statusCode: '2040' });
                    } else {
                        done(err, { statusCode: '2041' });
                    }
                });
            } else {
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in SetupProductLineDAO - getSetupProductLine:', err);
                        done(err, result);
                    } else if (result.length > 0) {
                        done(err, { statusCode: '2040' });
                    } else {
                        var sqlQuery = "UPDATE " + config.dbTables.suppliersTBL
                            + " SET IsDeleted = '" + config.booleanTrue
                            + "', Name = '" + name
                            + "', LastModifiedDate = '" + date
                            + "' WHERE Id = '" + req.params.id + "'";
                        execute.query(sqlQuery, function (err, result) {
                            if (err) {
                                logger.error('Error in SetupProductLineDAO - editSetupProductLine:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, { statusCode: '2041' });
                            }
                        });
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in SetupProductLineDAO - getSetupProductLine:', err);
            done(err, null);
        }
    }
}