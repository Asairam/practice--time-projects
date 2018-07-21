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
    savemobileCarriers: function (req, done) {
        var mobileCarriersObj = req.body.mobileCarrier;
        var mobileCarrierData = [];
        var k = 0;
        var mobileCarriersData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [mobileCarriersObj],
            Name: config.mobileCarriers
        };
        this.getMobileCarriers(req, function(err, result){
            if (result.statusCode === '9999') {
                for (var j = 0; j < mobileCarriersObj.length; j++) {
                    if (mobileCarriersObj[j].mobileCarrierName === '') {
                        k++;

                    }
                }
                /**
                    * uniqueness for Client Flags
                    */
                for (var i = 0; i < mobileCarriersObj.length; i++) {
                    if (mobileCarriersObj[i].mobileCarrierName != '') {
                        mobileCarrierData.push(mobileCarriersObj[i].mobileCarrierName);
                    }
                }
                var uniqueData = _.uniq(mobileCarrierData);
                if (k > 0) {
                    done(err, { statusCode: '2054' });
                } else if (uniqueData.length != mobileCarrierData.length) {
                    done(err, { statusCode: '20555' });
                } else {
                var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                        execute.query(sqlQuery, mobileCarriersData, function (err, data) {
                            if (err) {
                                logger.error('Error1 in mobileCarriers dao - savemobileCarriers:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
                    }
            } else if(result && result.length > 0) {
                for (var j = 0; j < mobileCarriersObj.length; j++) {
                    if (mobileCarriersObj[j].mobileCarrierName === '') {
                        k++;

                    }
                }
                /**
                    * uniqueness for Client Flags
                    */
                for (var i = 0; i < result.length; i++) {
                    if (mobileCarriersObj[i].mobileCarrierName != '') {
                        mobileCarrierData.push(mobileCarriersObj[i].mobileCarrierName);
                    }
                }
                var uniqueData = _.uniq(mobileCarrierData);
                if (k > 0) {
                    done(err, { statusCode: '2054' });
                } else if (uniqueData.length != mobileCarrierData.length) {
                    done(err, { statusCode: '2055' });
                } else {
                // result = JSON.parse(result);
                // result.push(mobileCarriersObj);
                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                    + " SET JSON__c = '" + JSON.stringify(mobileCarriersObj)
                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                    + "' WHERE Name = '" + config.mobileCarriers + "'";
                execute.query(sqlQuery, '', function (err, data) {
                    if (err) {
                        logger.error('Error2 in mobileCarriers dao - savemobileCarriers:', err);
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
    * This function lists the MobileCarriers
    */
    getMobileCarriers: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.mobileCarriers + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
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