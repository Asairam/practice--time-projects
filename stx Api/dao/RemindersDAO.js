var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var mail = require('../config/sendMail');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    sendReminders: function(req, done) {
        var remindersObj = req.body;
        remindersObj.emailTemplate = remindersObj.emailTemplate.replace(/\n/g,'').replace(/\t/g,'');
        var remindersData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [remindersObj],
            Name: config.apptReminders
        };
        this.getReminders(req, function(err, result){
            if (result.statusCode === '9999') {
                var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                        execute.query(sqlQuery, remindersData, function (err, data) {
                            if (err) {
                                logger.error('Error1 in Reminders dao - saveReminders:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
            } else if(result && result != null) {
                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                    + " SET JSON__c = '" + JSON.stringify(remindersObj)
                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                    + "' WHERE Name = '" + config.apptReminders + "'";
                execute.query(sqlQuery, '', function (err, data) {
                    if (err) {
                        logger.error('Error2 in apptReminders dao - saveReminders:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, data);
                    }
                });
                done(err, { statusCode: '9999' });
            }
        });
    },
    /**
     * This function lists Reminders
     */
    getReminders: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.apptReminders + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in apptReminders dao - apptReminders:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptReminders dao - apptReminders:', err);
            return (err, { statusCode: '9999' });
        }
    },
     /**
     * This function send Reminders
     */
    sendemailReminders: function (req, done) {
        try {
            var toadr = 'akhila-qa@webappclouds.com';
            mail.sendemail(toadr, req.body.emailTemplate, req.body.subject, function(err, response) {
                if (response != null) {
                    done(err, response);
                } else
                done(err, '2056');
            });
        } catch (err) {
            logger.error('Unknown error in apptReminders dao - sendemailReminders:', err);
            return (err, { statusCode: '9999' });
        }
    }
};
