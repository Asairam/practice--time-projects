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

module.exports = {
    /**
     * This method create a single record in data_base
     */
    saveResources: function (req, done) {
        try {
            var setupResourcesObj = req.body.setupResourcesObj;
            var resourceData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                Name: setupResourcesObj.resourceName,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastActivityDate: dateFns.getUTCDatTmStr(new Date()),
                Active__c: setupResourcesObj.resourceActive,
                Number_Available__c: setupResourcesObj.numberAvailable
            }
            var sqlQuery = 'INSERT INTO ' + config.dbTables.resourceTBL + ' SET ?';
            execute.query(sqlQuery, resourceData, function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2033' });
                    } else {
                        logger.error('Error in SetupResources dao - SetupResources:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    done(err, result);
                }

            });
        } catch (err) {
            logger.error('Unknown error in SetupResources dao - SetupResources:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method fetches all data from Resource__c table
     */
    getResources: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.resourceTBL;
            if (parseInt(req.params.isActive) === config.booleanTrue) {
                sqlQuery = sqlQuery + ' WHERE Active__c = ' + req.params.isActive + ' and isDeleted=0 ORDER By Name ASC';
            } else {
                sqlQuery = sqlQuery + ' WHERE isDeleted=0 ORDER By Name ASC'
            }
            execute.query(sqlQuery, function (err, result) {
                if (err) {
                    logger.error('Error in SetupResources dao - getResources:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupResources dao - getResources:', err);
            done(err, null);
        }
    },
    /**
     * This method edit single record by using id
     */
    editResources: function (req, done) {
        try {
            var updateObj = req.body.editResourceServiceData;
            var sqlQuery = 'UPDATE ' + config.dbTables.resourceTBL + ' SET  IsDeleted = "' + config.booleanFalse + '", Name = "'
                + updateObj.resourceName + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date()) + '", Active__c = "' + updateObj.resourceActive
                + '", Number_Available__c = "' + updateObj.numberAvailable + '" WHERE Id = "' + req.params.id + '"';
            execute.query(sqlQuery, function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2033' });
                    } else {
                        logger.error('Error in SetupResources dao - SetupResources:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupResources dao - editResources:', err);
            done(err, { statusCode: '9999' });
        }
    }
}
