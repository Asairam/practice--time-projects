/**
 * Importing required modules
 */
var config = require('config');
var async = require('async');
var logger = require('../lib/logger');
var mysql = require('mysql');
var moment = require('moment');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var _ = require("underscore");
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * This method create a single record in data_base
     */
    saveSetupProductLine: function (req, done) {
        try {
            var setupProductLineObj = JSON.parse(req.body.productLineObj);
            var groupsData = [];
            var unitOfMeasuresData = [];
            var suppliersData = {
                Id: uniqid(),
                OwnerId: uniqid(),
                IsDeleted: config.booleanFalse,
                Name: setupProductLineObj.productLineName,
                CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                CreatedById: uniqid(),
                LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                LastModifiedById: uniqid(),
                SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                Active__c: setupProductLineObj.active,
                Color__c: setupProductLineObj.productColor,
                Groups__c: JSON.stringify(setupProductLineObj.inventoryGroups),
                Units_of_Measure__c: JSON.stringify(setupProductLineObj.unitOfMeasures)
            }
            var sqlQuery = 'INSERT INTO ' + config.dbTables.setupProductLineTBL + ' SET ?';
            for (var i = 0; i < setupProductLineObj.inventoryGroups.length; i++) {
                groupsData.push(setupProductLineObj.inventoryGroups[i].inventoryGroups);
            }
            for (var j = 0; j < setupProductLineObj.unitOfMeasures.length; j++) {
                unitOfMeasuresData.push(setupProductLineObj.unitOfMeasures[j].unitOfMeasures);
            }
            var uniqueData = _.uniq(groupsData);
            var uniqueMeasuresData = _.uniq(unitOfMeasuresData);
            if (uniqueData.length === groupsData.length && uniqueMeasuresData.length === unitOfMeasuresData.length) {
                execute.query(sqlQuery, suppliersData, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            done(err, { statusCode: '2033' });
                        } else {
                            logger.error('Error in SetupProductLineDAO - saveSetupProductLine:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }

                });
            } else {
                done('err', { statusCode: '2042' });
            }

        } catch (err) {
            logger.error('Unknown error in SetupProductLineDAO - saveSetupProductLine:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method fetches all data from ProductLine
     */
    getSetupProductLine: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.setupProductLineTBL + ' WHERE IsDeleted = 0 ';
            if (parseInt(req.params.inActive) === config.booleanTrue)
                sqlQuery = sqlQuery + ' AND Active__c = ' + req.params.inActive;
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupProductLineDAO - getSetupProductLine:', err);
                    done(err, result);
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupProductLineDAO - getSetupProductLine:', err);
            done(err, null);
        }
    },
    deleteSetupProductLine: function (req, done) {
        try {
            var date = new Date();
            var newDate = moment(date).format('YYYY-MM-DD HH:MM:SS');
            var name = req.params.name + '-' + newDate
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.setupProductTBL;
            sqlQuery = sqlQuery + ' WHERE Product_Line__c = "' + req.params.id + '" and isDeleted=0';
            if (req.params.type === 'Edit') {
                execute.query(sqlQuery, '', function (err, result) {
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
                execute.query(sqlQuery, '', function (err, result) {
                    if (err) {
                        logger.error('Error in SetupProductLineDAO - getSetupProductLine:', err);
                        done(err, result);
                    } else if (result.length > 0) {
                        done(err, { statusCode: '2040' });
                    } else {
                        var sqlQuery = 'UPDATE ' + config.dbTables.setupProductLineTBL
                            + ' SET IsDeleted = "' + config.booleanTrue
                            + '", Name = "' + name
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
        } catch (err) {
            logger.error('Unknown error in SetupProductLineDAO - getSetupProductLine:', err);
            done(err, null);
        }
    },

    deleteInventoryGroup: function (req, done) {
        try {
            var sqlQuery = 'SELECT Inventory_Group__c FROM ' + config.dbTables.setupProductTBL;
            sqlQuery = sqlQuery + ' WHERE Inventory_Group__c = "' + req.params.name + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in SetupProductLineDAO - getSetupProductLine:', err);
                    done(err, result);
                } else if (result.length > 0) {
                    done(err, { statusCode: '2040' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in SetupProductLineDAO - getSetupProductLine:', err);
            done(err, null);
        }
    },
    /**
     * This method edit single record by using id
     */
    editSetupProductLine: function (req, done) {
        try {
            var updateObj = req.body;
            var groupsData = [];
            var unitOfMeasuresData = [];
            var sqlQuery = "UPDATE " + config.dbTables.setupProductLineTBL
                + " SET IsDeleted = '" + config.booleanFalse
                + "', Name = '" + updateObj.updateProductLineName
                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                + "', Active__c = '" + updateObj.updateActive
                + "', Color__c = '" + updateObj.updateProductColor
                + "', Groups__c = '" + JSON.stringify(updateObj.updateInventoryGroups)
                + "', Units_of_Measure__c = '" + JSON.stringify(updateObj.updateUnitOfMeasures)
                + "' WHERE Id = '" + req.params.id + "'";
            for (var i = 0; i < updateObj.updateInventoryGroups.length; i++) {
                groupsData.push(updateObj.updateInventoryGroups[i].inventoryGroups);
            }
            for (var j = 0; j < updateObj.updateUnitOfMeasures.length; j++) {
                unitOfMeasuresData.push(updateObj.updateUnitOfMeasures[j].unitOfMeasures);
            }
            var uniqueData = _.uniq(groupsData);
            var uniqueMeasuresData = _.uniq(unitOfMeasuresData);
            if (uniqueData.length === groupsData.length && uniqueMeasuresData.length === unitOfMeasuresData.length) {

                execute.query(sqlQuery, function (err, result) {
                    if (err !== null) {
                        if (err.sqlMessage.indexOf('Name') > 0) {
                            done(err, { statusCode: '2033' });
                        } else {
                            logger.error('Error in SetupProductLineDAO - editSetupProductLine:', err);
                            done(err, { statusCode: '9999' });
                        }
                    } else {
                        done(err, result);
                    }
                });
            } else {
                done('err', { statusCode: '2042' });
            }
        } catch (err) {
            logger.error('Unknown error in SetupProductLineDAO - editSetupProductLine:', err);
            done(err, { statusCode: '9999' });
        }
    }
}