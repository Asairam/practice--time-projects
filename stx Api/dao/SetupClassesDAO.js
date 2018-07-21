/**
 * Importing required modules
 */
var cfg = require('config');
var async = require('async');
var logger = require('../lib/logger');
var mysql = require('mysql');
var moment = require('moment');
var uniqid = require('uniqid');
var _ = require("underscore");
var execute = require('../db_connection/db');
var dateFns = require('./../common/dateFunctions');
module.exports = {
    /**
     * Saving Setup Classes
     */
    saveClasses: function (req, done) {
        try {
            var date = new Date();
            var setupServiceObj = JSON.parse(req.body.setupService);
            var resourceData = [];
            var resourceInsertData = [];
            var setupServiceData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                Name: setupServiceObj.name,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                Active__c: setupServiceObj.active,
                Client_Facing_Name__c: '',
                Department__c: '',
                Duration_1__c: setupServiceObj.duration,
                Resource_Filter__c: setupServiceObj.resourcesUsed,
                Deposit_Amount__c: setupServiceObj.depositAmount,
                Deposit_Required__c: setupServiceObj.depositRequired,
                Duration_1_Available_For_Other_Work__c: setupServiceObj.description,
                Deposit_Required__c: setupServiceObj.depositRequired,
                Description__c: setupServiceObj.description,
                Levels__c: JSON.stringify(setupServiceObj.priceLevels),
                Service_Group__c: setupServiceObj.serviceGroup,
                Taxable__c: setupServiceObj.taxable,
                Price_per_Attendee__c: parseFloat(setupServiceObj.pricePerAttendee).toFixed(2),
                Max_Attendees__c: setupServiceObj.maxAttendees,
                Is_Class__c: setupServiceObj.is_Class
            };
            var sqlQuery = 'INSERT INTO ' + cfg.dbTables.serviceTBL + ' SET ?';
            execute.query(sqlQuery, setupServiceData, function (err, result, fields) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2033' });
                    } else {
                        logger.error('Error in SetupServices dao - saveSetupService:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    if (setupServiceObj.resourcesUsed != 'None' && setupServiceObj.resources.length > 0) {
                        for (var j = 0; j < setupServiceObj.resources.length; j++) {
                            resourceData.push(setupServiceObj.resources[j].resourceName);
                        }
                        var uniqueData = _.uniq(resourceData);
                        if (uniqueData.length === resourceData.length) {
                            for (var i = 0; i < setupServiceObj.resources.length; i++) {
                                resourceInsertData.push([uniqid(), uniqid(), 0, date, uniqid(),
                                    date, uniqid(), date, date, setupServiceObj.resources[i].priority,
                                setupServiceObj.resources[i].resourceName, setupServiceData.Id])

                            }
                            var insertQuery = 'INSERT INTO ' + cfg.dbTables.serviceResourceTBL
                                + ' (Id, OwnerId, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                + ' SystemModstamp, LastActivityDate, Priority__c, Resource__c,'
                                + ' Service__c) VALUES ?';
                            if (resourceInsertData.length > 0) {
                                execute.query(insertQuery, [resourceInsertData], function (err, result1, fields) {
                                    if (err) {
                                        logger.error('Error in SetupServices dao - setupResourceData:', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, result);
                                    }
                                });
                            } else {
                                done(err, result);
                            }
                        } else {
                            done('err', { statusCode: '2045' });
                        }
                    } else {
                        done(err, result);
                    }
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupServices dao - saveSetupService', err);
            done(err, { statusCode: '9999' });
        }
    },
    getResource: function (req, done) {
        id = req.params.id;
        var resrdata = [];
        var selecsrtQuery = 'SELECT * FROM Service_Resource__c WHERE Service__c="' + id + '" and IsDeleted = 0'
        var selectscQuery = 'SELECT sc.Name as serviceName,sc.Duration_1__c,sc.Resource_Filter__c, sc.Max_Attendees__c,sc.Active__c, sc.Price_per_Attendee__c, sc.Is_Class__c FROM Service__c sc WHERE sc.Id="' + id + '" and sc.IsDeleted = 0'
        var sql = ' SELECT r.Id as resourceId, r.Name as resourceName,sc.Name as serviceName,sc.Duration_1__c,sc.Resource_Filter__c, sc.Max_Attendees__c,sc.Active__c, sc.Price_per_Attendee__c, sc.Is_Class__c, sr.Priority__c, sr.Id as srId FROM Service__c sc' +
            ' LEFT JOIN Service_Resource__c sr ON (sr.Service__c = sc.Id OR sr.Resource__c = sc.Id)' +
            ' LEFT JOIN Resource__c r ON r.Id = sr.Resource__c' +
            ' where sc.Id ="' + id + '" AND sr.IsDeleted = 0 order by sr.Priority__c asc';
        execute.query(selecsrtQuery, function (error, results, fields) {
            if (error != null) {
                logger.error('Error in SetupClassesDAO dao - getResource:', error);
                done(error, '9999');
            } else if (results.length > 0) {
                execute.query(sql, function (error, results, fields) {
                    async.each(results, function (resdata, next) {
                        resrdata.push({
                            resourceId: resdata.resourceId,
                            resourceName: resdata.resourceName,
                            Priority__c: resdata.Priority__c,
                            srId: resdata.srId
                        });
                    });
                    if (error != null) {
                        logger.error('Error in SetupClassesDAO dao - getResource:', error);
                        done(error, '9999');
                    } else {
                        done(error, { resrdata, results });
                    }
                });
            } else {
                execute.query(selectscQuery, function (error, results, fields) {
                    if (error != null) {
                        logger.error('Error in SetupClassesDAO dao - getResource:', error);
                        done(error, '9999');
                    } else {
                        done(error, { resrdata, results });
                    }
                });
            }
        });
    },
    deleteResource: function (req, done) {
        var sqlQuery = 'UPDATE Service_Resource__c'
            + ' SET IsDeleted = 1'
            + ' WHERE Service__c = "' + req.params.srId + '"';
        execute.query(sqlQuery, function (err, result) {
            if (err) {
                logger.error('Error in SetupClassesDAO - deleteResource:', err);
                done(err, { statusCode: '9999' });
            } else {
                done(err, { statusCode: '2041' });
            }
        });
    },
    deleteClasses: function (req, done) {
        var date = new Date();
        var newDate = moment(date).format('YYYY-MM-DD HH:MM:SS');
        var name = req.params.name + '-' + newDate
        var selectQuery = 'select * from Worker_Service__c'
            + ' WHERE Service__c = "' + req.params.id + '" and isDeleted = 0';
        if (req.params.type === 'Edit') {
            execute.query(selectQuery, function (err, result) {
                if (err) {
                    logger.error('Error in SetupProductLineDAO - getSetupProductLine:', err);
                    done(err, result);
                } else if (result.length > 0) {
                    done(err, { statusCode: '2040' });
                } else {
                    done(err, { statusCode: '2041' });
                }
            });
        } else {
            execute.query(selectQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupProductLineDAO - getSetupProductLine:', err);
                    done(err, result);
                } else if (result.length > 0) {
                    done(err, { statusCode: '2040' });
                } else {
                    var sqlQuery = 'UPDATE ' + cfg.dbTables.serviceTBL
                        + ' SET IsDeleted = 1'
                        + ', Name = "' + name
                        + '", LastModifiedDate = "' + date
                        + '" WHERE Id = "' + req.params.id + '"';
                    execute.query(sqlQuery, function (err, result) {
                        if (err) {
                            logger.error('Error in SetupProductLineDAO - editSetupProductLine:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, { statusCode: '2041' });
                        }
                    });
                }
            });
        }
    },
    editClasses: function (req, done) {
        var updateObj = req.body;
        var resourceData = [];
        var priorityData = [];
        var resourceUpdateData = [];
        var Id = req.params.id;
        var indexParm = 0;
        var queries = '';
        var selectQuery = 'Select Id From Service_Resource__c Where Service__c ="' + Id + '" And IsDeleted = 0';
        queries += mysql.format('UPDATE Service__c SET  IsDeleted="' + 0 + '", Active__c="'
            + updateObj.classActive + '", LastModifiedDate="' + dateFns.getUTCDatTmStr(new Date()) + '", Name="' + updateObj.className + '", Duration_1__c="'
            + updateObj.duration + '", Max_Attendees__c="' + updateObj.maxAttendees + '", Price_per_Attendee__c="'
            + parseFloat(updateObj.pricePerAttendee).toFixed(2) + '", Resource_Filter__c="' + updateObj.resourcesUsed + '" WHERE Id="' + Id + '";');
        execute.query(selectQuery, function (error, resultss) {
            var data = [];
            for (var k = 0; k < resultss.length; k++) {
                data.push(resultss[k].Id);
            }
            if (error) {
                done(error, '9999');
            } else if (data.length > 0 && updateObj.resourcesUsed === 'None') {
                for (var z = 0; z < data.length; z++) {
                    queries += mysql.format('UPDATE Service_Resource__c'
                        + ' SET IsDeleted = 1'
                        + ' WHERE Id = "' + data[z] + '";');
                }
            }
            for (var k = 0; k < updateObj.resources.length; k++) {
                if (updateObj.resources[k].remove) {
                    data.push(updateObj.resources[k].srId);
                    queries += mysql.format('UPDATE Service_Resource__c'
                        + ' SET IsDeleted = 1'
                        + ' WHERE Id = "' + data[k] + '";');
                }
            }
            if (updateObj.resources.length > 0 && updateObj.resourcesUsed != 'None') {
                for (var j = 0; j < updateObj.resources.length; j++) {
                    if (updateObj.resources[j].srId == '') {
                        resourceData.push(updateObj.resources[j].resourceId);
                        if (updateObj.resources[j].Priority__c != null && updateObj.resources[j].Priority__c != '')
                            priorityData.push(updateObj.resources[j].Priority__c);
                    } else {
                        resourceData.push(updateObj.resources[j].resourceId);
                        if (updateObj.resources[j].Priority__c != null && updateObj.resources[j].Priority__c != '')
                            priorityData.push(updateObj.resources[j].Priority__c);
                    }
                }
                var uniqueData = _.uniq(resourceData);
                var uniqueData1 = _.uniq(priorityData);
                if ((uniqueData.length != resourceData.length) && (uniqueData1.length != priorityData.length)) {
                    done('err', { statusCode: '2047' });
                } else if (uniqueData.length != resourceData.length) {
                    done('err', { statusCode: '2045' });
                } else if (uniqueData1.length != priorityData.length) {
                    done('err', { statusCode: '2046' });
                } else {
                    for (var i = 0; i < updateObj.resources.length; i++) {
                        if (updateObj.resources[i].srId != '') {
                            queries += mysql.format('UPDATE Service_Resource__c SET  Resource__c="' + updateObj.resources[i].resourceId + '", Priority__c="'
                                + updateObj.resources[i].Priority__c + '" WHERE Service__c="' + Id + '" AND Id= "' + updateObj.resources[i].srId + '";');
                        } else {
                            resourceUpdateData.push([uniqid(), uniqid(), 0, dateFns.getUTCDatTmStr(new Date()), uniqid(),
                            dateFns.getUTCDatTmStr(new Date()), uniqid(), dateFns.getUTCDatTmStr(new Date()), dateFns.getUTCDatTmStr(new Date()), updateObj.resources[i].Priority__c,
                            updateObj.resources[i].resourceId, Id]);
                        }
                    }
                    var insertQuery = 'INSERT INTO ' + cfg.dbTables.serviceResourceTBL
                        + ' (Id, OwnerId, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                        + ' SystemModstamp, LastActivityDate, Priority__c, Resource__c,'
                        + ' Service__c) VALUES ?';
                    if (queries.length > 0) {
                        execute.query(queries, function (err, result) {
                            if (err != null) {
                                if (err.sqlMessage.indexOf('Name') > 0) {
                                    indexParm++;
                                    sendResponse(indexParm, err, { statusCode: '2033' }, done);
                                } else {
                                    indexParm++;
                                    sendResponse(indexParm, err, { statusCode: '9999' }, done);
                                }
                            } else {
                                indexParm++;
                                sendResponse(indexParm, err, result, done);
                            }
                        });
                    }
                    if (resourceUpdateData.length > 0) {
                        execute.query(insertQuery, [resourceUpdateData], function (err, result1) {
                            if (err) {
                                indexParm++;
                                sendResponse(indexParm, err, { statusCode: '9999' }, done);
                            } else {
                                indexParm++;
                                sendResponse(indexParm, err, result1, done);
                            }
                        });
                    }

                }
            } else if (queries.length > 0) {
                execute.query(queries, function (err, result) {
                    if (err != null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            indexParm++;
                            sendResponse(indexParm, err, { statusCode: '2033' }, done);
                        } else {
                            indexParm++;
                            sendResponse(indexParm, err, { statusCode: '9999' }, done);
                        }
                    } else {
                        indexParm++;
                        sendResponse(indexParm, err, result, done);
                    }
                });
            }
        });
    }
};
function sendResponse(indexParm, err, result, done) {
    if (indexParm === 1) {
        done(err, result);
    }
}