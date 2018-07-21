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
    saveSetupGoals: function (req, done) {
        try {
            var setupGoalObj =req.body;
            var goalData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: config.booleanFalse,
                Name: setupGoalObj.name,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                Active__c: setupGoalObj.active,
                Billboard__c: 0,
                Period__c: 'Weekly',
                Steps__c: JSON.stringify(setupGoalObj.methodsJson)
            }
            var sqlQuery = 'INSERT INTO ' + config.dbTables.setupGoalsTBL + ' SET ?';
                execute.query(sqlQuery, goalData, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            done(err, { statusCode: '2033' });
                        } else {
                            logger.error('Error in SetupGoalDAO - saveSetupGoals:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
    
                });
            
        } catch (err) {
            logger.error('Unknown error in SetupGoalDAO - saveSetupGoals:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method fetches all data from goals
     */
    getSetupGoals: function (req, done) {
        try {
        var sqlQuery = 'SELECT * FROM ' + config.dbTables.setupGoalsTBL+' WHERE IsDeleted = 0 ';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupGoalsDAO - getSetupGoals:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupGoalDAO - getSetupCompensation:', err);
            done(err, null);
        }
    },
    /**
     * This method edit single record by using id
     */
    editSetupGoals: function (req, done) {
        try {
            var updateObj = req.body;
            var sqlQuery = "UPDATE " + config.dbTables.setupGoalsTBL
                + " SET Name = '" + updateObj.name 
                + "', Active__c = '" + updateObj.active
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "', Steps__c = '" + JSON.stringify(updateObj.methodsJson)
                + "' WHERE Id = '" + req.params.id + "'";
                execute.query(sqlQuery, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            done(err, { statusCode: '2033' });
                        } else {
                            logger.error('Error in SetupGoalDAO - editSetupGoals:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
                });
        } catch (err) {
            logger.error('Unknown error in SetupGoalDAO - editSetupGoals:', err);
            done(err, { statusCode: '9999' });
        }
    }
}