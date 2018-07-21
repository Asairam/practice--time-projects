/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var ignoreCase = require('ignore-case');
var _ = require("underscore");
var logger = require('../lib/logger');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * This function saves Client Visit Types 
     */
    saveVisitTypes: function (req, done) {
        var visitTypesObj = req.body;
        var k = 0;
        var arrayData = [];
        var visitTypesData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [visitTypesObj],
            Name: config.visitTypes
        };
        this.getVisitTypes(req, function (err, result) {
            if (result.statusCode === '9999') {
                for (var j = 0; j < visitTypesObj.length; j++) {
                    if (visitTypesObj[j].active === true && visitTypesObj[j].visitType === '') {
                        k++;

                    }
                }
                var nameUniq = false;
                /**
                    * uniqueness for Visit Types
                    */
                for (var i = 0; i < visitTypesObj.length; i++) {
                    if (visitTypesObj[i].visitType != '') {
                        visitTypesObj[i].visitType.toLowerCase();
                        arrayData.push(visitTypesObj[i].visitType.toLowerCase().trim());
                    }
                }
                var uniqueData = _.uniq(arrayData);
                if (k > 0) {
                    done(err, { statusCode: '2048' });
                } else if (uniqueData.length != arrayData.length) {
                    done(err, { statusCode: '2049' });
                } else {
                    var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                    execute.query(sqlQuery, visitTypesData, function (err, data) {
                        if (err) {
                            logger.error('Error1 in VisitTypes dao - saveVisitTypes:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                }
            } else if (result && result.length > 0) {
                for (var j = 0; j < visitTypesObj.length; j++) {
                    if (visitTypesObj[j].active === true && visitTypesObj[j].visitType === '') {
                        k++;

                    }
                }
                var nameUniq = false;
                /**
                    * uniqueness for Visit Types
                    */
                for (var i = 0; i < result.length; i++) {
                    if (visitTypesObj[i].visitType != '' && visitTypesObj[i].visitType !== undefined) {
                        arrayData.push(visitTypesObj[i].visitType.toLowerCase().trim());
                    }
                }
                var uniqueData = _.uniq(arrayData);
                if (k > 0) {
                    done(err, { statusCode: '2048' });
                } else if (uniqueData.length != arrayData.length) {
                    done(err, { statusCode: '2049' });
                } else {
                    // result = JSON.parse(result);
                    result.push(visitTypesObj);
                    var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" + JSON.stringify(visitTypesObj)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.visitTypes + "'";
                    execute.query(sqlQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in VisitTypes dao - saveVisitTypes:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                }
            }
        });
    },
    /**
     * This function lists the Client Visit Types 
     */
    getVisitTypes: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.visitTypes + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                } else {
                    logger.error('Error in VisitTypes dao - getVisitTypes:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in VisitTypes dao - getVisitTypes:', err);
            return (err, { statusCode: '9999' });
        }
    },
     /**
     * This function lists the Client Visit Types 
     */
    getActiveVisitTypes: function (req, done) {
        try {
            var JSON__c_str = []
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.visitTypes + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    for (var i = 0; i < JSON.parse(result[0].JSON__c).length; i++) {
                        if (JSON.parse(result[0].JSON__c)[i].active === true) {
                            JSON__c_str.push({ 'visitType': JSON.parse(result[0].JSON__c)[i].visitType });
                        }
                    }
                    done(err, JSON__c_str);
                } else {
                    logger.error('Error in VisitTypes dao - getVisitTypes:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in VisitTypes dao - getVisitTypes:', err);
            return (err, { statusCode: '9999' });
        }
    }
};