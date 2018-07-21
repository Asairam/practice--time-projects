var config = require('config');
var utils = require('../lib/util');
var logger = require('../lib/logger');
var execute = require('../db_connection/db');

module.exports.controller = function (app) {

    //--- Start of API to get Appointment search results ---//
    app.get('/api/appointment/search', function (req, res) {
        //--- Input Param ---//
        var inputParms = JSON.parse(req.headers['params']);
        //--- Variable Declaration ---//
        var index = 0, apptPrfData, cmpHrsData, cstHrsData, wrkSrvData;
        //--- Appointments settings data for Duration and Interval ---//
        getApptPrf(function (data) {
            index++;
            apptPrfData = data;
            finalMethod(index, apptPrfData, cmpHrsData, cstHrsData, wrkSrvData, inputParms, res);
        });
        //--- All days all input workers working days (Company and Custom Hours) ---//
        getWrkHrs(inputParms, function (data1, data2) {
            index++;
            cmpHrsData = data1;
            cstHrsData = data2;
            finalMethod(index, apptPrfData, cmpHrsData, cstHrsData, wrkSrvData, inputParms, res);
        });
        //--- All services done by input workers for the next 2 weeks ---//
        getWrkSrvData(inputParms, function (data) {
            index++;
            wrkSrvData = data;
            finalMethod(index, apptPrfData, cmpHrsData, cstHrsData, wrkSrvData, inputParms, res);
        });
    });
    //--- End of API to get Appointment search results ---//
};

//--- Start of function to get data for Appointments settings ---//
function getApptPrf(callback) {
    var apptPrfQry = 'SELECT JSON__c FROM ' + config.dbTables.preferenceTBL + ' WHERE Name = "' + config.apptBooking + '" and IsDeleted=0';
    execute.query(apptPrfQry, '', function (err, data) {
        if (err) {
            logger.error('Error in getApptPrf: ', err);
            callback(null);
        } else {
            callback(JSON.parse(data[0].JSON__c));
        }
    });
}
//--- End of function to get data for Appointments settings ---//

