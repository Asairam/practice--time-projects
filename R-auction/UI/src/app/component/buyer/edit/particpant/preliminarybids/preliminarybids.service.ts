import { Injectable } from "@angular/core";
import * as config from 'src/app/appConfig/app.config';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';

@Injectable()
export class PreliminaryBidsService {

    constructor(
		public buyerService: BuyerEditService, 
    ) { }

    getLotListWithItems(preliminaryData) {
        this.buyerService.lotList.forEach((lot, index) => {
			preliminaryData.push({ lotID: lot.lotID, lotName: lot.lotName });
			preliminaryData[index].items = this.buyerService.itemDetails.filter(x => x.lotID == lot.lotID);
        })
        preliminaryData = preliminaryData.filter((obj) => {
            return obj.items.length > 0;
        });
        return preliminaryData;
    }
    
    calculateBidAndCost(preliminaryData, preBid) {
        preliminaryData.forEach(lot => {
			lot.items.forEach(element => {
				let preliminaryCost = (preBid != null) ? preBid.filter(x => x.lineItemID == element.itemID) : [];
				element.bestBid = (preliminaryCost.length > 0) ? preliminaryCost[0].baseCost : null;
				element.totalBestBid = (preliminaryCost.length > 0) ? preliminaryCost[0].variableCost : null;
				element.baseCost = (preliminaryCost.length > 0) ? preliminaryCost[0].baseCost : null;
				element.variableCost = (preliminaryCost.length > 0) ? preliminaryCost[0].variableCost : null;

			});
		});
    }

    calculateLandedRateCost(preliminaryData, currencyDecimal, selectCurrency, addFactor, mulFactor) {
        addFactor = addFactor ? addFactor : 0;
        mulFactor = mulFactor ? mulFactor : 0;
        preliminaryData.forEach(lot => {
			lot.items.forEach(element => {
				element.submit = false;
				let landedData = null;
				landedData = config.calculateTotalLandedCost(addFactor, mulFactor, [...preliminaryData], element, selectCurrency.exchangeRate, false, currencyDecimal);
				if (landedData["landedUnit"]) {
					element.landedUnitRate = landedData.landedUnit;
					element.totalLandedCost = landedData.totalLanded;
					this.calculateItemWeightage(element, currencyDecimal , preliminaryData)
				}
				element.amount = "";
				element.flag = true;
			})
		})
    }

    getTotalValue(total, preliminaryData) {
        total.baseCost = 0;
        total.variableCost = 0;
        total.landedCost = 0;
        total.totalLandedCost = 0;
        preliminaryData.forEach(lot => {
            lot.items.forEach(item => {
              total.baseCost +=item["bestBid"] ?Number(item.bestBid):0;
              total.variableCost += item["totalBestBid"] ?Number(item.totalBestBid):0;
              total.landedCost += item["landedUnitRate"]?Number(item.landedUnitRate):0;
              total.totalLandedCost +=item["totalLandedCost"]? Number(item.totalLandedCost):0;
            });
        });
    }

    calculateItemWeightage(item, decimalPlace, preliminaryData) {
        item.itemWeight = config.calculateItemWeightByBuyer({ bestBid: item.bestBid, minimumDesiredQuantity: item.minimumDesiredQuantity }, preliminaryData);
        item.itemWeight = (item.itemWeight * 100).toFixed(decimalPlace);
    }

