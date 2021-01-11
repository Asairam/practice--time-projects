import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';
import { CommonService } from 'src/app/commonService/common.service';
import * as config from 'src/app/appConfig/app.config';
import { SupplierService } from 'src/app/component/component-service/supplier.service';
import { PreliminaryBidsService } from './preliminarybids.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/* NgRx */
import { Store, select} from '@ngrx/store';
import * as fromEditModule from '../../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';
import * as fromAppModule from '../../../../../state/app.reducer';

@Component({
	selector: 'app-preliminarybids-copy-20200830',
	templateUrl: './preliminarybids-copy-20200830.component.html',
	styleUrls: ['./preliminarybids-copy-20200830.component.css'],
	providers: [ PreliminaryBidsService ]
})
export class PreliminarybidsCopy20200830Component implements OnInit, OnDestroy {

	multipleCurrencyAuction: boolean = false;
	afMfEnabled: boolean = false;
	componentActive: boolean = true;
	auctionReadOnly: boolean = false;

	@Input() auctionData = {
		decimalPlace: 0,
		minBidChangeValue: null,
		minBidType: null,
		currency: [],
		primaryCurrency: null
    }
	@Input() displaySupplier = null;
	@Input() preBid = [];
	@Input() item = [];
	@Input() treeData = [];
	preliminaryData = [];
	status = false;
	selectCurrency = null;
	addFactor = 0;
	mulFactor = 0;
	selectBidCurrency = null;
	currency = null;
	bidData = { addFactor: 0, mulFactor: 0, currency: null, supplierID: null };
	auctionStatusList = config.AUCTIONSTATUS;
	displayFlag = false;
	errorFlag = false;

	currencyCodePrimary;
	currencyDecimal = 0;
	auctionID;
	total = { baseCost: 0, variableCost: 0, landedCost: 0, totalLandedCost: 0 };

	constructor(
		public buyerService: BuyerEditService, 
		public common: CommonService, 
		private supplierService: SupplierService,
		private store: Store<fromEditModule.EditModuleState>,
		private appstore: Store<fromAppModule.AppModuleState>,
		public preBidService: PreliminaryBidsService,
        @Inject(MAT_DIALOG_DATA) { ...data }, 
        public MatDialogRef: MatDialogRef<PreliminarybidsCopy20200830Component>,
		) {
			// debugger
			this.auctionData = data.dialogContent.auctionData;
			this.preBid = data.dialogContent.preBid;
			this.displaySupplier = data.dialogContent.supplier;
	}

