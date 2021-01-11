import { Injectable } from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Injectable()
export class PrintPreviewService {

    constructor(
      private _decimalPipe: DecimalPipe
    ) { }

    getTableBodyListItemDetails(itemData, viewData) {
        let newBody = [];
        itemData.forEach((data, index) => {
            let srno = index+1;
            let lotName =  data.lotType? data.lotType : data.lotName;
            let itemcode = data.itemCode;
            let qty = data.minimumDesiredQuantity;
            let unit = data.unitOfMeasure;
            let remarks = data.remarks;
            let amount = data.startPrice?data.startPrice:0;
            let minimumChangeValue = data.minimumChangeValue ? data.minimumChangeValue : viewData.biddingRules.minBidChange ? viewData.biddingRules.minBidChange : 0;
            let row = [srno, itemcode, lotName + '/' + data.itemName, amount, qty, minimumChangeValue, unit, remarks ];
             
            newBody.push(row);
            let customItemRow = [];
            data.customFieldData.forEach(function(field) {
              var head = viewData.customHeader.indexOf(field.name);
              if(head != -1) {
                customItemRow.push(field.value)
              }
            })
            if(customItemRow.length>0) {
              newBody.push(viewData.customHeader);
              newBody.push(customItemRow);
            }
            if(data.fromMMCS) {  
              if(data.longTextChar) {
                if(data.longTextChar.mmcsLongDesc) {
                  newBody.push([{content: '', styles: { fillColor: 255 }} ,{ content: {longDesc : true, isdescLabel: true, descLabel: 'Long Description :'}, colSpan: 5, rowSpan: 0, styles: { fillColor: 255, fontStyle:"bold" } }])
                  newBody.push([{content: '', styles: { fillColor: 255 }} ,{ content: {longDesc : true, isdesc: true, desc: data.longTextChar && data.longTextChar.mmcsLongDesc ?  data.longTextChar.mmcsLongDesc : ''}, colSpan: 5, rowSpan: 0, styles: { fillColor: 255 } }])
                }
                if(data.longTextChar.mmcsCharacteristics && data.longTextChar.mmcsCharacteristics.length > 0) {
                  newBody.push([{content: '', styles: { fillColor: 255 }} ,{ content: {longDesc : true, ischarLabel: true, charLabel: 'Characteristics :'}, colSpan: 5, rowSpan: 0, styles: { fillColor: 255, fontStyle:"bold" } }])
                  newBody.push([{content: '', styles: { fillColor: 255 }} ,{ content: '', customData: {longDesc : true, ischar: true, characteristics: data.longTextChar}, colSpan: 5, rowSpan: 0, styles: { fillColor: 255 } }])
                }
              }    
            }
        })
        return newBody;
    }

    getTableBodyListParticipants(participantList, basicInfoData, itemData) {
        let body = [];
        participantList.forEach((element, index) => {
            body.push([ index+1, element.supplierID , element.supplierName1 , element.supplierState, "", "", ""]);
            element.contactperson.forEach(contact => {
              body.push(["", "", "", "", contact.vendorfullname, contact.useremail1, contact.mobileno ]);
            });
            if(element.bids && element.bids.length > 0) {
              body.push([
                {
                  customData: true,
                  content: {
                    supplier: element,
                    basicInfoData: basicInfoData,
                    itemData: itemData,
                  }, colSpan: 7, rowSpan: 0, styles: { fillColor: 255 } }]);
            }
        });
        return body;
    }

    getHeaderListBidsInParticipants(supplier, basicInfoData, itemData) {
        let headers = ["S.no", "Lot Name/Item Name", "Quantity"];
        let currencyCode = supplier.supplierCurrency.currencyCode ? supplier.supplierCurrency.currencyCode : '';
        headers.push(`My Unit Cost (${currencyCode})`);
        headers.push(`My Total Unit Cost (${currencyCode})`);

        if(basicInfoData.currency.length > 1) {
            let priCurrency = basicInfoData.primaryCurrency ? basicInfoData.primaryCurrency : '';
            headers.push(`Landed Cost (${priCurrency})`);
            headers.push(`Total LC (${priCurrency})`);
        }
        return headers
    }

