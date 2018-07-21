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
     * Saving Company data
     */
    setupCompany: function (req, companyObj, done) {
        var companyObj = JSON.parse(req.body.company);
        var companyLogo = '';
        var companyPath = '';
        if (req.file) {
            companyLogo = req.file.filename;
            companyPath = req.file.path;
        }
        var post = {
            Id: uniqid(),
            OwnerId: uniqid(),
            IsDeleted: 0,
            Name: companyObj.companyName,
            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
            CreatedById: uniqid(),
            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
            LastModifiedById: uniqid(),
            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
            City__c: companyObj.address.city,
            Country_Code__c: companyObj.address.country,
            Email__c: companyObj.contactDetails.email,
            Logo__c: companyPath,
            Main_Office_Location__Latitude__s: '',
            Main_Office_Location__Longitude__s: '',
            Phone__c: companyObj.contactDetails.phone,
            Postal_Code__c: companyObj.address.postalCode,
            State_Code__c: companyObj.address.state,
            Street_Address__c: companyObj.address.streetAddress
        };
        var sql = "INSERT INTO Company__c SET ?";
        if (companyLogo != '') {
            if (companyLogo.split('.')[1] === 'jpg' || companyLogo.split('.')[1] === 'png' || companyLogo.split('.')[1] === 'jpeg') {
                execute.query(sql, post, function (err, results, fields) {
                    if (err) {
                        done(err, results);
                        logger.error('err..........', err);
                    } else {
                        var companyColors = {
                            Id: uniqid(),
                            OwnerId: uniqid(),
                            IsDeleted: 0,
                            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                            CreatedById: uniqid(),
                            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                            LastModifiedById: uniqid(),
                            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                            JSON__c: [companyObj.headerColor],
                            Name: config.companyColors
                        };
                        getCompanyColors(req, function (err, result) {
                            if (result.statusCode === '9999') {
                                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                                    + " SET JSON__c = '" + JSON.stringify(companyObj.headerColor)
                                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                    + "' WHERE Name = '" + config.companyColors + "'";
                                execute.query(sqlQuery, '', function (err, data) {
                                    if (err) {
                                        logger.error('Error1 in SetupServiceGroup dao - saveServiceGroups:', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, data);
                                    }
                                });
                            } else {
                                result = JSON.parse(result);
                                result.push(companyObj.headerColor);
                                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                                    + " SET JSON__c = '" + JSON.stringify(result)
                                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                    + "' WHERE Name = '" + config.companyColors + "'";
                                execute.query(sqlQuery, '', function (err, data) {
                                    if (err) {
                                        logger.error('Error2 in SetupServiceGroup dao - saveServiceGroups:', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, data);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                done(null, { statusCode: '2058' });
            }
        } else {
            execute.query(sql, post, function (err, results, fields) {
                if (err) {
                    done(err, results);
                    logger.error('err..........', err);
                } else {
                    var companyColors = {
                        Id: uniqid(),
                        OwnerId: uniqid(),
                        IsDeleted: 0,
                        CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                        CreatedById: uniqid(),
                        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                        LastModifiedById: uniqid(),
                        SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                        JSON__c: [companyObj.headerColor],
                        Name: config.companyColors
                    };
                    getCompanyColors(req, function (err, result) {
                        if (result.statusCode === '9999') {
                            var sqlQuery = 'INSERT INTO ' + config.dbTables.preferenceTBL + ' SET ?';
                            execute.query(sqlQuery, companyColors, function (err, data) {
                                if (err) {
                                    logger.error('Error1 in SetupServiceGroup dao - saveServiceGroups:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    done(err, data);
                                }
                            });
                        } else {
                            result = JSON.parse(result);
                            result.push(companyObj.headerColor);
                            var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                                + " SET JSON__c = '" + JSON.stringify(result)
                                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                + "' WHERE Name = '" + config.companyColors + "'";
                            execute.query(sqlQuery, '', function (err, data) {
                                if (err) {
                                    logger.error('Error2 in SetupServiceGroup dao - saveServiceGroups:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    done(err, data);
                                }
                            });
                        }
                    });
                }
            });
        }
    }, /**
    * Saving Company data
    */
    updateCompany: function (req, companyObj, done) {
        var companyObj = JSON.parse(req.body.company);
        var companyLogo = '';
        var companyPath = '';
        if (req.file) {
            companyLogo = req.file.filename;
            companyPath = req.file.path;
        }
        var date = new Date();
        var sqlQuery = 'UPDATE Company__c '
            + ' SET Name = "' + companyObj.updateCompanyName
            + '", City__c = "' + companyObj.address.city
            + '", Country_Code__c = "' + companyObj.address.country
            + '", Email__c = "' + companyObj.contactDetails.email
            + '", Phone__c = "' + companyObj.contactDetails.phone
            + '", Postal_Code__c = "' + companyObj.address.postalCode
            + '", State_Code__c = "' + companyObj.address.state
            + '", LastModifiedDate = "' + dateFns.getUTCDatTmStr(new Date())
            + '", Street_Address__c = "' + companyObj.address.streetAddress
            if (companyPath !== '') {
                sqlQuery += '", Logo__c = "' + companyPath
            }
            sqlQuery += '" WHERE Id = "' + req.params.id + '"';
        if (companyLogo != '') {
            if (companyLogo.split('.')[1] === 'jpg' || companyLogo.split('.')[1] === 'png' || companyLogo.split('.')[1] === 'jpeg') {
                execute.query(sqlQuery, '', function (err, results, fields) {
                    if (err) {
                        done(err, results);
                        logger.error('err..........', err);
                    } else {
                        var companyColors = {
                            Id: uniqid(),
                            OwnerId: uniqid(),
                            IsDeleted: 0,
                            CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                            CreatedById: uniqid(),
                            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                            LastModifiedById: uniqid(),
                            SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                            LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                            JSON__c: [companyObj.headerColor],
                            Name: config.companyColors
                        };
                        getCompanyColors(req, function (err, result) {
                            if (result.statusCode === '9999') {
                                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                                    + " SET JSON__c = '" + JSON.stringify(companyObj.headerColor)
                                    + "', LastModifiedDate = '" + date
                                    + "' WHERE Name = '" + config.companyColors + "'";
                                execute.query(sqlQuery, '', function (err, data) {
                                    if (err) {
                                        logger.error('Error1 in SetupServiceGroup dao - saveServiceGroups:', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, data);
                                    }
                                });
                            } else {
                                var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                                    + " SET JSON__c = '" + JSON.stringify(companyObj.headerColor)
                                    + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                    + "' WHERE Name = '" + config.companyColors + "'";
                                execute.query(sqlQuery, '', function (err, data) {
                                    if (err) {
                                        logger.error('Error2 in SetupServiceGroup dao - saveServiceGroups:', err);
                                        done(err, { statusCode: '9999' });
                                    } else {
                                        done(err, data);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                done(null, { statusCode: '2058' });
            }
        } else {
            execute.query(sqlQuery, function (err, results) {
                if (err) {
                    done(err, results);
                    logger.error('err..........', err);
                } else {
                    var companyColors = {
                        Id: uniqid(),
                        OwnerId: uniqid(),
                        IsDeleted: 0,
                        CreatedDate: dateFns.getUTCDatTmStr(new Date()),
                        CreatedById: uniqid(),
                        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                        LastModifiedById: uniqid(),
                        SystemModstamp: dateFns.getUTCDatTmStr(new Date()),
                        LastModifiedDate: dateFns.getUTCDatTmStr(new Date()),
                        JSON__c: [companyObj.headerColor],
                        Name: config.companyColors
                    };
                    getCompanyColors(req, function (err, result) {
                        if (result.statusCode === '9999') {
                            var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                                + " SET JSON__c = '" + JSON.stringify(companyObj.headerColor)
                                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                + "' WHERE Name = '" + config.companyColors + "'";
                            execute.query(sqlQuery, '', function (err, data) {
                                if (err) {
                                    logger.error('Error1 in SetupServiceGroup dao - saveServiceGroups:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    done(err, data);
                                }
                            });
                        } else {
                            var sqlQuery = "UPDATE " + config.dbTables.preferenceTBL
                                + " SET JSON__c = '" + JSON.stringify(companyObj.headerColor)
                                + "', LastModifiedDate = '" + dateFns.getUTCDatTmStr(new Date())
                                + "' WHERE Name = '" + config.companyColors + "'";
                            execute.query(sqlQuery, '', function (err, data) {
                                if (err) {
                                    logger.error('Error2 in SetupServiceGroup dao - saveServiceGroups:', err);
                                    done(err, { statusCode: '9999' });
                                } else {
                                    done(err, data);
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    /**
     * List Companies
     */
    getCompanies: function (req, res, done) {
        execute.query('SELECT * from Company__c where isDeleted = 0', function (err, cmpresult) {
            if (err) {
                logger.error('Error in postal code dao - postal code:', err);
                done(err, { statusCode: '9999' });
            } else {
                getCompanyColors(req, function (err, coloursresult) {
                    done(err, { cmpresult, coloursresult });
                });

            }
        });


    },
    companiesPostal: function (req, res, done) {
        try {
            var postalCode = req.params;
            var postalcodeData = {
                Name: postalCode.name,
            }
            var sqlQuery = "SELECT State_Code__c as state , Country_Code__c as country,City__c as city FROM `Company__c` WHERE Postal_Code__c ='" + postalcodeData.Name + "' and isDeleted =0 ";
            execute.query(sqlQuery, '', function (err, result) {
                if (result.length > 0) {
                    done(err, result);
                } else {
                    logger.error('Error in postal code dao - postal code:', err);
                    done(err, { statusCode: '9999' });
                }
            });
        } catch (err) {
            logger.error('Unknown error in postal code dao - postal code:', err);
            return (err, { statusCode: '9999' });
        }

    }

};
/**
 * This function is to get Company Colors List
 */
var getCompanyColors = function (req, done) {
    try {
        var sqlQuery = 'SELECT JSON__c FROM ' + config.dbTables.preferenceTBL
            + ' WHERE Name = "' + config.companyColors + '"';
        execute.query(sqlQuery, '', function (err, result) {
            if (result && result[0].JSON__c) {
                var JSON__c_str = JSON.parse(result[0].JSON__c);
                done(err, result[0].JSON__c);
            } else {
                logger.error('Error in SetupServiceGroup dao - getServiceGroups:', err);
                done(err, { statusCode: '9999' });
            }
        });
    } catch (err) {
        logger.error('Unknown error in SetupServiceGroup dao - getServiceGroups:', err);
        return (err, { statusCode: '9999' });
    }
}