	ngOnInit() {
		this.appstore.pipe(select(fromAppModule.getAuctionConfigOnly),takeWhile(() => this.componentActive) ).subscribe(auctionConfig => {
			if(auctionConfig && auctionConfig.features) {
				this.afMfEnabled = auctionConfig.features.currency;
			}
		});
		this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) ).subscribe(auctionReadOnly => {
			this.auctionReadOnly = auctionReadOnly;
		});
		this.store.pipe(select(fromEditModule.getAuctionDetails),takeWhile(() => this.componentActive) ).subscribe((auctionDetails: any) => {
			// this.multipleCurrencyAuction = auctionDetails.bidCurrencyCount > 1 ? true: false;
			if(auctionDetails.bidCurrencyCount > 1) {
				this.multipleCurrencyAuction = true;
			} else {
				this.multipleCurrencyAuction = false;
			}
			this.currencyCodePrimary = auctionDetails.primaryCurrency ? auctionDetails.primaryCurrency.currencyCode : ''; 
			this.currencyDecimal = auctionDetails.currencyDecimal;
			this.auctionID = auctionDetails.auctionId;
		});

		this.preliminaryData = [];    
		// this.auctionData.decimalPlace=this.auctionData.decimalPlace?this.auctionData.decimalPlace:this.auctionData["currencyDecimalPlace"];
		if(this.buyerService.auctionData.auctionStatus == this.auctionStatusList.DR || this.buyerService.auctionData.auctionStatus == this.auctionStatusList.PB) {
			this.displayFlag = true;
		} else {
			this.displayFlag = false;
		}
		// this.displayFlag = (this.buyerService.auctionData.auctionStatus == this.auctionStatusList.DR || this.buyerService.auctionData.auctionStatus == this.auctionStatusList.PB) ? true : false;
		this.selectBidCurrency = this.auctionData.currency.filter(x => x.currencyCode == ((this.preBid.length > 0) ? this.preBid[0].currency.currencyCode : this.displaySupplier.supplierCurrency.currencyCode))[0];
		this.selectCurrency = this.selectBidCurrency; // (old) = (new)
		this.addFactor = (this.preBid.length > 0 && this.afMfEnabled) ? this.preBid[0].supplierAF : (this.displaySupplier.supplierAF && this.afMfEnabled) ? this.displaySupplier.supplierAF : 0;
		this.mulFactor = (this.preBid.length > 0 && this.afMfEnabled) ? this.preBid[0].supplierMF : (this.displaySupplier.supplierMF && this.afMfEnabled) ? this.displaySupplier.supplierMF : 0;
		this.bidData = { addFactor: this.addFactor, mulFactor: this.mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID }
		this.getSupplierBiddingData();
		this.getTotalValue();
	}

	

	onTextChange(data) {
		try {
		if (data["amount"])
		if(data.amount.length > 0) {
			data.flag = false;
		} else {
			data.flag = true;
		}
			// data.flag = (data.amount.length > 0) ? false : true;
		else
			data.flag = true;
		}
		catch (ex) {
		this.common.error(ex);
		}
	}



	acceptPercent(event: KeyboardEvent) {
		this.errorFlag = config.percentageRange(event);
		if (!this.errorFlag) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	// getSupplierBiddingData() {
	// 	if (this.buyerService.auctionData.auctionStatus.toLowerCase() == config.AUCTIONSTATUS.DR.toLowerCase() || this.buyerService.auctionData.auctionStatus.toLowerCase() == config.AUCTIONSTATUS.PB.toLowerCase()) {
	// 		this.status = true;
	// 	}
	// 	this.preliminaryData = this.preBidService.getLotListWithItems(this.preliminaryData);
	// 	this.preBidService.calculateBidAndCost(this.preliminaryData, this.preBid);
	// 	this.preBidService.calculateLandedRateCost(this.preliminaryData, this.currencyDecimal, this.selectCurrency, this.addFactor, this.mulFactor);
	// }

	getSupplierBiddingData() {
		if (this.buyerService.auctionData.auctionStatus.toLowerCase() == config.AUCTIONSTATUS.DR.toLowerCase() || this.buyerService.auctionData.auctionStatus.toLowerCase() == config.AUCTIONSTATUS.PB.toLowerCase()) {
		  this.status = true;
		}
		this.buyerService.lotList.forEach((lot, index) => {
		  this.preliminaryData.push({ lotID: lot.lotID, lotName: lot.lotName });
		  this.preliminaryData[index].items = JSON.parse(JSON.stringify(this.buyerService.itemDetails.filter(x => x.lotID == lot.lotID)));
		})
		this.preliminaryData = this.preliminaryData.filter((obj) => {
		  return obj.items.length > 0;
		});
		this.preliminaryData.forEach(lot => {
		  lot.items.forEach(element => {
			let preliminaryCost = (this.preBid != null) ? this.preBid.filter(x => x.lineItemID == element.itemID) : [];
			element.bestBid = (preliminaryCost.length > 0) ? preliminaryCost[0].baseCost : null;
			element.totalBestBid = (preliminaryCost.length > 0) ? preliminaryCost[0].variableCost : null;
			element.baseCost = (preliminaryCost.length > 0) ? preliminaryCost[0].baseCost : null;
			element.variableCost = (preliminaryCost.length > 0) ? preliminaryCost[0].variableCost : null;
	
		  })
		})
		this.preliminaryData.forEach(lot => {
		  lot.items.forEach(element => {
			element.submit = false;
			let landedData = null;
			landedData = config.calculateTotalLandedCost(this.addFactor, this.mulFactor, [...this.preliminaryData], element, this.selectCurrency.exchangeRate, false, (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
			if (landedData["landedUnit"]) {
			  element.landedUnitRate = landedData.landedUnit;
			  element.totalLandedCost = landedData.totalLanded;
			  element.itemWeight = config.calculateItemWeightByBuyer({ bestBid: element.bestBid, minimumDesiredQuantity: element.minimumDesiredQuantity }, this.preliminaryData);
			  element.itemWeight = (element.itemWeight * 100).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
			}
			element.amount = "";
			element.flag = true;
	
		  })
		})
	
		// this.decimalValue = "0.0-" + (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"];
	  }

	changeCurrency() {  
		let addFactor = (this.addFactor && this.afMfEnabled) ? this.addFactor : 0;
		let mulFactor = (this.mulFactor && this.afMfEnabled) ? this.mulFactor : 0;
		let bidExist = false;
		let filterParam = 'bestBid';

		// Step 1 Apply Xchange rate to Base Cost if bid amount exist for any line item.
		bidExist = this.preBidService.applyXchRateToBaseCost(this.preliminaryData, this.auctionData, this.selectCurrency, this.currencyDecimal, filterParam, this.selectBidCurrency);
		// Step 2 Create Payload with calculated Landed rates.
		let saveItemData = this.preBidService.getPayloadWithCalculatedLandedRates(this.auctionID, this.preliminaryData, this.selectBidCurrency, this.currencyDecimal, this.displaySupplier.supplierID, addFactor, mulFactor, filterParam);
		// Step 3 Save Multiple Bids
		if(saveItemData.length > 0) {
			this.preBidService.saveMultipleBids(saveItemData, this.preliminaryData, this.currencyDecimal).then(res => {	
				// (old currency) = (new Currency)				
				this.selectCurrency = this.selectBidCurrency;		
                this.getTotalValue();
                this.common.success("Bid All Saved Successfully");
				this.bidData = { addFactor: addFactor, mulFactor: mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID };
				this.buyerService.bidCalculator.next(this.bidData);
			}).catch(err => {				
				this.common.error(err);
			})
		} else {			
			// (old currency) = (new Currency)				
			this.selectCurrency = this.selectBidCurrency;
			this.bidData = { addFactor: addFactor, mulFactor: mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID };
			this.buyerService.bidCalculator.next(this.bidData);
		}
	}

	saveIndividualBid(item) {
		let filterParam = 'amount';
		this.preBidService.saveBid(this.auctionID, item, this.bidData, this.preliminaryData, this.selectBidCurrency, this.currencyDecimal, this.displaySupplier.supplierID, this.addFactor, this.mulFactor, filterParam).then(res => {
			this.getTotalValue();
			this.common.success("Preliminary Bid For " + item.itemName + " Saved Successfully");
		}).catch(err => {			
			this.common.error(err)
		});
	}

	saveMultipleBids() { 
		let addFactor = (this.addFactor) ? this.addFactor : 0;
		let mulFactor = (this.mulFactor) ? this.mulFactor : 0;
		let bidExist = false;
		let filterParam = 'amount';

		// Step 1 Apply Xchange rate to Base Cost if bid amount exist for any line item.
		bidExist = this.preBidService.applyXchRateToBaseCost(this.preliminaryData, this.auctionData, this.selectCurrency, this.currencyDecimal, filterParam, this.selectBidCurrency);
		
		if (!bidExist) return this.common.error("No input value in any item");

		// Step 2 Create Payload with calculated Landed rates.
		let saveItemData = this.preBidService.getPayloadWithCalculatedLandedRates(this.auctionID, this.preliminaryData, this.selectCurrency, this.currencyDecimal, this.displaySupplier.supplierID, addFactor, mulFactor, filterParam);

		// Step 3 Save Multiple Bids
		if(saveItemData.length > 0) {
			this.preBidService.saveMultipleBids(saveItemData, this.preliminaryData, this.currencyDecimal).then(res => {				
                this.getTotalValue();
				this.common.success("Bid All Saved Successfully");
				this.bidData = { addFactor: addFactor, mulFactor: mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID };
				this.buyerService.bidCalculator.next(this.bidData);
			}).catch(err => {				
				this.common.error(err);
			})
		} else {
			// if (!accept) {
			//   this.selectCurrency = this.selectBidCurrency;
			// }
			this.bidData = { addFactor: addFactor, mulFactor: mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID };
			// if (!accept) {
			  this.buyerService.bidCalculator.next(this.bidData);
			// }
		}
	}

	saveCalculate() {
		this.changeCurrency()
	}


	deleteIndividualBid(item) {
		this.preBidService.deleteBid(this.auctionID, item, this.preliminaryData, this.selectBidCurrency, this.currencyDecimal, this.displaySupplier.supplierID, this.addFactor, this.mulFactor).then(res => {
			this.getTotalValue();
			this.common.success("Preliminary Bid For " + item.itemName + " Deleted Successfully");
		}).catch(err => {			
			this.common.error(err);
		});		
	}

	deleteAllBids(){
		this.preBidService.deleteAllBids(this.auctionID, this.preliminaryData, this.displaySupplier.supplierID).then(res => {
			this.getTotalValue();
			this.common.success("Preliminary Bids Deleted Successfully");
		}).catch(err => {			
			this.common.error(err);
		})
	}

	getTotalValue() {
		this.preBidService.getTotalValue(this.total, this.preliminaryData);
	}

	onNegativeBtn() {
		this.MatDialogRef.close(false);
	}

	ngOnDestroy() {
		this.componentActive = false;
	}

}
