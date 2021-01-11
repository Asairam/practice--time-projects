import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';
import { CommonService } from 'src/app/commonService/common.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from '../../../../../shared/component/view-popup/view-popup.component';
import { BuyerBiddingService } from 'src/app/component/component-service/buyer-bidding.service';
import { FormControl } from '@angular/forms';
import { BidhistoryService } from './bidhistory.service';
import { Subscription } from 'rxjs';
/* NgRx */
import { Store, select} from '@ngrx/store';
import * as fromLiveBiddingModule from '../../state/live-bidding-module.reducer';
import { takeWhile } from 'rxjs/operators';
import * as fromAppModule from '../../../../../state/app.reducer';

@Component({
  selector: 'app-bidhistory',
  providers: [BidhistoryService],
  templateUrl: './bidhistory.component.html',
  styleUrls: ['./bidhistory.component.css']
})
export class BidhistoryComponent implements OnInit, OnDestroy {

  afMfEnabled: boolean = false;
  componentActive: boolean = true;
  exchangeRate = {};
  selectedTabIndex = 0;
  @Input() allSupplierInviteList = [];
  @Input() issealedBidDis = false;
  selectedReference = '';
  bidreference = [];
  @Input() primaryCurrency: any;
  @Input() supplierListForCurrency: any;
  bid_res: any;
  data = [];
  obj: any;
  commonheader: any;
  translateSer: any;
  supplierDrop = [];
  selectedSupplier = '';
  selectedLot = '';
  selectedItem = '';
  selectedBid = '';
  bidhistorydata: any;
  public supplierbidref: FormControl = new FormControl();
  public supplierFilterCtrl: FormControl = new FormControl();
  public lotFilterCtrl: FormControl = new FormControl();
  public itemFilterCtrl: FormControl = new FormControl();
  summaryList = this.bidService.summaryList;
  itemFilter = [];
  @Input() auctionID;
  @Input() auctionData;
  @Input() currencyDecimalPlace = 2;
  currDeciPlac: string = ''
  serDestroy: Subscription;
  sortBy =  {columnName : "", type : ""};

