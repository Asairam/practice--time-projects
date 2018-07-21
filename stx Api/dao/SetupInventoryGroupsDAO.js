/**
 * Importing required modules
 */
var config = require('config');
var async = require('async');
var logger = require('../lib/logger');
var mysql = require('mysql');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var ignoreCase = require('ignore-case');
var _ = require("underscore");
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
   * This method create a single record in data_base
   */
    saveInventoryGroups: function (req, done) {
        try {
            var inventoryGroupsObj = req.body;
            var inventoryGroups = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: 0,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                JSON__c: JSON.stringify([inventoryGroupsObj]),
                Name: config.inventoryGroups
            };
            this.getInventoryGroups(req, function (err, result) {
                if (err || result.statusCode === '9999') {
                    var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                    execute.query(sqlQuery, inventoryGroups, function (err, data) {
                        if (err) {
                            logger.error('Error1 in SetupInventoryGroup dao - editInventoryGroup:', err);
                            done(err, { statusCode: '9999' });
                        } else {
                            done(err, data);
                        }
                    });
                } else {
                    var groupArray = [];
                    var test = result;
                    async.each(test, function (groupdata, next) {
                        groupArray.push(groupdata.inventoryGroupName)
                    });
                    groupArray.push(inventoryGroupsObj.inventoryGroupName);
                    var uniqueData = _.uniq(groupArray);
                    if (uniqueData.length != groupArray.length) {
                        done('err', { statusCode: '2036' });
                    } else {
                        result.push(inventoryGroupsObj);
                        var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                            + " SET JSON__c = '" + JSON.stringify(result)
                            + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                            + "' WHERE Name = '" + config.inventoryGroups + "'";
                        execute.query(sqlQuery, '', function (err, data) {
                            if (err) {
                                logger.error('Error1 in inventoryGroups dao - saveinventoryGroups:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
                    }
                }
            });
        } catch (err) {
            logger.error('Unknown error in inventoryGroups dao - saveinventoryGroups:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * To get InventoryGroups List
     */
    getInventoryGroups: function (req, done) {
        try {
            if (req.params.groupname) {
                var sqlQuery = 'SELECT JSON__c FROM ' + config.dbTables.preferenceTBL + " WHERE Name = 'Inventory Groups'";
                execute.query(sqlQuery, '', function (err, result) {
                    if (result && result.length > 0) {
                        var JSON__c_str = JSON.parse(result[0].JSON__c);
                        result[0].JSON__c = JSON__c_str.sort(function (a, b) {
                            return a.sortOrder - b.sortOrder
                        });
                        done(err, result[0].JSON__c);
                    } else {
                        done(err, { statusCode: '9999' });
                    }
                });
            } else {
                var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL + " WHERE Name = 'Inventory Groups'";
                execute.query(sqlQuery, '', function (err, result) {
                    if (result && result.length > 0) {
                        var JSON__c_str = JSON.parse(result[0].JSON__c);
                        result[0].JSON__c = JSON__c_str.sort(function (a, b) {
                            return a.sortOrder - b.sortOrder
                        });
                        done(err, result[0].JSON__c);
                    } else {
                        done(err, { statusCode: '9999' });
                    }
                });
            }
        } catch (err) {
            logger.error('Unknown error in SetupInventoryGroupsDAO - getSetupInventoryGroups:', err);
            done(err, null);
        }
    },
    editInventoryGroups: function (req, done) {
        try {
            var setupInventoryObj = req.body;
            var updateInventoryName = req.params.updateInventoryName;
            var oldInventoryName = req.params.oldInventoryName;
            var temp = [];
            var index;
            var uniq = false;
            var indexParam = 0;
            this.getInventoryGroups(req, function (err, result) {
                if (err || result.statusCode === '9999') {
                    logger.error('Error1 in SetupInventoryGroup dao - editInventoryGroup:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    /**
                     * uniqueness for service group name
                     */
                    var tempJson = result
                    temp = tempJson;
                    for (var i = 0; i < temp.length; i++) {
                        if (temp && !ignoreCase.equals(oldInventoryName, temp[i].inventoryGroupName) && ignoreCase.equals(setupInventoryObj.updateInventoryName, temp[i].inventoryGroupName)) {
                            uniq = true;
                        } else if (temp && ignoreCase.equals(oldInventoryName, temp[i].inventoryGroupName)) {
                            index = i;
                        }
                    }
                    if (uniq) {
                        done(err, { statusCode: '2033' });
                    } else {
                        temp.splice(index, 1);
                        temp.push(setupInventoryObj);
                        var groupArray = [];
                        async.each(temp, function (groupdata, next) {
                            groupArray.push(groupdata.inventoryGroupName)
                        });
                        // groupArray.push(setupInventoryObj.inventoryGroupName);
                        var uniqueData = _.uniq(groupArray);
                        if (uniqueData.length != groupArray.length) {
                            done('err', { statusCode: '2036' });
                        } else {
                            var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                                + " SET JSON__c = '" + JSON.stringify(temp)
                                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                + "' WHERE Name = '" + config.inventoryGroups + "'";
                            execute.query(sqlQuery, '', function (err, data) {
                                if (err) {
                                    logger.error('Error2 in SetupInventoryGroup dao - editInventoryGroup:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    var searchInvtry = '"inventoryGroups":"' + oldInventoryName + '"';
                                    var proLineSql = "SELECT Id, Groups__c FROM `Product_Line__c` WHERE Groups__c LIKE '%" + searchInvtry + "%'"
                                    var productSql = "UPDATE " + config.dbTables.setupProductTBL
                                        + " SET Inventory_Group__c = '" + updateInventoryName
                                        + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                        + "' WHERE Inventory_Group__c = '" + oldInventoryName + "'"
                                    execute.query(proLineSql, '', function (proLineErr, proLineData) {
                                        if (proLineData && proLineData.length > 0) {
                                            var queries = '';
                                            for (let j = 0; j < proLineData.length; j++) {
                                                var updadeteJson = JSON.parse(proLineData[j].Groups__c);
                                                for (let i = 0; i < JSON.parse(proLineData[j].Groups__c).length; i++) {
                                                    if (JSON.parse(proLineData[j].Groups__c)[i].inventoryGroups === oldInventoryName) {
                                                        updadeteJson[i].inventoryGroups = updateInventoryName;
                                                        queries += mysql.format("UPDATE " + config.dbTables.setupProductLineTBL
                                                            + " SET Groups__c = '" + JSON.stringify(updadeteJson)
                                                            + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                                            + "' WHERE Id = '" + proLineData[j].Id + "';");
                                                    }
                                                }
                                            }
                                            execute.query(queries, '', function (updateErr, updateData) {
                                                if (updateErr) {
                                                    indexParam++
                                                    sendResponse(updateErr, updateData, indexParam, done);
                                                } else {
                                                    indexParam++
                                                    sendResponse(updateErr, updateData, indexParam, done);
                                                }
                                            });
                                        } else {
                                            indexParam++
                                            sendResponse('', '', indexParam, done);
                                        }
                                    });
                                    execute.query(productSql, '', function (productErr, productData) {
                                        if (productErr) {
                                            indexParam++
                                            sendResponse(productErr, productData, indexParam, done);
                                        } else {
                                            indexParam++
                                            sendResponse(productErr, productData, indexParam, done);
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupInventoryGroup dao - editInventoryGroup:', err);
            done(err, { statusCode: '9999' });
        }
    }
}
function sendResponse(err, data, indexParam, done) {
    if (indexParam === 2) {
        done(err, data);
    }
}