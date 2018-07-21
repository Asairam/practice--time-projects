/**
 * Importing required modules
 */
var config = require('config');
var async = require('async');
var logger = require('../lib/logger');
var mysql = require('mysql');
var uniqid = require('uniqid');
var moment = require('moment');
var execute = require('../db_connection/db');
var _ = require("underscore");
var dateFns = require('./../common/dateFunctions');
module.exports = {
    /**
     * Saving Setup Service
     */
    setupService: function (req, done) {
        try {
            var setupServiceObj = JSON.parse(req.body.setupService);
            var resourceData = [];
            var date = dateFns.getUTCDatTmStr(new Date());
            /**
             * if it is a service record
             */
            var serviceDataObj = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: config.booleanFalse,
                Name: setupServiceObj.serviceName,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                Active__c: setupServiceObj.active,
                Available_For_Client_To_Self_Book__c: null,
                Buffer_After__c: setupServiceObj.priceLevels[0].bufferAfter,
                Client_Facing_Name__c: setupServiceObj.onlineName,
                Department__c: null,
                Deposit_Amount__c: setupServiceObj.depositAmount,
                Deposit_Percent__c: setupServiceObj.depositPercent,
                Deposit_Required__c: setupServiceObj.depositRequired,
                Description__c: setupServiceObj.description,
                Duration_1_Available_For_Other_Work__c: setupServiceObj.priceLevels[0].duration1AvailableForOtherWork,
                Duration_1__c: setupServiceObj.priceLevels[0].duration1,
                Duration_2_Available_For_Other_Work__c: setupServiceObj.priceLevels[0].duration2AvailableForOtherWork,
                Duration_2__c: setupServiceObj.priceLevels[0].duration2,
                Duration_3_Available_For_Other_Work__c: setupServiceObj.priceLevels[0].duration3AvailableForOtherWork,
                Duration_3__c: setupServiceObj.priceLevels[0].duration3,
                Levels__c: JSON.stringify(setupServiceObj.priceLevels),
                No_Discounts__c: null,
                Price__c: setupServiceObj.priceLevels[0].price,
                Resource_Filter__c: setupServiceObj.resourcesFilter,
                ServiceName__c: setupServiceObj.serviceName,
                Service_Group__c: setupServiceObj.serviceGroup,
                Guest_Charge__c: setupServiceObj.guestChargeAmount,
                Taxable__c: setupServiceObj.taxable,
                Worker__c: null,
                Worker_del__c: null,
                Is_Class__c: setupServiceObj.is_Class,
                Max_Attendees__c: null,
                Price_per_Attendee__c: null
            };
            var sqlQuery = 'INSERT INTO ' + config.dbTables.serviceTBL + ' SET ?';
            /**
             * Inserting data in services table
             */
            execute.query(sqlQuery, serviceDataObj, function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Client_Facing') > 0) {
                        done(err, { statusCode: '2034' });
                    } else if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2033' });
                    } else {
                        logger.error('Error in SetupServices dao - saveSetupService:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    var records = [];
                    var resourceLength = (setupServiceObj.resources).length;
                    /**
                     * If resource filter is All/Any then inserting resources
                     * data in Service_Resource table
                     */
                    if (resourceLength > 0) {
                        /**
                         * Inserting data in Service_Resource table
                         */
                        var resourcesSQLQuery = 'INSERT INTO ' + config.dbTables.serviceResourceTBL
                            + ' (Id, OwnerId, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                            + ' SystemModstamp, LastActivityDate, Priority__c, Resource__c, Service__c) VALUES ?';
                        for (var i = 0; i < resourceLength; i++) {
                            records[i] = [uniqid(), serviceDataObj.OwnerId,
                            config.booleanFalse,
                            dateFns.getUTCDatTmStr(new Date()), serviceDataObj.CreatedById,
                            dateFns.getUTCDatTmStr(new Date()), serviceDataObj.LastModifiedById,
                            serviceDataObj.SystemModstamp, dateFns.getUTCDatTmStr(new Date()),
                            setupServiceObj.resources[i].priority,
                            (setupServiceObj.resources[i].name).split('~')[1], serviceDataObj.Id
                            ];
                        }
                        execute.query(resourcesSQLQuery, [records], function (err1, result) {
                            if (err1) {
                                /**
                                 * Transaction mgt
                                 */
                                var rollbackServiceRec = 'DELETE FROM ' + config.dbTables.serviceTBL + ' WHERE Id = "' + serviceDataObj.Id + '"';
                                execute.query(rollbackServiceRec, '', function (ignoreErr, ignoreResult) { });
                                logger.error('Error in SetupServices dao - setupResourceData:', err1);
                                done(err1, { statusCode: '9999' });
                            } else {
                                done(err1, result);
                            }
                        });
                    } else {
                        /**
                         * If resource filter is 'None' then no action on Service_Resource table
                         * just sending the response
                         */
                        done(err, result);
                    }
                }
            });
        } catch (err) {
            logger.log('Unknown error in SetupServices dao - saveSetupService', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This function lists Setup Service records by Group Name
     */
    getSetupServiceByGroupName: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.serviceTBL
                + ' WHERE IsDeleted = ' + config.booleanFalse + ' AND Service_Group__c = "' + req.params.serviceGroupName + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err)
                    logger.error('Error in SetupServices dao - getSetupService : ', err);
                done(err, result);
            });
        } catch (err) {
            logger.log('Unknown error in SetupServices dao - getSetupService : ', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This function lists Active/Inactive Setup Service 
     */
    getSetupServiceActiveInactiveList: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.serviceTBL
                + ' WHERE IsDeleted = ' + config.booleanFalse + ' AND Is_Class__c = ' + config.booleanFalse
                + ' AND Service_Group__c = "' + req.params.serviceGroupName + '"';
            if (parseInt(req.params.active) === config.booleanTrue)
                sqlQuery = sqlQuery + ' AND Active__c = ' + config.booleanTrue;
            execute.query(sqlQuery, '', function (err, result, fields) {
                if (err)
                    logger.error('Error in SetupServices dao - getSetupServiceActiveInactiveList : ', err);
                done(err, result);
            });
        } catch (err) {
            logger.log('Unknown error in SetupServices dao - getSetupServiceActiveInactiveList : ', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This function lists Active/Inactive Setup Classes List
     */
    getSetupClassActiveInactiveList: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.serviceTBL
                + ' WHERE IsDeleted = ' + config.booleanFalse + ' AND Is_Class__c = ' + config.booleanTrue;
            // if (req.params.type === 'true')
            //     sqlQuery = sqlQuery + ' AND Active__c = ' + config.booleanTrue;
            execute.query(sqlQuery, '', function (err, result, fields) {
                if (err)
                    logger.error('Error in SetupServices dao - getSetupClassActiveInactiveList : ', err);
                done(err, result);
            });
        } catch (err) {
            logger.error('Unknown error in SetupServices dao - getSetupClassActiveInactiveList : ', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This function is to fetch single service record
     */
    getServiceRecord: function (req, done) {
        try {
            var sqlQuerySrvs = 'SELECT * FROM ' + config.dbTables.serviceTBL
                + ' WHERE Id = "' + req.params.id + '"';
            var sqlQuerySrvRsrs = 'SELECT r.Id as resourceId, r.Name as resourceName, sc.Name as serviceName, sc.Duration_1__c,'
                + ' sc.Resource_Filter__c, sc.Max_Attendees__c, sc.Active__c, sc.Price_per_Attendee__c, sc.Is_Class__c,'
                + ' sr.Priority__c, sr.Id as srId FROM ' + config.dbTables.serviceTBL + ' sc LEFT JOIN ' + config.dbTables.serviceResourceTBL
                + ' sr ON (sr.Service__c = sc.Id OR sr.Resource__c = sc.Id) LEFT JOIN ' + config.dbTables.resourceTBL + ' r ON r.Id = sr.Resource__c'
                + ' where sc.Id ="' + req.params.id + '" AND sr.IsDeleted = 0 order by sr.Priority__c asc';
            var sqlDependencyQuery1 = 'SELECT "ws" as ws, Service__c FROM Worker_Service__c WHERE Service__c = "' + req.params.id + '"';
            var sqlDependencyQuery2 = 'SELECT "ts" as ts, Service__c FROM Ticket_Service__c WHERE Service__c = "' + req.params.id + '"';
            execute.query(sqlQuerySrvs + '; ' + sqlQuerySrvRsrs + '; ' + sqlDependencyQuery1 + '; ' + sqlDependencyQuery2, '', function (err, result) {
                if (err)
                    logger.error('Error in SetupServices dao - getServiceRecord : ', err);
                done(err, result);
            });
        } catch (err) {
            logger.error('Unknown error in SetupServices dao - getServiceRecord : ', err);
            done(err, { statusCode: '9999' });
        }
    },
    updateSetupService: function (req, done) {
        try {
            var updateObj = JSON.parse(req.body.updateObj);
            var sqlQuery = "UPDATE " + config.dbTables.serviceTBL
                + " SET IsDeleted = '" + config.booleanFalse
                + "', Name = '" + updateObj.serviceName
                + "', CreatedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "', Active__c = '" + updateObj.active
                // + "', Available_For_Client_To_Self_Book__c = '" + updateObj.availableForClientToSelfBookc
                + "', Buffer_After__c = '" + updateObj.priceLevels[0].bufferAfter
                + "', Client_Facing_Name__c = '" + updateObj.onlineName
                // + "', Department__c = '" + updateObj.Departmentc
                + "', Deposit_Amount__c = '" + updateObj.depositAmount
                + "', Deposit_Percent__c = '" + updateObj.depositPercent
                + "', Deposit_Required__c = '" + updateObj.depositRequired
                + "', Description__c = '" + updateObj.description
                + "', Duration_1_Available_For_Other_Work__c = '" + updateObj.priceLevels[0].duration1AvailableForOtherWork
                + "', Duration_1__c = '" + updateObj.priceLevels[0].duration1
                + "', Duration_2_Available_For_Other_Work__c = '" + updateObj.priceLevels[0].duration2AvailableForOtherWork
                + "', Duration_2__c = '" + updateObj.priceLevels[0].duration2
                + "', Duration_3_Available_For_Other_Work__c = '" + updateObj.priceLevels[0].duration3AvailableForOtherWork
                + "', Duration_3__c = '" + updateObj.priceLevels[0].duration3
                + "', Levels__c = '" + JSON.stringify(updateObj.priceLevels)
                // + "', No_Discounts__c = '" + updateObj.NoDiscounts
                + "', Price__c = '" + updateObj.priceLevels[0].price
                + "', Resource_Filter__c = '" + updateObj.resourcesFilter
                + "', ServiceName__c = '" + updateObj.serviceName
                + "', Service_Group__c = '" + updateObj.serviceGroup
                + "', Taxable__c = '" + updateObj.taxable
                + "', Guest_Charge__c = '" + updateObj.guestChargeAmount
                // + "', Worker__c = '" + updateObj.Worker
                //  + "', Worker_del__c = '" + updateObj.Workerdel
                + "', Is_Class__c = '" + updateObj.is_Class
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                // + "', Price_per_Attendee__c = '" + updateObj.PriceperAttendee
                + "' WHERE Id = '" + req.params.id + "'";
            execute.query(sqlQuery, '', function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Client_Facing') > 0) {
                        done(err, { statusCode: '2034' });
                    } else if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2033' });
                    } else {
                        logger.error('Error in SetupServices dao - saveSetupService:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    var sqlDelete = 'DELETE FROM ' + config.dbTables.serviceResourceTBL + ' WHERE Service__c = "' + req.params.id + '"';
                    execute.query(sqlDelete, '', function (ignoreErr, ignoreResult) {
                        if (ignoreErr) {
                            logger.error('Error in SetupServices dao - deleting the records: ', ignoreErr);
                            done(err, { statusCode: '9999' });
                        } else {
                            var records = [];
                            var resourceLength = (updateObj.resources).length;
                            /**
                             * If resource filter is All/Any then inserting resources
                             * data in Service_Resource table
                             */
                            if (resourceLength > 0) {
                                /**
                                 * Inserting data in Service_Resource table
                                 */
                                for (var i = 0; i < resourceLength; i++) {
                                    records[i] = [uniqid(), updateObj.OwnerId,
                                    config.booleanFalse,
                                    dateFns.getUTCDatTmStr(new Date()), updateObj.CreatedById,
                                    dateFns.getUTCDatTmStr(new Date()), uniqid(),
                                    dateFns.getUTCDatTmStr(new Date()), dateFns.getUTCDatTmStr(new Date()),
                                    updateObj.resources[i].priority,
                                    (updateObj.resources[i].name).split('~')[1], req.params.id
                                    ];
                                }
                                var resourcesSQLQuery = 'INSERT INTO ' + config.dbTables.serviceResourceTBL
                                    + ' (Id, OwnerId, IsDeleted, CreatedDate, CreatedById, LastModifiedDate,  LastModifiedById,'
                                    + ' SystemModstamp, LastActivityDate, Priority__c, Resource__c, Service__c) VALUES ?';
                                execute.query(resourcesSQLQuery, [records], function (err1, result) {
                                    if (err1) {
                                        logger.error('Error in SetupServices dao - updateSetupService:', err1);
                                        done(err1, { statusCode: '9999' });
                                    } else {
                                        done(err1, result);
                                    }
                                });
                            } else {
                                /**
                                 * If resource filter is 'None' then no action on Service_Resource table
                                 * just sending the response
                                 */
                                done(err, result);
                            }
                        }
                    });
                }
            });
        } catch (err) {
            logger.log('Unknown error in SetupResources dao - editResources:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This function is to deete service details record
     */
    deleteSetupService: function (req, done) {
        try {
            var newDate = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');
            var name = req.params.name + '-' + newDate
            var sqlQuery = "UPDATE " + config.dbTables.serviceTBL
                + " SET IsDeleted = '" + config.booleanTrue
                + "', Name = '" + name
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "' WHERE Id = '" + req.params.id + "'";
            execute.query(sqlQuery, function (err, result) {
                if (err) {
                    logger.error('Error in SetupServices dao - deleteSetupServices dao:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, { statusCode: '1013' });
                }
            });
        } catch (err) {
            logger.log('Unknown error in SetupServices dao - deleteSetupServices dao:', err);
            done(err, null);
        }
    }
};
