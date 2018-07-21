/**
 * Importing required modules
 */
var logger = require('../lib/logger');
var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * Inserting appointment booked record in db
     */
    appointmentsBooking: function (req, done) {
        var bookingObj = req.body;
        var bookingData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [bookingObj],
            // Name: config.occupations
        };
        this.getApptBookingData(req, function(err, data){
            if (data === '') {
                var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                        execute.query(sqlQuery, bookingData, function (err, data) {
                            if (err) {
                                logger.error('Error1 in apptBooking dao - saveapptBooking:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
            } else {
                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                    + " SET JSON__c = '" + JSON.stringify(bookingObj)
                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                    + "' WHERE Name = '" + config.apptBooking + "'";
                execute.query(sqlQuery, '', function (err, data) {
                    if (err) {
                        logger.error('Error2 in apptBooking dao - saveapptBooking:', err);
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, data);
                    }
                });
            }
            
        });
    },
    getApptBookingData: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.apptBooking + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                } else {
                    logger.error('Error in apptBooking dao - getApptBookingData:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in apptBooking dao - getApptBookingData:', err);
            return (err, { statusCode: '9999' });
        }
    }
};