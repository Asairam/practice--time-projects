/**
 * Importing required modules
 */
var marketingSetDAO = require('../dao/MarketingSetDAO');
var config = require('config');
var fs = require('fs');
module.exports = {
    /**
     * Dao call to save email marketing sets
     */
    saveMarketingset: function (req, done) {
        marketingSetDAO.saveMarketingset(req, function (err, data) {
            if (data.statusCode === '2076') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to edit marketing sets
     */
    editMarketingset: function (req, done) {
        marketingSetDAO.editMarketingset(req, function (err, data) {
            if (data.statusCode === '2076') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to delete marketing sets
     */
    deleteMarketingset: function (req, done) {
        marketingSetDAO. deleteMarketingset(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },

   
     /**
     * Dao call to getrewards
     */
    getrewards: function (req, done) {
        marketingSetDAO.getrewards(req, function (err, data) {
            if (data.statusCode === '2076') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to postrewards
     */
    saveRewards: function (req, done) {
        marketingSetDAO.saveRewards(req, function (err, data) {
            if (data.statusCode === '2076') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
   /**
     * Dao call to updaterewards
     */
    updateRewards: function (req, done) {
        marketingSetDAO.updateRewards(req, function (err, data) {
            if (data.statusCode === '2076') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to lists the PaymentTypes 
     */
    getMarketingsets: function (req, done) {
        marketingSetDAO.getMarketingsets(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
     /**
     * Dao call to get the marketing set by id 
     */
    getMarketingsetById: function (req, done) {
        marketingSetDAO.getMarketingsetById(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to lists the emailList
     */
    getEmailList: function (req, done) {
        marketingSetDAO.getEmailList(req, function (err, data) {
            if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to getClientRewards
     */
    getClientRewards: function (req, done) {
        marketingSetDAO.getClientRewards(req, function (err, data) {
            if (data.statusCode === '2076') {
                done({ httpCode: 400, statusCode: data.statusCode, result: {} });
            } else if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    },
    /**
     * Dao call to getPreference By Name
     */
    getPreference: function (req, done) {
        marketingSetDAO.getPreferenceFromUiName(req, function (err, data) {
           if (err) {
                done({ httpCode: 500, statusCode: '9999', result: {} });
            } else {
                done({ httpCode: 200, statusCode: '1001', result: data });
            }
        });
    }
};
