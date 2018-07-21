/**
 * Importing required modules
 */
var config = require('config');
var async = require('async');
var logger = require('../lib/logger');
var mysql = require('mysql');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var _ = require("underscore");
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * This method create a single record in data_base
     */
    saveSetupCompensationMethods: function (req, done) {
        try {
            var setupCompensationObj =req.body;
            var compensationData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: config.booleanFalse,
                Name: setupCompensationObj.name,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                Active__c: setupCompensationObj.active,
                Basis__c: setupCompensationObj.basisValue,
                Period__c: 'Pay Period',
                Scale__c: JSON.stringify(setupCompensationObj.scales),
                Steps__c:JSON.stringify(setupCompensationObj.methodsJson),
                isScale__c:setupCompensationObj.isScale
            }
            var sqlQuery = 'INSERT INTO ' + config.dbTables.setupCompensationTBL + ' SET ?';
                execute.query(sqlQuery, compensationData, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            done(err, { statusCode: '2033' });
                        } else {
                            logger.error('Error in SetupCompensationDAO - saveSetupCompensation:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
    
                });
            
        } catch (err) {
            logger.error('Unknown error in SetupCompensationDAO - saveSetupCompensation:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method fetches all data from compensationmethod
     */
    getSetupCompensationMethods: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.setupCompensationTBL+' WHERE IsDeleted = 0 AND isScale__c = 0';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupCompensationDAO - getSetupCompensation:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupCompensationDAO - getSetupCompensation:', err);
            done(err, null);
        }
    },
    deleteSetupCompensationMethods: function (req, done) {
        try {
            var sqlQuery = 'SELECT Inventory_Group__c FROM ' + config.dbTables.setupProductTBL;
            sqlQuery = sqlQuery + ' WHERE Inventory_Group__c = "' + req.params.name+ '" and isDeleted=0';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupCompensationDAO - getSetupCompensation:', err);
                    done(err, result);
                } else if (result.length > 0){
                    done(err, { statusCode: '2040' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupCompensationDAO - getSetupCompensation:', err);
            done(err, null);
        }
    },
    /**
     * This method edit single record by using id
     */
    editSetupCompensationMethods: function (req, done) {
        try {
            var updateObj = req.body;
            var sqlQuery = "UPDATE " + config.dbTables.setupCompensationTBL
                + " SET Name = '" + updateObj.name 
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date()) 
                + "', Active__c = '" + updateObj.active
                + "', Steps__c = '" + JSON.stringify(updateObj.methodsJson)
                + "' WHERE Id = '" + req.params.id + "'";
                execute.query(sqlQuery, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            done(err, { statusCode: '2033' });
                        } else {
                            logger.error('Error in SetupCompensationDAO - editSetupCompensationMethods:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
                });
        } catch (err) {
            logger.error('Unknown error in SetupCompensationDAO - editSetupCompensation:', err);
            done(err, { statusCode: '9999' });
        }
    }
}