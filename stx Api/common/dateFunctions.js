module.exports = {
    getUTCDatTmStr: function (currentDate) {
        if (!currentDate) {
            currentDate = new Date();
        }
        return currentDate.getUTCFullYear()
            + '-' + ('0' + (currentDate.getUTCMonth() + 1)).slice(-2)
            + '-' + ('0' + currentDate.getUTCDate()).slice(-2)
            + ' ' + ('0' + currentDate.getUTCHours()).slice(-2)
            + ':' + ('0' + currentDate.getUTCMinutes()).slice(-2)
            + ':' + ('0' + currentDate.getUTCSeconds()).slice(-2);
    },
    getDBDatTmStr: function (currentDate) {
        if (!currentDate) {
            currentDate = new Date();
        }
        return currentDate.getFullYear()
            + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2)
            + '-' + ('0' + currentDate.getDate()).slice(-2)
            + ' ' + ('0' + currentDate.getHours()).slice(-2)
            + ':' + ('0' + currentDate.getMinutes()).slice(-2)
            + ':' + ('0' + currentDate.getSeconds()).slice(-2);
    },
    getDBNxtDay: function (dayParm) {
        var dtTmArry = dayParm.split(' ');
        var dtArry = dtTmArry[0].split('-');
        var nxtDt = ('0' + (parseInt(dtArry[2], 10) + 1)).slice(-2);
        return dtArry[0] + '-' + dtArry[1] + '-' + nxtDt + ' ' + dtTmArry[1];
    },
    getDBStEndWk: function (dayParm) {
        var dtTmArry = dayParm.split(' ');
        var dtArry = dtTmArry[0].split('-');
        var tmArry = dtTmArry[1].split(':');
        var datObj = new Date(dtArry[0], (parseInt(dtArry[1], 10) - 1), dtArry[2], tmArry[0], tmArry[1], tmArry[2]).getWeek();
        return [this.getDBDatTmStr(datObj[0]).split(' ')[0] + ' ' + dtTmArry[1], this.getDBDatTmStr(datObj[1]).split(' ')[0] + ' ' + dtTmArry[1]];
    },
    getDBStEndMnt: function (dayParm) {
        var dtTmArry = dayParm.split(' ');
        var dtArry = dtTmArry[0].split('-');
        var tmArry = dtTmArry[1].split(':');
        var monDysAry = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var endMon = monDysAry[parseInt(dtArry[1], 10) - 1];
        if (parseInt(dtArry[1], 10) === 2 && (dtArry[0] % 4 === 0)) {
            endMon++;
        }
        return [dtArry[0] + '-' + dtArry[1] + '-' + '01' + ' ' + dtTmArry[1], dtArry[0] + '-' + dtArry[1] + '-' + endMon + ' ' + dtTmArry[1]];
    },
    getDBWkDays: function (dayParm) {
        var dtTmArry = dayParm.split(' ');
        var dtArry = dtTmArry[0].split('-');
        var tmArry = dtTmArry[1].split(':');
        var datObj = new Date(dtArry[0], (parseInt(dtArry[1], 10) - 1), dtArry[2], tmArry[0], tmArry[1], tmArry[2]);
        var rtnAry = [];
        while(datObj.getDate() > 7) {
            datObj.setDate(datObj.getDate()-7);
        }
        var noOfDaysInMonth = new Date(datObj.getFullYear(), datObj.getMonth()+1, 0).getDate();
        var datMon = datObj.getMonth();
        while(datObj.getDate() <= noOfDaysInMonth && datMon == datObj.getMonth()) {
            var tempAryVal = datObj.getFullYear() + '-' + ('0' + (datObj.getMonth()+1)).slice(-2) + '-' + ('0' + datObj.getDate()).slice(-2);
            rtnAry.push(tempAryVal);
            datObj.setDate(datObj.getDate()+7);
        }
        return rtnAry;
    },

    addMinToDBStr(dateStr, min) {
        var dtTmArry = dateStr.split(' ');
        var dtArry = dtTmArry[0].split('-');
        var tmArry = dtTmArry[1].split(':');
        var datObj = new Date(dtArry[0], (parseInt(dtArry[1], 10) - 1), dtArry[2], tmArry[0], tmArry[1], tmArry[2]);
        datObj.setTime(datObj.getTime() + min * 60000);
        return this.getDBDatTmStr(datObj);
    }
};

Date.prototype.getWeek = function (start) {
    start = start || 0;
    var today = new Date(this.setHours(0, 0, 0, 0));
    var day = today.getDay() - start;
    var date = today.getDate() - day;
    var StartDate = new Date(today.setDate(date));
    var EndDate = new Date(today.setDate(date + 6));
    return [StartDate, EndDate];
}