    getPreJson(auctionID, item, currencyObj, currencyDecimal, landedData, supplierID, addFactor, mulFactor, filterParam) {
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
            "landedCost": landedData.landedUnit.toFixed(currencyDecimal),
            "totalLandedCost": landedData.totalLanded.toFixed(currencyDecimal)
            }
    }

    saveBid(auctionID, item, bidData, preliminaryData, selectBidCurrency, currencyDecimal, supplierID, addFactor, mulFactor, filterParam) {
        addFactor = addFactor ? addFactor : 0;
        mulFactor = mulFactor ? mulFactor : 0
        return new Promise((resolve, reject) => {
            let objData = {};
            let bestBid = item.bestBid;
            item.bestBid = item.amount;
            item.baseCost = item.amount;
            item.totalBestBid = item.amount * item.minimumDesiredQuantity;
            item.variableCost = item.totalBestBid;
            let landedData = null;
            landedData = config.calculateTotalLandedCost(bidData.addFactor, bidData.mulFactor, preliminaryData, item, selectBidCurrency.exchangeRate, false, currencyDecimal);
            if (landedData["landedUnit"]) {
                objData = [ this.getPreJson(auctionID, item, selectBidCurrency, currencyDecimal, landedData, supplierID, addFactor, mulFactor, filterParam) ];
                this.buyerService.insertPreBidItem(objData).subscribe((res: any) => {
                    item.submit = true;
                    item.flag = true;
                    item.bestBid = item.amount;
                    item.totalBestBid = item.amount * item.minimumDesiredQuantity;
                    item.baseCost = item.bestBid;
                    item.variableCost = item.totalBestBid;
                    item.amount = "";
                    item.landedUnitRate = landedData.landedUnit.toFixed(currencyDecimal);
                    item.totalLandedCost = landedData.totalLanded.toFixed(currencyDecimal);
                    preliminaryData.forEach(lot => {
                        lot.items.forEach(element => {
                        let landedData = null;
                        landedData = config.calculateTotalLandedCost(addFactor, mulFactor, [...preliminaryData], element, selectBidCurrency.exchangeRate, false, currencyDecimal);
                        if (landedData["landedUnit"]) {
                            element.landedUnitRate = landedData.landedUnit.toFixed(currencyDecimal);
                            element.totalLandedCost = landedData.totalLanded.toFixed(currencyDecimal);
                            element.itemWeight = config.calculateItemWeightByBuyer({ bestBid: element.bestBid, minimumDesiredQuantity: element.minimumDesiredQuantity }, preliminaryData);
                            element.itemWeight = (element.itemWeight * 100).toFixed(currencyDecimal);
                        }
                        })
                    })
                    resolve();
                }, (err) => {
                    item.bestBid = bestBid;
                    item.totalBestBid = item.bestBid * item.minimumDesiredQuantity;
                    reject(err)
                })
      
            }
        })
        

    }

    deleteBid(auctionID, item, preliminaryData, selectBidCurrency, currencyDecimal, supplierID, addFactor, mulFactor) {
        addFactor = addFactor ? addFactor : 0;
        mulFactor = mulFactor ? mulFactor : 0;
        return new Promise((resolve, reject) => {
            let preliminaryBid = {
                auctionID: auctionID,
                supplierID: [supplierID],
                itemID: [item.itemID]
            }
            this.buyerService.deletePreliminaryBid(preliminaryBid).subscribe((res: any) => {
                item.bestBid = null;
                item.totalBestBid = null;
                item.landedUnitRate = null;
                item.totalLandedCost = null;
                item.baseCost = null;
                item.variableCost = null;
                preliminaryData.forEach(lot => {
                    lot.items.forEach(element => {
                        let landedData = null;
                        landedData = config.calculateTotalLandedCost(addFactor, mulFactor, [...preliminaryData], element, selectBidCurrency.exchangeRate, false, currencyDecimal);
                        if (landedData["landedUnit"]) {
                            element.landedUnitRate = landedData.landedUnit;
                            element.totalLandedCost = landedData.totalLanded;
                            if (element.itemID != item.itemID) {
                                element.itemWeight = config.calculateItemWeightByBuyer({ bestBid: element.bestBid, minimumDesiredQuantity: element.minimumDesiredQuantity }, preliminaryData);
                                element.itemWeight = (element.itemWeight * 100).toFixed(currencyDecimal);
                            } else {
                                if (element.itemWeight) {
                                    delete element.itemWeight;
                                }
                            }
                        }
                    })
                })
                resolve();
            }, err => {
                reject(err);
            })
        })
            
    }

    deleteAllBids(auctionID, preliminaryData, supplierID) {
        return new Promise((resolve, reject) => {
            let itemIDs=[];
            let bidExist = false;
            preliminaryData.forEach(lot => {
                let bestBidItemList = lot.items.filter(x => x.bestBid);
                if (bestBidItemList.length > 0) {
                    bidExist = true;
                    bestBidItemList.forEach(element => {
                        itemIDs.push(element.itemID);
                    });
                }
            });
            if(!bidExist) {
                reject('No bid in any item');
                return;
            }
            let preliminaryBid = {
                auctionID: auctionID,
                supplierID: [supplierID],
                itemID: itemIDs
            }
            this.buyerService.deletePreliminaryBid(preliminaryBid).subscribe((res: any) => {
                preliminaryData.forEach(lot => {
                    lot.items.forEach(item => {
                        item.bestBid = null;
                        item.totalBestBid = null;
                        item.landedUnitRate = null;
                        item.totalLandedCost = null;
                        item.baseCost = null;
                        item.variableCost = null;
                        delete item["itemWeight"];
                    })
                })
                resolve();
            }, err => {
                reject(err);
            })
        })
    }

    applyXchRateToBaseCost(preliminaryData, auctionData, oldCurrency, currencyDecimal, filterParam, newCurrency) {
        let bidExist = false;
        preliminaryData.forEach(lot => {
			let preDataList = lot.items.filter(x => x[filterParam] || x[filterParam] > 0);
			if (preDataList.length > 0) {
				bidExist = true;
				// Step 1.1 If Bid Exist then check currency selected in dropdown is same as primary currency
				preDataList.forEach(item => {
					let primaryValue = auctionData.currency.filter(x => x.currencyCode == oldCurrency.currencyCode)[0];
					// Step 1.2 Apply exchange rate for baseCost if selected currency not same as Primary currency.
					item.baseCost = (primaryValue.currencyCode == newCurrency.currencyCode) ? item[filterParam] : config.convertCurrency(item[filterParam], primaryValue.exchangeRate, newCurrency.exchangeRate)
					// Step 1.3 Determine decimal place.
					if (primaryValue.currencyCode != oldCurrency.currencyCode) {
						item.baseCost = Number(item.baseCost.toFixed(currencyDecimal));
					}
				})
			}
        });
        return bidExist;
    }

    getPayloadWithCalculatedLandedRates(auctionID, preliminaryData, newCurrency, currencyDecimal, supplierID, addFactor, mulFactor, filterParam) {
        let saveItemData = [];
        preliminaryData.forEach(lot => {
			// NOTE :: (bidAll) ? x.amount > 0 : x.bestBid > 0);
			let preDataList = lot.items.filter(x => x[filterParam] > 0);
			if (preDataList.length > 0) {
				preDataList.forEach(item => {
					let landedData = null;
					landedData = config.calculateTotalLandedCost(addFactor, mulFactor, preliminaryData, item, newCurrency.exchangeRate, false, currencyDecimal);
					if (landedData["landedUnit"]) {
						item.landedUnit = landedData.landedUnit.toFixed(currencyDecimal);
						item.totalLanded = landedData.totalLanded.toFixed(currencyDecimal);
					}
					saveItemData.push(this.getPreJson(auctionID, item, newCurrency, currencyDecimal, landedData, supplierID, addFactor, mulFactor, filterParam));
				});
			}	
        });
        return saveItemData;
    }

    saveMultipleBids(payload, preliminaryData, currencyDecimal) {
        return new Promise((resolve, reject) => {
            this.buyerService.insertPreBidItem(payload).subscribe((res: any) => {
                preliminaryData.forEach(lot => {
                    lot.items.forEach(item => {
                        let preItem = res.data.filter(x => x.lineItemID == item.itemID);
                        if (preItem.length > 0) {
                            item.submit = true;
                            item.flag = true;
                            item.amount = "";
                            item.bestBid = preItem[0].baseCost;
                            item.totalBestBid = preItem[0].baseCost * item.minimumDesiredQuantity;
                            item.baseCost = item.bestBid;
                            item.variableCost = item.totalBestBid;
                            item.landedUnitRate = item.landedUnit;
                            item.totalLandedCost = item.totalLanded;	
                        }
                        // this.bidData = { addFactor: addFactor, mulFactor: mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID };
                    });
                });
                preliminaryData.forEach(lot => {
                    lot.items.forEach(element => {
                    element.itemWeight = config.calculateItemWeightByBuyer({ bestBid: element.bestBid, minimumDesiredQuantity: element.minimumDesiredQuantity }, preliminaryData);
                    element.itemWeight = (element.itemWeight * 100).toFixed(currencyDecimal);
                    //   if (!accept) {
                        // this.buyerService.bidCalculator.next(this.bidData);
                    //   }
                    //   else {
                    // 	this.supplierService.acceptStatus.next(true);
                    //   }
                    })
                });
                resolve();
              
            }, (err: any) => {
                reject(err);
            })
        })
        
    }

}