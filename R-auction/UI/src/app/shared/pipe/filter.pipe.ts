import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../authService/auth.service';
import {DecimalPipe} from '@angular/common';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  userProfile: any;
  constructor(private authService: AuthService,private _decimalPipe: DecimalPipe) {
    this.userProfile = authService.getUserData();
  }
  decimalplace: any = null;

  numDifferentiation(value) {
    let val;
    if (value < 0) {
      val = value;
    } else {
      val = Math.abs(value);
    }
    // if (val >= 10000000) {
    //   return (val / 10000000).toFixed(this.decimalplace) + ' Cr';
    // } else if (val >= 100000) {
    //   return (val / 100000).toFixed(this.decimalplace) + ' Lac';
    // }
    // else {
      return this._decimalPipe.transform(val.toFixed(this.decimalplace),"0.0-"+this.decimalplace)
    //}
  }

  transform(value: any, arg1: any = [], arg2: any = null, flag: any = null, vendorcode: any = null, baseline: any = null, type: any = null, savingFlag: any = null, decimalplace: any = null, itemID: any = null, exchangeRate: any = null): any {
    this.decimalplace = (decimalplace || decimalplace == 0) ? decimalplace : 2;
    let dataBid = arg1;
    if (arg1.length > 0) {
      let data = null;
      if (itemID) {
        if (flag == "landed") {
          dataBid = dataBid.filter(x => x.itemID == itemID);
          data = (dataBid.length > 0) ? dataBid[0].landedUnitRate : 0;
        }
        else if (flag == "preItem") {
          if (dataBid.length > 0) {
            let preData = dataBid.filter(x => x.lineItemID == itemID);
            if(preData.length> 0){
            if (arg2 == "baseCost") {
              data = preData[0].baseCost ? preData[0].baseCost : null;
            }
            if (arg2 == "variableCost") {
              data = preData[0].variableCost ? preData[0].variableCost : null;
            }
            if (arg2 == "landedCost") {
              data = preData[0].landedCost ? preData[0].landedCost : null;
            }
            if (arg2 == "totalLandedCost") {
              data = preData[0].totalLandedCost ? preData[0].totalLandedCost : null;
            }
          }
        }
          else {
            data = 0;
          }

        }
        else {
          dataBid = dataBid.filter(x => x.itemID == itemID);
          data = (dataBid.length > 0) ? dataBid[0].totalLandedCost : 0;
        }
        data = this.numDifferentiation(data);
      }
      else {
        let vendorCode = (vendorcode != null) ? vendorcode : this.userProfile.settings.ril.vendorcodeSelected;

        if (arg2 != 4) {
          let lotBid = dataBid.filter(obj => obj.data._id == vendorCode);
          let eventBid = dataBid.filter(obj => obj.data._id == vendorCode);
          dataBid = dataBid.filter(obj => obj.data.bidderID == vendorCode);

          if (arg2 == 0) {
            // if (flag == "item") {
            data = (dataBid.length > 0) ? (dataBid.map(item => item.data.baseCost)[0]) : 0;
            if(exchangeRate){
              data = (dataBid.length > 0) ? this.numDifferentiation(data) : 0;
            }
            else{
            data = (dataBid.length > 0) ? ((dataBid[0].data.currency) ? dataBid[0].data.currency.currencyCode + " " : "") + this.numDifferentiation(data) : 0;
            }
            // }
          }
          else if (arg2 == 1) {
            if (flag == "lot") {
              data = (lotBid.length > 0) ? (lotBid.map(item => item.data.totalLandedCost)[0]) : 0;
            }
            else if (flag == "event") {
              data = (eventBid.length > 0) ? (eventBid.map(event => event.data.totalLandedCost)[0]) : 0;
            }
            else {
              data = (dataBid.length > 0) ? (dataBid.map(item => item.data.variableCost)[0]) : 0;

            }
            if (baseline != null) {
              if (type == 'forward') {
                let x = (data) ? data = (baseline != 0) ? (Math.round(((data - baseline) / baseline) * 100)) : 0 : 0;
                console.log(x);
              }
              else {
                let y = (data) ? data = (baseline != 0) ? (Math.round(((baseline - data) / baseline) * 100)) : 0 : 0;
                console.log(y)
              }
              data = this.numDifferentiation(data) + "%";

            }
            else {
              data = this.numDifferentiation(data);
            }
          }
          else if (arg2 == 11) {
            if (flag == "lot") {
              data = (lotBid.length > 0) ? (lotBid.map(item => item.data.totalLotCost)[0]) : 0;
            }
            else if (flag == "event") {
              data = (eventBid.length > 0) ? (eventBid.map(event => event.data.totalEventCost)[0]) : 0;
            }
            else {
              data = (dataBid.length > 0) ? (dataBid.map(item => item.data.variableCost)[0]) : 0;

            }
            data = this.numDifferentiation(data);
          }
          else if (arg2 == 2) {
            if (flag == "lot") {
              data = lotBid.map(lot => lot.rank)[0];
            }
            else if (flag == "event") {
              data = eventBid.map(event => event.rank)[0];
            }
            else {
              data = dataBid.map(item => item.rank)[0];
            }
            if (!data) {
              data = 0;
            }
          }
          else if (arg2 == 3) {
            if (flag == "lot") {
              data = lotBid.map(lot => lot.data.count)[0];
            }
            else if (flag == "event") {
              data = eventBid.map(event => event.data.count)[0];
            }
            else {
              data = dataBid.map(item => item.data.count)[0];
            }
            data = (data != undefined) ? data : 0;
          }
          else if (arg2 == 8) {
            data = dataBid.map(item => item.data.landedCost)[0];
            data = (data != undefined) ? this.numDifferentiation(data) : 0;
          }
          else if (arg2 == 9) {
            if (flag == "lot") {
              data = lotBid.map(lot => lot.data.totalLandedLotCost)[0];
            }
            else if (flag == "event") {
              data = eventBid.map(event => event.data.totalLandedEventCost)[0];
            }
            else {
              data = dataBid.map(item => item.data.totalLandedCost)[0];
            }
            if (flag == "lot" || flag == "event") {
              data = (data != undefined) ? data / exchangeRate : 0
            }
            data = (data != undefined) ? this.numDifferentiation(data) : 0;

          }
          else {
            data = lotBid.map(lot => lot.rank)[0];
          }
        }
        else {
          dataBid = dataBid.filter(obj => obj.bidderID == vendorCode);

          if (flag == "base") {
            data = dataBid.map(base => base.baseCost)[0];
            data = this.numDifferentiation(data);
          }
          else if (flag == "variable") {
            data = dataBid.map(variable => variable.variableCost)[0];
            data = this.numDifferentiation(data);
          }
          else if (flag == "time") {
            data = dataBid.map(time => time.submitDate)[0];
          }
          else if (flag == "initialBase") {
            data = dataBid.map(base => base.baseCost);
            data = data[data.length - 1];
            data = this.numDifferentiation(data);
          }
          else if (flag == "initialVariable") {
            data = dataBid.map(variable => variable.variableCost);
            data = data[data.length - 1];
            if (savingFlag == 'savingINR' || savingFlag == 'savingP') {



              if (type.toLowerCase() == 'forward') {
                if (savingFlag == 'savingINR') {
                  data = (dataBid[0].variableCost ? +dataBid[0].variableCost : 0) - (data ? +data : 0);
                  //data=(data!=0)?((data - data)):0;
                }
                else if (savingFlag == 'savingP') {
                  data = data ? ((dataBid[0].variableCost ? +dataBid[0].variableCost : 0) - (data ? +data : 0)) / (data ? +data : 0) * 100 : 0;



                }
              }
              else {
                if (savingFlag == 'savingINR') {
                  data = (data ? +data : 0) - (dataBid[0].variableCost ? +dataBid[0].variableCost : 0);
                  //data=(data!=0)?((data-data)):0;
                }
                else if (savingFlag == 'savingP') {
                  data = data ? ((data ? +data : 0) - (dataBid[0].variableCost ? +dataBid[0].variableCost : 0)) / (data ? +data : 0) * 100 : 0;
                  //data=(data!=0)?((data-data)):0;
                }
              }
              if (savingFlag != 'savingINR') {
                data = data.toFixed(this.decimalplace) + "%";
              }
              else {
                data = this.numDifferentiation(data);
              }
            }
          }

          if (savingFlag == "projectP") {
            if (baseline != null) {
              if (type.toLowerCase() == 'forward') {

                data = (baseline != 0) ? (Math.round(((data - baseline) / baseline) * 100)) : 0;
              }
              else {

                data = (baseline != 0) ? (Math.round(((baseline - data) / baseline) * 100)) : 0;
              }

            }

            else {
              data = 0;
            }
            data = data.toFixed(this.decimalplace) + "%";
          }



        }
      }
      return data;
    }
    else {
      value = (value) ? value : 0;
      if (arg2 == 2) {
        return value;
      }
      if (savingFlag == 'savingP' && savingFlag == 'projectP') {
        return value.toFixed(this.decimalplace) + "%";
      }
      else {
        return this.numDifferentiation(value);
      }

    }
  }
}
