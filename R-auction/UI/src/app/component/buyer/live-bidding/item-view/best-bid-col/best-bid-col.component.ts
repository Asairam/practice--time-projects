import { Component, Input} from '@angular/core';

@Component({
	selector: 'best-bid-col',
	templateUrl: './best-bid-col.component.html',
	styleUrls: ['./best-bid-col.component.css'],
})
export class BestBidComponent { 

    @Input() itemData;
    @Input() auctionData;
    @Input() exchangeRate;
    @Input() columnName;
    @Input() decimalPlace;

    constructor() {
    }

    showBestUnitRate() {
        return this.itemData.itemsBestBidUnitCost;
        // if(this.auctionData.primaryCurrencyNew.currencyCode == this.itemData.currencyCode) {
        //     return this.itemData.itemsBestBidUnitCost;
        // } else {
        //     // return this.itemData.itemsBestBidUnitCost * this.exchangeRate[this.itemData.currencyCode];
        //     return this.itemData.itemsBestBidUnitCost;
        // }
    }

    showBestTotalvalue() {
        return this.itemData.itemsBestBid;
        // if(this.auctionData.primaryCurrencyNew.currencyCode == this.itemData.currencyCode) {
        //     return this.itemData.itemsBestBid;
        // } else {
        //     // return this.itemData.itemsBestBid * this.exchangeRate[this.itemData.currencyCode];
        //     return this.itemData.itemsBestBid;
        // } 
    }

    showBestUnitRateBidHistory() {
        return this.itemData.baseCost;
        // if(this.auctionData.primaryCurrencyNew.currencyCode == this.itemData.supplierCurrency) {
        //     return this.itemData.baseCost;
        // } else {
        //     // return this.itemData.baseCost * this.exchangeRate[this.itemData.supplierCurrency];
        //     return this.itemData.baseCost;
        // }
    }

    showBestTotalvalueBidHistory() {
        return this.itemData.variableCost;
        // if(this.auctionData.primaryCurrencyNew.currencyCode == this.itemData.supplierCurrency) {
        //     return this.itemData.variableCost;
        // } else {
        //     // return this.itemData.variableCost * this.exchangeRate[this.itemData.supplierCurrency];
        //     return this.itemData.variableCost;
        // } 
    }


}