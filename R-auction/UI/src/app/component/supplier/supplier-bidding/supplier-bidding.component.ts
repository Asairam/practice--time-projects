import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { SupplierService } from '../../component-service/supplier.service';
import { CommonService } from '../../../commonService/common.service';
import { AuthService } from 'src/app/authService';
import { SocketService } from '../../socketService/socket.service';
import { ChatBotComponent } from 'src/app/shared/component/chat-bot/chat-bot.component';
import * as config from 'src/app/appConfig/app.config';
import { SupplierItemViewComponent } from './supplier-item-view/supplier-item-view.component';
import { BuyerEditService } from '../../component-service/buyer-edit.service';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { SupplierBidHistoryComponent } from './supplier-bid-history/supplier-bid-history.component';
import * as routerconfig from 'src/app/appConfig/router.config';
import { SupplierBiddingService } from './supplier-bidding.service';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromSupplierBiddingModule from '../supplier-bidding/state/supplier-bidding.reducer';
import * as supplierBiddingModuleActions from '../supplier-bidding/state/supplier-bidding.actions';
import { takeWhile } from 'rxjs/operators';

import { CustomDisColumnsComponent } from 'src/app/shared/component/custom-dis-columns/custom-dis-columns.component';

@Component({
  selector: 'app-supplier-bidding',
  templateUrl: './supplier-bidding.component.html',
  styleUrls: ['./supplier-bidding.component.css'],
  providers: [SupplierService]
})
export class SupplierBiddingComponent implements OnInit, OnDestroy {

