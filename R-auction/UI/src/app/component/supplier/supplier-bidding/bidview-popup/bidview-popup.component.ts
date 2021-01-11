import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as config from '../../../../appConfig/app.config';

@Component({
  selector: 'app-bidview-popup',
  templateUrl: './bidview-popup.component.html',
  styleUrls: ['./bidview-popup.component.css']
})
export class BidviewPopupComponent implements OnInit {
  totalItemCost = 0;
  calculateDisable: boolean = false;
  @Input() dialogData: any;
  @Input() auctionData: any = null;
  @Input() aucSubmit: any;
  @Input() supplierData = null;
  @Input() tab = null;
  @Output() enableConfirm=new EventEmitter<any>();
  landedFlag = false;
  aucAmount = "";
  biddingCurrency=null;

  constructor() { }

  ngOnInit() {
    if(this.dialogData && this.dialogData.length > 0) {
      this.dialogData.forEach(element => {
        this.totalItemCost += element.baseCost * element.minimumDesiredQuantity
      });
    }
    this.biddingCurrency=this.auctionData.currency.find(x=> x.currencyCode==this.supplierData["supplierCurrency"]["currencyCode"]);
    this.landedFlag = (this.auctionData["primaryCurrency"] != this.supplierData["supplierCurrency"]["currencyCode"]) ? true : false;
    if (!this.landedFlag)
      this.landedFlag = (this.supplierData["supplierAF"] || this.supplierData["supplierMF"]) ? true : false;
  }

  textValidationAuc(value) {
    var splitValue = value.split('.');
    if (value == "") {
      return false;
    }
    if (value >= 0 && value <= 100) {
      if (splitValue.length == 2) {
        if (splitValue[1].length > 2) {
          this.aucAmount = value.slice(0, -1);
          return false;
        }
      }
      this.aucAmount = value;

      return true;
    }
    else {

      this.aucAmount = (splitValue[0].slice(0, -1));
      this.aucAmount += (splitValue.length == 2) ? ("." + splitValue[1]) : "";

      return false;
    }
  }

  saveCalculate() {
    this.totalItemCost = 0;
    this.calculateDisable = true;
    this.dialogData.forEach(item => {
      let calculateValue = Number(Number((Number(item.baseCost) * Number(this.aucAmount)).toFixed(this.auctionData.currencyDecimalPlace)) / 100).toFixed(this.auctionData.currencyDecimalPlace);
      if (this.auctionData.type == config.AUC_TYPE[0].value) {
        item.baseCost = Number(Number(item.baseCost) + Number(calculateValue)).toFixed(this.auctionData.currencyDecimalPlace);
      }
      else {
        item.baseCost = Number(Number(item.baseCost) - Number(calculateValue)).toFixed(this.auctionData.currencyDecimalPlace);
      }
      item.bestBid = item.baseCost;
      this.totalItemCost += item.baseCost * item.minimumDesiredQuantity
    });
    this.dialogData.forEach(item => {
      let landedData = config.calculateTotalLandedCost(this.supplierData.supplierAF, this.supplierData.supplierMF, [...this.dialogData], item, this.biddingCurrency.exchangeRate, true, this.auctionData.currencyDecimalPlace)
      item.landedCost = (landedData.landedUnit / this.biddingCurrency.exchangeRate).toFixed(this.auctionData.currencyDecimalPlace);
      item.totalLandedCost = (landedData.totalLanded / this.biddingCurrency.exchangeRate).toFixed(this.auctionData.currencyDecimalPlace);
    });          
    this.enableConfirm.emit([...this.dialogData]);
  }


}
