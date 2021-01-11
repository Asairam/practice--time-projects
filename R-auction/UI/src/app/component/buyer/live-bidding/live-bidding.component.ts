import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerBiddingService } from '../../component-service/buyer-bidding.service';
import { CommonService } from 'src/app/commonService/common.service';
import { SocketService } from '../../socketService/socket.service';
import * as config from '../../../appConfig/app.config';
import { ItemViewComponent } from '../live-bidding/item-view/item-view.component';
import { CountdownComponent } from 'ngx-countdown';
import { Subject, Subscription } from 'rxjs';
import { SupplierMatrixViewComponent } from './supplier-matrix-view/supplier-matrix-view.component';
import { BidhistoryComponent } from './activity/bidhistory/bidhistory.component';
import 'rxjs/add/operator/takeUntil';
import { ChatBotComponent } from 'src/app/shared/component/chat-bot/chat-bot.component';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { BuyerEditService } from '../../component-service/buyer-edit.service';
import { AuthService } from '../../../authService/auth.service';
import { LiveAuditLogComponent } from './live-audit-log/live-audit-log.component';
import * as routerconfig from '../../../appConfig/router.config';
import { EditService } from '../edit/edit.service';
/* NgRx */
import { Store, select} from '@ngrx/store';
import * as fromLiveBiddingModule from './state/live-bidding-module.reducer';
import * as liveBiddingModuleActions from './state/live-bidding-module.actions';
import { takeWhile } from 'rxjs/operators';
import * as fromAppModule from '../../../state/app.reducer';
import { CustomDisColumnsComponent } from 'src/app/shared/component/custom-dis-columns/custom-dis-columns.component';
import { SummaryService } from './item-view/summary.service';


@Component({
  selector: 'app-live-bidding',
  templateUrl: './live-bidding.component.html',
  styleUrls: ['./live-bidding.component.css'],
  providers: [EditService,SummaryService]
})

export class LiveBiddingComponent implements OnInit {

