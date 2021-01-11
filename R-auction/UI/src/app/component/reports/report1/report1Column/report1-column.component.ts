import { Component, Input} from '@angular/core';
@Component({
	selector: 'report1-column',
	templateUrl: './report1-column.component.html',
	styleUrls: ['./report1-column.component.css'],
})
export class Report1ColumnComponent  {

	@Input() supplier;
	@Input() itemData;
	@Input() colName;
	@Input() decimalplace;
	@Input() auctionDetails;

	constructor(
	) { }

	getPricePerUnitPrimary() {
		let bid = this.itemData.bids.filter(obj => obj.data.bidderID == this.supplier.supplierID);
		if(bid.length == 0) return 0;
		return bid[0].data.baseCostPrimary;		
	}
	getPricePerUnit() {
		let bid = this.itemData.bids.filter(obj => obj.data.bidderID == this.supplier.supplierID);
		if(bid.length == 0) return 0;
		return bid[0].data.baseCost;		
	}

	getTotalBaseCostPrimary() {
		let bid = this.itemData.bids.filter(obj => obj.data.bidderID == this.supplier.supplierID);
		if(bid.length == 0) return 0;
		return bid[0].data.totalBaseCostPrimary;		
	}
	getTotalBaseCost() {
		let bid = this.itemData.bids.filter(obj => obj.data.bidderID == this.supplier.supplierID);
		if(bid.length == 0) return 0;
		return bid[0].data.variableCost;		
	}

	getPricePerUnitPrimaryAdvance() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		return bid[0].baseCostPrimary;		
	}

	getPricePerUnitAdvance(){
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		return bid[0].baseCost;		
	}
	getTotalBaseCostPrimaryAdvance() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		return bid[0].totalBaseCostPrimary;		
	}
	getTotalBaseCostAdvance() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		return bid[0].variableCost;		
	}

	getBestBidRevenue() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		return bid[0].baseCost;
	}

	getBestBidRevenuePrimary() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		return bid[0].baseCostPrimary;
	}

	getInitialBidRevenue() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		let firstBid = bid[bid.length - 1];
		return firstBid.baseCost;
	}

	getInitialBidRevenuePrimary() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		let firstBid = bid[bid.length - 1];
		return firstBid.baseCostPrimary;
	}

	getTotalBestBidRevenue() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		return bid[0].variableCost;
	}

	getTotalBestBidRevenuePrimary(){
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		return bid[0].totalBaseCostPrimary;
	}

	getTotalInitialBidRevenue() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		let firstBid = bid[bid.length - 1];
		return firstBid.variableCost;
	}

	getTotalInitialBidRevenuePrimary() {
		let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
		if(bid.length == 0) return 0;
		this.supplier.supplierCurrency = bid[0].currency;
		let firstBid = bid[bid.length - 1];
		return firstBid.totalBaseCostPrimary;
	}

	getSavingsAmountRevenue() {
		if(this.auctionDetails.auctionType.toLowerCase() == 'reverse') {			
			let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
			if(bid.length == 0) return 0;
			this.supplier.supplierCurrency = bid[0].currency;
			let firstBid = bid[bid.length - 1];
			let lastBid = bid[0];
			return firstBid.variableCost - lastBid.variableCost;
		} else {
			let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
			if(bid.length == 0) return 0;
			this.supplier.supplierCurrency = bid[0].currency;
			let firstBid = bid[bid.length - 1];
			let lastBid = bid[0];
			return lastBid.variableCost - firstBid.variableCost;
		}
	}

	getSavingsAmountPrimary() {
		if(this.auctionDetails.auctionType.toLowerCase() == 'reverse') {			
			let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
			if(bid.length == 0) return 0;
			this.supplier.supplierCurrency = bid[0].currency;
			let firstBid = bid[bid.length - 1];
			let lastBid = bid[0];
			return firstBid.totalBaseCostPrimary - lastBid.totalBaseCostPrimary;
		} else {
			let bid = this.supplier.data.bidData ? this.supplier.data.bidData : [];
			if(bid.length == 0) return 0;
			this.supplier.supplierCurrency = bid[0].currency;
			let firstBid = bid[bid.length - 1];
			let lastBid = bid[0];
			return lastBid.totalBaseCostPrimary - firstBid.totalBaseCostPrimary;
		}
	}

}