//--- Start of function to get data for all days and all input workers working days (Company and Custom Hours) ---//
function getWrkHrs(parms, callback) {
    var cmpHrsQry = "SELECT u.Id, " +
        "IF(ch.Id IS NULL, ch2.Id, ch.Id) as compHrsId, " +
        "IF(ch.SundayStartTime__c IS NULL OR ch.SundayStartTime__c = '', ch2.SundayStartTime__c, ch.SundayStartTime__c) as SundayStartTime__c, " +
        "IF(ch.SundayEndTime__c IS NULL OR ch.SundayEndTime__c = '', ch2.SundayEndTime__c, ch.SundayEndTime__c) as SundayEndTime__c, " +
        "IF(ch.MondayStartTime__c IS NULL OR ch.MondayStartTime__c = '', ch2.MondayStartTime__c, ch.MondayStartTime__c) as MondayStartTime__c, " +
        "IF(ch.MondayEndTime__c IS NULL OR ch.MondayEndTime__c = '', ch2.MondayEndTime__c, ch.MondayEndTime__c) as MondayEndTime__c, " +
        "IF(ch.TuesdayStartTime__c IS NULL OR ch.TuesdayStartTime__c = '', ch2.TuesdayStartTime__c, ch.TuesdayStartTime__c) as TuesdayStartTime__c, " +
        "IF(ch.TuesdayEndTime__c IS NULL OR ch.TuesdayEndTime__c = '', ch2.TuesdayEndTime__c, ch.TuesdayEndTime__c) as TuesdayEndTime__c, " +
        "IF(ch.WednesdayStartTime__c IS NULL OR ch.WednesdayStartTime__c = '', ch2.WednesdayStartTime__c, ch.WednesdayStartTime__c) as WednesdayStartTime__c, " +
        "IF(ch.WednesdayEndTime__c IS NULL OR ch.WednesdayEndTime__c = '', ch2.WednesdayEndTime__c, ch.WednesdayEndTime__c) as WednesdayEndTime__c, " +
        "IF(ch.ThursdayStartTime__c IS NULL OR ch.ThursdayStartTime__c = '', ch2.ThursdayStartTime__c, ch.ThursdayStartTime__c) as ThursdayStartTime__c, " +
        "IF(ch.ThursdayEndTime__c IS NULL OR ch.ThursdayEndTime__c = '', ch2.ThursdayEndTime__c, ch.ThursdayEndTime__c) as ThursdayEndTime__c, " +
        "IF(ch.FridayStartTime__c IS NULL OR ch.FridayStartTime__c = '', ch2.FridayStartTime__c, ch.FridayStartTime__c) as FridayStartTime__c, " +
        "IF(ch.FridayEndTime__c IS NULL OR ch.FridayEndTime__c = '', ch2.FridayEndTime__c, ch.FridayEndTime__c) as FridayEndTime__c, " +
        "IF(ch.SaturdayStartTime__c IS NULL OR ch.SaturdayStartTime__c = '', ch2.SaturdayStartTime__c, ch.SaturdayStartTime__c) as SaturdayStartTime__c, " +
        "IF(ch.SaturdayEndTime__c IS NULL OR ch.SaturdayEndTime__c = '', ch2.SaturdayEndTime__c, ch.SaturdayEndTime__c) as SaturdayEndTime__c " +
        "FROM " +
        "User__c as u " +
        "LEFT JOIN Company_Hours__c as ch on ch.Id = u.Appointment_Hours__c " +
        "LEFT JOIN Company_Hours__c as ch2 on ch2.isDefault__c = 1 " +
        "WHERE ch.IsDeleted = 0 AND ch2.IsDeleted = 0 AND " +
        "u.Id IN " + getInQryStr(parms['id']);
    execute.query(cmpHrsQry, '', function (err, cmpHrsData) {
        if (err) {
            logger.error('Error in getWrkHrs:', err);
            callback(null, null);
        } else {
            if (cmpHrsData && cmpHrsData.length > 0) {
                var compHrsIds = '(';
                for (var i = 0; i < cmpHrsData.length; i++) {
                    compHrsIds += '\'' + cmpHrsData[i].compHrsId + '\','
                }
                compHrsIds = compHrsIds.slice(0, -1);
                compHrsIds += ')';
                //--- Adding custom hours ---//
                getCstHrs(compHrsIds, parms['date'], function (cstHrsData) {
                    callback(cmpHrsData, cstHrsData);
                });
            } else {
                callback(null, null);
            }
        }
    });
}
//--- End of function to get data for all days and all input workers working days (Company and Custom Hours) ---//

//--- Start of function to get data for Custom Hours for the next 2 weeks from the selected date ---//
function getCstHrs(compHrsIds, date, callback) {
    var cstHrsQry = "SELECT Date__c, All_Day_Off__c, StartTime__c, EndTime__c, Company_Hours__c FROM " + config.dbTables.customHoursTBL + " WHERE " +
        "Date__c >= '" + date + "' AND Date__c <= ('" + date + "' + INTERVAL 14 DAY) AND Company_Hours__c IN " + compHrsIds + " AND IsDeleted=0";
    execute.query(cstHrsQry, '', function (err, data) {
        if (err) {
            callback(null);
        } else {
            callback(data);
        }
    });
}
//--- End of function to get data for Custom Hours for the next 2 weeks from the selected date ---//

//--- Start of function to get data for all services for selected workers ---//
function getWrkSrvData(param, callback) {
    var wrkSrvQry = "SELECT Service_Date_Time__c, Duration__c, Worker__c FROM " + config.dbTables.ticketServiceTBL + " WHERE " +
        "IsDeleted = 0 AND " +
        "Service_Date_Time__c IS NOT NULL AND " +
        "Service_Date_Time__c >= '" + param['date'] + "' AND " +
        "Service_Date_Time__c <= ('" + param['date'] + "' + INTERVAL 14 DAY) AND " +
        "Worker__c IN " + getInQryStr(param['id']);
    execute.query(wrkSrvQry, '', function (err, data) {
        if (err) {
            callback(null);
        } else {
            callback(data);
        }
    });
}
//--- End of function to get data for all services for selected workers ---//

