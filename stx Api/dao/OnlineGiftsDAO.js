/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    saveOnlineGifts: function(req, done) {
        var onlineGiftsObj = req.body;
        onlineGiftsObj.emailTemplate = onlineGiftsObj.emailTemplate.replace(/\n/g,'').replace(/\t/g,'');
        var onlineGiftsData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [onlineGiftsObj],
            Name: config.giftsOnline
        };
        this.getOnlineGifts(req, function(err, result){
            if (result.statusCode === '9999') {
                var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                        execute.query(sqlQuery, onlineGiftsData, function (err, data) {
                            if (err) {
                                logger.error('Error1 in OnlineGifts dao - saveOnlineGifts:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
            } else if(result && result != null) {
                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                    + " SET JSON__c = '" + JSON.stringify(onlineGiftsObj)
                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                    + "' WHERE Name = '" + config.giftsOnline + "'";
                execute.query(sqlQuery, '', function (err, data) {
                    if (err) {
                        logger.error('Error2 in giftsOnline dao - saveOnlineGifts:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, data);
                    }
                });
            }
        });
    },
    /**
     * This function lists OnlineGifts
     */
    getOnlineGifts: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.giftsOnline + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in OnlineGifts dao - getOnlineGifts:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                }
            });
        } catch (err) {
            logger.error('Unknown error in OnlineGifts dao - getOnlineGifts:', err);
            return (err, { statusCode: '9999' });
        }
    }
};