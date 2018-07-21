/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var moment = require('moment');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * This function is to saves Promotions into db
     */
    savePromotion: function (req, done) {
        var promotionObj = req.body;
        var promotionData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            Name: promotionObj.Name,
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            Active__c: promotionObj.Active__c,
            Client_Marketing__c: '',
            Discount_Amount__c: promotionObj.Discount_Amount__c,
            Discount_Percentage__c: promotionObj.Discount_Percentage__c,
            End_Date__c: promotionObj.End_Date__c,
            Product_Discount__c: promotionObj.Product_Discount__c,
            Service_Discount__c: promotionObj.Service_Discount__c,
            Sort_Order__c: promotionObj.Sort_Order__c,
            Start_Date__c: promotionObj.Start_Date__c
        };
        var sqlQuery = 'INSERT INTO ' + config.dbTables.promotionTBL + ' SET ?';
        execute.query(sqlQuery, promotionData, function (err, data) {
            if (err !== null) {
                if (err.sqlMessage.indexOf('Name') > 0) {
                    done(err, { statusCode: '2074' });
                }  else if (err.sqlMessage.indexOf('Sort_Order__c') > 0) {
                    done(err, { statusCode: '2075' });
                } else {
                    logger.error('Error in Promotions dao - AddPromotions:', err);
                    done(err, { statusCode: '9999' });
                }
            } else {
                done(err, data);
            }
        });
    },
    /**
     * This function lists the Promotions
     */
    getPromotions: function (req, done) {
        try {
            var sqlQuery = 'SELECT *, IFNULL(Discount_Amount__c,0) as discountAmount, IFNULL(Discount_Percentage__c,0) as discountPers FROM Promotion__c WHERE isDeleted = 0 order by Sort_Order__c ASC';
            execute.query(sqlQuery, '', function (err, result) {
                if (err) {
                    logger.error('Error in promotion dao - getpromotions:', err);
                    done(err, { statusCode: '9999' });
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in promotion dao - getpromotions:', err);
            return (err, { statusCode: '9999' });
        }
    },
    /**
     * This method edit single record by using id
     */
    editPromotion: function (req, done) {
        try {
            var updateObj = req.body;
            var startDate = moment(updateObj.updatePromotionStartDate).format('YYYY-MM-DD');
            var endDate = moment(updateObj.updatePromotionEndDate).format('YYYY-MM-DD');
            var Id = req.params.id;
            var curDate = new Date();
            var sqlQuery = 'UPDATE ' + config.dbTables.promotionTBL
                + ' SET Name = "' + updateObj.updateName
                + '", Active__c = "' + updateObj.updateActive
                + '", Discount_Amount__c = "' + updateObj.updateDiscountAmount
                + '", Discount_Percentage__c = "' + updateObj.updateDiscountPercentage
                + '", End_Date__c = "' + endDate
                + '", Product_Discount__c = "' + updateObj.updateProductDiscount
                + '", Service_Discount__c = "' + updateObj.updateServiceDiscount
                + '", Start_Date__c = "' + startDate
                + '", Sort_Order__c = "' + updateObj.updateSortOrder
                + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
                + '" WHERE Id = "' + req.params.id + '"';
            execute.query(sqlQuery, function (err, result) {
                if (err !== null) {
                    if (err.sqlMessage.indexOf('Name') > 0) {
                        done(err, { statusCode: '2074' });
                    } else if (err.sqlMessage.indexOf('Sort_Order__c') > 0) {
                        done(err, { statusCode: '2075' });
                    } else {
                        logger.error('Error in Promotions dao - edit Promotions:', err);
                        done(err, { statusCode: '9999' });
                    }
                } else {
                    done(err, result);
                }
            });
        } catch (err) {
            logger.error('Unknown error in Promotions DAO - editPromotions:', err);
            done(err, { statusCode: '9999' });
        }
    },
    /**
     * This method edit single record by using id
     */
    editPromotionSortOrder: function (req, done) {
        try {
            var updateObj = req.body;
            var curDate = new Date();
            var sortData = [];
            for (var i = 0; i < updateObj.length; i++) {
                sortData.push(updateObj[i].Sort_Order__c);
            }
            var sorted_arr = sortData.slice().sort();
            var results = [];
            for (var i = 0; i < sorted_arr.length - 1; i++) {
                if (sorted_arr[i + 1] == sorted_arr[i]) {
                    results.push(sorted_arr[i]);
                }
            }
            if (results.length > 0) {
                done(null, { statusCode: '2061' });
            } else {
                for (var i = 0; i < updateObj.length; i++) {
                    var sqlQuery = 'UPDATE ' + config.dbTables.promotionTBL
                        + ' SET Sort_Order__c = "' + updateObj[i].Sort_Order__c
                        + '" WHERE Id = "' + updateObj[i].Id + '"';
                    execute.query(sqlQuery, function (err, result) {
                        if (err !== null) {
                            if (err.sqlMessage.indexOf('Sort_Order__c') > 0) {
                                done(err, { statusCode: '2061' });
                            } else {
                                logger.error('Error in Promotions dao - edit Promotions:', err);
                                done(err, { statusCode: '9999' });
                            }
                        } else {
                            done(err, result);
                        }
                    });
                }
            }
        } catch (err) {
            logger.error('Unknown error in Promotions DAO - editPromotions:', err);
            done(err, { statusCode: '9999' });
        }
    }
};
