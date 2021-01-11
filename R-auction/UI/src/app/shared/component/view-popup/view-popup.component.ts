import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from '../../../commonService/common.service';
import { SupplierService } from '../../../component/component-service/supplier.service';
import * as config from '../../../appConfig/app.config';
import { BuyerEditService } from 'src/app/component/component-service/buyer-edit.service';
import { PreliminarybidsComponent } from 'src/app/component/buyer/edit/particpant/preliminarybids/preliminarybids.component';
import { Subject } from 'rxjs';
import { CommonLoaderService } from '../loader/loader.service';
/* NgRx */
import { Store, select} from '@ngrx/store';
import * as fromEditModule from '../../../component/buyer/edit/state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-view-popup',
  templateUrl: './view-popup.component.html',
  styleUrls: ['./view-popup.component.css']
})
export class ViewPopupComponent implements OnInit, OnDestroy {

  componentActive: boolean = true;
	auctionReadOnly: boolean = false; 

  isLoading: Subject<boolean> = this.loaderService.isLoading;
  dialogMessage = "";
  dialogContent: any;
  dialogPositiveBtn = "Yes";
  dialogNegativeBtn = 'No';
  attachment_type_options = config.ATTACHMENTTYPE_OPTION;
  tab = '';
  viewData: any;
  enableButton = true;
  auctionId: any;
  tempData = null;
  commonheader: any;
  itemData: any;
  updateItemData = [];
  comment: any;
  auctionStatusList = config.AUCTIONSTATUS;
  auctionData: any;
  aucSubmit: boolean;
  selectBidCurrency = null;
  prelimianryData = [];
  supplier = {
    supplierAF: 0,
    supplierMF: 0,
    supplierID: null,
    supplierCurrency: null,
    supplierUser: false
  }
  attachData = [];
  inviteStatus = "";
  lot_item = [];
  responseDataDownloads;
  downloadSource;
  displayedColumnsDownloads: string[] = ['document', 'download'];
  biddingcurrency: any;
  primarycurrency: any;
  templateAuctionNmae = null;
  supplierData = null;
  customfieldList:any = [];
  @ViewChild(PreliminarybidsComponent) preliminary: PreliminarybidsComponent;
   allRemarks=[];

