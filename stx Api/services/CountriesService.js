var CountriesDAO = require('../dao/CountriesDAO');

module.exports = {
    getCountries: function(req, callback) {
        CountriesDAO.getCountries(req, function(err, result) {
            callback(err, result);
        });
    },
    
    getStates: function(req, country, callback) {
        CountriesDAO.getStates(req, country, function(err, result) {
            if (err) {
                callback({httpCode: 500, status: '9999', result: {}});
            } else {
                callback({httpCode: 200, status: '1001', result: result});
            }
        });
    },
    getTimezones: function(req, callback) {
        CountriesDAO.getTimezones(req, function(err, result) {
            if (err) {
                callback({httpCode: 500, status: '9999', result: {}});
            } else {
                callback({httpCode: 200, status: '1001', result: result});
            }
        });
    },

    getLookupDataByType: function(lookupType, done) {
        CountriesDAO.getLookupDataByType(lookupType, function(err, resObj) {
            if (err) {
                done({httpCode: 500, status: '9999', result: {}});
            } else if (resObj) {
                done({httpCode: 200, status: '1001', result: resObj});
            } else {
                done({httpCode: 400, status: '2012', result: {}});
            }
        });
    },
    getCities: function(req, country, state, callback) {
        CountriesDAO.getCities(req, country, state, function(err, result) {
            callback(err, result);
        });
    }
};
