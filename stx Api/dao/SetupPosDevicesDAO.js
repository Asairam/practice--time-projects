/**
 * Importing required modules
 */
var config = require('config');
var async = require('async');
var logger = require('../lib/logger');
var mysql = require('mysql');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var ignoreCase = require('ignore-case');
var _ = require("underscore");
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
   * This method create a single record in data_base
   */
    savePosDevices: function (req, done) {
        try {
            var posDevicesObj = req.body;
            var posDevices = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                JSON__c: JSON.stringify([posDevicesObj.cashDrawers]),
                Name: config.cashDrawers
            };
            var receiptMemo = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                JSON__c: JSON.stringify([posDevicesObj.receiptMemo]),
                Name: config.receiptMemo
            };
            var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
            this.getPosDevices(req, function (err, result) {
                if (result.statusCode === '9999') {
                    execute.query(sqlQuery, posDevices, function (err, data) {
                        if (err) {
                            logger.error('Error1 in posDevices dao - saveposDevices:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            execute.query(sqlQuery, receiptMemo, function (err, data) {
                                if (err) {
                                    logger.error('Error1 in posDevices dao - savereceiptMemo:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                     execute.query(sqlQuery, posDevices, function (err, data) {
                                if (err) {
                                    logger.error('Error1 in posDevices dao - savereceiptMemo:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    done(err, data);
                                }
                            });
                                }
                            });
                        }
                    });
                } else if (result && result.length > 0) {
                    var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" + JSON.stringify(posDevicesObj.cashDrawers)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.cashDrawers + "'";
                    execute.query(sqlQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in mobileCarriers dao - savemobileCarriers:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            var sqlQuery1 = 'UPDATE ' + config.dbTables.preferenceTBL
                                + ' SET JSON__c = "' + posDevicesObj.receiptMemo
                                + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                                + '" WHERE Name = "' + config.receiptMemo + '"';
                            execute.query(sqlQuery1, '', function (err, data) {
                                if (err) {
                                    logger.error('Error2 in mobileCarriers dao - savemobileCarriers:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    done(err, data);
                                }
                            });
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in posDevices dao - saveposDevices:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * To get posDevices List
     */
    getPosDevices: function (req, done) {
        try {
            var sqlQuery = 'SELECT JSON__c FROM ' + config.dbTables.preferenceTBL + " WHERE Name = 'Cash Drawers' or Name = 'Receipt Memo'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in posDevices DAO - getposDevices:', err);
            done(err, null);
        }
    },
     /**
     * To get Pos List
     */
    getPos: function (req, done) {
        try {
            var sqlQuery = 'SELECT JSON__c FROM ' + config.dbTables.preferenceTBL + " WHERE Name = 'Sales Tax' or Name = 'Merchant In Store' or Name = 'Merchant Online' or Name = 'Payment Gateway' ";
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in posDevices DAO - getposDevices:', err);
            done(err, null);
        }
    },
    savePos: function (req, done) {
        try {
            var posObj = req.body;
            var pos = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                JSON__c: JSON.stringify([posObj.salesTax]),
                Name: config.posTax
            };
            var paymentGateway = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                JSON__c: JSON.stringify([posObj.paymentGateway]),
                Name: config.posPaymentGateway
            };
            var merchantInStore = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                JSON__c: JSON.stringify([posObj.merchantInStore]),
                Name: config.posMerchantInStore
            };
            var merchantOnline = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                JSON__c: JSON.stringify([posObj.merchantOnline]),
                Name: config.posMerchantOnline
            };
            var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
            this.getPos(req, function (err, result) {
                if (result.statusCode === '9999') {
                    execute.query(sqlQuery, pos, function (err, data) {
                        if (err) {
                            logger.error('Error1 in posDevices dao - saveposDevices:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            execute.query(sqlQuery, pos, function (err, data) {
                                if (err) {
                                    logger.error('Error1 in posDevices dao - savereceiptMemo:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    done(err, data);
                                }
                            });
                        }
                    });
                } else if (result && result.length > 0) {
                    var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" + JSON.stringify(posObj.salesTax)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.posTax + "'";
                    execute.query(sqlQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in mobileCarriers dao - savemobileCarriers:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            var sqlQuery1 = "UPDATE " + config.dbTables.preferenceTBL
                                + " SET JSON__c = '" + JSON.stringify(posObj.merchantInStore)
                                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                + "' WHERE Name = '" + config.posMerchantInStore + "'";
                            execute.query(sqlQuery1, '', function (err, data) {
                                if (err) {
                                    logger.error('Error2 in mobileCarriers dao - savemobileCarriers:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    var sqlQuery2 = "UPDATE " + config.dbTables.preferenceTBL
                                + " SET JSON__c = '" + JSON.stringify(posObj.merchantOnline)
                                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                + "' WHERE Name = '" + config.posMerchantOnline + "'";
                            execute.query(sqlQuery2, '', function (err, data) {
                                if (err) {
                                    logger.error('Error2 in mobileCarriers dao - savemobileCarriers:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    var sqlQuery3 = "UPDATE " + config.dbTables.preferenceTBL
                                    + " SET JSON__c = '" + JSON.stringify(posObj.paymentGateway)
                                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                    + "' WHERE Name = '" + config.posPaymentGateway + "'";
                                execute.query(sqlQuery3, '', function (err, data) {
                                    if (err) {
                                        logger.error('Error2 in mobileCarriers dao - savemobileCarriers:', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, data);
                                    }
                                });
                                }
                            });
                                }
                            });
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in posDevices dao - saveposDevices:', err);
            done(err, { statusCode: '9999' });
        }
    },
}