  constructor(
      private buyerService: BuyerEditService, 
      public dialog: MatDialog, 
      public MatDialogRef: MatDialogRef<ViewPopupComponent>, 
      public common: CommonService, 
      private supplierservice: SupplierService,
      @Inject(MAT_DIALOG_DATA) { ...data }, 
      public loaderService: CommonLoaderService,
      private store: Store<fromEditModule.EditModuleState>
    ) {
    this.dialogMessage = data.dialogMessage;
    this.dialogPositiveBtn = data.dialogPositiveBtn;
    this.dialogNegativeBtn = data.dialogNegativeBtn;
    this.dialogContent = data.dialogContent;
    this.tab = data.tab;
    this.viewData = data.data;
    this.auctionId = data.auctionID;
    this.biddingcurrency = data.bidding;
    this.primarycurrency = data.primarycurrency
    this.customfieldList = data.data ? data.data.customfieldList : [];
    this.tempData = {
      dialogMessage: data.dialogMessage,
      dialogNegativeBtn: data.dialogNegativeBtn,
      tab: data.tab
    }
    if (this.tab === 'Print-Preview') {
      this.viewData = data.data;
    }
    if (this.tab === 'bidView' || this.tab === "bidAll") {
      this.itemData = (this.tab === "bidAll") ? data.dialogData.data : [data.dialogData.data];
      this.auctionData = data.dialogData.auctionData;
      this.supplierData = data.dialogData.supplierData;
      this.enableButton = (this.tab === "bidAll") ? false : true;
    }
    if (this.tab === 'acceptView') {
      this.auctionData = data.dialogData.auctionData;
      this.selectBidCurrency = this.auctionData.currency.filter(x => x.currencyCode == data.supplier.supplierCurrency.currencyCode)[0];
      this.supplier = {
        supplierAF: (data.supplier.supplierAF) ? data.supplier.supplierAF : 0,
        supplierMF: (data.supplier.supplierMF) ? data.supplier.supplierMF : 0,
        supplierID: data.supplier.supplierID,
        supplierCurrency: (data.supplier.supplierCurrency) ? data.supplier.supplierCurrency : null,
        supplierUser: true
      }
      this.prelimianryData = (data.prelimianryData) ? data.prelimianryData : [];
      this.lot_item = [...data.lot_item_data];
      this.allRemarks=data.allRemarks;
    }
    if (this.tab === "downloadView") {
      this.downloadSource = new MatTableDataSource(this.viewData);
    }
    this.common.toggleDiv.subscribe(
      (data: any) => {
        if (data.flag === 'itemPopupClose' || data.flag === 'lotPopupClose') {
          this.MatDialogRef.close();
        }
      });
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.commonheader = text;
    });

    this.supplierservice.acceptStatus.subscribe(async (data: any) => {
      this.callAcceptAPI();
    })
  }

  ngOnInit() {
    this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionReadOnly => {
			this.auctionReadOnly = auctionReadOnly;
		});
  }

  private onPositiveBtn() {

    if (this.tab == 'acceptView') {
      if (!this.comment) {
        this.common.warning('Please Enter Your Comment.');
      }
      else {
        this.inviteStatus = config.AUCTIONSTATUS.AC;
        this.acceptDetails();
      }
    } else if (this.tab === 'template-confirm') {
      if (!this.templateAuctionNmae) {
        this.common.warning('Please Enter Auction Name.');
      }
      else {
        this.MatDialogRef.close(this.templateAuctionNmae);
      }
    }
    else if (this.tab == 'bidAll') {
      this.MatDialogRef.close(this.updateItemData);
    }
    else if (this.tab == "preBidView") {
      this.preliminary.saveAllBid();
    }
    else if (this.tab == "remarkView")
      this.tab = "acceptView";   
    else {
      if (this.inviteStatus == config.AUCTIONSTATUS.AC || this.inviteStatus === this.auctionStatusList.RJ) {
        this.savePreliminary();
        this.callAcceptAPI();
      } else {
        this.MatDialogRef.close(true);
      }
    }
  }

  private onDeclineBtn() {
    if (!this.comment) {
      this.common.warning('Please Enter Your Comment.');
    }
    else {
      this.inviteStatus = config.AUCTIONSTATUS.RJ;
      // this.savePreliminary();
      this.acceptDetails();
    }
  }
  private onNegativeBtn() {
    if (this.tab == "attachView")
      [this.tab, this.dialogNegativeBtn, this.dialogMessage, this.attachData] = [this.tempData.tab, this.tempData.dialogNegativeBtn, this.tempData.dialogMessage, []];
     else
      this.MatDialogRef.close(false);
  }

  onDeleteBid() {
    this.preliminary.deleteAllPreBid();
  }

  acceptDetails() {
    let sele = this.inviteStatus == config.AUCTIONSTATUS.AC ? 'Accept?' : 'Decline?';
    this.tab = 'confirm_msg';
    this.dialogMessage = 'Please confirm..';
    this.dialogContent = 'Are you sure you want to ' + sele;
    this.dialogPositiveBtn = 'Yes';
    this.dialogNegativeBtn = 'No';
    // if (this.auctionData.currency.length > 1) {
    var elements = document.getElementsByClassName("dialog-vlg")[0] as HTMLElement;
    if (elements)
      elements.style.width = '252px';
    // }
  }

  callAcceptAPI() {
    let objData = {
      auctionID: this.auctionId, status: (this.inviteStatus == config.AUCTIONSTATUS.AC) ? this.auctionStatusList.AC : this.auctionStatusList.RJ, acceptanceMessage: this.comment, email: JSON.parse(localStorage.getItem('userdata')).email.toLowerCase(),
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

  savePreliminary() {
    if (this.supplier.supplierCurrency.currencyCode != this.selectBidCurrency.currencyCode) {
      // this.preliminary.saveCalculate(true);
      let sendData = {
        flag: 'viewPopupCallToPreliminary'
      }
      this.common.toggleDiv.emit(sendData);
    }
    // else {
    //   this.acceptDetails();
    // }
  }

  openRemark() {
    this.tab = "remarkView";
  }

  changeCurrency() {
    this.buyerService.changeCurrency.next(this.selectBidCurrency);
  }

  getSelectedPoHistory(report) {
    this.buyerService.selectPoHistory.next(report);
    this.MatDialogRef.close(false);
 }

  enableConfirm(data) {
    this.enableButton = true;
    console.log(data);
    this.updateItemData = data;
    this.common.success("Calculate successfully.")
  }

  getAttachment(data) {
    this.tab = "attachView";
    this.dialogNegativeBtn = "Cancel"
    this.attachData = data;
    this.dialogMessage = "Attachments";
  }

  camelToTitle = (camelCase) => camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();

    ngOnDestroy() {
      this.componentActive = false;
    }



}