  afMfEnabled: boolean = false;
  supplierInviteList = [];
  @ViewChild(CustomDisColumnsComponent) private customDisview: CustomDisColumnsComponent;
  participantAdditionApplicable: Boolean = false;
  participantAdditionEnabled: Boolean = false;
  sealActive: boolean = true;
  arrfil:any;
  sealedBidDis = false;
  componentActive: boolean = true;
  // backUpCusfilterlist = [];
  polling: any;
  supplierListForCurrency: any;
  primaryCurrency: any;
  timeRemainingToOpen: any;
  auctionID: number;
  auctionData: any;
  auctionListData: any;
  bidSocket: any;
  timeSocket: Subscription;
  destroyaucdata: Subscription;
  playButt = true;
  pauseButt = false;
  chatMessage = false;
  downButt: boolean = false;
  aucStatus
  @ViewChild(ItemViewComponent) private itemview: ItemViewComponent;
  @ViewChild(ItemViewComponent) private select_sav: ItemViewComponent;
  @ViewChild(SupplierMatrixViewComponent) private matrixview: SupplierMatrixViewComponent;
  @ViewChild(CountdownComponent) counter: CountdownComponent;
  @ViewChild(ChatBotComponent) private chatView: ChatBotComponent;
  @ViewChild(BidhistoryComponent) private bidView: BidhistoryComponent;
  @ViewChild(LiveAuditLogComponent) private auditView: LiveAuditLogComponent;
  destroySubcriptions$: Subject<boolean> = new Subject<boolean>();
  auctionStatusList = config.AUCTIONSTATUS;
  socketData: any = { status: '', startDate: '', endDate: '', seconds: 0, supplierStatus: '', currentDate: '' };
  viewFlag: any;
  openActivity = false;
  viewTyp = !this.common.isMobile ? 'list' : 'card';
  chatDisplay = false;
  translateSer: any;
  reportType: any;
  report = [
    { value: 'singleSource', viewValue: 'Single Source' },
    { value: 'bestCase', viewValue: 'Best Cost Outcome' },
  ];
  supplierList: any[];
  chatNotification = [];
  matrixSocket: any;
  bestBidInfo = config.BESTBIDINFO;
  buyer_savings_drop = config.BUYER_SAVINGS;
  buyer_savings: any;
  selectedSavings: any;
  current_total_bid: any;
  single_source_totalCost: any;
  playPauseDis = false;
  commonheader: any;
  decimalplace: any;
  constructor(public route: ActivatedRoute, public bidService: BuyerBiddingService, private auth: AuthService,
    private dialog: MatDialog, public common: CommonService, private socketService: SocketService, private router: Router,
    private buyerService: BuyerEditService,
    private editService: EditService, private store: Store<fromLiveBiddingModule.LiveBiddingModuleState>,
    private summaryservice:SummaryService) {
    this.route.params.subscribe(params => {
      this.auctionID = params['id'] ? +params['id'] : null;
    });
    this.common.translateSer('STATUS_DETAILS').subscribe(async (text: string) => {
      this.translateSer = text;
    });
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.commonheader = text;
    });
  }

  closeChat() {
    try {
      this.chatDisplay = (this.chatDisplay) ? false : true;
      this.chatMessage = false;
    } catch (e) {
      this.common.error(e);
    }
  }

  ngOnInit() {
    this.common.getConfigDetails();

		this.store.pipe(select(fromAppModule.getAuctionConfigOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionConfig => {
			if(auctionConfig && auctionConfig.features) { 
				this.afMfEnabled = auctionConfig.features.currency;
        this.participantAdditionEnabled = auctionConfig.features.participantLive;
			}
		});
    this.store.pipe(select(fromLiveBiddingModule.getAuctionStatus), 
      takeWhile(() => this.componentActive)).subscribe(auctionStatus => {
			if( auctionStatus == 'suspended') {
        console.log('suspended');
			}
			if(auctionStatus == 'published') {
        console.log('published');
			}
			if(auctionStatus == 'paused') {
      }
      if(auctionStatus == 'draft') {
        console.log('draft');
      }

      this.participantAdditionApplicable = auctionStatus == 'open';
      this.aucStatus = auctionStatus;
    });
    this.store.pipe(select(fromLiveBiddingModule.getLiveBiddingModuleSealedbidDataShowHide), 
     takeWhile(() => this.sealActive)).subscribe(auctionSeal => {
        console.log(auctionSeal,'auctionSeal')
        this.sealedBidDis = auctionSeal;
      });

    try {
      this.bidService.BestBidInformationShownBasedOn = this.bestBidInfo[1];
      this.getAllAPIData();
      this.getSocketData();
    }
    catch (e) {
      this.common.error(e);
      this.common.loader = false;

    }
  }

  getAllAPIData() {
    // this.common.loader = true;
    this.bidService.getLiveBidDetails(this.auctionID).takeUntil(this.destroySubcriptions$).subscribe((res) => {
      this.primaryCurrency = res[0]["data"].primaryCurrencyNew || res[0]["data"].primaryCurrency;
      this.supplierListForCurrency = res[1]["data"].supplierList;
      this.viewFlag = "item";
      this.common.currentURLParams = 'item';
      this.getAuctionData(res[0]["data"]);
      this.getparticipateSupplierList(this.auctionID);
      this.suppProcess(res[1]["data"].supplierList);
      let isHost;
      if (this.auth.getUserData().email !== res[0]["data"].auctionLeader.email) {
        isHost = true;
      } else {
        isHost = false;
      }
      // let isHost = this.auth.getUserData().email !== res[0]["data"].auctionLeader.email ? true : false;
      this.common.auctionLeader = Object.assign({ 'host': isHost }, res[0]["data"].auctionLeader);
    }, (err) => {
      this.common.error(err);
      this.common.loader = false;
    })
  }

  goto() {
    this.router.navigate([routerconfig.buyer_router_links.EDIT_AUCTION + '/' + this.auctionID], { queryParams: { status: this.socketData.status } });
  }


  getAuctionData(data) {
    try {
      this.auctionData = data;
      this.store.dispatch(new liveBiddingModuleActions.SetStatusAndRepublishRequired({ 
        republishRequired: data.republishRequired,
        status: data.status.toLowerCase(),
        primaryCurrency: data.primaryCurrencyNew
      }));
      this.socketData = this.auctionData;
      this.bidService.matrixColumn = this.viewFlag;
      this.decimalplace = "0.0-" + data.currencyDecimalPlace;
      this.currhideshow();

      this.getRemainingTime();
      let minutes = this.common.dateTimeFilter(new Date(this.socketData.startDate), new Date(this.socketData.currentDate)).minutes;
      if (this.socketData.status == this.auctionStatusList.PB && minutes > 0 && minutes <= 10) {
        this.socketData.seconds = 0;
        this.socketData.status = this.auctionStatusList.PD;
      } else if (this.socketData.status === this.auctionStatusList.PA) {
        let enddate = new Date(this.socketData.endDate).getTime();
        let startdate = new Date(this.socketData.startPauseDate).getTime();
        this.socketData.seconds = (enddate - startdate) / 1000;
        setTimeout(() => {
          this.counter.pause();
        }, 1);
        this.pauseButt = true;
        this.playButt = false;
      } else if (this.socketData.status == this.auctionStatusList.CO) {
        this.socketData.seconds = 0;
      } else if (this.socketData.status == this.auctionStatusList.PB) {
        this.socketData.seconds = 0;
      } else if (this.socketData.status == this.auctionStatusList.OP) {
        this.onSelectedTab();
      }
      this.common.commonStatus = this.socketData.status;
      this.getFilterSavColumn(data);
      if (this.socketData.status !== this.auctionStatusList.OP) {
        this.getItemFilList();
      }
      this.setSealedBidState();
      this.buyerSavFun();
      this.bestbidinfo()
      this.savingsCal();
    }
    catch (ex) {
      this.common.error(ex);
      this.common.loader = false;
    }
  }

  getRemainingTime() {
    let currentDateinSec = (new Date()).getTime() / 1000;
    let startDateinSec = (new Date(this.socketData.startDate)).getTime() / 1000;
    this.timeRemainingToOpen = currentDateinSec - startDateinSec;
  }

  getSocketData() {
    this.timeSocket = this.socketService.getSocketData(this.auctionID)
      .subscribe(data => {
        this.store.dispatch(new liveBiddingModuleActions.SetStatusAndRepublishRequired({ 
          republishRequired: data.republishRequired,
          status: data.status.toLowerCase() 
        }));
        this.socketData = data;
        if (this.socketData.status == this.auctionStatusList.CO) {
          this.aucClosePopup();
          this.socketData.seconds = 0;
          this.setSealedBidState();
          Object.assign(this.socketData,{isSealedBidAuction:this.auctionData.isSealedBidAuction});
          // if(this.auctionData.isSealedBidAuction) {
          //   this.checkSealedBidFun();
          //   this.issealedbidAucCloseShowSupplierOriginalName();
          // }
        } else if (this.socketData.status == this.auctionStatusList.PA) {
          setTimeout(() => {
            this.counter.pause();
          }, 1);
          this.pauseButt = true;
          this.playButt = false;
        } else {
          this.pauseButt = false;
          this.playButt = true;
        }
        this.onSelectedTab();
        this.common.commonStatus = this.socketData.status;

      });

    // this.bidSocket = this.socketService.getBidSocketData(this.auctionID, 'buyer').subscribe(data => {
    //   if (this.viewFlag == "item") {
    //     // debugger;
    //     this.itemview.getItemData(data[0], true);
    //     this.common.playAudio();
    //   }
    // })

    this.matrixSocket = this.socketService.getMatrixSocketData(this.auctionID).subscribe(data => {
      if (this.viewFlag == "supplier") {
        this.matrixview.getBuyerMatrixData(data);
        this.matrixview.matrixSupplierNameSuffle();
      }
    })
  }

  getSupplierDetails(data) {
    try {
      let resData= data.filter((obj)=>obj.status.toLowerCase() !== 'suspended');
      data.forEach((supplier,i) => {
        if (!supplier["supplierCurrency"]) {
          supplier.supplierCurrency = { currencyCode: "INR", currencyName: "Indian Rupee" };
          supplier.supplierAF = 0;
          supplier.supplierMF = 0;
        }
        this.getChatData(supplier.supplierID, supplier);
        if(this.sealedBidDis) {
          supplier.supplierName1 = 'Participant '+ (i+1)
        }
      });
      this.bidService.supplierDetails = [...resData];
      this.supplierList = [...resData];
      this.supplierInviteList = data;
    }
    catch (ex) {
      this.common.error(ex);
      this.common.loader = false;
    }
  }

  getChatData(vendorCode, supplier) {
    this.socketService.getQuerySocketData(this.auctionID, vendorCode)
      .subscribe(data => {
        if (this.chatDisplay) {
          this.chatView.getSocketChat(data, vendorCode, supplier);
          this.chatMessage = false;
        }
        else {
          config.chatAudio();
          if (this.chatNotification.length == 0) {
            this.chatNotification.push({ vendorcode: vendorCode })
          }
          else {
            if (this.chatNotification.some(x => x.vendorcode != vendorCode)) {
              this.chatNotification.push({ vendorcode: vendorCode })
            }
          }
          this.chatMessage = true;
        }
      })
  }

  pausePlayButt() {
    if (this.playButt) {
      this.playButt = false;
      this.pauseButt = true;
    } else {
      this.playButt = true;
      this.pauseButt = false;
    }
    this.playPauseDis = true;
    var obj = {
      "auctionID": this.auctionID,
      "type": this.socketData.status === this.auctionStatusList.PA ? 'Resume' : 'Paused'
    };
    this.bidService.pauseResumeAuction(obj).subscribe((res) => {
      if (res['success']) {
        this.playPauseDis = false;
        let dis = obj['type'] == 'Resume' ? 'resume' : 'pause';
        this.common.success("Auction " + dis + " successfully.");
      }
    }, (err) => { });
  }

  openActivityComponent() {
    try {
      var element = document.getElementById("footer-slider");
      element.classList.toggle("slidemsgup");
      if (this.openActivity) {
        this.openActivity = false;
      }
      else {
        this.openActivity = true;
      }
    }
    catch (e) {
      this.common.error(e.message);
    }
  }
  viewType(val) {
    this.itemview.view = val;
    this.viewTyp = val;
    if (this.viewFlag == 'supplier') {
      this.bidService.matrixColumn = this.viewFlag;
    }
  this.currhideshow();

  }

  getReport(val) {
    if (val == 'excel') {
      this.bidService.getBidReportExcel(this.auctionID, this.reportType)
    } else {
      this.bidService.getBidReport(this.auctionID, this.reportType).subscribe(res => {
      })
    }
  }
  goBack() {
    if (this.route.snapshot.params.breadCrumbStatus) {
      this.router.navigate([routerconfig.buyer_router_links.BUYER_LIST_VIEW], { queryParams: { status: this.route.snapshot.params.breadCrumbStatus } });
    } else {
      window.history.back();
    }
  }
  selectBidType(type) {
    this.bidService.BestBidInformationShownBasedOn = type;
  }

  selectBuyerSavType(type) {
    this.buyer_savings = type;
    if (this.viewFlag == 'item') {
      if (this.select_sav) {
        this.select_sav.select_sav_bid = type.key;
      }
    }
    // if (this.viewFlag == 'supplier') { this.matrixview.select_sav_bid = this.buyer_savings_drop[2].key; }
    this.savingsColumns(type);
    this.bidService.savingTypeSubject.next(type);
  }

  getAucDataFromParent(data) {
    this.auctionListData = data;
    this.current_total_bid = data['bestBidEventCost'];
    this.single_source_totalCost = data['totalCost'];
    this.summaryFilColumnAddField();
  }

  getparticipateSupplierList(id) {
    try {
      this.bidService.participateSupplierList(id).subscribe((res) => {
        if(this.auctionData.isSealedBidAuction) {
          if(this.openActivity) {
            this.bidService.participantsArr.forEach((element,i) => {
              if(res['data'].find(obj=>obj.user.userID == element.user.userID)){
                element = res['data'][i]
              }
            });
          } else {
            this.bidService.participantsArr = this.common.getRandomElementsFromArray(res['data']);
          }
        } else {
          this.bidService.participantsArr = res['data'];
        }
        this.bidService.participantsArr.forEach(element => {
          element.lastBid = element.lastBid ? Math.round(element.lastBid) : null;
        });
      });
    } catch (err) { }
  }

  getRemoveSupplier(eve) {
    if (eve) {
      this.getSupplierList();
      this.getparticipateSupplierList(this.auctionID);
    }
  }

  openSupplierCurrency() {
    let supplierData = [];
    this.supplierList.forEach((data) => {
      let currencyData = this.auctionData["currency"].find(x => x.currencyCode == data.supplierCurrency.currencyCode);
      supplierData.push({ supplierID: data.supplierID, supplierName: data.supplierName1, supplierCurrency: currencyData });
    })
    let sendData = {
      flag: 'openAttach',
      pageFrom: 'supplier_currency',
      data: { supplierData: supplierData, currency: this.auctionData["currency"], decimalValue: this.auctionData["currencyDecimalPlace"], primaryCurrency: this.auctionData["primaryCurrencyNew"] }
    }
    this.common.toggleDiv.emit(sendData);
  }

  queryDialog() {
    let dialogData = {
      flag: 'openAttach',
      pageFrom: 'queryHistory',
      sealedBid: this.auctionData.isSealedBidAuction,
      data: {
        auctionID: this.auctionID,
        auctionData: null,
        // supplierList: this.supplierList,
        chat: "offline"
      }
    };
    this.common.toggleDiv.emit(dialogData);
  }


  forceClose() {
    let objDtls = {
      auctionID: this.auctionID,
      type: "closeAuction"
    }
    if (this.socketData.status == this.auctionStatusList.OP) {
      this.buyerService.updateStatusOpenClose(objDtls).subscribe((res: any) => {
        if (res['success']) {
          this.playButt = false;
          this.pauseButt = false;
          this.socketData.status = this.auctionStatusList.CO;
          this.common.success('Auction closed successfully.');
        }
      });
    }
  }

  confirmPopup(val) {
    var msg;
    switch (val) {
      case 'pauseButt':
        msg = this.translateSer['MSG_CAP_STA']['PAUSE'];
        break;
      case 'playButt':
        msg = this.translateSer['MSG_CAP_STA']['RESUME'];
        break;
      case '':
        msg = this.translateSer['MSG_CAP_STA']['CLOSE'];
        break;
      default:
      // code block
    }
    try {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-xs';
      objMatDialogConfig.data = {
        dialogMessage: this.commonheader['PLZ_CON'],
        dialogContent: this.commonheader['DO_U_W_T']['DO'] + msg + this.commonheader['DO_U_W_T']['AUC'],
        tab: 'confirm_msg',
        dialogPositiveBtn: "Yes",
        dialogNegativeBtn: "No"
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.dialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        if (value) {
          if (val) {
            this.pausePlayButt();
          } else {
            this.forceClose();
          }
        }
      });
    } catch (e) { }
  }

  refreshButt(bol) {
    switch (this.viewFlag) {
      case 'item':   // Summary page
        this.itemview.autoRefreshItemBidDetails();
        if (this.openActivity && !bol) {
          this.getparticipateSupplierList(this.auctionID);
        }
        break;
      case 'supplier': // Matrix Page
        this.matrixview.getMatrixAPI();
        break;
      case 'bid':    // Bid History Page
        this.bidView.getbiddata().then(result => {
          this.bidView.onOptionsSelected();
        });
        break;
      case 'auditLog':    // Audit Log Page
        if (bol) {
          this.auditView.getAuditList();
        }
        break;
      default:
      // code block
    }
  }

  autoRefreshApi() {
    // if (this.viewFlag == 'item') {
    // Observable.timer(0, 6000)
    //   .takeWhile(() => this.alive)
    //   .subscribe(() => {
    //     this.common.loader = false;
    //     if (this.common.internetConn) {
    //       // this.itemview.getItemBidDetails();
    //       this.refreshButt(false);
    //     }
    //   });
    // }
    this.polling = setInterval(() => {
      this.common.loader = false;
      if (this.common.internetConn) {
        this.autoRefreshgetAuctionData().then(() => {
          this.refreshButt(false);
        });
      }
    }, 6000);
  }


  getBidHistoryReport() {
    let token = this.auth.getTokenValue();
    let id = this.auctionID + '?token=' + token;
    this.bidService.getBidHistoryExcel(id);
    //this.downButt = true;

    // return this.getBidHistoryReport.('pnc/auction/vendor/api/buyer/bidhistoryReportExcel/:auctionID');
  }



  onSelectedTab() {
    this.openActivity = false;
    // this.bidService.matrixColumn = this.viewFlag;
    if (this.viewFlag != 'item') {
      var element = document.getElementById("footer-slider");
      element.classList.remove("slidemsgup");
    } else {
      this.getItemFilList();
    }
    clearInterval(this.polling);
    if (this.socketData.status == this.auctionStatusList.OP) {
      this.autoRefreshApi();
    }
    this.common.currentURLParams = this.viewFlag;
  }

  onclickMenu() {
    try {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-lg';
      objMatDialogConfig.data = {
        dialogMessage: "Select Columns",
        tab: 'dynamicMenu'
      }
      objMatDialogConfig.width = "500px";
      objMatDialogConfig.height = "250px";
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.dialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {

      });
    } catch (e) {

    }
  }

  autoRefreshgetAuctionData() {
    return new Promise((resolve, reject) => {
      this.destroyaucdata = this.bidService.getAuctionDataById(this.auctionID).subscribe((res: any) => {
        if (res['success']) {
          this.auctionData = res['data'];
          this.savingsCal();
         this.buyerSavFun();
          resolve();
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  redirectToEdit2(val, status, addParticipant) {
    let newObj = {
      ...val,
      status: status
    }
    if(addParticipant) newObj.addParticipant = true;
    this.editService.redirectToEdit(newObj)
  }
  savingsFiter() {
    this.savingsCal();
    var obj = {
      auctionID: this.auctionID,
      savingFilterName: this.buyer_savings.savingFilter
    }
    this.bidService.filterSavingAuction(obj).subscribe((res: any) => {
      if (res['success']) {

      }
    }, (err) => {
    });
  }

  savingsColumns(type) {
    let arr = this.bidService.columnNames;
    if (type.key === 0) {
      this.common.cardViewDisCol(arr, 'PreliminaryBidCost').selected = true;
      this.common.cardViewDisCol(arr, 'PreliminaryBidCostTotalValue').selected = true;
    } else {
      this.common.cardViewDisCol(arr, 'PreliminaryBidCost').selected = false;
      this.common.cardViewDisCol(arr, 'PreliminaryBidCostTotalValue').selected = false;
    }
    if (type.key === 1) {
      this.common.cardViewDisCol(arr, 'IntialBidCost').selected = true;
      this.common.cardViewDisCol(arr, 'IntialBidCostTotalValue').selected = true;
    } else {
      this.common.cardViewDisCol(arr, 'IntialBidCost').selected = false;
      this.common.cardViewDisCol(arr, 'IntialBidCostTotalValue').selected = false;
    }
    if (type.key === 2) {
      this.common.cardViewDisCol(arr, 'BaselineUnitCost').selected = true;
      this.common.cardViewDisCol(arr, 'Baseline').selected = true;
    } else {
      this.common.cardViewDisCol(arr, 'BaselineUnitCost').selected = false;
      this.common.cardViewDisCol(arr, 'Baseline').selected = false;
    }
  }

  getFilterSavColumn(data) {
    let filterType = 'initial';
    if (data.savingFilterName) {
      filterType = data.savingFilterName
    }
    let findIndex = this.buyer_savings_drop.findIndex(obj => obj.savingFilter.toLowerCase() === filterType.toLowerCase());
    this.buyer_savings = this.buyer_savings_drop[findIndex];
    this.selectedSavings = this.buyer_savings_drop[findIndex];
    this.selectBuyerSavType(this.buyer_savings);
  }




  getItemFilList() {
    this.buyerService.getCustomFilList(this.auctionID).subscribe((res: any) => {
      this.arrfil = res['data'];
      if (res['data'] && res['data']['filterColumn'] && res['data']['filterColumn'].length > 0) {
        let findNew = this.common.arrCompare(this.bidService.columnNames, res['data']['filterColumn']);
        this.bidService.columnNames = res['data']['filterColumn'];
        if (findNew && findNew.length > 0) {
          findNew.forEach(element => {
            element.ind = (this.bidService.columnNames.length - 1) + 1
            this.bidService.columnNames.push(element);
          });
        }
      }
      if (!this.afMfEnabled) {
        this.bidService.columnNames = this.bidService.columnNames.filter(obj => 
          obj.item_id != 'LandedUnit' && obj.item_id != 'TotalLanded' 
        );
      }
      this.savingsColumns(this.buyer_savings);
      if(this.auctionData.isSealedBidAuction) {
        this.checkSealedBidFun();
      }
    }, (err) => { });
  }

  summaryFilColumnAddField() {
    let res = this.itemview.customfieldList;
    if (res && res.length > 0) {
      this.checkIsAvaCus(res);
      res.forEach(element => {
        let filcol = {
          ind: (this.bidService.columnNames.length - 1) + 1,
          item_id: element.fieldName,
          item_text: element.fieldName,
          selected: false,
          disable: false,
          customField: true
        };
        const existingIds = this.bidService.columnNames.map((added) => added.item_id);
        if (!existingIds.includes(filcol.item_id)) {
          this.bidService.columnNames.push(filcol);
        }
      });
      // this.backUpCusfilterlist = [...this.bidService.columnNames];
    }
  }

  checkIsAvaCus(cusArr) {
    this.bidService.columnNames.forEach((element, i) => {
      if (element.customField && cusArr.filter(obj => obj.fieldName == element.item_id).length == 0) {
        this.bidService.columnNames.splice(i, 1)
      }
    });
  }

  checkSealedBidFun(){
    let filNoBid = {
      ind: (this.bidService.columnNames.length - 1) + 1,
      item_id: 'numberOfBids',
      item_text: 'No of Bids',
      selected: true,
      disable: false
    };
    const existingIds = this.bidService.columnNames.map((added) => added.item_id);
    if (!existingIds.includes(filNoBid.item_id) && this.viewFlag == 'item') {
      this.bidService.columnNames.push(filNoBid);
    }

    this.bidService.columnNames.forEach(element => {
       if(!this.bidService.disCol.includes(element.item_id)){
        if (this.socketData.status == this.auctionStatusList.CO) {
            element.disable = false;
         } else {
           element.disable = true;
         }
      } else {
          if(!this.arrfil) {
            element.selected = true;
          }
      }
    });
  }
  onRo() {
    this.common.buyerRedirectLanding();
  }
  onRoCli() {
    this.router.navigate([routerconfig.buyer_router_links.LIVE_AUCTION]);
  }

  getSupplierList() {
    this.buyerService.getSupplierDetails(this.auctionID).subscribe((res:any)=>{
      if(res.success) {
        this.suppProcess(res["data"].supplierList);
      }
  },err=>{ });
}
ngOnDestroy() {
  this.componentActive = false;
  this.sealActive = false;
  try {
    this.destroySubcriptions$.next(true);
    this.destroySubcriptions$.complete();
    this.chatNotification.length = 0;
    this.bidService.columnNames = [];
    this.bidService.displayedColumns = [];
    this.bidService.columnNamesMatrix = [];
    this.bidService.columnNamesItem = [];
    this.common.refreshAuctionLeader();
    if (this.timeSocket) {
      this.timeSocket.unsubscribe();
    }
    if (this.destroyaucdata) {
      this.destroyaucdata.unsubscribe();
    }
    this.common.loader = true;
    clearInterval(this.polling);
    this.bidService.participantsArr = [];
  } catch (e) {
    this.common.error(e);
  }
}

getColumnsInd(field) {
  if(this.common.inArrFindColInd(this.bidService.columnNames,field) != -1) {
    return this.common.inArrFindColInd(this.bidService.columnNames,field);
  }
}

currhideshow() {
  if(this.getColumnsInd('LandedUnit')) {
  if (this.auctionData && this.auctionData.currency && this.auctionData.currency.length > 1) {
    this.bidService.columnNames[this.getColumnsInd('LandedUnit')].selected = true;
    this.bidService.columnNames[this.getColumnsInd('TotalLanded')].selected = true;
    this.bidService.columnNames[this.getColumnsInd('CurrentBidUnitCost')].selected = false;
    this.bidService.columnNames[this.getColumnsInd('CurrentBid')].selected = false;
    this.bidService.columnNames[this.getColumnsInd('LandedUnit')].disable = false;
    this.bidService.columnNames[this.getColumnsInd('TotalLanded')].disable = false;
  }
  else {
    if (this.auctionData.currency[0].currencyCode == this.auctionData.primaryCurrency) {
      this.bidService.columnNames[this.getColumnsInd('LandedUnit')].disable = true;
      this.bidService.columnNames[this.getColumnsInd('TotalLanded')].disable = true;
    }
  }
}
}
suppProcess(res) {
  if(this.sealedBidDis) {
    let arr = this.common.getRandomElementsFromArray(res);
    this.getSupplierDetails(arr);
   } else {
     this.getSupplierDetails(res);
   }
}
buyerSavFun(){
  this.buyer_savings_drop[0]['totalValue'] = this.auctionData.preliminaryBid;
  this.buyer_savings_drop[1]['totalValue'] = this.auctionData.initialBid;
  this.buyer_savings_drop[2]['totalValue'] = this.auctionData.historicalBid;
 }

 bestbidinfo() {
  this.bidService.BestBidInformationShownBasedOn = this.bestBidInfo.find(obj => obj.value.toLowerCase() === this.auctionData.bestBidInfoShownBy.toLowerCase());
  if(this.auctionData.bestBidInfoShownBy.toLowerCase() === this.bestBidInfo[0].value.toLowerCase()) {
    this.bidService.columnNames[this.getColumnsInd('SupplierOrganization')].selected = true;
  }
 }
aucClosePopup () {
  const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-xs';
      objMatDialogConfig.data = {
        dialogMessage: this.commonheader['THANK_U'],
        dialogContent: this.commonheader['AUC_CLO'],
        tab: 'confirm_msg',
        dialogPositiveBtn: "Ok"
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.dialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        if(this.auctionData.isSealedBidAuction) {
          window.location.reload();
        }
      });
}

setSealedBidState() {
  this.store.dispatch(new liveBiddingModuleActions.SealedBidModeDataHideShow(
    this.auctionData.isSealedBidAuction && this.socketData.status !== this.auctionStatusList.CO ? true : false
  ));
}
ClickedOut(eve) {
  if (!eve.target.closest(".filter-dropdown") && this.customDisview && this.customDisview.itemboundClick) { 
   this.customDisview.itemboundClick = false;
   this.customDisview.saveItemCustFil();
  }
 }

 savingsCal() {
  this.summaryservice.callHeaderLevel(this.buyer_savings,this.auctionData);
 }
 
  issealedbidAucCloseShowSupplierOriginalName(){
    if (this.auctionData && this.auctionData.isSealedBidAuction) {
      this.getSupplierList();
      if (this.viewFlag === 'supplier') {
        setTimeout(() => {
          this.matrixview.matrixSupplierNameSuffle();
        }, 2000);
      }
    }
  }

  isSealedbidShufflePar() {
    if (this.sealedBidDis) {
      if (this.viewFlag !== 'supplier') {
        // if (this.socketData.status == this.auctionStatusList.OP || this.socketData.status == this.auctionStatusList.PA) {
        //   setTimeout(() => {
        //     this.matrixview.ifSealedBidMatrixAPI().then(() => {
        //       this.bidService.matrixColumn = this.viewFlag;
        //     });
        //   }, 500);
        // } else {
        //   setTimeout(() => {
        //     this.matrixview.getMatrixAPI();
        //     this.matrixview.matrixSupplierNameSuffle();
        //   }, 500);
        // }
        // return;
        this.getSupplierList();
      }else {
        return;
      }
    }
    this.bidService.matrixColumn = this.viewFlag;
  }

}
