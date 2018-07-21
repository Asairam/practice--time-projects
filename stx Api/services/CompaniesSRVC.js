/**
 * Importing required modules
 */
var companiesDAO = require('../dao/CompaniesDAO');
var config = require('config');
var fs = require('fs');
var logger = require('../lib/logger');

module.exports = {
    /**
     * Dao call to save Company Data
     */
    setupCompany: function (req, companyObj, done) {
        companiesDAO.setupCompany(req, companyObj, function (err, data) {
            if (err) {
                logger.error('Error in companiesDAO - setupCompany', err);
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else if (data.statusCode === '2058') {
                done({httpCode: 400, statusCode: '2058', result: {}});
            } else if (data) {
                var renameLoc = config.companyLogoFilePath + '/' + companyObj.companyName;
                if (!fs.existsSync(renameLoc)) {
                    fs.mkdirSync(renameLoc);
                }

                if (req.file) {
                    renameLoc = renameLoc + '/' + req.file.filename;
                    fs.rename(config.companyLogoFilePath + '/' + companyObj.companyName + '/'
                            + req.file.filename, renameLoc, function () {
                                fs.rmdir(config.companyLogoFilePath + '/' + companyObj.companyName, function (err) {
                                });
                            });
                }
                done({httpCode: 200, statusCode: '1011', result: data});
            } else {
                done({httpCode: 400, statusCode: '9997', result: data});
            }
        });
    },
     /**
     * Dao call to upade Company Data
     */
    updateCompany: function (req, companyObj, done) {
        companiesDAO.updateCompany(req, companyObj, function (err, data) {
            if (err) {
                logger.error('Error in companiesDAO - setupCompany', err);
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else if (data.statusCode === '2058') {
                done({httpCode: 400, statusCode: '2058', result: {}});
            } else if (data) {
                var renameLoc = config.companyLogoFilePath + '/' + companyObj.companyName;
                if (!fs.existsSync(renameLoc)) {
                    fs.mkdirSync(renameLoc);
                }

                if (req.file) {
                    renameLoc = renameLoc + '/' + req.file.filename;
                    fs.rename(config.companyLogoFilePath + '/' + companyObj.companyName + '/'
                            + req.file.filename, renameLoc, function () {
                                fs.rmdir(config.companyLogoFilePath + '/' + companyObj.companyName, function (err) {
                                });
                            });
                }
                done({httpCode: 200, statusCode: '1011', result: data});
            } else {
                done({httpCode: 400, statusCode: '9997', result: data});
            }
        });
    },
    /**
     * Dao call to List Companies
     */
    getCompanies: function (req, res, done) {
        companiesDAO.getCompanies(req, res, function (err, data) {
            if (err) {
                logger.error('Error in companiesDAO - setupCompany', err);
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else if (data) {
                done({httpCode: 200, statusCode: '1028', result: data});
            } else {
                done({httpCode: 400, statusCode: '9997', result: {}});
            }
        });
    },
    /*
     * 
     * @Dao getting postal code and sending city, country code to front end
     */
    companiesPostal: function (req, res, done) {
        companiesDAO.companiesPostal(req, res, function (err, data) {
            if (err) {
                logger.error('Error in companiesDAO - setupCompany', err);
                done({httpCode: 500, statusCode: '9999', result: {}});
            } else if (data.length > 0) {
                done({httpCode: 200, statusCode: '1028', result: data});
            } else {
                done({httpCode: 400, statusCode: '2072', result: {}});
            }
        });
    }
};