//--- Start of main function to generate output for the request ---//
function finalMethod(index, apptPrfData, cmpHrsData, cstHrsData, wrkSrvData, inputParms, res) {
    if (index == 3) {
        //--- Generation of time slots ---//
        var srtEndAry = gntSrvcRslt(apptPrfData, cmpHrsData, cstHrsData, inputParms);
        var stdrn = 0;
        //--- Start of filtering time slots by considering existing worker serives ---//
        for (var i = 0; i < inputParms['durations'].length; i++) {
            if (srtEndAry && srtEndAry.length > 0 && wrkSrvData && wrkSrvData.length > 0) {
                var tempWrkSrvData = wrkSrvData.filter(function (a) { return a.Worker__c == inputParms['id'][i] });
                srtEndAry = filterWrkSrv(srtEndAry, tempWrkSrvData, stdrn, inputParms['durations'][i]);
            }
            stdrn += parseInt(inputParms['durations'][i], 10);
        }
        //--- End of filtering time slots by considering existing worker serives ---//
        //--- Start of generation of ranks ---//
        if (srtEndAry.length > 0) {
            srtEndAry.forEach(function (item, index) {
                srtEndAry[index] = { 'date': srtEndAry[index][0], 'value': srtEndAry[index][1], 'rank': 0 };
            });
            //--- Ranks generation ---//
            srtEndAry = generateRanks(srtEndAry, inputParms, cmpHrsData, cstHrsData, wrkSrvData);
            // if (apptPrfData['availabilityOrder'] === 'Ranking Order') {
                //--- Sorting array based on ranks ---//
                srtEndAry.sort(function (a, b) {
                    // return (a.rank > b.rank) ? -1 : (a.rank < b.rank) ? 1 : 0;
                    return 0>1 ? 0: -1;
                });
            // }
            srtEndAry = srtEndAry.slice(0, apptPrfData['maximumAvailableToShow']);
            //--- Delete date key from all output objects ---//
            srtEndAry = deleteDateKey(srtEndAry);
        }
        //--- End of generation of ranks ---//
        //--- Final response ---//
        utils.sendResponse(res, 200, 1001, srtEndAry);
    }
}
//--- End of main function to generate output for the request ---//

//--- Start of function to generate Time slots ---//
function gntSrvcRslt(apptPrfData, cmpHrsData, cstHrsData, params) {
    var tempDtObj = params['date'].split('-');
    var selDt = new Date(tempDtObj[0], (parseInt(tempDtObj[1], 10) - 1), tempDtObj[2]);
    //--- Generates default start and end times of workers first worker company hours ---//
    var srtEndAry = getDefStEdAry(cmpHrsData[0], selDt);
    //--- First worker custom hours ---//
    var firstWrkCstHrs = cstHrsData.filter(function (a) { return a['Company_Hours__c'] === cmpHrsData[0]['compHrsId'] });
    //--- Start of adding custom hours (Considering custom hours and all day off) ---//
    for (var i = 0; i < srtEndAry.length; i++) {
        if (firstWrkCstHrs && firstWrkCstHrs.length > 0) {
            for (var j = 0; j < firstWrkCstHrs.length; j++) {
                tempDtObj = firstWrkCstHrs[j]['Date__c'].split('-');
                var cstDt = new Date(tempDtObj[0], (parseInt(tempDtObj[1], 10) - 1), tempDtObj[2]);
                if (srtEndAry[i] && cstDt.getTime() === srtEndAry[i][0].getTime()) {
                    if (firstWrkCstHrs[j]['All_Day_Off__c'] == 1) {
                        srtEndAry[i] = null;
                    } else {
                        srtEndAry[i] = [cstDt, firstWrkCstHrs[j]['StartTime__c'], firstWrkCstHrs[j]['EndTime__c']];
                    }
                }
            }
        }
        selDt.setDate(selDt.getDate() + 1);
    }
    //--- End of adding custom hours (Considering custom hours and all day off) ---//
    //--- Removing null values from output array ---//
    srtEndAry = srtEndAry.filter(function (a) { return a !== null });
    //--- Generation of  ---//
    return getChrnOdrAry(srtEndAry, apptPrfData['bookingIntervalMinutes'], params['dateformat']);
}
//--- End of function to generate Time slots ---//

