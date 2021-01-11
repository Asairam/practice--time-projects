import { Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonService } from '../../../../commonService/common.service';
import * as config from '../../../../appConfig/app.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromSupplierBiddingModule from '../../supplier-bidding/state/supplier-bidding.reducer';
import { takeWhile } from 'rxjs/operators';


@Component({
  templateUrl: './supp-item-popup-view-only.component.html',
  styleUrls: ['./supp-item-popup-view-only.component.css']
})
export class SuppItemPopupViewOnlyComponent implements OnInit, OnDestroy {

  componentActive: boolean = true;
  popupData: any;
  customfieldList = [];
  commonheader: any;
  attachment_type_options = config.ATTACHMENTTYPE_OPTION;
  showAttachments: boolean = false;
  exchangeRate = 1;
  currencyCodeBidder = '';
  currencyCodePrimary = '';
  showCalculation: boolean = false;
  currencyDecimal;

  constructor(
    public MatDialogRef: MatDialogRef<SuppItemPopupViewOnlyComponent>,
    public common: CommonService,
    @Inject(MAT_DIALOG_DATA) { ...data },
    private store: Store<fromSupplierBiddingModule.SupplierBiddingModuleState>
  ) {
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.commonheader = text;
    });
    this.popupData = data.data;
    this.customfieldList = data.data.customfieldList.filter(ele => ele.vendorLevelDisplay);
  }

  ngOnInit() {
    this.store.pipe(select(fromSupplierBiddingModule.getAuctionDetails), takeWhile(() => this.componentActive)).subscribe((auctionDetails: any) => {
      if (auctionDetails) {
        this.currencyCodeBidder = auctionDetails.biddingCurrency ? auctionDetails.biddingCurrency.currencyCode : '';
        this.exchangeRate = auctionDetails.biddingCurrency ? auctionDetails.biddingCurrency.exchangeRate : '';
        this.currencyCodePrimary = auctionDetails.primaryCurrency ? auctionDetails.primaryCurrency.currencyCode : '';
        this.currencyDecimal = auctionDetails.currencyDecimal;
      }
    });
  }

  showAttachDocument() {
    this.showAttachments = !this.showAttachments;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.shiftKey && event.keyCode == 70) {
      this.showCalculation = true;
    }

    if (event.shiftKey && event.keyCode == 81) {
      this.showCalculation = false;
    }
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