  additionMultiplicationFactor;
  @ViewChild(CustomDisColumnsComponent) private customDisview: CustomDisColumnsComponent;
  aucStatus;
  auctionLeader:any;
  auctionSuspended: boolean = false;
  componentActive: boolean = true;
  socketendpoint: any;
  timeRemainingToOpen: any;
  @ViewChild(CountdownComponent) counter: CountdownComponent;
  auctionID: any;
  chatMessage = false;
  chatDisplay = false;
  socketData: any;
  translateSer: any;
  discountText = null;
  viewTyp = !this.commonservice.isMobile ? 'list' : 'card';
  viewFlag = '';
  items = [];
  @ViewChild(SupplierItemViewComponent) private supplieritemview: SupplierItemViewComponent;
  @ViewChild(SupplierBidHistoryComponent) private supplierbidview: SupplierBidHistoryComponent;
  @ViewChild(ChatBotComponent) private chatView: ChatBotComponent;
  auctionData: any = {
    auctionLeader: null, auctionName: null, auctionStatus: null,
    supplierStatus: null, auctionType: null, auctionID: null
  }
  auctionStatusList = config.AUCTIONSTATUS;
  participate = false;
  status = "";
  supplierData = null;
  prelimianryData = [];
  selectBidCurrency = null;
  common_btn: any;
  remarks = [];
  currentURL: any;
  constructor(
      private supplierBiddingService: SupplierBiddingService,
      private matDialog: MatDialog, 
      private buyerService: BuyerEditService, 
      public socketService: SocketService, 
      private auth: AuthService, 
      private supplierservice: SupplierService, 
      public commonservice: CommonService, 
      private routes: ActivatedRoute,
      private router: Router,
      private store: Store<fromSupplierBiddingModule.SupplierBiddingModuleState>
    ) {
    this.routes.params.pipe(takeWhile(() => this.componentActive)).subscribe(params => {
      this.auctionID = params['id'] ? +params['id'] : null;
      if (this.auctionID) {
        // this.onlineAuc(this.auctionID);
        this.commonservice.supplierbiddingPage = { page: 'bid', auctionid: this.auctionID };
      }
    });
    this.commonservice.translateSer('STATUS_DETAILS').pipe(takeWhile(() => this.componentActive)).subscribe(async (text: string) => {
      this.translateSer = text;
    });
    this.commonservice.translateSer('COMMON').pipe(takeWhile(() => this.componentActive)).subscribe(async (text: string) => {
      this.common_btn = text;
    });
    this.socketendpoint = this.socketService.getSocketData(this.auctionID);
    this.socketendpoint.subscribe(res => {
      if(res.status.toLowerCase() == 'open' && this.aucStatus && this.aucStatus == 'paused'){
        this.dispatchAuctionStatus(res);
        Object.assign(this.auctionData, this.auctionData, {...res});
        if(this.viewFlag == 'item') {
          this.getSuppFilList();
        }
      }      
    })
    router.events.pipe(takeWhile(() => this.componentActive))
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          this.backButton(this.auctionID);
        }
      });
    this.router.events.pipe(takeWhile(() => this.componentActive)).subscribe((event) => {
      this.currentURL = this.router.url.substring(1);
    });
  }

  ngOnInit() {
    this.store.pipe(select(fromSupplierBiddingModule.getAuctionDetails), 
      takeWhile(() => this.componentActive)).subscribe(auctionDetails => {
        if(auctionDetails) {
          this.additionMultiplicationFactor = auctionDetails.additionMultiplicationFactor;
          // debugger;
        }
			
		});
    this.store.pipe(select(fromSupplierBiddingModule.getSupplierBiddingModuleInitialized),takeWhile(() => this.componentActive))
      .subscribe( (supplierBiddingModuleInitialized) => {
        if(!supplierBiddingModuleInitialized){
          let auctionId = this.routes.snapshot.params.id;       
          this.getAuctionDetails(auctionId);
          this.supplierBiddingService.getSupplierOrgFeature(auctionId).then((res: any) => {
            this.dispatchAdminConfiguration(res);
          }).catch();
        }
    });
    

    this.store.pipe(select(fromSupplierBiddingModule.getAuctionStatus), 
      takeWhile(() => this.componentActive)).subscribe(auctionStatus => {
			if( auctionStatus == 'suspended') {
        console.log('suspended');
        this.auctionSuspended = true;
			} else {
        this.auctionSuspended = false;
      }
			if(auctionStatus == 'published') {
        console.log('published');
			}
			if(auctionStatus == 'paused') {
        console.log('paused');
      }
      this.aucStatus = auctionStatus;
		});

    this.viewFlag = this.loadCom();
    // this.getAuctionDataByID();
    this.commonservice.loader = true;
    this.getChatData();
    this.getSupplierData();
  }

  getAuctionDetails(auctionId) {
    this.supplierBiddingService.getAuctionDetailsById(auctionId).then((res: any) =>{
      this.auctionLeader =  res.data.auctionLeader;
      this.dispatchAuctionStatus(res.data);   
      // if(this.auctionData && this.auctionData.hasOwnProperty('currentBidSingleSource')  && this.auctionData.hasOwnProperty('currentBidBestCost')){
      //   this.auctionData.currentBidSingleSource = res.data.currentBidSingleSource;
      //   this.auctionData.currentBidBestCost = res.data.currentBidBestCost;
      // }
      // this.auctionData.initialBid = res.data.initialBid;
      // this.auctionData.myTotalValue = res.data.myTotalValue;
      // this.auctionData.myRank = res.data.myRank;
      Object.assign(this.auctionData, this.auctionData, {...res.data});
    }).catch();
  }

  dispatchAuctionStatus(data) {
    this.store.dispatch(new supplierBiddingModuleActions.SetStatusAndRepublishRequired({
      republishRequired: data.republishRequired,
      status: data.status.toLowerCase(),
      infoShownToSupplier: data.infoShownToSupplier
    }))
  }

  dispatchAdminConfiguration(res) {
    this.store.dispatch(new supplierBiddingModuleActions.SetAdminConfigFeature({
      takeLead : res.data.takeLead,
      additionMultiplicationFactor: res.data.currency
    }));
  }

  closeChat() {
    try {
      this.chatDisplay = (this.chatDisplay) ? false : true;
      this.chatMessage = false;
    } catch (e) {
      this.commonservice.error(e);
    }
  }

  getChatData() {
    let vendorCode = this.auth.getUserData().settings.ril.vendorcodeSelected;
    this.socketService.getQuerySocketData(this.auctionID, vendorCode).pipe(takeWhile(() => this.componentActive))
      .subscribe(data => {
        if (this.chatDisplay) {
          this.chatView.getSocketChat(data, vendorCode);
          this.chatMessage = false;
        }
        else {
          config.chatAudio();
          this.chatMessage = true;
        }
      })
  }

  showSocketDataFromParent(data) {
    data = JSON.parse(data);
    this.socketData = data.socketData;
    this.getRemainingTime();
    if (this.socketData.status === this.auctionStatusList.PA) {
      setTimeout(() => {
        this.counter.pause();
      }, 1);
    }
    this.participate = data.participate;
    this.status = this.socketData.supplierStatus;
    this.dispatchAuctionStatus(this.socketData);
    this.auctionData.status = this.socketData.status;
    this.items = data.items;
    let userDtls = this.auth.getUserData();
    let supplierRemarks = this.supplierData["supplierRemarks"] ? this.supplierData["supplierRemarks"]
      .map(x => ({ ...x, updatedUser: userDtls.name.firstname + ' ' + userDtls.name.lastname })) : [];
    let buyerRemarks = this.socketData["buyerRemarks"] ? this.socketData["buyerRemarks"]
      .map(x => ({ ...x, updatedUser: this.socketData["auctionLeader"]["name"] })) : [];
    this.remarks = [...supplierRemarks, ...buyerRemarks];
  }
  getRemainingTime() {
    let currentDateinSec = (new Date()).getTime() / 1000;
    let startDateinSec = (new Date(this.socketData.startDate)).getTime() / 1000;
    this.timeRemainingToOpen = currentDateinSec - startDateinSec;
  }
  getAucDataFromParent(data) {
    this.auctionData = data;
    this.selectBidCurrency = this.auctionData.currency.find(x => x.currencyCode == this.supplierData["supplierCurrency"]["currencyCode"]);
    this.store.dispatch(new supplierBiddingModuleActions.SetBiddingCurrencyAndExchangeRate({
      currencyCode: this.selectBidCurrency.currencyCode,
      currencyName: this.selectBidCurrency.currencyName,
      exchangeRate: this.selectBidCurrency.exchangeRate
    }));

    this.store.dispatch(new supplierBiddingModuleActions.SetPrimaryCurrency({
      currencyCode: this.auctionData.primaryCurrencyNew.currencyCode,
      currencyName: this.auctionData.primaryCurrencyNew.currencyName,
    }));

    this.store.dispatch(new supplierBiddingModuleActions.SetCurrencyDecimal({
      currencyDecimal: this.auctionData.currencyDecimalPlace
    }));

    this.commonservice.commonStatus = data.status;
    this.discountText = (this.auctionData.type == config.AUC_TYPE[0].value) ? "% Increase all" : "% Discount All";
    if(this.viewFlag == 'item') {
      this.getSuppFilList();
    }
  }

  viewType(val) {
    this.supplieritemview.view = val;
    this.viewTyp = val;
  }

  queryDialog() {
    let dialogData = {
      flag: 'openAttach',
      pageFrom: 'queryHistory',
      data: {
        auctionID: this.auctionID,
        auctionData: this.auctionData,
        // supplierList: [],
        chat: "offline"
      }
    };
    this.commonservice.toggleDiv.emit(dialogData);
  }

  acceptDetails() {
    this.supplierBiddingService.getAuctionDetailsById(this.auctionID).then((res: any) =>{
      this.auctionLeader =  res.data.auctionLeader;
      this.dispatchAuctionStatus(res.data);
      if(res.data.republishRequired  && res.data.status.toLowerCase() == "published") {
        this.commonservice.error(`You can not bid as the Auction is being Amended – Please Contact the Auction Author "${this.auctionLeader.name}"`)
      } else {
        this.supplieritemview.acceptDetails(this.remarks); 
      }        
    }).catch();
    
  }

  getSupplierData() {
    this.buyerService.getSupplierAndPreliminary(this.auctionID, this.auth.getUserData().settings.ril.vendorcodeSelected).pipe(takeWhile(() => this.componentActive)).subscribe((res: any) => {
      this.prelimianryData = (res[1]["data"].length > 0) ? res[1]["data"].filter(x => x.bidderID == this.auth.getUserData().settings.ril.vendorcodeSelected) : [];
      this.supplierData = res[0]["data"] ? res[0]["data"].supplierList : [];
      // debugger;
      if (this.supplierData.length > 0) {
        this.supplierData = this.supplierData.find(x => x.supplierID == this.auth.getUserData().settings.ril.vendorcodeSelected);
        if (!this.supplierData["supplierCurrency"]) {
          this.supplierData.supplierCurrency = { currencyCode: "INR", currencyName: "Indian Rupee" };
          this.supplierData.supplierAF = 0;
          this.supplierData.supplierMF = 0;
        }
        this.buyerService.supplierData = this.supplierData;
      }
    }, err => {
      this.commonservice.error(err);
    })
  }

  acceptStatus(data) {
    data = JSON.parse(data);
    this.participate = data.participate;
    this.status = data.status;
    this.auctionData.supplierStatus = this.status;
  }

  backButton(auctionID) {
    this.socketService.supplierBackButtonFromBreadcrumbs(auctionID).pipe(takeWhile(() => this.componentActive)).subscribe(data => { let res = data; });
  }

  biddingDialog() {
    try {
      let dialogData = {};
      let bidData = [];
      this.supplieritemview.supplierBiddingSource.forEach(lot => {
        let itemData = lot.items.filter(x => x.bids.length > 0);
        if (itemData.length > 0) {
          let biddingData = [];
          lot.items.forEach(item => {
            biddingData = item.bids.filter(y => y.data.bidderID == this.supplierData.supplierID);
            if (biddingData.length > 0)
              bidData.push({
                lotID: lot.lotID,
                lotName: lot.lotName,
                itemID: item.itemID,
                itemName: item.itemName,
                minimumDesiredQuantity: item.minimumDesiredQuantity,
                minimumChangeValue: item.minimumChangeValue,
                minChangeType: item.minChangeType,
                baseCost: biddingData[0].data.baseCost,
                landedCost: biddingData[0].data.landedCost,
                totalLandedCost: biddingData[0].data.totalLandedCost
              });
          });
        }
      });
      if (bidData.length == 0) {
        return this.commonservice.error("Bid atleast in one item");
      }
      const objMatDialogConfig = new MatDialogConfig();
      dialogData = { supplierData: this.supplierData, data: bidData, auctionID: this.auctionID, decimalplace: this.auctionData.currencyDecimalPlace, auctionData: this.auctionData }

      objMatDialogConfig.panelClass = 'dialog-md';
      objMatDialogConfig.data = {
        dialogMessage: 'Supplier Bidding All Bidded Item',
        tab: 'bidAll',
        dialogPositiveBtn: "Confirm",
        dialogNegativeBtn: "Close",
        bidButton: "supplier-itemcomponent",
        dialogData: dialogData
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().pipe(takeWhile(() => this.componentActive)).subscribe((value) => {
        // debugger
        if (value) {
          this.supplieritemview.supplierBiddingSource.forEach((lot) => {
            lot.items.forEach(item => {
              let data = value.find(x => x.itemID == item.itemID);
              if (data) {
                let objData = {}
                objData = {
                  "auctionID": this.auctionID,
                  "organizationID": 0,
                  "lineItemID": data.itemID,
                  "bidType": "string",
                  "name": data.itemName,
                  "fixedCost": 0,
                  "minCapacity": 0,
                  "maxCapacity": 0,
                  "currencyCode": this.supplierData.supplierCurrency.currencyCode,
                  "description": 0,
                  "baseCost": data.baseCost,
                  "variableCost": 0,
                  "currency": {
                    "currencyName": this.supplierData.supplierCurrency.currencyName,
                    "currencyCode": this.supplierData.supplierCurrency.currencyCode
                  },
                  "supplierAF": this.supplierData.supplierAF,
                  "supplierMF": this.supplierData.supplierMF,
                  "landedCost": data.landedCost,
                  "totalLandedCost": data.totalLandedCost
                }
                this.supplierservice.insertBidItem(objData).subscribe((res: any) => {
                  this.supplieritemview.supplierBiddingAllErrorControlList.set(item.itemID, new FormControl(''));
                }, (err) => {
                  this.supplieritemview.errorFlag = true;
                  this.supplieritemview.supplierBiddingAllErrorControlList.set(item.itemID, new FormControl(err));
                  // item.toolTip = this.supplieritemview.supplierBiddingAllErrorControlList.get(item.itemID).value;
                });
              }
            })
          });
          this.commonservice.success("Bid All submitted successfully. If any errors- Kindly see each line item wise.");
        }
      });


    } catch (e) {


    }
  }

  viewSummaryDialog() {
    window.scroll(0, 0);
    let userDtls = this.auth.getUserData();
    let printViewObj = {
      basicInformation: this.auctionData,
      contactperson: {
        name: userDtls.name.firstname + ' ' + userDtls.name.lastname,
        email: userDtls.email ? userDtls.email : '',
        number: userDtls.mobile ? userDtls.mobile : ''
      },
      biddingRules: {
        extendauctionNewBid: this.auctionData.extensionType ? this.auctionData.extensionType : '',
        gracePeriod: this.auctionData.gracePeriod ? this.auctionData.gracePeriod : '',
        extentionTime: this.auctionData.extensionSeconds ? this.auctionData.extensionSeconds : '',
        minBidChange: this.auctionData.minBidChangeValue,
        bidCusionLimit: (this.auctionData.type !== config.AUC_TYPE[0].value) ? this.auctionData.bidCushionTypeLowerLimit : this.auctionData.bidCushionTypeUpperLimit,
        minBidChangeType: this.auctionData.minBidChangeType,
        bidCushionTypeLimit: this.auctionData.bidCushionType,
        primaryCurrency: this.auctionData.primaryCurrency ? this.auctionData.primaryCurrency : '',
        biddingCurrency: this.auctionData.currency ? this.auctionData.currency : ''

      },
      shedule: {
        startDate: this.auctionData.startDate ? this.auctionData.startDate : '',
        endDate: this.auctionData.endDate,
      },
      supplier: [{ ...this.supplierData }],
      item: this.items,
      flag: 'supplier'
    }
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-lg';
    objMatDialogConfig.data = {
      dialogMessage: "Print Preview",
      tab: 'Print-Preview',
      dialogNegativeBtn: "Close",
      data: printViewObj
    }
    objMatDialogConfig.disableClose = true;
    let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
    refMatDialog.afterClosed().pipe(takeWhile(() => this.componentActive)).subscribe((value) => {
    })
  }

  refreshButt() {
    switch (this.viewFlag) {
      case 'item':   // Summary page
        this.supplieritemview.getSupplierBiddingList();
        break;
      case 'bid':    // Bid History Page
        this.supplierbidview.getBidHistory();
        break;
      default:
      // code block
    }
  }

  getFilterCol(savedCols, originalList) {
    let tmpList = [];
    savedCols.forEach(savObj => {
      originalList.forEach(orgObj => {
        if(savObj.ind == orgObj.ind) {
          orgObj.selected = savObj.selected;
          orgObj.disable = savObj.disable;
          tmpList.push(orgObj);
        }
      });
    });
    return tmpList.length > 0 ? tmpList : originalList;
  }
 
  getSuppFilList() {
    this.buyerService.getCustomFilList(this.auctionID).subscribe((res: any) => {
        if(res['data'] && res['data']['filterColumn'] && res['data']['filterColumn'].length > 0){
          let findNew = this.commonservice.arrCompare(this.supplierservice.suppFilCol, res['data']['filterColumn']);
          this.supplierservice.suppFilCol = this.getFilterCol(res['data']['filterColumn'], this.supplierservice.suppFilCol);
          // this.supplierservice.suppFilCol = res['data']['filterColumn'];
          this.supplierservice.suppFilCol.forEach(obj => {
            if(obj['display_name']) {
              obj['item_text'] = obj['display_name'];
              delete obj['display_name']; // Delete old key 
            }
          });
          if (findNew && findNew.length > 0) {
            findNew.forEach(element => {
              element.ind = (this.supplierservice.suppFilCol.length - 1) + 1
              this.supplierservice.suppFilCol.push(element);
            });
          }
        }
        this.checkProcess1();
        this.supplieritemview.refreshTableHead();
        this.filColumnAddField();
        // debugger;
        // this.additionMultiplicationFactor;
        if (!this.additionMultiplicationFactor) {
          this.supplierservice.suppFilCol = this.supplierservice.suppFilCol.filter(obj => 
            obj.item_id != 'cost-weightage' && obj.item_id != 'landedCost' && obj.item_id != 'totalLandedCost'
          );
        }
    }, (err) => {});
  }
  goBack() {
      this.router.navigate([routerconfig.supplier_router_links.PARTICIPANT_LIST_VIEW], { queryParams: { status: 'All' } });
  }

  loadCom() {
    let loadPag = '';
    if(this.currentURL.indexOf(routerconfig.supplier_router_links.PARTICIPANT_SUMMARY_VIEW) != -1){
      loadPag = 'item';
    } else if(this.currentURL.indexOf(routerconfig.supplier_router_links.PARTICIPANT_BID_HIS_VIEW) != -1){
      loadPag = 'bid';
    }
    return loadPag;
  }

  changeRoute() {
    switch(this.viewFlag) {
      case 'item':   // Summary page
      this.router.navigate([routerconfig.supplier_router_links.PARTICIPANT_SUMMARY_VIEW+'/'+this.auctionID]);
        break;
      case 'bid':    // Bid History Page
      this.router.navigate([routerconfig.supplier_router_links.PARTICIPANT_BID_HIS_VIEW+'/'+this.auctionID]);
        break;
      default:
    }
  }

  filColumnAddField() {
    let res = this.supplieritemview.customfieldList;
    if (res && res.length > 0) {
      this.suppcheckIsAvaCus(res);
      res.forEach(element => {
        let filcol = {
          ind: (this.supplierservice.suppFilCol.length - 1) + 1,
          item_id: element.fieldName,
          item_text: element.fieldName,
          selected: false,
          disable: true,
          customField: true
        };
        const existingIds = this.supplierservice.suppFilCol.map((added) => added.item_id);
        if (!existingIds.includes(filcol.item_id)) {
          this.supplierservice.suppFilCol.push(filcol);
        }
      });
    }
  }

  suppcheckIsAvaCus(cusArr){
		this.supplierservice.suppFilCol.forEach((element:any,i) => {
			if(element.customField && cusArr.filter(obj=> obj.fieldName == element.item_id).length == 0){
				this.supplierservice.suppFilCol.splice(i,1);
			}
    });
  }
  oncli() {
    this.commonservice.supplierRedirectLanding();
  }

  checkProcess1() {
    this.refreshPriRan();
    // if (this.auctionData.infoShownToSupplier == config.supplierShown.price) {
    //   // hide rank fileds
    //   this.supplierservice.suppFilCol[this.supplieritemview.getColumnsInd('rank')]['disable'] = true;
    // } else if (this.auctionData.infoShownToSupplier == config.supplierShown.rank) {
    //   // hide price fileds
    //   this.supplierservice.suppFilCol[this.supplieritemview.getColumnsInd('itemsBestBid')]['disable'] = true;
    //   this.supplierservice.suppFilCol[this.supplieritemview.getColumnsInd('itemsBestBidUnitCost')]['disable'] = true;
    // } 
    this.supplieritemview.checkPriceRank();
  }

  refreshPriRan() {
    // this.supplierservice.suppFilCol[this.supplieritemview.getColumnsInd('itemsBestBid')]['disable'] = false;
    // this.supplierservice.suppFilCol[this.supplieritemview.getColumnsInd('itemsBestBidUnitCost')]['disable'] = false;
    // this.supplierservice.suppFilCol[this.supplieritemview.getColumnsInd('rank')]['disable'] = false;
    this.supplierservice.suppFilCol.forEach(col => {
      col.disable = false;
    });
  }

  ngOnDestroy() {
    try {
      if (this.supplieritemview.userinfosocket) {
        this.supplieritemview.userinfosocket.unsubscribe();
      }
      this.socketService.callUserInfo = true;
    } catch (e) { }
    
    this.store.dispatch(new supplierBiddingModuleActions.ClearSupplierBiddingModuleData(true));
    this.componentActive = false;
  }
  aucClosePopup (ev) {
    const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-xs';
        objMatDialogConfig.data = {
          dialogMessage: this.common_btn['THANK_U'],
          dialogContent: this.common_btn['AUC_CLOSED_TQ'],
          tab: 'confirm_msg',
          dialogPositiveBtn: "Ok"
        }
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
        refMatDialog.afterClosed().subscribe((value) => {});
  }
  headerApiRefresh(eve) {
    this.getAuctionDetails(this.auctionID);
  }

  ClickedOut(eve) {
    if (!eve.target.closest(".filter-dropdown") && this.customDisview && this.customDisview.itemboundClick) { 
     this.customDisview.itemboundClick = false;
     this.customDisview.saveItemCustFil();
    }
   }
  
}