//--- Start of function to genetate start and end times of the days ---//
function getDefStEdAry(cmpHrsData, selDt) {
    var tempDt = new Date(selDt.getFullYear(), selDt.getMonth(), selDt.getDate());
    var rtnAry = [];
    for (var i = 0; i < 14; i++) {
        switch (tempDt.getDay()) {
            case 0:
                if (cmpHrsData['SundayStartTime__c'] && cmpHrsData['SundayEndTime__c']
                    && cmpHrsData['SundayStartTime__c'] != '' && cmpHrsData['SundayEndTime__c'] != '') {
                    rtnAry.push([new Date(tempDt), cmpHrsData['SundayStartTime__c'], cmpHrsData['SundayEndTime__c']]);
                }
                break;
            case 1:
                if (cmpHrsData['MondayStartTime__c'] && cmpHrsData['MondayEndTime__c']
                    && cmpHrsData['MondayStartTime__c'] != '' && cmpHrsData['MondayEndTime__c'] != '') {
                    rtnAry.push([new Date(tempDt), cmpHrsData['MondayStartTime__c'], cmpHrsData['MondayEndTime__c']]);
                }
                break;
            case 2:
                if (cmpHrsData['TuesdayStartTime__c'] && cmpHrsData['TuesdayEndTime__c']
                    && cmpHrsData['TuesdayStartTime__c'] != '' && cmpHrsData['TuesdayEndTime__c'] != '') {
                    rtnAry.push([new Date(tempDt), cmpHrsData['TuesdayStartTime__c'], cmpHrsData['TuesdayEndTime__c']]);
                }
                break;
            case 3:
                if (cmpHrsData['WednesdayStartTime__c'] && cmpHrsData['WednesdayEndTime__c']
                    && cmpHrsData['WednesdayStartTime__c'] != '' && cmpHrsData['WednesdayEndTime__c'] != '') {
                    rtnAry.push([new Date(tempDt), cmpHrsData['WednesdayStartTime__c'], cmpHrsData['WednesdayEndTime__c']]);
                }
                break;
            case 4:
                if (cmpHrsData['ThursdayStartTime__c'] && cmpHrsData['ThursdayEndTime__c']
                    && cmpHrsData['ThursdayStartTime__c'] != '' && cmpHrsData['ThursdayEndTime__c'] != '') {
                    rtnAry.push([new Date(tempDt), cmpHrsData['ThursdayStartTime__c'], cmpHrsData['ThursdayEndTime__c']]);
                }
                break;
            case 5:
                if (cmpHrsData['FridayStartTime__c'] && cmpHrsData['FridayEndTime__c']
                    && cmpHrsData['FridayStartTime__c'] != '' && cmpHrsData['FridayEndTime__c'] != '') {
                    rtnAry.push([new Date(tempDt), cmpHrsData['FridayStartTime__c'], cmpHrsData['FridayEndTime__c']]);
                }
                break;
            case 6:
                if (cmpHrsData['SaturdayStartTime__c'] && cmpHrsData['SaturdayEndTime__c']
                    && cmpHrsData['SaturdayStartTime__c'] != '' && cmpHrsData['SaturdayEndTime__c'] != '') {
                    rtnAry.push([new Date(tempDt), cmpHrsData['SaturdayStartTime__c'], cmpHrsData['SaturdayEndTime__c']]);
                }
                break;
            default:
                break;
        }
        tempDt.setDate(tempDt.getDate() + 1);
    }
    return rtnAry;
}
//--- End of function to genetate start and end times of the days ---//

