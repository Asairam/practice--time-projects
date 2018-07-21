/**
 * Importing required modules
 */
var cfg = require('config');
var logger = require('../lib/logger');
var mysql = require('mysql');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    saveServicePackages: function (req, done) {
        var servicePackagesObj = req.body;
        if (servicePackagesObj.clientFacingName && servicePackagesObj.clientFacingName.trim() === "") {
            servicePackagesObj.clientFacingName = null;
        }
        var post = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            Name: servicePackagesObj.packageName,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            Active__c: servicePackagesObj.packageActive,
            Available_Client_Self_Booking__c: servicePackagesObj.availableforClientSelfBooking,
            Available_Online_Purchase__c: servicePackagesObj.availableforOnlinePurchase,
            Client_Facing_Name__c: servicePackagesObj.clientFacingName,
            Deposit_Amount__c: 20, //
            Deposit_Percent__c: 20, //
            Deposit_Required__c: 20, //
            Description__c: servicePackagesObj.description,
            Discounted_Package__c: servicePackagesObj.discountedPackage,
            JSON__c: JSON.stringify(servicePackagesObj.JSON__c),
            Package_value_before_discounts__c: servicePackagesObj.packageValueBeforeDiscounts,
            Type__c: 'service',
            Tax_Percent__c: servicePackagesObj.taxPercent,
            Tax__c: servicePackagesObj.serviceTaxValue

        }
        var sql = "INSERT INTO Package__c SET ?";
        execute.query(sql, post, function (err, results) {
            if (err != null) {
                if (err.sqlMessage.indexOf('Client_Facing_Name__c') > 0) {
                    done(err, { statusCode: '2038' });
                } else if (err.sqlMessage.indexOf('Name') > 0) {
                    done(err, { statusCode: '2033' });
                } else {
                    logger.error('Error in SetupServicePackage dao - saveServicePackages:', err);
                    done(err, '9999');
                }
            } else {
                done(err, results);
            }

        });
    },
    getServicePackages: function (req, done) {
        if (req.params.type === 'true') {
            query = "SELECT * from Package__c where Active__c=" + 1 + ' and isDeleted=0';
        } else {
            query = 'SELECT * from Package__c where isDeleted=0';
        }
        execute.query(query, function (error, results, fields) {
            if (error)
                logger.error('The solution is: ', error);
            done(error, results);
        });
    },
    editServicePackages: function (req, done) {
        var updateObj = req.body;
        var queryString = '';
        if (updateObj.clientFacingName && updateObj.clientFacingName.trim() === "") {
            updateObj.clientFacingName = null;
        }
        var tempItem = {
            Name: updateObj.packageName,
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            Active__c: updateObj.packageActive,
            Available_Client_Self_Booking__c: updateObj.availableforClientSelfBooking,
            Available_Online_Purchase__c: updateObj.availableforOnlinePurchase,
            Client_Facing_Name__c: updateObj.clientFacingName,
            JSON__c: JSON.stringify(updateObj.JSON__c),
            Package_value_before_discounts__c: updateObj.packageValueBeforeDiscounts,
            Type__c: "CITY",
            Deposit_Amount__c: 20,
            Deposit_Percent__c: 20,
            Discounted_Package__c: updateObj.discountedPackage,
            Deposit_Required__c: 20,
            Tax_Percent__c: updateObj.taxPercent,
            Description__c: updateObj.description,
            Tax__c: updateObj.serviceTaxValue
        }
        var whereCond = {
            Id: req.params.id
        };
        queryString += mysql.format('UPDATE Package__c '
            + ' SET ? '
            + ' WHERE ?; ', [tempItem, whereCond]);
        execute.query(queryString, function (error, results) {
            if (error != null) {
                if (error.sqlMessage.indexOf('Client_Facing_Name__c') > 0) {
                    done(error, { statusCode: '2038' });
                } else if (error.sqlMessage.indexOf('Name') > 0) {
                    done(error, { statusCode: '2033' });
                } else {
                    logger.error('Error in SetupServicePackage dao - editServicePackages:', error);
                    done(error, '9999');
                }
            } else {
                done(error, results);
            }
        });
    },
    /**
     * This function lists Setup Service 
     */
    getSetupService: function (req, done) {
        query = 'SELECT * from Service__c';
        if (req.params.serviceid) {
            query = query + ' where isDeleted = 0 and Id="' + req.params.serviceid + '"';
        }
        execute.query(query, function (error, results, fields) {
            if (error) {
                done(error, results);
            } else {
                done(error, results);
            }
        });
    }
};