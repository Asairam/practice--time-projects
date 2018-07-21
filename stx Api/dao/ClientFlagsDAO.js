/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var _ = require("underscore");
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * Saving Client Flags
     */
    saveClientFlags: function (req, done) {
        var clientFlagsObj = req.body;
        var arrayData = [];
        var k = 0;
        var clientFlagsData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [clientFlagsObj],
            Name: config.clientFlags
        };
        this.getClientFlags(req, function (err, result) {
            if (result.statusCode === '9999') {
                for (var j = 0; j < clientFlagsObj.length; j++) {
                    if (clientFlagsObj[j].active === true && clientFlagsObj[j].flagName === '') {
                        k++;

                    }
                }
                /**
                    * uniqueness for Client Flags
                    */
                for (var i = 0; i < clientFlagsObj.length; i++) {
                    if (clientFlagsObj[i].flagName != '') {
                        arrayData.push(clientFlagsObj[i].flagName.toLowerCase().trim());
                    }
                }
                var uniqueData = _.uniq(arrayData);
                if (k > 0) {
                    done(err, { statusCode: '2050' });
                } else if (uniqueData.length != arrayData.length) {
                    done(err, { statusCode: '2051' });
                } else {
                    var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                    execute.query(sqlQuery, clientFlagsData, function (err, data) {
                        if (err) {
                            logger.error('Error1 in clientFlags dao - saveclientFlags:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                }
            } else if (result && result.length > 0) {
                for (var j = 0; j < clientFlagsObj.length; j++) {
                    if (clientFlagsObj[j].active === true && clientFlagsObj[j].flagName === '') {
                        k++;

                    }
                }
                /**
                    * uniqueness for Client Flags
                    */
                for (var i = 0; i < result.length; i++) {
                    if (clientFlagsObj[i].flagName != '') {
                        arrayData.push(clientFlagsObj[i].flagName.toLowerCase().trim());
                    }
                }
                var uniqueData = _.uniq(arrayData);
                if (k > 0) {
                    done(err, { statusCode: '2050' });
                } else if (uniqueData.length != arrayData.length) {
                    done(err, { statusCode: '2051' });
                } else {
                    // result = JSON.parse(result);
                    // result.push(clientFlagsObj);
                    var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" + JSON.stringify(clientFlagsObj)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.clientFlags + "'";
                    execute.query(sqlQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in clientFlags dao - saveclientFlags:', err);
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
     * This function lists Client Flags 
     */
    getClientFlags: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.clientFlags + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                } else {
                    logger.error('Error in clientFlags dao - getclientFlags:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in clientFlags dao - getclientFlags:', err);
            return (err, { statusCode: '9999' });
        }
    }
};