//--- Start of function to genetate time slots based on chronological order ---//
function getChrnOdrAry(srtEndAry, intvl, dateformat) {
    var rtnObj = [];
    for (var i = 0; i < srtEndAry.length; i++) {
        var srtDate = new Date(srtEndAry[i][0]);
        var stHrsMin = getHrsMin(srtEndAry[i][1]);
        srtDate.setHours(stHrsMin[0]);
        srtDate.setMinutes(stHrsMin[1]);
        var endDate = new Date(srtEndAry[i][0]);
        var endHrsMin = getHrsMin(srtEndAry[i][2]);
        endDate.setHours(endHrsMin[0]);
        endDate.setMinutes(endHrsMin[1]);
        while (srtDate.getTime() < endDate.getTime()) {
            var temp = getDateStr(srtDate, dateformat);
            rtnObj.push([new Date(srtDate), temp]);
            srtDate.setMinutes(srtDate.getMinutes() + intvl);
        }
    }
    return rtnObj;
}
//--- End of function to genetate time slots based on chronological order ---//

//--- Start of function to get hours and minutes from string ---//
function getHrsMin(timeStr) {
    var hrs = 0;
    var tempAry = timeStr.split(' ');
    var hrsMinAry = tempAry[0].split(':');
    hrs = parseInt(hrsMinAry[0], 10);
    if (tempAry[1] == 'AM' && hrs == 12) {
        hrs = 0;
    } else if (tempAry[1] == 'PM' && hrs != 12) {
        hrs += 12;
    }
    return [hrs, parseInt(hrsMinAry[1], 10)];
}
//--- End of function to get hours and minutes from string ---//

//--- Start of function to generate date time string based on the request ---//
function getDateStr(dtObj, dateformat) {
    var datStr = '';
    if (dateformat === 'MM/DD/YYYY hh:mm:ss a') {
        datStr = ('0' + (dtObj.getMonth() + 1)).slice(-2) + '/' +
            ('0' + dtObj.getDate()).slice(-2) + '/' +
            dtObj.getUTCFullYear() + ' ' + formatAMPM(dtObj);
    }
    return datStr;
}
//--- End of function to generate date time string based on the request ---//

//--- Start of function to generate time string based on the date object ---//
function formatAMPM(dtObj) {
    var hours = dtObj.getHours();
    var minutes = dtObj.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var strTime = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ' ' + ampm;
    return strTime;
}
//--- End of function to generate time string based on the date object ---//

//--- Start of function to generate string from array for IN query parameters ---//
function getInQryStr(arryObj) {
    var rtnStr = '';
    if (arryObj && arryObj.length > 0) {
        rtnStr += '(';
        for (var i = 0; i < arryObj.length; i++) {
            rtnStr += '\'' + arryObj[i] + '\',';
        }
        rtnStr = rtnStr.slice(0, -1);
        rtnStr += ')';
    }
    return rtnStr;
}
//--- End of function to generate string from array for IN query parameters ---//

