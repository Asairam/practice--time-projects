var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var mail = require('../config/sendMail');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    // Start of code to create Notification
    createNotifications: function(req, done) {
        var notificationsObj =req.body;
        notificationsObj.emailTemplate = notificationsObj.emailTemplate.replace(/\n/g,'').replace(/\t/g,'');
        var notificationsData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [notificationsObj],
            Name: config.apptNotification
        };
        this.getNotifications(req, function(err, result){
            if (result.statusCode === '9999') {
                var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                        execute.query(sqlQuery, notificationsData, function (err, data) {
                            if (err) {
                                logger.error('Error1 in Notifications dao - saveNotifications:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
            } else if(result && result != null) {
                // result = JSON.parse(result);
                // result.push(notificationsObj);
                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                    + " SET JSON__c = '" + JSON.stringify(notificationsObj)
                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                    + "' WHERE Name = '" + config.apptNotification + "'";
                execute.query(sqlQuery, '', function (err, data) {
                    if (err) {
                        logger.error('Error2 in Notification dao - saveNotification:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, data);
                    }
                });
            }
        });
    },
    /**
     * This function lists Notifications
     */
    getNotifications: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.apptNotification + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                } else {
                    logger.error('Error in Notifications dao - getNotifications:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in Notifications dao - getNotifications:', err);
            return (err, { statusCode: '9999' });
        }
    },
     /**
     * This function send Notifications
     */
    sendNotifications: function (req, done) {
        try {
            var toadr = 'akhila-qa@webappclouds.com';
            mail.sendemail(toadr, req.body.emailTemplate, req.body.subject, function(err, response) {
                if (response != null) {
                    done(err, response);
                } else
                done(err, '2056');
            });
        } catch (err) {
            logger.error('Unknown error in Notifications dao - getNotifications:', err);
            return (err, { statusCode: '9999' });
        }
    }
};
