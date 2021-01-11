import { Injectable } from "@angular/core";
import * as config from 'src/app/appConfig/app.config';
import { BuyerEditService } from '../../../component-service/buyer-edit.service';

@Injectable()
export class SuppAuctionAcceptService {

    constructor(
		public buyerService: BuyerEditService, 
    ) { }

    getNewJson(auctionID, item, currencyObj, landedData, supplierID, addFactor, mulFactor, filterParam) {
        return {
            "auctionID": auctionID,
            "organizationID": 0,
            "lineItemID": item.itemID,
            "bidType": "string",
            "name": item.itemName,
            "fixedCost": 0,
            "minCapacity": 0,
            "maxCapacity": 0,
            "currencyCode": currencyObj.currencyCode,
            "description": 0,
            "baseCost": item[filterParam],
            "variableCost": 0,
            "vendorID": supplierID,
            "currency": {
              "currencyName": currencyObj.currencyName,
              "currencyCode": currencyObj.currencyCode
            },
            "supplierAF": addFactor ? addFactor : 0,
            "supplierMF": mulFactor ? mulFactor : 0,
            "landedCost": landedData.landedUnit,
            "totalLandedCost": landedData.totalLanded
        }
    }

    getCalculatedPayload(auctionID, preliminaryData, selectCurrency, supplierID, addFactor, mulFactor, currencyDecimal) {
        let filterParam = 'bestBid';
        let saveItemData = [];
        preliminaryData.forEach(lot => {
            let preDataList = lot.items.filter(x =>  x[filterParam] > 0);
            if (preDataList.length > 0) {
                preDataList.forEach(item => {
                let landedData = {
                    landedUnit: (item.landedUnitRate * selectCurrency.exchangeRate).toFixed(currencyDecimal),
                    totalLanded: (item.totalLandedCost * selectCurrency.exchangeRate).toFixed(currencyDecimal)
                };
                let newJson = this.getNewJson(auctionID, item, selectCurrency, landedData, supplierID, addFactor, mulFactor, filterParam)
                saveItemData.push(newJson);
    
              });
            }    
        });
        return saveItemData;
    }

    savePayload(saveItemData) {
        return new Promise((resolve, reject) => {
            this.buyerService.insertPreBidItem(saveItemData).subscribe((res: any) => {
                // this.preliminaryData.forEach(lot => {
                //   lot.items.forEach(item => {
                //     let preItem = res.data.filter(x => x.lineItemID == item.itemID);
                //     if (preItem.length > 0) {
                //       item.amount = "";
                //       item.bestBid = preItem[0].baseCost;
                //       item.totalBestBid = preItem[0].baseCost * item.minimumDesiredQuantity;
                //     }
                //     this.bidData = { addFactor: this.addFactor, mulFactor: this.mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID };
                //   });
                // });
                // this.preliminaryData.forEach(lot => {
                //   lot.items.forEach(element => {
                //     element.itemWeight = config.calculateItemWeightByBuyer({ bestBid: element.bestBid, minimumDesiredQuantity: element.minimumDesiredQuantity }, this.preliminaryData);
                //     element.itemWeight = (element.itemWeight * 100).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
                    
                //       this.supplierService.acceptStatus.next(true);
                //   })
                // });
                resolve()
                
              }, (err: any) => {
                  reject(err);
              })
        })
        
    }

}