//--- Start of function to check time slots are available or not? based on worker existing services ---//
function filterWrkSrv(srtEndAry, wrkSrvData, subDur, srvDur) {
    for (var i = 0; i < srtEndAry.length; i++) {
        for (var j = 0; j < wrkSrvData.length; j++) {
            if (srtEndAry[i]) {
                var newSrvStDt = new Date(srtEndAry[i][0]);
                newSrvStDt.setMinutes(newSrvStDt.getMinutes() + parseInt(subDur, 10));
                var newSrvEndDt = new Date(newSrvStDt);
                newSrvEndDt.setMinutes(newSrvEndDt.getMinutes() + parseInt(srvDur, 10));
                var tempDtTmAr = wrkSrvData[j]['Service_Date_Time__c'].split(' ');
                var tempDtAr = tempDtTmAr[0].split('-');
                var tempTmAr = tempDtTmAr[1].split(':');
                var srvStDt = new Date(tempDtAr[0], (parseInt(tempDtAr[1], 10) - 1), tempDtAr[2], tempTmAr[0], tempTmAr[1], tempTmAr[2]);
                var srvEndDt = new Date(srvStDt);
                srvEndDt.setMinutes(srvEndDt.getMinutes() + parseInt(wrkSrvData[j]['Duration__c'], 10));
                if (newSrvStDt.getTime() === srvStDt.getTime()
                    || newSrvEndDt.getTime() === srvEndDt.getTime()
                    || (newSrvStDt.getTime() > srvStDt.getTime() && newSrvStDt.getTime() < srvEndDt.getTime())
                    || (newSrvEndDt.getTime() > srvStDt.getTime() && newSrvEndDt.getTime() < srvEndDt.getTime())
                    || (newSrvStDt.getTime() < srvStDt.getTime() && newSrvEndDt.getTime() > srvEndDt.getTime())) {
                    srtEndAry[i] = null;
                }
            }
        }
    }
    srtEndAry = srtEndAry.filter(function (a) { return a !== null });
    return srtEndAry;
}
//--- End of function to check time slots are available or not? based on worker existing services ---//

//--- Start of function to delete date key from JSON array ---//
function deleteDateKey(jsonArry) {
    for (var i = 0; i < jsonArry.length; i++) {
        delete jsonArry[i]['date'];
    }
    return jsonArry;
}
//--- End of function to delete date key from JSON array ---//

