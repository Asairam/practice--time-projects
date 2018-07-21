/**
 * Importing required modules
 */
var config = require('config');
var logger = require('../lib/logger');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var _ = require("underscore");
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * This method create a single record in data_base
     */
    saveSetupPermissions: function (req, done) {
        try {
            var setupPermissionsObj =req.body;
            var goalData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: config.booleanFalse,
                Name: setupPermissionsObj.Name,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                Authorized_Pages__c: JSON.stringify(setupPermissionsObj.Authorized_Pages__c)
            }
            var sqlQuery = 'INSERT INTO ' + config.dbTables.permissionsTBL + ' SET ?';
                execute.query(sqlQuery, goalData, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            done(err, { statusCode: '2033' });
                        } else {
                            logger.error('Error in SetupPermissionDAO - saveSetupPermissions:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
    
                });
            
        } catch (err) {
            logger.error('Unknown error in SetupPermissionDAO - saveSetupPermissions:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method fetches all data from goals
     */
    getSetupPermissions: function (req, done) {
        try {
        var sqlQuery = 'SELECT * FROM ' + config.dbTables.permissionsTBL+' WHERE IsDeleted = 0 ';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupPermissionsDAO - getSetupPermissions:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupPermissionDAO - getSetupCompensation:', err);
            done(err, null);
        }
    },
    /**
     * This method edit single record by using id
     */
    editSetupPermissions: function (req, done) {
        try {
            var updateObj = req.body;
            var sqlQuery = "UPDATE " + config.dbTables.permissionsTBL
                + " SET Name = '" + updateObj.Name 
                + "', Authorized_Pages__c = '" + JSON.stringify(updateObj.Authorized_Pages__c)
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + req.params.id + "'";
                execute.query(sqlQuery, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            done(err, { statusCode: '2033' });
                        } else {
                            logger.error('Error in SetupPermissionDAO - editSetupPermissions:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
                });
        } catch (err) {
            logger.error('Unknown error in SetupPermissionDAO - editSetupPermissions:', err);
            done(err, { statusCode: '9999' });
        }
    }
}