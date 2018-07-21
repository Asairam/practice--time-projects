/**
 * Importing required modules
 */
var config = require('config');
var async = require('async');
var logger = require('../lib/logger');
var execute = require('../db_connection/db');
var uniqid = require('uniqid');
var ignoreCase = require('ignore-case');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * Inserting Service Groups record in Preferences table
     * Default value for 'Name' column is 'Service Groups'
     * For each new record, update 'JSON__c'(String array of JSON objects)
     * coloumn with new Service Groups JSON object
     * Note: JSON__c column value is a String array of JSON objects
     */
    saveServiceGroups: function (req, done) {
        try {
            var setupServiceGroupsObj = req.body.createServiceGroupsData;
           var serviceGroups = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                JSON__c: JSON.stringify([setupServiceGroupsObj]),
                Name: config.serviceGroups
            };

            /**
            * Following function is to check wether Service Groups record is
            * exist or not in Preferences table. If not insert whole record in
            * Preferences table else update new record in JSON__c array 
            */
            this.getServiceGroups(req, function (err, result) {
                if (result.statusCode === '9999') {
                    var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                    execute.query(sqlQuery, serviceGroups, function (err, data) {
                        if (err) {
                            logger.error('Error1 in SetupServiceGroup dao - saveServiceGroups:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                } else {
                    var nameUniq = false;
                    var onlineNameUniq = false;
                    /**
                     * uniqueness for service group name
                     */
                    for (var i = 0; i < result.length; i++) {
                        if (result) {
                            if (setupServiceGroupsObj && ignoreCase.equals(setupServiceGroupsObj.serviceGroupName, result[i].serviceGroupName)) {
                                nameUniq = true;
                                break;
                            } else if (setupServiceGroupsObj.clientFacingServiceGroupName !== '' && setupServiceGroupsObj && ignoreCase.equals(setupServiceGroupsObj.clientFacingServiceGroupName, result[i].clientFacingServiceGroupName)) {
                                onlineNameUniq = true;
                                break;
                            }
                        }
                    }
                    if (nameUniq) {
                        // Record with same name already exists
                        done(err, { statusCode: '2033' });
                    } else if (onlineNameUniq) {
                        // Record with same onlinename already exists
                        done(err, { statusCode: '2034' });
                    } else {
                        result.push(setupServiceGroupsObj);
                        var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                            + " SET JSON__c = '" + JSON.stringify(result)
                            + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                            + "' WHERE Name = '" + config.serviceGroups + "'";
                        execute.query(sqlQuery, '', function (err, data) {
                            if (err) {
                                logger.error('Error2 in SetupServiceGroup dao - saveServiceGroups:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
                    }
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupServiceGroup dao - saveServiceGroups:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This function is to get Service Groups List
     */
    
    getServiceGroups: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.serviceGroups + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    result[0].JSON__c = JSON__c_str.sort(function (a, b) {
                        return a.sortOrder - b.sortOrder
                    });
                    done(err, result[0].JSON__c);
                } else {
                    logger.error('Error in SetupServiceGroup dao - getServiceGroups:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupServiceGroup dao - getServiceGroups:', err);
            done(err, { statusCode: '9999' });
        }
    },
    getServicesData: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.serviceTBL
                + ' WHERE Service_Group__c = "' + req.params.oldServiceGroupName + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    done(err, { statusCode: '2040' });
                } else {
                    done(err, { statusCode: '2041' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupServices dao - getSetupService : ', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This function is to edit service groups record
     */
    editServiceGroups: function (req, done) {
        try {
            var setupServiceGroupsObj = req.body.updateServiceGroupsData;
            var oldServiceGroupName = req.params.oldServiceGroupName;
            var oldOnlineName = req.params.oldOnlineName;
            var index;
            var nameUniq = false;
            var onlineNameUniq = false;
            this.getServiceGroups(req, function (err, result) {
                if (err || result.statusCode === '9999') {
                    logger.error('Error1 in SetupServiceGroup dao - editServiceGroups:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    /**
                     * uniqueness for service group name
                     */
                    for (var i = 0; i < result.length; i++) {
                        if (result) {
                            if (!ignoreCase.equals(oldServiceGroupName, result[i].serviceGroupName) &&
                                ignoreCase.equals(setupServiceGroupsObj.serviceGroupName, result[i].serviceGroupName)) {
                                nameUniq = true;
                            } else if (setupServiceGroupsObj.clientFacingServiceGroupName !== '' &&
                                !ignoreCase.equals(oldOnlineName, setupServiceGroupsObj.clientFacingServiceGroupName) &&
                                ignoreCase.equals(setupServiceGroupsObj.clientFacingServiceGroupName, result[i].clientFacingServiceGroupName)) {
                                onlineNameUniq = true;
                            } else if (ignoreCase.equals(oldServiceGroupName, result[i].serviceGroupName)) {
                                result.splice(i, 1);
                            }
                        }
                    }
                    if (nameUniq) {
                        // Record with same name already exists
                        done(err, { statusCode: '2033' });
                    } else if (onlineNameUniq) {
                        // Record with same onlinename already exists
                        done(err, { statusCode: '2034' });
                    } else {
                        result.push(setupServiceGroupsObj);
                        var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                            + " SET JSON__c = '" + JSON.stringify(result)
                            + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                            + "' WHERE Name = '" + config.serviceGroups + "'";
                        execute.query(sqlQuery, '', function (err, data) {
                            if (err) {
                                logger.error('Error2 in SetupServiceGroup dao - editServiceGroups:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
                    }
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupServiceGroup dao - editServiceGroups:', err);
            done(err, { statusCode: '9999' });
        }
    },
    deleteServiceGroups: function (req, done) {
        try {
            var index;
            this.getServiceGroups(req, function (err, result) {
                if (err || result.statusCode === '9999') {
                    logger.error('Error1 in SetupServiceGroup dao - deleteServiceGroups:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    var oldServiceGroupName = req.params.oldServiceGroupName;
                    for (var i = 0; i < result.length; i++) {
                        if (result && ignoreCase.equals(oldServiceGroupName, result[i].serviceGroupName)) {
                            index = i;
                            result.splice(index, 1);
                            break;
                        }
                    }
                    var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" + JSON.stringify(result)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.serviceGroups + "'";
                    execute.query(sqlQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in SetupServiceGroup dao - deleteServiceGroups:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupServiceGroup dao - deleteServiceGroups:', err);
            done(err, { statusCode: '9999' });
        }
    },
};