//--- Start of function to generate ranks based on following rules ---//
/*
*	Ranking Rules:
*	If beginning of appt is beginning of worker’s hours - 1 pt
*	If the end of the appt is at the end of worker’s hours - 1 pt
*	If beginning of appt is touching the end of a previous appt / book out time - 1 pt
*	If the end of the appt is touching the beginning of the next appt  / book out time - 1 pt
*	If the appt is ‘meshable’ (fits inside 'available for other work' interval) with another appt - 1 pt
*/
function generateRanks(srtEndAry, inputParms, cmpHrsData, cstHrsData, wrkSrvData) {
    srtEndAry = srtEndAry.filter(function (a) { return a !== null });
    var tempDtObj = inputParms['date'].split('-');
    var wrkDayStEnd = [];
    for (var i = 0; i < inputParms['id'].length; i++) {
        var selDt = new Date(tempDtObj[0], (parseInt(tempDtObj[1], 10) - 1), tempDtObj[2]);
        //--- Generates default start and end times of worker company hours ---//
        var defStEndTms = getDefStEdAry(cmpHrsData.filter(function (a) { return a['Id'] === inputParms['id'][i] })[0], selDt);
        //--- Worker custom hours ---//
        var wrkCstHrs = cstHrsData.filter(function (a) { return a['Company_Hours__c'] === cmpHrsData[i]['compHrsId'] });
        //--- Start of adding custom hours (Considering custom hours and all day off) ---//
        for (var j = 0; j < defStEndTms.length; j++) {
            if (wrkCstHrs && wrkCstHrs.length > 0) {
                for (var k = 0; k < wrkCstHrs.length; k++) {
                    tempDtObj = wrkCstHrs[k]['Date__c'].split('-');
                    var cstDt = new Date(tempDtObj[0], (parseInt(tempDtObj[1], 10) - 1), tempDtObj[2]);
                    if (defStEndTms[j] && cstDt.getTime() === defStEndTms[j][0].getTime()) {
                        if (wrkCstHrs[k]['All_Day_Off__c'] == 1) {
                            defStEndTms[j] = null;
                        } else {
                            defStEndTms[j] = [cstDt, wrkCstHrs[k]['StartTime__c'], wrkCstHrs[k]['EndTime__c']];
                        }
                    }
                }
            }
            selDt.setDate(selDt.getDate() + 1);
        }
        //--- End of adding custom hours (Considering custom hours and all day off) ---//
        //--- Removing null values from output array ---//
        defStEndTms = defStEndTms.filter(function (a) { return a !== null });
        //--- Start of creating start and end times of a day date objects ---//
        for (var j = 0; j < defStEndTms.length; j++) {
            var wrkStDtTime = new Date(defStEndTms[j][0]);
            var tempWrkStHrsMinAry = getHrsMin(defStEndTms[j][1]);
            wrkStDtTime.setHours(wrkStDtTime.getHours() + tempWrkStHrsMinAry[0]);
            wrkStDtTime.setMinutes(wrkStDtTime.getMinutes() + tempWrkStHrsMinAry[1]);
            var wrkEndDtTime = new Date(defStEndTms[j][0]);
            var tempWrkEndHrsMinAry = getHrsMin(defStEndTms[j][2]);
            wrkEndDtTime.setHours(wrkEndDtTime.getHours() + tempWrkEndHrsMinAry[0]);
            wrkEndDtTime.setMinutes(wrkEndDtTime.getMinutes() + tempWrkEndHrsMinAry[1]);
            defStEndTms[j] = { 'start': wrkStDtTime, 'end': wrkEndDtTime };
        }
        //--- End of creating start and end times of a day date objects ---//
        wrkDayStEnd.push({ 'id': inputParms['id'][i], 'dayStEnd': defStEndTms });
    }
    srtEndAry = filterByDur(srtEndAry, wrkDayStEnd, inputParms['durations']);
    for (var i = 0; i < srtEndAry.length; i++) {
        var stDur = 0;
        var endDur = parseInt(inputParms['durations'][0], 10);
        for (var j = 0; j < inputParms['id'].length; j++) {
            var tempWrkDayStEnd = wrkDayStEnd.filter(function (a) { return a['id'] == inputParms['id'][j] })[0]['dayStEnd'];
            for (var k = 0; k < tempWrkDayStEnd.length; k++) {
                // If beginning of appt is beginning of worker’s hours
                var temStrDateObj = new Date(srtEndAry[i]['date']);
                temStrDateObj.setMinutes(temStrDateObj.getMinutes() + stDur);
                if (temStrDateObj.getTime() === tempWrkDayStEnd[k]['start'].getTime()) {
                    srtEndAry[i]['rank'] += 1;
                }
                // If the end of the appt is at the end of worker’s hours
                var temEndDateObj = new Date(srtEndAry[i]['date']);
                temEndDateObj.setMinutes(temEndDateObj.getMinutes() + endDur);
                if (temEndDateObj.getTime() === tempWrkDayStEnd[k]['end'].getTime()) {
                    srtEndAry[i]['rank'] += 1;
                }
            }
            stDur += parseInt(inputParms['durations'][j], 10);
            if (inputParms['durations'][j + 1]) {
                endDur += parseInt(inputParms['durations'][j + 1], 10);
            }
        }
    }

    return srtEndAry;
}
//--- End of function to generate ranks ---//

//--- Start of function to filter time slots based on service end time and end time of worker day ---//
function filterByDur(srtEndAry, wrkDayStEnd, durations) {
    for (var i = 0; i < srtEndAry.length; i++) {
        for (var j = 0; j < wrkDayStEnd.length; j++) {
            if (srtEndAry[i]) {
                var tempDate = new Date(srtEndAry[i]['date']);
                tempDate.setMinutes(tempDate.getMinutes() + parseInt(durations[j], 10));
                var endDate = wrkDayStEnd[j]['dayStEnd'].filter(function (a) { return a['start'].getDate() === tempDate.getDate() })[0]['end'];
                if (tempDate.getTime() > endDate.getTime()) {
                    srtEndAry[i] = null;
                }
            }
        }
    }
    srtEndAry = srtEndAry.filter(function (a) { return a !== null });
    return srtEndAry;
}
//--- End of function to filter time slots based on service end time and end time of worker day ---//
