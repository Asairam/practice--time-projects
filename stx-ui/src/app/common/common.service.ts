import { isNullOrUndefined } from 'util';
export class CommonService {
  getUTCDatTmStr(currentDate: Date) {
    if (!currentDate) {
      currentDate = new Date();
    }
    return currentDate.getUTCFullYear()
      + '-' + ('0' + (currentDate.getUTCMonth() + 1)).slice(-2)
      + '-' + ('0' + currentDate.getUTCDate()).slice(-2)
      + ' ' + ('0' + currentDate.getUTCHours()).slice(-2)
      + ':' + ('0' + currentDate.getUTCMinutes()).slice(-2)
      + ':' + ('0' + currentDate.getUTCSeconds()).slice(-2);
  }

  UsrTmzStrToUTCStr(dateStr: string) {
    const dtTmArry = dateStr.split(' ');
    const dtArry = dtTmArry[0].split('-');
    const tmArry = dtTmArry[1].split(':');
    const datObj = new Date(parseInt(dtArry[0], 10), (parseInt(dtArry[1], 10) - 1), parseInt(dtArry[2], 10), parseInt(tmArry[0], 10), parseInt(tmArry[1], 10), parseInt(tmArry[2], 10));
    datObj.setTime(datObj.getTime() + datObj.getTimezoneOffset() * 60000);
    return this.getDBDatTmStr(datObj);
  }

  UTCStrToUsrTmzStr(UTCDtStr: string) {
    const dtTmArry = UTCDtStr.split(' ');
    const dtArry = dtTmArry[0].split('-');
    const tmArry = dtTmArry[1].split(':');
    const datObj = new Date(parseInt(dtArry[0], 10), (parseInt(dtArry[1], 10) - 1), parseInt(dtArry[2], 10), parseInt(tmArry[0], 10), parseInt(tmArry[1], 10), parseInt(tmArry[2], 10));
    datObj.setTime(datObj.getTime() - (datObj.getTimezoneOffset() * 60000));
    return this.getDBDatTmStr(datObj);
  }

