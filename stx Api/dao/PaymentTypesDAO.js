/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var moment = require('moment');
var mysql = require('mysql');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * This function is to saves PaymentTypes into db
     */
    savePaymentTypes: function (req, paymenttypesObj, done) {
        var date = new Date();
        var paymentTypesObj = JSON.parse(req.body.paymentListNew);
        if (req.file != undefined)
            var filepath = req.file.path;
        var paymentTypesData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            Name: paymentTypesObj.Name,
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            Abbreviation__c: paymentTypesObj.Abbreviation__c,
            Active__c: paymentTypesObj.Active__c,
            Icon_Document_Name__c: filepath,
            Minimum_Purchase_Amount__c: '',
            Process_Electronically_Online__c: paymentTypesObj.Process_Electronically_Online__c,
            Process_Electronically__c: paymentTypesObj.Process_Electronically__c,
            Read_Only_Active_Flag__c: '',
            Reads_Only_Name__c: '',
            Sort_Order__c: paymentTypesObj.Sort_Order__c,
            Transaction_Fee_Per_Transaction__c: '',
            Transaction_Fee_Percentage__c: '',
            Uses_Reference_Field__c: ''
        };
        var sqlQuery = 'INSERT INTO ' + config.dbTables.paymentTypesTBL + ' SET ?';
        execute.query(sqlQuery, paymentTypesData, function (err, data) {
            if (err !== null) {
                if (err.sqlMessage.indexOf('Name') > 0) {
                    done(err, { statusCode: '2059' });
                } else if (err.sqlMessage.indexOf('Abbreviation__c') > 0) {
                    done(err, { statusCode: '2060' });
                } else if (err.sqlMessage.indexOf('Sort_Order__c') > 0) {
                    done(err, { statusCode: '2061' });
                } else {
                    logger.error('Error in PaymentTypes dao - AddPaymentTypes:', err);
                    done(err, { statusCode: '9999' });
                }
            } else {
                done(err, data);
            }
        });
    },
    /**
     * This function lists the PaymentTypes
     */
    getPaymentTypes: function (req, done) {
        try {
            /**
             * this query has the dependecy with the checkout Payments, If Want to edit this once check the scenario
             */
            var sqlQuery = 'SELECT *, \'\' as Icon_Name FROM ' + config.dbTables.paymentTypesTBL
                + ' WHERE isDeleted = 0 order by Sort_Order__c ASC';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in PaymentTypes dao - getPaymentTypes:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, data = {'paymentResult': result, 'Id': uniqid()});
                }
            });
        } catch (err) {
            logger.error('Unknown error in PaymentTypes dao - getPaymentTypes:', err);
            return (err, { statusCode: '9999' });
        }
    },
    deletePaymentType: function (req, done) {
        try {
            var date = new Date();
            var newDate = moment(date).format('YYYY-MM-DD HH:MM:SS');
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.ticketPaymentTBL;
            sqlQuery = sqlQuery + ' WHERE Payment_Type__c = "' + req.params.id + '"';
            if (req.params.type === 'Edit') {
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in SetupProductLineDAO - getSetupProductLine:', err);
                        done(err, result);
                    } else if (result.length > 0) {
                        done(err, { statusCode: '2040' });
                    } else {
                        var sqlQuery1 = 'SELECT * FROM ' + config.dbTables.clientMembershipTBL;
                        sqlQuery1 = sqlQuery1 + ' WHERE Payment_Type__c = "' + req.params.id + '"';
                        execute.query(sqlQuery1, function (err, result) {
                            if (err) {
                                logger.error('Error in SetupProductLineDAO - editSetupProductLine:', err);
                                done(err, { statusCode: '9999' });
                            } else if (result.length > 0) {
                                done(err, { statusCode: '2040' });
                            } else {
                                done(err, { statusCode: '2041' });
                            }
                        });
                    }
                });
            } else {
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in PaymentTypesDAO - deletePaymentTypes:', err);
                        done(err, result);
                    } else if (result.length > 0) {
                        done(err, { statusCode: '2040' });
                    } else {
                        var sqlQuery1 = 'SELECT * FROM ' + config.dbTables.clientMembershipTBL;
                        sqlQuery1 = sqlQuery1 + ' WHERE Payment_Type__c = "' + req.params.id + '"';
                        execute.query(sqlQuery1, function (err, result) {
                            if (err) {
                                logger.error('Error in PaymentTypesDAO - deletePaymentTypes:', err);
                                done(err, { statusCode: '9999' });
                            } else if (result.length > 0) {
                                done(err, { statusCode: '2040' });
                            } else {
                                var val = Math.floor(1000 + Math.random() * 9000);
                                var sqlQuery2 = 'UPDATE ' + config.dbTables.paymentTypesTBL
                                    + ' SET IsDeleted = 1'
                                    + ', Name = "' + req.params.name + '-' + newDate
                                    + '", Abbreviation__c = "' + req.params.abbrevation + '-' + newDate
                                    + '", Sort_Order__c = "' + req.params.order + val
                                    + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                                    + '" WHERE Id = "' + req.params.id + '"';
                                execute.query(sqlQuery2, function (err, result) {
                                    if (err) {
                                        logger.error('Error in PaymentTypesDAO - deletePaymentTypes:', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, { statusCode: '2041' });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in SetupProductLineDAO - getSetupProductLine:', err);
            done(err, null);
        }
    },
    /**
     * This method edit single record by using id
     */
    editPaymentTypes: function (req, paymenttypesObj, done) {
        try {
            var updateObj = JSON.parse(req.body.paymentListNew);
            var curDate = new Date();
            if (req.file != undefined)
                var filepath = req.file.path;
            var sqlQuery = 'UPDATE ' + config.dbTables.paymentTypesTBL
                + ' SET Name = "' + updateObj.Name
                + '", Active__c = "' + updateObj.Active__c
                + '", Abbreviation__c = "' + updateObj.Abbreviation__c
                + '", Process_Electronically_Online__c = "' + updateObj.Process_Electronically_Online__c
                + '", Process_Electronically__c = "' + updateObj.Process_Electronically__c
                + '", Sort_Order__c = "' + updateObj.Sort_Order__c
                if (filepath) {
                    sqlQuery += '", Icon_Document_Name__c = "' + filepath
                }
                sqlQuery += '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                + '" WHERE Id = "' + req.params.id + '"';
            execute.query(sqlQuery, function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2059' });
                    } else if (err.sqlMessage.indexOf('Abbreviation__c') > 0) {
                        done(err, { statusCode: '2060' });
                    } else if (err.sqlMessage.indexOf('Sort_Order__c') > 0) {
                        done(err, { statusCode: '2061' });
                    } else {
                        logger.error('Error in PaymentTypes dao - edit PaymentTypes:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in PaymentTypes DAO - editPaymentTypes:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method edit single record by using id
     */
    editPaymentTypeSortorder: function (req, done) {
        try {
            var updateObj = req.body;
            var curDate = new Date();
            var sortData = [];
            var sqlQuery = '';
            for (var i = 0; i < updateObj.length; i++) {
                sortData.push(updateObj[i].Sort_Order__c);
            }
            var sorted_arr = sortData.slice().sort();
            var results = [];
            for (var i = 0; i < sorted_arr.length - 1; i++) {
                if (sorted_arr[i + 1] == sorted_arr[i]) {
                    results.push(sorted_arr[i]);
                }
            }
            if (results.length > 0) {
                done(null, { statusCode: '2061' });
            } else {
                for (var i = 0; i < updateObj.length; i++) {
                    sqlQuery += mysql.format('UPDATE ' + config.dbTables.paymentTypesTBL
                        + ' SET Sort_Order__c = ' + updateObj[i].Sort_Order__c
                        + ', LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                        + '" WHERE Id = "' + updateObj[i].Id + '";');
                }
                execute.query(sqlQuery, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Sort_Order__c') > 0) {
                            done(err, { statusCode: '2061' });
                        } else {
                            logger.error('Error in PaymentTypes dao - edit PaymentTypes:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in PaymentTypes DAO - editPaymentTypes:', err);
            done(err, { statusCode: '9999' });
        }
    }
};
