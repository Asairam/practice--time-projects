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
    saveMemberships: function (req, done) {
        try {
            var membershipsObj = req.body;
            var membershipsData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                Name: membershipsObj.Name,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                Active__c: membershipsObj.active,
                Price__c: membershipsObj.price
            };
            var sqlQuery = 'INSERT INTO ' + config.dbTables.setupMembershipTBL + ' SET ?';
            execute.query(sqlQuery, membershipsData, function (err, result, fields) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2033' });
                    } else {
                        logger.error('Error in SetupMemberships dao - saveSetupMemberships:', err);
                        done(err, { statusCode: '9999' });
                    }
                }else {
                    done(err, result);
                }

            });
        } catch (err) {
            logger.error('Unknown error in SetupMembershipsDAO - saveSetupMemberships:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method updates memberships
     */
    editMemberships : function (req, done) {
        var updateObj = req.body;
        var Id = req.params.id;
        var queryString = 'UPDATE ' + config.dbTables.setupMembershipTBL +  ' SET Active__c="'
        + updateObj.updateActive + '", LastModifiedDate="' + dateFns.getUTCDatTmStr(new Date()) + '", Name="' + updateObj.updateName + '", Price__c="' + updateObj.updatePrice + '" WHERE Id="' + Id + '"';
        execute.query(queryString, function (error, results, fields) {
        if (error != null) {
            if (error.sqlMessage.indexOf('Name') > 0) {
                done(error, { statusCode: '2033' });
            } else {
                logger.error('Error in SetupMembershipsDAO dao - editMemberships:', err);
                done(error, '9999');
            }
        } else {
            done(error, results);
            }
    });
    },
    /**
     * This method fetches all data from setup memberships
     */
    getMemberships: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.setupMembershipTBL+ ' WHERE isDeleted = 0';
            if (parseInt(req.params.inActive) === config.booleanTrue)
            sqlQuery = sqlQuery + ' AND Active__c = ' + config.booleanTrue;
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupMembershipsDao - getMemberships:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupMembershipsDao - getMemberships:', err);
            done(err, null);
        }
    }
}