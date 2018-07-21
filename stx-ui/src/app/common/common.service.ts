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
      '<CARDEXPIRY>0719</CARDEXPIRY>' +
      '<HASH>' + data.hash + '</HASH>' +
      '<CURRENCY>' + data.currency + '</CURRENCY>' +
      '<TERMINALTYPE>' + data.terminalType + '</TERMINALTYPE>' +
      '<TRANSACTIONTYPE>' + data.transactionType + '</TRANSACTIONTYPE>' +
      '</PAYMENT>';
    return returnXml;
  }
  getServiceDurations(workerData) {
    const workerKeys = ['wduration1', 'wduration2', 'wduration3', 'wbuffer'];
    const serviceKeys = ['sduration1', 'sduration2', 'sduration3', 'sbuffer'];
    const durationKeys = ['Duration_1__c', 'Duration_2__c', 'Duration_3__c', 'Buffer_After__c'];
    const otherDetails = ['Duration_1_Available_for_Other_Work__c', 'Duration_2_Available_for_Other_Work__c',
      'Duration_3_Available_for_Other_Work__c'];
    const durations: any = {};
    if (workerKeys.map((key) => workerData[key]).filter((value) => value !== 0 && value !== null).length !== 0) {
      workerKeys.map((key, i) => {
        durations[durationKeys[i]] = workerData[key] ? workerData[key] : 0;
      });
    } else {
      serviceKeys.map((key, i) => {
        durations[durationKeys[i]] = workerData[key] ? workerData[key] : 0;
      });
    }
    durations['Guest_Charge__c'] = workerData['Guest_Charge__c'] ? workerData['Guest_Charge__c'] : 0;
    durations['Net_Price__c'] = workerData['Net_Price__c'] ? workerData['Net_Price__c'] : 0;
    durations['Taxable__c'] = workerData['Taxable__c'] ? workerData['Taxable__c'] : 0;
    otherDetails.map((key) => {
      durations[key] = workerData[key] ? +workerData[key] : 0;
    });
    return durations;
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
      'crdId': rList[i]['crdId']
    };
    if (tempJSONObj[j]['onOneItem'] === 'Services') {
      rtnSrvObj = obj;
    } else if (tempJSONObj[j]['onOneItem'] === 'Products') {
      rtnProObj = obj;
    }
    const dataArray = { 'srvcRwds': rtnSrvObj, 'prodRwds': rtnProObj };
    return dataArray;
  }
}
