import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'baselineSavings'
})
export class baselineSavingsPipe implements PipeTransform {
    constructor() { }
    transform({ ...item }: any=null, type: any=null, select: any=null, savtype: any=null, supplierID: any = null) {
        let baseCost = 0;
        item.historicalTotalVal = 0;
        item.preliminaryTotalVal = 0;
        item.initialTotalVal = 0;
        if (supplierID) {
            let itemFilter = null;
            if (item.bids.length > 0) {
                itemFilter = item.bids.find(x => x.data._id == supplierID);
                if (itemFilter) {
                    baseCost = itemFilter["data"]["baseCost"]? itemFilter["data"]["baseCost"]:0;
                    baseCost*=item.minimumDesiredQuantity
                }
                else {
                    baseCost = 0;
                }
            }
            else {
                baseCost = 0;
            }
          }
        else {
            baseCost = item.itemsBestBid;
       
        }
            if (baseCost) {
            item.historicalTotalVal = ((item.historicalCost ? +item.historicalCost : 0) * (item.minimumDesiredQuantity ? +item.minimumDesiredQuantity : 0));
            item.preliminaryTotalVal = ((item.preliminaryVal ? +item.preliminaryVal : 0) * (item.minimumDesiredQuantity ? +item.minimumDesiredQuantity : 0));
            item.initialTotalVal = ((item.initialVal ? +item.initialVal : 0) * (item.minimumDesiredQuantity ? +item.minimumDesiredQuantity : 0));
            if (type.toLowerCase() === 'forward') {
                // Preliminary Bid
                if (select === 0) {
                    if (savtype === 'per') {
                        return item.preliminaryTotalVal ? ((baseCost ? +baseCost : 0) - (item.preliminaryTotalVal ? +item.preliminaryTotalVal : 0)) / (item.preliminaryTotalVal ? +item.preliminaryTotalVal : 0) * 100 : 0;
                    } else {
                        return item.preliminaryTotalVal ? (baseCost ? +baseCost : 0) - (item.preliminaryTotalVal ? +item.preliminaryTotalVal : 0) : 0;
                    }
                }

                // Initial Bid
                if (select === 1) {
                    if (savtype === 'per') {
                        return item.initialTotalVal ? ((baseCost ? +baseCost : 0) - (item.initialTotalVal ? +item.initialTotalVal : 0)) / (item.initialTotalVal ? +item.initialTotalVal : 0) * 100 : 0;
                    } else {
                        return item.initialTotalVal ? (baseCost ? +baseCost : 0) - (item.initialTotalVal ? +item.initialTotalVal : 0) : 0;
                    }
                }

                //Historical Bid
                if (select === 2) {
                    if (savtype === 'per') {
                        return item.historicalTotalVal ? ((baseCost ? +baseCost : 0) - (item.historicalTotalVal ? +item.historicalTotalVal : 0)) / (item.historicalTotalVal ? +item.historicalTotalVal : 0) * 100 : 0;
                    } else {
                        return item.historicalTotalVal ? (baseCost ? +baseCost : 0) - (item.historicalTotalVal ? +item.historicalTotalVal : 0) : 0;
                    }
                }
            } else {
                // Preliminary Bid
                if (select === 0) {
                    if (savtype === 'per') {
                        return item.preliminaryTotalVal ? ((item.preliminaryTotalVal ? +item.preliminaryTotalVal : 0) - (baseCost ? +baseCost : 0)) / (item.preliminaryTotalVal ? +item.preliminaryTotalVal : 0) * 100 : 0;
                    } else {
                        return item.preliminaryTotalVal ? (item.preliminaryTotalVal ? +item.preliminaryTotalVal : 0) - (baseCost ? +baseCost : 0) : 0;
                    }
                }

                // Initial Bid
                if (select === 1) {
                    if (savtype === 'per') {
                        return item.initialTotalVal ? ((item.initialTotalVal ? +item.initialTotalVal : 0) - (baseCost ? +baseCost : 0)) / (item.initialTotalVal ? +item.initialTotalVal : 0) * 100 : 0;
                    } else {
                        return item.initialTotalVal ? (item.initialTotalVal ? +item.initialTotalVal : 0) - (baseCost ? +baseCost : 0) : 0;
                    }
                }

                //Historical Bid
                if (select === 2) {
                    if (savtype === 'per') {
                        return item.historicalTotalVal ? ((item.historicalTotalVal ? +item.historicalTotalVal : 0) - (baseCost ? +baseCost : 0)) / (item.historicalTotalVal ? +item.historicalTotalVal : 0) * 100 : 0;
                    } else {
                        return item.historicalTotalVal ? (item.historicalTotalVal ? +item.historicalTotalVal : 0) - (baseCost ? +baseCost : 0) : 0;
                    }
                }
            }
        }
        else {
            return baseCost;
        }

    }
}