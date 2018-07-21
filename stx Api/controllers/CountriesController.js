
var CountriesService = require('../services/CountriesService');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var cfg = require('config');
module.exports.controller = function(app, passport) {
    app.get('/api/v1/lookups/states/:country', function(req, res, done) {
        try {
            var country = req.params.country;
            CountriesService.getStates(req, country, function(data) {
                utils.sendResponse(res, data.httpCode, data.status, data.result);
            });
        } catch (err) {
            logger.error('Error in CountriesController - /api/v1/lookups/states/:country:', err);
            utils.sendResponse(res, 500, '9999', '');
        }
    });
    app.get('/api/timezones', function(req, res, done) {
        
        // try {
        //     CountriesService.getTimezones(req, function(data) {
        //         utils.sendResponse(res, data.httpCode, data.status, data.result);
        //     });
        // } catch (err) {
        //     logger.error('Error in CountriesController - /api/timezones', err);
        //     utils.sendResponse(res, 500, '9999', '');
        // }
        utils.sendResponse(res, 200, 1001, createTimezones(new Date()));
    });
    app.get('/api/v1/lookups/:lookuptype', function(req, res, done) {
        var lookupType = req.params.lookuptype;
        if (lookupType) {
            CountriesService.getLookupDataByType(lookupType, function(data) {
                utils.sendResponse(res, data.httpCode, data.status, data.result);
            });
        } else {
            // Missing mandatory field data
            utils.sendResponse(res, 400, '9995', {});
        }
    });

};

function createTimezones(crtDate) {
    const timeZoneArray = cfg.timeZonesList;
    const utcDate = new Date(crtDate.getUTCFullYear(), crtDate.getUTCMonth(), crtDate.getUTCDate(), crtDate.getUTCHours(), crtDate.getUTCMinutes(), crtDate.getUTCSeconds());
    const finalArray = [];
    for (let i = 0; i < timeZoneArray.length; i++) {
        const tmpMain = crtDate.toLocaleString('en', { timeZone: timeZoneArray[i][1] }).split(' ');
        const tmpSub1 = tmpMain[0].split('/');
        const tmpSub2 = tmpMain[1].split(':');
        let tempHour = parseInt(tmpSub2[0], 10);
        if(tmpMain[2] === 'PM' && tempHour !== 12) {
            tempHour += 12;
        } else if(tmpMain[2] === 'AM' && tempHour === 12) {
            tempHour = 0;
        }
        const diffMin = (new Date(parseInt(tmpSub1[2], 10), parseInt(tmpSub1[0], 10) - 1
            , parseInt(tmpSub1[1], 10), tempHour, parseInt(tmpSub2[1], 10)
            , parseInt(tmpSub2[2], 10)).getTime() - utcDate.getTime()) / 60000;
        let hours = Math.trunc(diffMin / 60);
        let min = Math.abs(diffMin % 60);
        if (hours >= 0 && hours.toString().length < 2) {
            hours = '0' + hours;
        } else if (hours < 0 && hours.toString().length === 2) {
            hours = hours.toString()[0] + '0' + hours.toString()[1];
        }
        if (min.toString().length < 2) {
            min = '0' + min;
        }
        let optionVal = '(GMT';
        if (diffMin >= 0) {
            optionVal += '+';
        }
        optionVal += hours + ':' + min + ') ' + timeZoneArray[i][0] + ' (' + timeZoneArray[i][1] + ')';
        finalArray.push(optionVal);
    }
    return finalArray;
}
