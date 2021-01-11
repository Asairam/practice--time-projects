import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { BuyerEditService } from '../../../component-service/buyer-edit.service';
import { CommonService } from 'src/app/commonService/common.service';
import * as config from 'src/app/appConfig/app.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SuppAuctionAcceptService } from './supp-auction-accept-popup.service';
import { SupplierService } from '../../../component-service/supplier.service';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromSupplierBiddingModule from '../../supplier-bidding/state/supplier-bidding.reducer';
import * as supplierBiddingModuleActions from '../../supplier-bidding/state/supplier-bidding.actions';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'supp-auction-accept-popup',
  templateUrl: './supp-auction-accept-popup.component.html',
  styleUrls: ['./supp-auction-accept-popup.component.css'],
  providers: [ SuppAuctionAcceptService ]
})
export class SuppAuctionAcceptPopupComponent implements OnInit, OnDestroy {

    multipleCurrencyAuction: boolean = false;
    additionMultiplicationFactor = false;
    componentActive: boolean = true;
    auctionReadOnly: boolean = false;

    @Input() auctionData = {
        decimalPlace: 0,
        minBidChangeValue: null,
        minBidType: null,
        currency: [],
        primaryCurrency: null
    }
    @Input() supplierUser = false;
    @Input() auctionID = null;
    @Input() displaySupplier = null;
    @Input() preBid = [];
    @Input() item = [];
    @Input() treeData = [];
    preliminaryData = [];
    decimalValue = "";
    selectCurrency = null;
    addFactor = 0;
    mulFactor = 0;
    selectBidCurrency = null;
    currency = null;
    bidData = { addFactor: 0, mulFactor: 0, currency: null, supplierID: null };
    auctionStatusList = config.AUCTIONSTATUS;
    errorFlag = false;
    total = { baseCost: 0, variableCost: 0, landedCost: 0, totalLandedCost: 0 };

    currencyCodePrimary = '';
    currencyDecimal = 0;
    currencyCodeBidder = '';
    exchangeRate;
    comment: any;    
    inviteStatus = "";
    secondAcceptConfirmation = false;  
    secondDeclineConfirmation = false;     
    allRemarks = [];

    constructor(
        public buyerService: BuyerEditService, 
        public common: CommonService, 
        private store: Store<fromSupplierBiddingModule.SupplierBiddingModuleState>,
        @Inject(MAT_DIALOG_DATA) { ...data },        
        public MatDialogRef: MatDialogRef<SuppAuctionAcceptPopupComponent>, 
        public suppAccService: SuppAuctionAcceptService,
        private supplierservice: SupplierService,
        ) {
            this.auctionID = data.auctionID;
            this.auctionData = data.dialogData.auctionData;
            this.selectBidCurrency = this.auctionData.currency.filter(x => x.currencyCode == data.supplier.supplierCurrency.currencyCode)[0];
            this.selectCurrency = this.selectBidCurrency;
            this.displaySupplier = {
                supplierAF: (data.supplier.supplierAF) ? data.supplier.supplierAF : 0,
                supplierMF: (data.supplier.supplierMF) ? data.supplier.supplierMF : 0,
                supplierID: data.supplier.supplierID,
                supplierCurrency: (data.supplier.supplierCurrency) ? data.supplier.supplierCurrency : null,
                supplierUser: true
            }
            this.preBid = (data.prelimianryData) ? data.prelimianryData : [];
            this.treeData = [...data.lot_item_data];
            this.allRemarks = data.allRemarks;
    }

    ngOnInit() {
        this.preliminaryData = [];
        this.store.pipe(select(fromSupplierBiddingModule.getAuctionDetails),  takeWhile(() => this.componentActive)).subscribe((auctionDetails: any) => {
            if(auctionDetails) {
                this.preliminaryData = [...this.treeData];
                // debugger;
                this.additionMultiplicationFactor = auctionDetails.additionMultiplicationFactor;
                this.currencyCodeBidder = auctionDetails.biddingCurrency.currencyCode;
                this.exchangeRate = auctionDetails.biddingCurrency.exchangeRate;
                this.currencyCodePrimary = auctionDetails.primaryCurrency.currencyCode;            
                this.currencyDecimal = auctionDetails.currencyDecimal;
                this.selectBidCurrency = this.auctionData.currency.filter(x => x.currencyCode == this.currencyCodeBidder)[0];
                this.selectCurrency = this.selectBidCurrency;
                this.getSupplierPreData();
                this.getTotalValue();
            }            
        });
            
        this.addFactor = (this.displaySupplier.supplierAF) ? this.displaySupplier.supplierAF : 0;
        this.mulFactor = (this.displaySupplier.supplierMF) ? this.displaySupplier.supplierMF : 0;
        
    }