  getDBDatTmStr(currentDate: Date) {
    if (!currentDate) {
      currentDate = new Date();
    }
    return currentDate.getFullYear()
      + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2)
      + '-' + ('0' + currentDate.getDate()).slice(-2)
      + ' ' + ('0' + currentDate.getHours()).slice(-2)
      + ':' + ('0' + currentDate.getMinutes()).slice(-2)
      + ':' + ('0' + currentDate.getSeconds()).slice(-2);
  }
  getDBDatTmStr2(dateString: string, dateFormat: string) {
    if (dateFormat === 'MM/DD/YYYY hh:mm:ss a') {
      const dateAry = dateString.split(' ');
      const dateObj = dateAry[0].split('/');
      const timeObj = dateAry[1].split(':');
      if (dateAry[2] === 'AM' && parseInt(timeObj[0], 10) === 12) {
        timeObj[0] = '00';
      }
      if (dateAry[2] === 'PM' && parseInt(timeObj[0], 10) !== 12) {
        timeObj[0] = (parseInt(timeObj[0], 10) + 12).toString();
      }
      return dateObj[2] + '-' + dateObj[0] + '-' + dateObj[1] + ' ' + timeObj[0] + ':' + timeObj[1] + ':' + '00';
    }
  }

  getDBDatStr(currentDate: Date) {
    if (!currentDate) {
      currentDate = new Date();
    }
    return currentDate.getFullYear()
      + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2)
      + '-' + ('0' + currentDate.getDate()).slice(-2)
      + ' 00:00:00';
  }

  getDateFrmDBDateStr(dateStr: string) {
    const dtTmArry = dateStr.split(' ');
    const dtArry = dtTmArry[0].split('-');
    return new Date(parseInt(dtArry[0], 10), (parseInt(dtArry[1], 10) - 1), parseInt(dtArry[2], 10));
  }

  getDateTmFrmDBDateStr(dateStr: string) {
    const dtTmArry = dateStr.split(' ');
    const dtArry = dtTmArry[0].split('-');
    const tmArry = dtTmArry[1].split(':');
    return new Date(parseInt(dtArry[0], 10), (parseInt(dtArry[1], 10) - 1), parseInt(dtArry[2], 10),
      parseInt(tmArry[0], 10), parseInt(tmArry[1], 10), parseInt(tmArry[2], 10));
  }
  /* below method used to split date 2018-09-15 to 9/15/2018 */
  // getDateTmFrmDBDateStrng(dateStr: string) {
  //   const dtTmArry = dateStr.split(' ');
  //   const dtArry = dtTmArry[0].split('-');
  //   // const tmArry = dtTmArry[1].split(':');
  //   return new Date(parseInt(dtArry[0], 10), parseInt(dtArry[1], 10), parseInt(dtArry[2], 10));
  // }

  // token create

  updateToken(data) {
    const returnXml = '<?xml version=\'1.0\' encoding=\'utf-8\'?>' +
      '<SECURECARDUPDATE>' +
      '<MERCHANTREF>' + data.merchantref + '</MERCHANTREF>' +
      '<TERMINALID>' + data.terminalid + '</TERMINALID>' +
      '<DATETIME>' + data.dateTime + '</DATETIME>' +
      '<CARDNUMBER>' + data.cardNum + '</CARDNUMBER>' +
      '<CARDEXPIRY>' + data.cardExp + '</CARDEXPIRY>' +
      '<CARDTYPE>' + data.cardType + '</CARDTYPE>' +
      '<CARDHOLDERNAME>' + data.cardHolName + '</CARDHOLDERNAME>' +
      '<HASH>' + data.hash + '</HASH>' +
      '<CVV>' + data.cvv + '</CVV>' +
      '</SECURECARDUPDATE>';
    return returnXml;
  }

  createToken(data) {
    const returnXml = '<?xml version=\'1.0\' encoding=\'utf-8\'?>' +
      '<SECURECARDREGISTRATION>' +
      '<MERCHANTREF>' + data.merchantref + '</MERCHANTREF>' +
      '<TERMINALID>' + data.terminalid + '</TERMINALID>' +
      '<DATETIME>' + data.dateTime + '</DATETIME>' +
      '<CARDNUMBER>' + data.cardNum + '</CARDNUMBER>' +
      '<CARDEXPIRY>' + data.cardExp + '</CARDEXPIRY>' +
      '<CARDTYPE>' + data.cardType + '</CARDTYPE>' +
      '<CARDHOLDERNAME>' + data.cardHolName + '</CARDHOLDERNAME>' +
      '<HASH>' + data.hash + '</HASH>' +
      '<CVV>' + data.cvv + '</CVV>' +
      '</SECURECARDREGISTRATION>';
    return returnXml;
  }
  createPaymentToken(data) {
    const returnXml = '<?xml version=\'1.0\' encoding=\'utf-8\'?>' +
      '<PAYMENT>' +
      '<ORDERID>' + data.ticketPaymntId + '</ORDERID>' +
      '<TERMINALID>' + data.terminalid + '</TERMINALID>' +
      '<AMOUNT>' + data.amountDue + '</AMOUNT>' +
      '<DATETIME>' + data.dateTime + '</DATETIME>' +
      '<CARDNUMBER>' + data.cardNum + '</CARDNUMBER>' +
      '<CARDTYPE>' + data.cardType + '</CARDTYPE>' +
      '<CARDEXPIRY>' + data.cardExp + '</CARDEXPIRY>' +
      '<HASH>' + data.hash + '</HASH>' +
      '<CURRENCY>' + data.currency + '</CURRENCY>' +
      '<TERMINALTYPE>' + data.terminalType + '</TERMINALTYPE>' +
      '<TRANSACTIONTYPE>' + data.transactionType + '</TRANSACTIONTYPE>' +
      '</PAYMENT>';
    return returnXml;
  }

  getCardType(cardNum: string) {
    if (cardNum.match(/^4[0-9]{6,}$/) != null) {
      return 'VISA';
    } else if (cardNum.match(/^3[47][0-9]{5,}$/) != null) {
      return 'AMEX';
    } else if (cardNum.match(/^6(?:011|5[0-9]{2})[0-9]{3,}$/) != null) {
      return 'DISCOVER';
    } else if (cardNum.match(/^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$/) != null) {
      return 'MASTERCARD';
    } else {
      return 'VISA';
    }
  }
  IsNumeric(e) {
    const value = e.target.value;
    let ret: boolean;
    const code = e.keyCode === 0 ? e.charCode : e.keyCode;
    const commonCondition: boolean = (code >= 48 && code <= 57) || (code === 8) || code >= 37 && code <= 40;
    if (commonCondition) { // check digits
      ret = true;
    } else {
      ret = false;
    }
    return ret;
  }

  // remove  duplicate records

  removeDuplicates(originalArray, prop) {
    const newArray = [];
    const lookupObject = {};
    for (let i = 0; i < originalArray.length; i++) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (const field of Object.keys(lookupObject)) {
      newArray.push(lookupObject[field]);
    }
    return newArray;
  }
  /**
   * insering filtered rewards of prods and services
   */
  insrtRwds(tempJSONObj, rList, i, j) {
    let rtnSrvObj;
    let rtnProObj;
    const obj = {
      'Name': rList[i]['Name'] + ': ' + tempJSONObj[j]['redeemName'],
      'Id': rList[i]['Id'],
      'points': rList[i]['points'],
      'redeemjson': tempJSONObj[j],
      'crId': rList[i]['crId'],
      'crdId': rList[i]['crdId'],
      'discount': tempJSONObj[j]['discount'],
      'discountType': tempJSONObj[j]['discountType'],
      'onOneItem': tempJSONObj[j]['onOneItem']

    };
    if (tempJSONObj[j]['onOneItem'] === 'Services') {
      rtnSrvObj = obj;
    } else if (tempJSONObj[j]['onOneItem'] === 'Products') {
      rtnProObj = obj;
    }
    const dataArray = { 'srvcRwds': rtnSrvObj, 'prodRwds': rtnProObj };
    return dataArray;
  }
  /**
   * @param clientRwdArray
   * @param apptData
   * to filter the rewards by dates of awardrules
   */
  getFilterRwdsByAwardRules(clientRwdArray, apptData) {
    for (let i = 0; i < clientRwdArray.length; i++) {
      let serviceDate = new Date();
      if (apptData && apptData.apdate) {
        const tempDtStr = apptData.apdate.split(' ')[0].split('-');
        serviceDate = new Date(tempDtStr[0], (parseInt(tempDtStr[1], 10) - 1), tempDtStr[2]);
      }
      if (clientRwdArray[i]['stDate'] && clientRwdArray[i]['endDate']) {
        const stDtAry = clientRwdArray[i]['stDate'].split(' ')[0].split('-');
        const stDt = new Date(stDtAry[0], (parseInt(stDtAry[1], 10) - 1), stDtAry[2]);
        const endDtAry = clientRwdArray[i]['endDate'].split(' ')[0].split('-');
        const endDt = new Date(endDtAry[0], (parseInt(endDtAry[1], 10) - 1), endDtAry[2]);
        if (stDt <= serviceDate && endDt >= serviceDate) {
          clientRwdArray[i]['isInsert'] = true;
        }
      } else {
        clientRwdArray[i]['isInsert'] = true;
      }
    }
    clientRwdArray = clientRwdArray.filter((obj) => obj.isInsert);
    return clientRwdArray;
  }



  /*
  *  Belongs to pages bookstanding and modify and find appt start
  */

  dateMatch(apptDate: Date, customHoursDate: Date): boolean {

    return (apptDate.getTime() === customHoursDate.getTime());
  }

  /// Get the custom hours of worker if exsists
  getCustomHoursData(selectedWorker, reqApptStart: Date) {
    const length = selectedWorker.Date__c.split(',').length;
    let workerTimings: any;
    for (let i = 0; i < length; i++) {
      const year = selectedWorker.Date__c.split(',')[i].split('-')[0];
      const month = +selectedWorker.Date__c.split(',')[i].split('-')[1] - 1;
      const day = selectedWorker.Date__c.split(',')[i].split('-')[2];
      const isOffDay = selectedWorker.All_Day_Off__c.split(',')[i];
      const StartTime__c = +isOffDay === 1 ? '' : selectedWorker.StartTime__c.split(',')[i];
      const EndTime__c = +isOffDay === 1 ? '' : selectedWorker.EndTime__c.split(',')[i];
      const apptDateNoTime = new Date(reqApptStart.getFullYear(), reqApptStart.getMonth(), reqApptStart.getDate(), 0, 0, 0);
      if (this.dateMatch(apptDateNoTime, new Date(year, month, day, 0, 0, 0))) {
        workerTimings = {
          startTime: StartTime__c,
          endTime: EndTime__c,
        };
        break;
      }
    }
    return workerTimings;

  }

  //// get worker hours by checking company hours , custom hours and default company hours
  getWorkerHours(reqApptStart: Date, workerId: string, workerHours: Array<any>): { 'startTime': string, 'endTime': string } {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedWorker = workerHours.filter((worker) => worker.Id === workerId)[0];
    const day = weekDays[reqApptStart.getDay()];
    let workerTimings: any;
    if (!isNullOrUndefined(selectedWorker.Date__c)) {
      workerTimings = this.getCustomHoursData(selectedWorker, reqApptStart);
    }
    if (!workerTimings) {
      workerTimings = {};
      for (const key in selectedWorker) {
        if (key.toLowerCase() === day.toLowerCase() + 'starttime__c') {
          workerTimings['startTime'] = selectedWorker[key];
        } else if (key.toLowerCase() === day.toLowerCase() + 'endtime__c') {
          workerTimings['endTime'] = selectedWorker[key];
        }
      }
    }
    return workerTimings;
  }
  //// comparison for worker timings with service timings
  compareWorkerTimings(workerStartDate: Date, workerEndDate: Date, reqApptStart: Date, reqApptEnd: Date): boolean {
    const isExsistInworkerHours = (reqApptStart.getTime() >= workerStartDate.getTime()) && (reqApptEnd.getTime() <= workerEndDate.getTime()) ? true : false;
    return isExsistInworkerHours;
  }

  //// Checking worker working hours with service timings for availability
  checkWorkerServiceStatus(reqApptStart: Date, reqApptEnd: Date, workerId: string, workerTimings: Array<any>): boolean {
    const workerHours = this.getWorkerHours(reqApptStart, workerId, workerTimings);
    let isExsistInworkerHours: boolean;
    if ((workerHours.startTime !== '' && !isNullOrUndefined(workerHours.startTime)) || (workerHours.endTime !== '' && !isNullOrUndefined(workerHours.endTime))) {
      const startTime = this.timeConversionToDate(workerHours.startTime, reqApptStart);
      const endTime = this.timeConversionToDate(workerHours.endTime, reqApptStart);
      isExsistInworkerHours = this.compareWorkerTimings(startTime, endTime, reqApptStart, reqApptEnd);
    } else {
      isExsistInworkerHours = false;
    }

    return !isExsistInworkerHours;
  }

  timeConversionToDate(time: string, bookingDate: Date): Date {
    let hours: any;
    let minutes: any = time.split(' ')[0].split(':')[1];
    if (time.split(' ')[1] === 'AM') {
      hours = time.split(' ')[0].split(':')[0];
      if (+hours === 12) {
        hours = 0;
      }
    } else if (time.split(' ')[1] === 'PM') {
      hours = time.split(' ')[0].split(':')[0];
      if (parseInt(hours, 10) !== 12) {
        hours = parseInt(hours, 10) + 12;
      }
    }
    minutes = parseInt(minutes, 10);
    return new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate(), hours, minutes);
  }
  // Compares appointment timings with request service time to check availability
  compareDatesForAppointment(apptStart: Date, apptEnd: Date, reqApptStart: Date, reqApptEnd: Date): boolean {
    if (reqApptStart.getTime() >= apptStart.getTime() && reqApptStart.getTime() < apptEnd.getTime()) {
      return true;
    } else if (reqApptEnd.getTime() > apptStart.getTime() && reqApptEnd.getTime() <= apptEnd.getTime()) {
      return true;
    } else if (reqApptStart.getTime() <= apptStart.getTime() && reqApptEnd.getTime() >= apptEnd.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  // calculate servcie tax
  calculateServiceTax(taxAmount: number, bookingData: Array<any>, packageIncluded: boolean): { bookingData: Array<any>, serviceTax: number, sales: number } {
    let totalTax = 0;
    let totalPrice = 0;
    const data = bookingData.map((bookedData) => {
      bookedData['Service_Tax__c'] = this.calculatePercentage(taxAmount, bookedData['Net_Price__c'], bookedData['Taxable__c']);
      totalTax += bookedData['Service_Tax__c'];
      totalPrice += bookedData['Net_Price__c'];
      bookedData['IsPackage'] = packageIncluded ? 1 : 0;
      return bookedData;
    });
    return {
      bookingData: data,
      serviceTax: totalTax,
      sales: totalPrice
    };
  }
  // Calculate tax amount from the tax percent
  calculatePercentage(taxPercentage: number, Amount: number, isTaxable: number): number {
    if (isTaxable === 1) {
      const amountValue = (+Amount * +taxPercentage) / 100;
      return +amountValue.toFixed(2);
    } else {
      return 0;
    }

  }

  // Get the durations , charges from the worker.
  getServiceDurations(workerData) {
    const workerKeys = ['wduration1', 'wduration2', 'wduration3', 'wbuffer'];
    const serviceKeys = ['sduration1', 'sduration2', 'sduration3', 'sbuffer'];
    const durationKeys = ['Duration_1__c', 'Duration_2__c', 'Duration_3__c', 'Buffer_After__c'];
    const otherWorkerDetails = ['Duration_1_Available_for_Other_Work__c', 'Duration_2_Available_for_Other_Work__c',
      'Duration_3_Available_for_Other_Work__c'];
    const otherServiceDetails = ['sDuration_1_Available_for_Other_Work__c', 'sDuration_2_Available_for_Other_Work__c',
      'sDuration_3_Available_for_Other_Work__c'];
    const durations: any = {};
    if (workerKeys.map((key) => workerData[key]).filter((value) => value !== 0 && value !== null && value).length !== 0) {
      workerKeys.map((key, i) => {
        durations[durationKeys[i]] = workerData[key] ? workerData[key] : 0;
      });
      otherWorkerDetails.map((key) => {
        durations[key] = workerData[key] ? +workerData[key] : 0;
      });
    } else {
      serviceKeys.map((key, i) => {
        durations[durationKeys[i]] = workerData[key] ? workerData[key] : 0;
      });
      otherServiceDetails.map((key, i) => {
        durations[otherWorkerDetails[i]] = workerData[key] ? +workerData[key] : 0;
      });
    }
    durations['Guest_Charge__c'] = workerData['Guest_Charge__c'] ? workerData['Guest_Charge__c'] : 0;
    durations['Net_Price__c'] = workerData['Net_Price__c'] ? workerData['Net_Price__c'] : 0;
    durations['Taxable__c'] = workerData['Taxable__c'] ? workerData['Taxable__c'] : 0;

    return durations;
  }
  /*
  *  Belongs to pages bookstanding and modify and find appt ends
  */

  getCheckInPrepaidPackage(packageList: Array<any>, apptData: any, serviceData: Array<any>) {
    let pckData = [];
    const pckArray = [];
    let sumOfDiscountedPrice = 0;
    let discountedPackageTotal = 0;
    let discountedPackage = 0;
    let pckgtax = 0;
    let rows = [];
    let pckgObj = {};
    let pckId = '';
    const ticketServiceData = [];
    rows = serviceData;
    const bkdPckId = apptData.Booked_Package__c.split(',');
    let bookedPckgVal = [];
    const taxPer = JSON.parse(apptData.SalesTax);
    for (let i = 0; i < bkdPckId.length; i++) {
      if (bkdPckId[i] && bkdPckId[i] !== '') {
        bookedPckgVal.push({ 'Id': bkdPckId[i] });
      }
    }
    bookedPckgVal = this.removeDuplicates(bookedPckgVal, 'Id');
    for (let i = 0; i < bookedPckgVal.length; i++) {
      pckData = pckData.concat(packageList.filter((obj) => obj.Id === bookedPckgVal[i]['Id']));
      if (pckData && pckData[i] && pckData[i].Discounted_Package__c) {
        pckId = pckData[i].Id;
        discountedPackage += parseFloat(pckData[i].Discounted_Package__c);
        pckgtax += parseFloat(pckData[i].Tax__c);
        discountedPackageTotal += parseFloat(pckData[i].Discounted_Package__c);
        const tempArry = [];
        for (let j = 0; j < JSON.parse(pckData[i].JSON__c).length; j++) {
          sumOfDiscountedPrice += parseFloat(JSON.parse(pckData[i].JSON__c)[j].discountPriceEach);
          const tempObj = JSON.parse(pckData[i].JSON__c)[j];

          for (let k = 0; k < rows.length; k++) {

            if ((rows[k].Id === JSON.parse(pckData[i].JSON__c)[j].serviceId)) {
              if (parseInt(tempObj['reps'], 10) > 0) {
                tempObj['reps'] = parseInt(tempObj['reps'], 10) - 1;
                tempObj['used'] = tempObj['used'] + 1;
              }
              // tempArry.push(tempObj);
              ticketServiceData.push({
                'pckId': pckId,
                'serviceId': rows[k].Id,
                'netPrice': +JSON.parse(pckData[i].JSON__c)[j].discountPriceEach,
                'serTax': ((JSON.parse(pckData[i].JSON__c)[j].taxable === '1' || JSON.parse(pckData[i].JSON__c)[j].taxable === 1) ?
                  ((JSON.parse(pckData[i].JSON__c)[j].discountPriceEach) * (+taxPer.serviceTax / 100)) : 0)
                // 'serTax': (JSON.parse(pckData[i].JSON__c)[j].discountPriceEach) * (+taxPer.serviceTax / 100)
              });
            }
          }
          tempArry.push(tempObj);
        }
        pckData[i].JSON__c = JSON.stringify(tempArry);
      }
      pckArray.push({
        'pckId': pckId,
        'sumOfDiscountedPrice': discountedPackage + pckgtax,
        'discountedPackage': discountedPackage,
        'Json': pckData[i].JSON__c,
        'pckgtax': pckgtax
      });
      sumOfDiscountedPrice = 0;
      discountedPackage = 0;
      pckgtax = 0;
    }
    pckgObj = {
      'pckArray': this.removeDuplicates(pckArray, 'pckId'),
      'discountedPackageTotal': discountedPackageTotal,
      // 'discountedPackage': discountedPackage
      'ticketServiceData': ticketServiceData
    };
    apptData.apstatus = 'Checked In';
    const apptDataObj = {
      'apstatus': 'Checked In',
      'clientCurBal': apptData.Current_Balance__c,
      'serviceSales': apptData.Service_Sales__c,
      'apptId': apptData.apptid ? apptData.apptid : apptData.apptId,
      'netprice': apptData.netprice

    };
    return { apptDataResult: apptDataObj, packageResult: pckgObj };
    // this.checkIn(apptDataObj, pckgObj);
  }
  /* Below method is used to convert 2018-09-07 to 9/7/2018 */
  // getUsrDtStrFrmDBStrng(DBDtStr: string) {
  //   if (DBDtStr) {
  //   const dtObj = this.getDateTmFrmDBDateStrng(DBDtStr);
  //   DBDtStr = (dtObj.getUTCMonth()) + '/' + (dtObj.getUTCDate() + 1) + '/' + dtObj.getUTCFullYear();
  //   } else {
  //     DBDtStr = '';
  //   }
  //   return DBDtStr;
  // }


  getUsrDtStrFrmDBStr(DBDtStr: string) {
    const dtObj = this.getDateTmFrmDBDateStr(DBDtStr);
    DBDtStr = (dtObj.getUTCMonth() + 1) + '/' + dtObj.getUTCDate() + '/' + dtObj.getUTCFullYear();
    return [DBDtStr, this.formatAMPM(dtObj)];
  }

  formatAMPM(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + ':' + ('0' + minutes).slice(-2) + ' ' + ampm;
  }
  /* format for Ex:2018/08/30 14:20:00 to 2018/08/30 02:20PM */
  getAMPM(date) {
    const temp = date;
    date = new Date(date);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return (temp.split(' ')[0] + '$' + ((hours < 10) ? ('0' + hours) : hours) + ':' + ('0' + minutes).slice(-2) + ' ' + ampm);
  }
}