    getTableBodyListBidsInParticipants(supplier, basicInfoData, itemData) {
      let tableBody = [];
      itemData.forEach((item, index) => {
          let tmp = [];
          tmp.push(index+1);
          let lotNameame = item.lotType ? item.lotType : item.lotName;
          tmp.push(`${lotNameame}/${item.itemName}`);
          tmp.push(item.minimumDesiredQuantity);
          // for preItem , baseCost -- refer filter
          let preData = supplier.bids.filter(x => x.lineItemID == item.itemID)[0];
          let baseCost = preData && preData.baseCost ? preData.baseCost : null;
          baseCost = this.numDifferentiation(baseCost, basicInfoData.currencyDecimalPlace);
          tmp.push(baseCost);
          let variableCost = preData && preData.variableCost ? preData.variableCost : null;
          variableCost = this.numDifferentiation(variableCost, basicInfoData.currencyDecimalPlace);
          tmp.push(variableCost);
          let landedCost = preData && preData.landedCost ? preData.landedCost : null;
          landedCost = this.numDifferentiation(landedCost, basicInfoData.currencyDecimalPlace);
          tmp.push(landedCost);
          let totalLandedCost = preData && preData.totalLandedCost ? preData.totalLandedCost : null;
          landedCost = this.numDifferentiation(totalLandedCost, basicInfoData.currencyDecimalPlace);
          tmp.push(totalLandedCost);

          if(basicInfoData.currency.length > 1) {
              tmp.push(landedCost);
              tmp.push(totalLandedCost);
          }
          tableBody.push(tmp);
      });
      let tmpTotal = [];
      tmpTotal.push({content: 'Total', styles: { fillColor: 255 },  colSpan: 3, rowSpan: 0});
      tmpTotal.push('');
      let variableCost = this.numDifferentiation(supplier.variableCost, basicInfoData.currencyDecimalPlace);
      tmpTotal.push(variableCost);
      let landedCost = this.numDifferentiation(supplier.landedCost, basicInfoData.currencyDecimalPlace);
      tmpTotal.push(landedCost);
      let totalLandedCost = this.numDifferentiation(supplier.totalLandedCost, basicInfoData.currencyDecimalPlace);
      tmpTotal.push(totalLandedCost);

      if(basicInfoData.currency.length > 1) {
        tmpTotal.push(landedCost);
        tmpTotal.push(totalLandedCost);
      }
      tableBody.push(tmpTotal);
      return tableBody;
    }

    numDifferentiation(value, decimalplace) {
      let val;
      if (value < 0) {
        val = value;
      } else {
        val = Math.abs(value);
      }
      return this._decimalPipe.transform(val.toFixed(decimalplace),"0.0-"+decimalplace)
    }

    getTableBodyListCohost(hostList) {
        let body = [];
        hostList.forEach((element, index) => {
            let employeeID = element.employeeID ? element.employeeID : '';
            let employeeName = element.employeeName ? element.employeeName : '';
            let employeeMail = element.employeeMail ? element.employeeMail : '';
            let employeeMobileNo = element.employeeMobileNo ? element.employeeMobileNo : '';
            body.push([index+1, employeeID, employeeName, employeeMail, employeeMobileNo]);
        });
        return body;
    }

    getTableBodyListLongDesc(content) {
        let charBody = [];
        content.characteristics.mmcsCharacteristics.forEach((element, index) => {
            let desc = element.nvchcharacteristics ? element.nvchcharacteristics : '';
            let unit = element.nvchuomcode ? element.nvchuomcode : '';
            let type = element.charvaluetype ? element.charvaluetype : '';
            let values = element.nvchcharvalues ? element.nvchcharvalues : '';
            let abbrev = element.nvchcharabbrev ? element.nvchcharabbrev : '';
            charBody.push([index+1, desc, unit, type, values, abbrev]);
        });
        return charBody;
    }

}