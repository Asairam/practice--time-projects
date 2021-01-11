import { Injectable } from '@angular/core';

@Injectable()
export class BidhistoryService {

    constructor(){}

    getFormatedOutput(bidList, primaryCurrency, supplierListForCurrency) {
        let suppCurrency = new Map();
        supplierListForCurrency.forEach(supplier => {
            suppCurrency.set(supplier.supplierID, supplier.supplierCurrency);
        });
        let unfilteredList = [];
        bidList.forEach(obj => {
            obj.history.forEach(bid => {
                let objJson = {
                    itemID: obj.itemID,
                    itemName: obj.itemName,
                    lotID: obj.lotID,
                    lotName: obj.lotName,
                    minimumDesiredQuantity: obj.minimumDesiredQuantity,
                    baseCost: bid.baseCost,
                    bidderID: bid.bidderID,
                    createdAt: bid.createdAt,
                    isDeleted: bid.isDeleted,
                    isLeading: bid.isLeading,
                    rank: bid.rank,
                    variableCost: bid.variableCost,
                    id: bid._id,
                    landedCost: bid.landedCost,
                    totalLandedCost: bid.totalLandedCost,
                    primaryCurrency: primaryCurrency.currencyCode,
                    supplierCurrency: suppCurrency.get(bid.bidderID).currencyCode,
                    uniqueBidID: bid.uniqueBidID,
                    suspendedBidder: bid.suspendedBidder,
                    baseCostPrimary: bid.baseCostPrimary,
                    totalBaseCostPrimary: bid.totalBaseCostPrimary,
                    roundID: bid.roundID
                } 
                unfilteredList.push(objJson);    
            });
        });
        // Sort 
        unfilteredList.sort((a, b) => {
            var dateA = new Date(a.createdAt).getTime();
            var dateB = new Date(b.createdAt).getTime();
            return dateA < dateB ? 1 : -1;
        });
        // Filter out deleted bids.
        // let filteredList =  unfilteredList.filter((obj) => {
        //     return !obj.isDeleted;
        // });

        return { unfilteredList: unfilteredList, filteredList: unfilteredList};        
    }
}