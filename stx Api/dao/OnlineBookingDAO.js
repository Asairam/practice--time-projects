var config = require('config');
var logger = require('../lib/logger');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var _ = require("underscore");
var dateFns = require('./../common/dateFunctions');

module.exports = {
    // Start of code to createUser operation
    createOnlineBooking: function (req, done) {
        var onlineBookingObj = req.body;
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
            JSON__c: [onlineBookingObj],
            Name: config.onlineBooking
        };
        onlineBookingListingData(req, function (err, result) {
            if (result.statusCode === '9999') {
                if (req.body.windowStartOption === req.body.windowEndOption) {
                    if (req.body.windowStartNumber < req.body.windowEndNumber) {
                        var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                        execute.query(sqlQuery, onlineBookingData, function (err, data) {
                            if (err) {
                                logger.error('Error1 in OnlineBooking dao - saveOnlineBooking:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
                    } else {
                        done('err', '2035');
                    }
                } else if (req.body.windowStartOption === 'Days') {
                    if (req.body.windowStartNumber * 24 < req.body.windowEndNumber) {
                        var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                        execute.query(sqlQuery, onlineBookingData, function (err, data) {
                            if (err) {
                                logger.error('Error1 in OnlineBooking dao - saveOnlineBooking:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
                    } else {
                        done('err', '2035');
                    }

                } else if (req.body.windowStartOption === 'Hours') {
                    if (req.body.windowStartNumber  < req.body.windowEndNumber * 24) {
                        var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" + JSON.stringify(onlineBookingObj)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.onlineBooking + "'";
                    execute.query(sqlQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in onlineBooking dao - saveonlineBooking:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                    } else {
                        done('err', '2035');
                    }

                } else {
                    var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                    execute.query(sqlQuery, onlineBookingData, function (err, data) {
                        if (err) {
                            logger.error('Error1 in OnlineBooking dao - saveOnlineBooking:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                }
            } else if (result && result != null) {
                if (req.body.windowStartOption === req.body.windowEndOption) {
                    if (req.body.windowStartNumber <= req.body.windowEndNumber) {
                        var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" +JSON.stringify(onlineBookingObj)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.onlineBooking + "'";
                    execute.query(sqlQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in onlineBooking dao - saveonlineBooking:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                    } else {
                        done('err', '2035');
                    }
                } else if (req.body.windowStartOption === 'Days' && req.body.windowEndOption === 'Hours') {
                    if (req.body.windowStartNumber * 24 <= req.body.windowEndNumber) {
                        var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" + JSON.stringify(onlineBookingObj)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.onlineBooking + "'";
                    execute.query(sqlQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in onlineBooking dao - saveonlineBooking:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                    } else {
                        done('err', '2035');
                    }

                }else if (req.body.windowStartOption === 'Hours' && req.body.windowEndOption === 'Days') {
                    if (req.body.windowStartNumber  <= req.body.windowEndNumber * 24) {
                        var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                        + " SET JSON__c = '" + JSON.stringify(onlineBookingObj)
                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                        + "' WHERE Name = '" + config.onlineBooking + "'";
                    execute.query(sqlQuery, '', function (err, data) {
                        if (err) {
                            logger.error('Error2 in onlineBooking dao - saveonlineBooking:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                    } else {
                        done('err', '2035');
                    }

                } else {
                // result = JSON.parse(result);
                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                    + " SET JSON__c = '" + JSON.stringify(onlineBookingObj)
                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                    + "' WHERE Name = '" + config.onlineBooking + "'";
                execute.query(sqlQuery, '', function (err, data) {
                    if (err) {
                        logger.error('Error2 in onlineBooking dao - saveonlineBooking:', err);
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
    * This function lists the onlineBooking
    */
    getOnlinebooking: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.onlineBooking + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                } else {
                    logger.error('Error in onlineBooking dao - getonlineBooking:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in onlineBooking dao - getonlineBooking:', err);
            return (err, { statusCode: '9999' });
        }
    }
};
/**
     * This function is to get Company Colors List
     */
    var onlineBookingListingData = function(req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.onlineBooking + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                } else {
                    logger.error('Error in onlineBooking dao - getonlineBooking:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in onlineBooking dao - getonlineBooking:', err);
            return (err, { statusCode: '9999' });
        }
    }