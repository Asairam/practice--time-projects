/**
 * Importing required modules
 */
var companiesSRVC = require('../services/CompaniesSRVC');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var config = require('config');
var multer = require('multer');
var fs = require('fs');

module.exports.controller = function (app, passport) {
    /**
     * To upload Company Logo
     */
    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            var companyObj = '';
            try {
                companyObj = JSON.parse(req.body.company);
            } catch (err) {
                companyObj = req.body.company;
            }
            var uplLoc = config.companyLogoFilePath + '/' + companyObj.companyName;
            if (!fs.existsSync(uplLoc)) {
                fs.mkdirSync(uplLoc);
            }
            callback(null, uplLoc);
        }, filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });
    var uploadCompanyLogo = multer({storage: storage}).single('companyLogo');

    /**
     * This API Serves the  functionality to setup a company
     */
    app.post('/api/setup/companies', function (req, res, done) {
        uploadCompanyLogo(req, res, function (err) {
            try {
                companyObj = JSON.parse(req.body.company);
            } catch (err) {
                companyObj = req.body.company;
            }
            if (err) {
                logger.error('Error uploading Company Logo', err);
            } else {
                companiesSRVC.setupCompany(req, companyObj, function (data) {
                    utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
                });
            }
        });
    });
    /**
     * This API Serves the  functionality to update a company
     */
    app.put('/api/setup/companyinfo/:id', function (req, res, done) {
        uploadCompanyLogo(req, res, function (err) {
            try {
                companyObj = JSON.parse(req.body.company);
            } catch (err) {
                companyObj = req.body.company;
            }
            if (err) {
                logger.error('Error uploading Company Logo', err);
            } else {
                companiesSRVC.updateCompany(req, companyObj, function (data) {
                    utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
                });
            }
        });
    });
    /**
     * This API is to list all companies
     */
    app.get('/api/setup/compananyinfo', function (req, res, cb) {
        try {
            companiesSRVC.getCompanies(req, res, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } catch (tokenError) {
            logger.error('there was an error in companies Controller : ', tokenError);
            utils.sendResponse(res, 500, '9999', '');
        }
    });
    /*
     * postal code and send city,country,state to front end
     */
    app.get('/api/setup/companies/postalCode/:name', function (req, res, cb) {
        try {
            companiesSRVC.companiesPostal(req, res, function (data) {
                utils.sendResponse(res, data.httpCode, data.statusCode, data.result);
            });
        } catch (tokenError) {
            logger.error('there was an error in companies Controller : ', tokenError);
            utils.sendResponse(res, 500, '9999', '');
        }
    });

};
