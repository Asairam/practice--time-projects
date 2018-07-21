var logger = require('../lib/logger');
var execute = require('../db_connection/db');
module.exports = {
    getStates: function(req, country, callback) {
        try {
            query = 'SELECT stateName from Country_States__c where countryName= "' + country + '" order by `stateName` ASC';
            execute.query(query, function (error, results) {
                if (error)
                callback(error, results);
                else
                callback(error, results);
              }); 
        } catch (err) {
            logger.error('Catch Error occured in CountriesDAO while fetching data from Countries - getCountries :', err);
            callback(500, {status: '9999', result: ''});
        }
    },
    getTimezones: function(req, callback) {
        try {
            query = 'SELECT timeZone from Time_Zones__c order by `timeZone` ASC';
            execute.query(query, function (error, results) {
                if (error)
                callback(error, results);
                else
                callback(error, results);
              }); 
        } catch (err) {
            logger.error('Catch Error occured in CountriesDAO while fetching data from Countries - getTimezones :', err);
            callback(500, {status: '9999', result: ''});
        }
    },
    getLookupDataByType: function(lookupType, callback) {
        if(lookupType === 'RESOURCE_USE') {
            query = 'SELECT * from Lookup_codes__c where lookupTypeName= "' + lookupType + '" order by `lookupName` DESC';
            execute.query(query, function (error, results, fields) {
                if (error)
                callback(error, results);
                else
                callback(error, results);
              }); 
        } else {
            query = 'SELECT * from Lookup_codes__c where lookupTypeName= "' + lookupType + '"';
            execute.query(query, function (error, results, fields) {
                if (error)
                    callback(error, results);
                else
                    callback(error, results);
            });
        }
    }
};