  constructor(
    private buyerService: BuyerEditService,
    private common: CommonService,
    private MatDialog: MatDialog,
    public bidService: BuyerBiddingService,
    private bhService: BidhistoryService,
    private store: Store<fromLiveBiddingModule.LiveBiddingModuleState>
  ) {
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.commonheader = text;
    });

    this.common.translateSer('ITEM_MSG').subscribe(async (text: string) => {
      this.translateSer = text;
    });
  }

  ngOnInit() {
    this.store.pipe(select(fromAppModule.getAuctionConfigOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionConfig => {
			if(auctionConfig && auctionConfig.features) { 
				this.afMfEnabled = auctionConfig.features.currency;
			}
		});
    this.auctionData.currency.forEach(curObj => {
			this.exchangeRate[curObj.currencyCode] = curObj.exchangeRate;
		});
    this.currDeciPlac = '.' + this.currencyDecimalPlace + '-' + this.currencyDecimalPlace;
    this.supplierDrop = [...this.allSupplierInviteList];
    try {
      this.supplierFilterCtrl.valueChanges
        .subscribe(() => {
          this.filterBanks();
        });
      this.lotFilterCtrl.valueChanges
        .subscribe(() => {
          this.filterBanks();
        });
      this.itemFilterCtrl.valueChanges
        .subscribe(() => {
          this.filterBanks();
        });
      this.supplierbidref.valueChanges
        .subscribe(() => {
          this.filterBanks();
        });
      this.getbiddata();
    }
    catch (ex) {
      this.common.error(ex);
    }
  }

  sortByColumn(column, type) {
    if(this.sortBy.columnName ==column) {
      this.sortBy.type = type; // (this.sortBy.type == "asc")?"desc":"asc";
    } else {
      this.sortBy.columnName = column;
      this.sortBy.type = type;
    }
    this.getbiddata();  
  }

  items() {
    this.itemFilter = [];
    this.bidService.summaryList.forEach((element) => {
      element.items.forEach((item) => {
        this.itemFilter.push(item);
      });
    });
  }
  
  getbiddata() {
    this.items();
    return new Promise((resolve, reject) => {
      if(this.sortBy.columnName == undefined) {
        this.sortBy.columnName = "";
        this.sortBy.type = "";

      }
      this.serDestroy = this.buyerService.getBidHistory(this.auctionID, this.sortBy).subscribe((res: any) => {
        let {filteredList}  = this.bhService.getFormatedOutput(res.data.data, this.primaryCurrency, this.supplierListForCurrency);
        let mismatchArray = [];
        let matchItem =[];
        this.sortBy = res.data.sort;
        if(this.sortBy.columnName!="time") {
          mismatchArray =  filteredList.filter(item => item[this.sortBy.columnName] == undefined);
          
          matchItem = filteredList.filter(item => item[this.sortBy.columnName] != undefined);
        } else {
          matchItem = filteredList;
        }
        if(this.sortBy && this.sortBy.columnName != undefined && this.sortBy.columnName != "") {
          matchItem.sort((a, b) => {
            if(this.sortBy.columnName=="time"){
              let x: any = new Date(a["createdAt"]);
              let y: any = new Date(b["createdAt"]);
              if(this.sortBy.type == "asc") {
                return x-y;
              } else {
                return y-x;
              }
            } 
            else{
              if(a[this.sortBy.columnName] != undefined && b[this.sortBy.columnName] != undefined) {
                if(this.sortBy.type == "asc") {
                  return a[this.sortBy.columnName] > b[this.sortBy.columnName]?1: (a[this.sortBy.columnName] < b[this.sortBy.columnName]?-1:0);
                } else {
                  return a[this.sortBy.columnName] < b[this.sortBy.columnName]?1: (a[this.sortBy.columnName] > b[this.sortBy.columnName]?-1:0);
                  //return b[this.sortBy.columnName] - a[this.sortBy.columnName];
                }
              } else { 
                return  0; 
              }
            }
          }) 
        } else {
            this.sortBy.columnName = "time";
            this.sortBy.type = "desc";
        }
        console.log("matchItem------", matchItem.length);
        this.bidhistorydata = matchItem.concat(mismatchArray);
        this.data = filteredList;
        this.bidrefFun(filteredList);
        this.onOptionsSelected();
        resolve();
      }, (err) => {
        this.common.error(err);
        this.common.loader = false;
        reject(err);
      });
    });
  }

  removeBid(element) {
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-xs';
    objMatDialogConfig.data = {
      dialogMessage: this.commonheader['PLZ_CON'],
      dialogContent: this.translateSer['REMOVE_ITEM'] + '<b>' + element.itemName + '</b>',
      tab: 'confirm_msg',
      dialogPositiveBtn: "Yes",
      dialogNegativeBtn: "No"
    }
    objMatDialogConfig.disableClose = true;
    let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
    refMatDialog.afterClosed().subscribe(value => {
      let obj = {
        id: element['id'],
        auctionID: this.auctionID
      }
      if (obj) {
        if (value) {
          this.buyerService.getBidDelete(obj).subscribe((res: any) => {
            if (res.success) {
              this.getbiddata();
              this.common.success(element.itemName + ' ' + this.commonheader['DELE_SUCC']);
            }
          });
        }
      }
    })
  }

  filterBanks() {
    // start supplier filter
    if (this.supplierFilterCtrl.value) {
      this.supplierDrop = [...this.allSupplierInviteList];
      this.supplierDrop = this.allSupplierInviteList.filter(
        item => item.supplierName1.toLowerCase().indexOf(this.supplierFilterCtrl.value.toLowerCase()) > -1
      );
    } else {
      this.supplierDrop = [...this.allSupplierInviteList];
    }

    // start lot filter
    if (this.lotFilterCtrl.value) {
      this.bidService.summaryList = [...this.summaryList];
      this.bidService.summaryList = this.bidService.summaryList.filter(
        lot => lot.lotName.toLowerCase().indexOf(this.lotFilterCtrl.value.toLowerCase()) > -1
      );
    } else {
      this.bidService.summaryList = [...this.summaryList];
    }

    // start item filter
    if (this.itemFilterCtrl.value) {
      this.items();
      this.itemFilter = this.itemFilter.filter(
        item => item.itemName.toLowerCase().indexOf(this.itemFilterCtrl.value.toLowerCase()) > -1
      );
    } else {
      this.items();
    }

    if (this.supplierbidref.value) {
      this.bidrefFun(this.data);
      this.bidreference = this.bidreference.filter(
        bid => bid.indexOf(this.supplierbidref.value.toLowerCase()) > -1
      );
    } else {
      this.bidrefFun(this.data);
    }

  }

  onOptionsSelected() {
    this.data = [...this.bidhistorydata];
    if (this.selectedSupplier != "") {
      this.data = this.data.filter(x => x.bidderID == this.selectedSupplier);
    }
    if (this.selectedLot != "") {
      this.data = this.data.filter(x => x.lotID == this.selectedLot);
    }
    if (this.selectedItem != "") {
      this.data = this.data.filter(x => x.itemID == this.selectedItem);
    }
    if (String(this.selectedBid) != "") {
      this.data = this.data.filter(x => x.isLeading == this.selectedBid);
    }
    if (this.selectedReference != "") {
      this.data = this.data.filter(x => x.uniqueBidID == this.selectedReference);
    } else {
      this.bidrefFun(this.data);
    }
  }

  bidrefFun(filteredList) {
    filteredList.forEach(element => {
      if(this.bidreference.indexOf(element.uniqueBidID) == -1) {
      this.bidreference.push(element.uniqueBidID)
      }
    });
  }
  selectedIndexChange(index: number) {
    this.selectedTabIndex = index;
  }

  ngOnDestroy() {    
    this.componentActive = false;
    try {
      if (this.serDestroy) {
        this.serDestroy.unsubscribe();
      }
    } catch (e) { }
  }

}
