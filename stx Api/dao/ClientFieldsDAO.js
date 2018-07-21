/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * This function is to saves Client Preferences Client Fields into db
     */
    saveClientFields: function (req, done) {
        var clientfieldsObj = req.body.clientPrefenceDetails;
        var quickAddfieldsData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [clientfieldsObj.quickAddRequiredFields],
            Name: config.clientQuickAddRequiredFields
        };
        var clientCardRequiredData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [clientfieldsObj.clientCardRequiredFields],
            Name: config.clientCardRequiredFields
        };
        var onlineBookingData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [clientfieldsObj.onlineBookingRequiredFields],
            Name: config.onlineBookingRequiredFields
        };
        var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
        this.getClientFields(req, function (err, result) {
            if (result.statusCode === '9999') {
                execute.query(sqlQuery, quickAddfieldsData, function (err, data) {
                    if (err) {
                        logger.error('Error1 in clientfields dao - saveclientfields:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, data);
                    }
                });
            } else if (result && result.length > 0) {
                // result = JSON.parse(result);
                // result.push(mobileCarriersObj);
                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                    + " SET JSON__c = '" + JSON.stringify(clientfieldsObj.quickAddRequiredFields)
                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                    + "' WHERE Name = '" + config.clientQuickAddRequiredFields + "'";
                execute.query(sqlQuery, '', function (err, data) {
                    if (err) {
                        logger.error('Error2 in mobileCarriers dao - savemobileCarriers:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        var sqlQuery1 = "UPDATE " + config.dbTables.preferenceTBL
                            + " SET JSON__c = '" + JSON.stringify(clientfieldsObj.clientCardRequiredFields)
                            + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                            + "' WHERE Name = '" + config.clientCardRequiredFields + "'";
                        execute.query(sqlQuery1, '', function (err, data) {
                            if (err) {
                                logger.error('Error2 in mobileCarriers dao - savemobileCarriers:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                var sqlQuery2 = "UPDATE " + config.dbTables.preferenceTBL
                                    + " SET JSON__c = '" + JSON.stringify(clientfieldsObj.onlineBookingRequiredFields)
                                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                    + "' WHERE Name = '" + config.onlineBookingRequiredFields + "'";
                                execute.query(sqlQuery2, '', function (err, data) {
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
    },
    /**
     * This function lists the Client Preferences Client Fields
     */
    getClientFields: function (req, done) {
        try {
            var sqlQuery = 'SELECT Name, JSON__c FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.clientQuickAddRequiredFields + '" or Name = "' + config.clientCardRequiredFields
                + '" or Name = "' + config.onlineBookingRequiredFields + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    done(err, result);
                } else {
                    logger.error('Error in mobileCarriers dao - getmobileCarriers:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in mobileCarriers dao - getmobileCarriers:', err);
            return (err, { statusCode: '9999' });
        }
    }
};
