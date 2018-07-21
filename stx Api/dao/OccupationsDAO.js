/**
 * Importing required modules
 */
var config = require('config');
var uniqid = require('uniqid');
var execute = require('../db_connection/db');
var logger = require('../lib/logger');
var _ = require("underscore");
var dateFns = require('./../common/dateFunctions');

module.exports = {
    /**
     * Saving Occupations
     */
    saveOccupations: function (req, done) {
        var date = new Date();
        var occupationsObj = req.body.occupations;
        var arrayOccupationsData = [];
        var k = 0;
        var occupationsData = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            JSON__c: [occupationsObj],
            Name: config.occupations
        };
        this.getOccupations(req, function(err, result){
            if (result.statusCode === '9999') {
                for (var j = 0; j < occupationsObj.length; j++) {
                    if (occupationsObj[j].occupationName === '') {
                        k++;

                    }
                }
                /**
                    * uniqueness for Client Flags
                    */
                for (var i = 0; i < occupationsObj.length; i++) {
                    if (occupationsObj[i].occupationName != '' && occupationsObj[i].occupationName != undefined) {
                        arrayOccupationsData.push(occupationsObj[i].occupationName.toLowerCase());
                    }
                }
                var uniqueData = _.uniq(arrayOccupationsData);
                if (k > 0) {
                    done(err, { statusCode: '2052' });
                } else if (uniqueData.length != arrayOccupationsData.length) {
                    done(err, { statusCode: '2053' });
                } else {
                var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                        execute.query(sqlQuery, occupationsData, function (err, data) {
                            if (err) {
                                logger.error('Error1 in occupations dao - saveoccupations:', err);
                                done(err, { statusCode: '9999' });
                            } else {
                                done(err, data);
                            }
                        });
                    }
            } else if(result && result.length > 0) {
                for (var j = 0; j < occupationsObj.length; j++) {
                    if (occupationsObj[j].occupationName === '') {
                        k++;

                    }
                }
                /**
                    * uniqueness for Client Flags
                    */
                for (var i = 0; i < result.length; i++) {
                    if (occupationsObj[i].occupationName != '' && occupationsObj[i].occupationName != undefined) {
                        arrayOccupationsData.push(occupationsObj[i].occupationName.toLowerCase());
                    }
                }
                var uniqueData = _.uniq(arrayOccupationsData);
                if (uniqueData.length != arrayOccupationsData.length) {
                    done(err, { statusCode: '2053' });
                } else {
                // result = JSON.parse(result);
                // result.push(occupationsObj);
                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                    + " SET JSON__c = '" + JSON.stringify(occupationsObj)
                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                    + "' WHERE Name = '" + config.occupations + "'";
                execute.query(sqlQuery, '', function (err, data) {
                    if (err) {
                        logger.error('Error2 in occupations dao - saveoccupations:', err);
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
    * This function lists the Client Occupations
    */
    getOccupations: function (req, done) {
        try {
            var sqlQuery = 'SELECT * FROM ' + config.dbTables.preferenceTBL
                + ' WHERE Name = "' + config.occupations + '"';
            execute.query(sqlQuery, '', function (err, result) {
                if (result && result.length > 0) {
                    var JSON__c_str = JSON.parse(result[0].JSON__c);
                    done(err, JSON__c_str);
                } else {
                    logger.error('Error in occupations dao - getoccupations:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in occupations dao - getoccupations:', err);
            return (err, { statusCode: '9999' });
        }
    }
};