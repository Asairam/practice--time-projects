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
    saveSetupCompensation: function (req, done) {
        try {
            var setupCompensationObj =req.body;
            var compensationData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: config.booleanFalse,
                Name: setupCompensationObj.name,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()) ,
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()) ,
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()) ,
                Active__c: setupCompensationObj.active,
                Basis__c: setupCompensationObj.basisValue,
                Period__c: 'Pay Period',
                Scale__c: JSON.stringify(setupCompensationObj.scales),
                Steps__c:'',
                isScale__c:1
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
     * This method fetches all data from compensation sclae
     */
    getSetupCompensation: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.setupCompensationTBL+' WHERE IsDeleted = 0 AND isScale__c = 1';
            if (parseInt(req.params.inActive) === config.booleanTrue)
            sqlQuery = sqlQuery + ' AND Active__c = ' + req.params.inActive;
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
    deleteSetupCompensation: function (req, done) {
        try {
            var sqlQuery = 'SELECT Steps__c FROM ' + config.dbTables.setupCompensationTBL;
            sqlQuery = sqlQuery + ' WHERE isScale__c = 0';
            execute.query(sqlQuery, '', function (err, result) {
                for(var i = 0 ; i < result.length ; i++){
                    for(j = 0; j<JSON.parse(result[i].Steps__c).length; j++) {
                    if (JSON.parse(result[i].Steps__c)[j].operand.indexOf('a0B41000007bL0qEAE') > 0) {
                        done(err, { statusCode: '2044' });
                    }
                }
                }
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
    /**
     * This method edit single record by using id
     */
    editSetupCompensation: function (req, done) {
        try {
            var updateObj = req.body;
            var operandData = [];
            var selectQuery = 'SELECT Steps__c FROM ' + config.dbTables.setupCompensationTBL;
            selectQuery = selectQuery + " WHERE isScale__c = 0 ";
            var sqlQuery = "UPDATE " + config.dbTables.setupCompensationTBL
            + " SET Name = '" + updateObj.updateName 
            + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())  
            + "', Active__c = '" + updateObj.updateActive
            + "', Basis__c = '" + updateObj.updateBasis 
            + "', Scale__c = '" + JSON.stringify(updateObj.updateScales)
            + "' WHERE Id = '" + req.params.id + "'";
            execute.query(selectQuery, '', function (err, result) {
                for (var i = 0; i < result.length; i++) {
                    if(result[i].Steps__c != null) {
                    for (j = 0; j < JSON.parse(result[i].Steps__c).length; j++) {
                        if(JSON.parse(result[i].Steps__c)[j].operand.indexOf('scale') === 0) {
                        operandData.push(JSON.parse(result[i].Steps__c)[j].operand.split(':')[1]);
                    }
                    }
                }
                }
                operandData.push(req.params.id);
                var uniqueData = _.uniq(operandData);
                if (uniqueData.length === operandData.length) {
                execute.query(sqlQuery, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            done(err, { statusCode: '2033' });
                        } else {
                            logger.error('Error in SetupCompensationDAO - editSetupCompensation:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
                });
                } else {
                    done(err, { statusCode: '2044' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupCompensationDAO - editSetupCompensation:', err);
            done(err, { statusCode: '9999' });
        }
    }
}