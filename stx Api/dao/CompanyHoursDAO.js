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
     * This function is to saves CompanyHours into db
     */
    saveCompanyHours: function (req, done) {
        var date = new Date();
        var companyHoursObj = req.body;
        var companyHoursData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            Name: companyHoursObj.description,
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            FridayEndTime__c: companyHoursObj.fri_end,
            FridayStartTime__c: companyHoursObj.fri_start,
            MondayEndTime__c: companyHoursObj.mon_end,
            MondayStartTime__c: companyHoursObj.mon_start,
            SaturdayEndTime__c: companyHoursObj.sat_end,
            SaturdayStartTime__c: companyHoursObj.sat_start,
            SundayEndTime__c: companyHoursObj.sun_end,
            SundayStartTime__c: companyHoursObj.sun_start,
            ThursdayEndTime__c: companyHoursObj.thur_end,
            ThursdayStartTime__c: companyHoursObj.thur_start,
            TimeZoneSidKey__c: companyHoursObj.timeZone,
            TuesdayEndTime__c: companyHoursObj.tue_end,
            TuesdayStartTime__c: companyHoursObj.tue_start,
            WednesdayEndTime__c: companyHoursObj.wed_end,
            WednesdayStartTime__c: companyHoursObj.wed_start,
            isActive__c: companyHoursObj.active,
            isDefault__c: companyHoursObj.companyHourse
        };
        if (companyHoursObj.companyHourse === 1) {
            var selectQuery = "UPDATE " + config.dbTables.companyHoursTBL + " SET isDefault__c = 0  WHERE isDefault__c = 1";
        } else {
            var selectQuery = "Select * From " + config.dbTables.companyHoursTBL + " WHERE isDeleted = 0";
        }
        if (!(timeCheck(companyHoursObj.sun_start, companyHoursObj.sun_end))) {
            done(null, { statusCode: '2062' });
        } else if (!(timeCheck(companyHoursObj.mon_start, companyHoursObj.mon_end))) {
            done(null, { statusCode: '2063' });
        } else if (!(timeCheck(companyHoursObj.tue_start, companyHoursObj.tue_end))) {
            done(null, { statusCode: '2064' });
        } else if (!(timeCheck(companyHoursObj.wed_start, companyHoursObj.wed_end))) {
            done(null, { statusCode: '2065' });
        } else if (!(timeCheck(companyHoursObj.thur_start, companyHoursObj.thur_end))) {
            done(null, { statusCode: '2066' });
        } else if (!(timeCheck(companyHoursObj.fri_start, companyHoursObj.fri_end))) {
            done(null, { statusCode: '2067' });
        } else if (!(timeCheck(companyHoursObj.sat_start, companyHoursObj.sat_end))) {
            done(null, { statusCode: '2068' });
        } else {
            var sqlQuery = 'INSERT INTO ' + config.dbTables.companyHoursTBL + ' SET ?';
            execute.query(selectQuery, function (err, result) {
                if (err) {
                    done(err, { statusCode: '9999' });
                } else {
                    execute.query(sqlQuery, companyHoursData, function (err, data) {
                        if (err !== null) {
                            if (err.sqlMessage.indexOf('Name') > 0) {
                                done(err, { statusCode: '2079' });
                            } else {
                                logger.error('Error1 in CompanyHours dao - saveCompanyHours:', err);
                                done(err, { statusCode: '9999' });
                            }
                        } else {
                            done(err, data);
                        }
                    });
                }
            });
        }
    },
    /**
     * This function lists the CompanyHours
     */
    getCompanyHours: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.companyHoursTBL
                + ' WHERE isDeleted = 0';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CompanyHours dao - getCompanyHours:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in CompanyHours dao - getCompanyHours:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
     * This method edit single record by using id
     */
    updateCompanyHours: function (req, done) {
        try {
            var updateObj = req.body;
            var curDate = new Date();
            var sqlQuery = "UPDATE " + config.dbTables.companyHoursTBL
                + " SET FridayEndTime__c = '" + updateObj.fri_end
                + "', Name = '" + updateObj.description
                + "', FridayStartTime__c = '" + updateObj.fri_start
                + "', MondayStartTime__c = '" + updateObj.mon_start
                + "', MondayEndTime__c = '" + updateObj.mon_end
                + "', SaturdayEndTime__c = '" + updateObj.sat_end
                + "', SaturdayStartTime__c = '" + updateObj.sat_start
                + "', SundayEndTime__c = '" + updateObj.sun_end
                + "', SundayStartTime__c = '" + updateObj.sun_start
                + "', ThursdayEndTime__c = '" + updateObj.thur_end
                + "', ThursdayStartTime__c = '" + updateObj.thur_start
                + "', TimeZoneSidKey__c = '" + updateObj.timeZone
                + "', TuesdayEndTime__c = '" + updateObj.tue_end
                + "', TuesdayStartTime__c = '" + updateObj.tue_start
                + "', WednesdayEndTime__c = '" + updateObj.wed_end
                + "', WednesdayStartTime__c = '" + updateObj.wed_start
                + "', isActive__c = '" + updateObj.active
                + "', isDefault__c = '" + updateObj.companyHourse
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + req.params.id + "'";
            if (updateObj.companyHourse === 1)
                var selectQuery = "UPDATE " + config.dbTables.companyHoursTBL + " SET isDefault__c = 0  WHERE isDefault__c = 1";
            else
                var selectQuery = "Select * from " + config.dbTables.companyHoursTBL + " WHERE isDeleted = 0";
            if (!(timeCheck(updateObj.sun_start, updateObj.sun_end))) {
                done(null, { statusCode: '2062' });
            } else if (!(timeCheck(updateObj.mon_start, updateObj.mon_end))) {
                done(null, { statusCode: '2063' });
            } else if (!(timeCheck(updateObj.tue_start, updateObj.tue_end))) {
                done(null, { statusCode: '2064' });
            } else if (!(timeCheck(updateObj.wed_start, updateObj.wed_end))) {
                done(null, { statusCode: '2065' });
            } else if (!(timeCheck(updateObj.thur_start, updateObj.thur_end))) {
                done(null, { statusCode: '2066' });
            } else if (!(timeCheck(updateObj.fri_start, updateObj.fri_end))) {
                done(null, { statusCode: '2067' });
            } else if (!(timeCheck(updateObj.sat_start, updateObj.sat_end))) {
                done(null, { statusCode: '2068' });
            } else {
                execute.query(selectQuery, function (err, result) {
                    if (err) {
                        done(err, { statusCode: '9999' });
                    } else {
                        execute.query(sqlQuery, function (err, result) {
                            if (err) {
                                if (err.sqlMessage.indexOf('Name') > 0) {
                                    done(err, { statusCode: '2079' });
                                } else {
                                    logger.error('Error1 in CompanyHours dao - saveCompanyHours:', err);
                                    done(err, { statusCode: '9999' });
                                }
                            }
                            else {
                                done(err, result);
                            }
                        });
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in CompanyHours - updateCompanyHours:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This function is to saves CompanyHours into db
     */
    saveCustomHours: function (req, done) {
        var date = new Date();
        var customHoursObj = req.body;
        // var newDate = moment(customHoursObj.customDate).format('MM/DD/YYYY');
        var companyHoursData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            Name: customHoursObj.description,
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            BusinessHoursId__c: '',
            Company_Hours__c: customHoursObj.companyHrsId,
            Date__c: customHoursObj.customDate,
            EndTime__c: customHoursObj.customEnd,
            IsWorkerHours__c: '',
            StartTime__c: customHoursObj.customStart,
            UserId__c: '',
            All_Day_Off__c: customHoursObj.customAllDay
        };
        var sqlQuery = 'INSERT INTO ' + config.dbTables.customHoursTBL + ' SET ?';
        if ((customHoursObj.customStart != undefined && customHoursObj.customEnd != undefined) && !(timeCheck(customHoursObj.customStart, customHoursObj.customEnd))) {
            done(null, { statusCode: '2069' });
        } else {
            execute.query(sqlQuery, companyHoursData, function (err, data) {
                if (err) {
                    logger.error('Error1 in CompanyHours dao - saveCustomHours:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, data);
                }
            });
        }
    },
    /**
     *  for cusom hrs Getting
     */
    getCompanyCustomHours: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.customHoursTBL
                + ' WHERE isDeleted = 0 and Company_Hours__c ="' + req.params.id + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CompanyHours dao - getCustomHours:', err);
                    done(err, { statusCode: '9999' });

                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in CompanyHours dao - getCustomHours:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
     * This method edit single record by using id
     */
    updateCompanyCustomHours: function (req, done) {
        try {
            var updateObj = req.body;
            var curDate = new Date();
            var sqlQuery = "UPDATE " + config.dbTables.customHoursTBL
                + " SET EndTime__c = '" + updateObj.customEnd
                + "', Name = '" + updateObj.description
                + "', All_Day_Off__c = '" + updateObj.customAllDay
                + "', StartTime__c = '" + updateObj.customStart
                + "', Date__c = '" + updateObj.customDate
                + "' WHERE Id = '" + updateObj.customHrsId + "'";
            if ((updateObj.customStart != undefined && updateObj.customEnd != undefined) && !(timeCheck(updateObj.customStart, updateObj.customEnd))) {
                done(null, { statusCode: '2069' });
            } else {
                execute.query(sqlQuery, function (err, result) {
                    if (err) {
                        done(err, { statusCode: '9999' });
                    } else {
                        done(err, result);
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in CompanyHours - updateCompanyHours:', err);
            done(err, { statusCode: '9999' });
        }
    },
    deleteCompanyCustomHours: function (req, done) {
        try {
            var sqlQuery = 'UPDATE ' + config.dbTables.customHoursTBL
                + ' SET IsDeleted = 1'
                + ' WHERE Id = "' + req.params.id + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in CompanyHours DAO - deleteCustomHours:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in CompanyHours DAO - deleteCustomHours:', err);
            done(err, null);
        }
    }
};

function timeCheck(startTime, endTime) {
    if (startTime != '' && endTime != '' && startTime.split(' ')[1] === 'PM' && endTime.split(' ')[1] === 'AM') {
        return false;
    } else if (startTime != '' && endTime != ''
        && (startTime.split(' ')[1] === endTime.split(' ')[1])
        && (parseInt(startTime.split(' ')[0].split(':')[0]) > parseInt(endTime.split(' ')[0].split(':')[0]))) {
        return false;
    } else if (startTime != '' && endTime != ''
        && (startTime.split(' ')[1] === endTime.split(' ')[1])
        && (parseInt(startTime.split(' ')[0].split(':')[1]) > parseInt(endTime.split(' ')[0].split(':')[1]))) {
        return false;
    } else if (startTime != '' && endTime != ''
        && (startTime.split(' ')[1] === endTime.split(' ')[1])
        && (parseInt(startTime.split(' ')[0].split(':')[0]) === parseInt(endTime.split(' ')[0].split(':')[0]))
        && (parseInt(startTime.split(' ')[0].split(':')[1]) === parseInt(endTime.split(' ')[0].split(':')[1]))) {
        return false;
    } else {
        return true;
    }
}
