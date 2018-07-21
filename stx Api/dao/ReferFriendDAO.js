/**
 * Importing required modules
 */
var logger = require('../lib/logger');
var config = require('config');
var execute = require('../db_connection/db');
var uniqid = require('uniqid');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    referFriend: function(req, done) {
        var referFriendObj = req.body;
        referFriendObj.emailTemplate = referFriendObj.emailTemplate.replace(/\n/g,'').replace(/\t/g,'');
        var referFriendData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [referFriendObj],
            Name: config.referFriend
        };
        this.getreferFriend(req, function(err, result){
            if (result.statusCode === '9999') {
                var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                        execute.query(sqlQuery, referFriendData, function (err, data) {
                            if (err) {
                                logger.error('Error1 in referFriend dao - savereferFriend:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
            } else if(result && result != null) {
                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                    + " SET JSON__c = '" + JSON.stringify(referFriendObj)
                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                    + "' WHERE Name = '" + config.referFriend + "'";
                execute.query(sqlQuery, '', function (err, data) {
                    if (err) {
                        logger.error('Error2 in referFriend dao - savereferFriend:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, data);
                    }
                });
            }
        });
    },
     /**
     * This function lists referFriend
     */
    getreferFriend: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.referFriend + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in referFriend dao - getreferFriend:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                }
            });
        } catch (err) {
            logger.error('Unknown error in referFriend dao - getreferFriend:', err);
            return (err, { statusCode: '9999' });
        }
    }
};