    changeCurrency() {  
        this.selectCurrency = this.auctionData.currency.filter(x => x.currencyCode ==  this.selectBidCurrency.currencyCode)[0];    
        this.store.dispatch(new supplierBiddingModuleActions.SetBiddingCurrencyAndExchangeRate({
            currencyCode: this.selectCurrency.currencyCode,
            currencyName: this.selectCurrency.currencyName,
            exchangeRate: this.selectCurrency.exchangeRate
        }));
    }

    getSupplierPreData() {
        this.preliminaryData.forEach(lot => {
            lot.items.forEach(element => {
                let bids = this.preBid.filter(x => x.lineItemID == element.itemID);
                if (bids.length > 0) {
                    element.itemsBestBidPrimary = bids[0].baseCostPrimary.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
                    element.landedUnitRate = (bids[0].landedCost / this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
                    element.totalLandedCost = (bids[0].totalLandedCost / this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
                }
                else {
                    element.itemsBestBidPrimary = 0;
                }
                element.bestBid = (element.itemsBestBidPrimary / this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
                element.totalBestBid = ((element.itemsBestBidPrimary * element.minimumDesiredQuantity) / this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);

            });
        });
        this.preliminaryData.forEach(lot => {
            lot.items.forEach(item => {
                item.itemWeight = config.calculateItemWeightByBuyer({ bestBid: item.bestBid, minimumDesiredQuantity: item.minimumDesiredQuantity }, this.preliminaryData);
                item.itemWeight = (item.itemWeight * 100).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
            })
        })
        this.decimalValue = "0.0-" + (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"];
    }

    getTotalValue() {
        this.total = { baseCost: 0, variableCost: 0, landedCost: 0, totalLandedCost: 0 };
        this.preliminaryData.forEach(lot => {
            lot.items.forEach(item => {
                this.total.baseCost +=item["bestBid"] ?Number(item.bestBid):0;
                this.total.variableCost += item["totalBestBid"] ?Number(item.totalBestBid):0;
                this.total.landedCost += item["landedUnitRate"]?Number(item.landedUnitRate):0;
                this.total.totalLandedCost +=item["totalLandedCost"]? Number(item.totalLandedCost):0;
            });
        });
    }

    

    onAcceptBtn() {
        if (!this.comment) {
            this.common.warning('Please Enter Your Comment.');
        } else {
            this.inviteStatus = config.AUCTIONSTATUS.AC;
            this.secondAcceptConfirmation = true;
            var elements = document.getElementsByClassName("dialog-vlg")[0] as HTMLElement;
            if (elements) {
                elements.style.width = '252px';
            }
        }
    }

    onDeclineBtn() {
        if (!this.comment) {
            this.common.warning('Please Enter Your Comment.');
        } else {
            this.inviteStatus = config.AUCTIONSTATUS.RJ;
            this.secondDeclineConfirmation = true;
            var elements = document.getElementsByClassName("dialog-vlg")[0] as HTMLElement;
            if (elements) {
                elements.style.width = '252px';
            }
        }
    }

    accepted() {
        if (this.displaySupplier.supplierCurrency.currencyCode != this.selectBidCurrency.currencyCode) {
            let saveItemData = this.suppAccService.getCalculatedPayload(this.auctionID, this.preliminaryData, this.selectCurrency, this.displaySupplier.supplierID, this.addFactor, this.mulFactor, this.currencyDecimal);

            if(saveItemData.length > 0) {
                this.suppAccService.savePayload(saveItemData).then(res => {  
                }).catch(err => {
                    this.common.error(err);
                })
            }
        }
        this.callAcceptAPI();
    }

    onNegativeBtn() {
        this.MatDialogRef.close(false);
    }
    

    declined() {
        this.callAcceptAPI();
    }

    callAcceptAPI() {
        let objData = {
          auctionID: this.auctionID, 
          status: (this.inviteStatus == config.AUCTIONSTATUS.AC) ? this.auctionStatusList.AC : this.auctionStatusList.RJ, 
          acceptanceMessage: this.comment, 
          email: JSON.parse(localStorage.getItem('userdata')).email.toLowerCase(),
          supplierCurrency: {
            currencyCode: this.selectBidCurrency.currencyCode,
            currencyName: this.selectBidCurrency.currencyName
          }
        };
        this.supplierservice.updateAccept(objData).subscribe((res: any) => {
          this.MatDialogRef.close(objData)
    
        }, err => {
          this.common.error(err.message);
        });
    }

    ngOnDestroy() {
		this.componentActive = false;
	}

}
