import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { SupplierService } from '../../../component-service/supplier.service';
import { CommonService } from '../../../../commonService/common.service';
import * as api from '../../../../../environments/environment'
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from '../../../../shared/component/view-popup/view-popup.component';
import { SocketService } from '../../../socketService/socket.service';
import * as config from '../../../../appConfig/app.config';
import { Subscription } from 'rxjs';
import { BuyerEditService } from 'src/app/component/component-service/buyer-edit.service';
import { FormControl } from '@angular/forms';
import * as routerconfig from '../../../../appConfig/router.config';
import { SupplierItemViewService } from './supplier-item-view.service';
import { SuppItemPopupViewOnlyComponent } from '../supp-item-popup-view-only/supp-item-popup-view-only.component';
import { SuppAuctionAcceptPopupComponent } from '../supp-auction-accept-popup/supp-auction-accept-popup.component';


/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromSupplierBiddingModule from '../../supplier-bidding/state/supplier-bidding.reducer';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-supplier-item-view',
  templateUrl: './supplier-item-view.component.html',
  styleUrls: ['./supplier-item-view.component.css'],
  providers: [SupplierItemViewService]
})
export class SupplierItemViewComponent implements OnInit, OnDestroy {

  showTakeLead = false;
  additionMultiplicationFactor = false;
  exchangeRate = null;
  bestBidInfo = config.BESTBIDINFO;
  @Output() aucCloseShowPopup: EventEmitter<String> = new EventEmitter<String>();
  takeLeadEnabled: boolean = false;
  takeLeadApplicable: boolean = false;
  componentActive: boolean = true;
  polling1: any;
  @Input() socketendpoint;
  @Output() headerApiRef: EventEmitter<String> = new EventEmitter<String>();
  @Output() sendSocketData: EventEmitter<String> = new EventEmitter<String>();
  @Output() sendAuctionData: EventEmitter<String> = new EventEmitter<String>();
  @Output() acceptData: EventEmitter<String> = new EventEmitter<String>();
  @Input() supplierData = null;
  auctionID: any;
  currencyData = {
    selectCurrencyCode: null,
    exchangeRate: []
  }
  errorFlag = false;
  price = false;
  rank = false;
  imageURL = api.environment.rauction;
  supplierBiddingSource = [];
  auctionData: any;
  current_total_bid: number;
  vendorcode = JSON.parse(localStorage.getItem('userdata')).settings.ril.vendorcodeSelected;
  decimalplace: any;
  decimalValue: number;
  bidFlag: boolean = false;
  bestBidInfoShownBy = '';
  supplier
  common_btn: any;
  timeSocket: Subscription;
  socketData: any = { status: '', startDate: '', endDate: '', supplierStatus: '', currentDate: '' };
  acceptFlag: any = false;
  auctionStatusList = config.AUCTIONSTATUS;
  participate = false;
  showBut = true;
  // @ViewChild(CountdownComponent) counter: CountdownComponent;
  clockStatus = true;
  bidSocket: any;
  status: any = "";
  totalCost = 0;
  auctionRank = null;
  typeView = false;
  view = !this.commonservice.isMobile ? "list" : "card";
  @Input() preBid = [];
  lot_item_data: any;
  biddingCurrency = null;
  aucAmount = "";
  supplierBiddingControlList: any = new Map();
  supplierBiddingAllErrorControlList: any = new Map();
  customfieldList: any = [];
  UNOBS = [];
  userinfosocket: any;
  // intervalCalOnce = true;
  constructor(
    private supplierservice: SupplierService, 
    public buyerService: BuyerEditService, 
    private commonservice: CommonService, 
    private routes: ActivatedRoute, 
    private matDialog: MatDialog, 
    private socketService: SocketService, 
    private router: Router,
    private supplierItemViewService: SupplierItemViewService,
    private store: Store<fromSupplierBiddingModule.SupplierBiddingModuleState>
    ) {
    this.commonservice.translateSer('COMMON').subscribe(async (text: string) => {
      this.common_btn = text;
    });
    this.routes.params.subscribe(params => {
      this.auctionID = params['id'] ? +params['id'] : null;
      // this.backButton(this.auctionID);
      if (this.auctionID) {
        // this.onlineAuc();
        this.supplierdelData();
      }
    });
  }

  ngOnInit() {
    this.store.pipe(select(fromSupplierBiddingModule.getAuctionDetails), 
      takeWhile(() => this.componentActive)).subscribe(auctionDetails => {
        if(auctionDetails) {
          this.takeLeadApplicable = auctionDetails.takeLeadApplicable;
          this.takeLeadEnabled = auctionDetails.takeLeadEnabled;
          this.additionMultiplicationFactor = auctionDetails.additionMultiplicationFactor;
          if(this.acceptFlag && this.takeLeadApplicable && this.takeLeadEnabled) {
            this.showTakeLead = true;
            if(this.additionMultiplicationFactor && this.auctionData && this.auctionData.currency && this.auctionData.currency.length > 1)  {
              this.showTakeLead = false;
            }
            if(this.supplierData && (this.supplierData.supplierAF || this.supplierData.supplierMF)) {
              this.showTakeLead = false;
            }
          } else {
            this.showTakeLead = false;
          }
        }
			
		});
    this.getCustomFields().then((result) => {
      this.customfieldList = result;
      this.getSupplierBiddingData();
    });
    this.socketService.socketReconnect(this.auctionID);
    this.getSocketData();
  }
  getBidTotalValConverted(lot) {
    return lot.singleSourceLandedAtEveryLevel / this.exchangeRate[this.supplierData.supplierCurrency.currencyCode];
  }
  bidDataFlag = false;
  getSupplierBiddingData() {
    if (this.auctionID) {
      let un1 = this.supplierservice.getLiveBidDetails(this.auctionID).subscribe((res: any) => {
        this.auctionData = { ...res.data };
        this.auctionData.currency.forEach(element => {
          if(!this.exchangeRate) this.exchangeRate = {};
          this.exchangeRate[element.currencyCode] = element.exchangeRate;
        });
        this.socketData = { ...res.data };
        this.status = this.socketData.supplierStatus;
        this.currencyData.selectCurrencyCode = this.supplierData.supplierCurrency.currencyCode;
        this.currencyData.exchangeRate = this.auctionData["currency"];
        this.biddingCurrency = this.currencyData.exchangeRate.find(x => x.currencyCode == this.currencyData.selectCurrencyCode);
        // debugger;
        this.sendAuctionData.emit(this.auctionData);
        // if (this.auctionData.infoShownToSupplier == config.supplierShown.price) {
        //   this.price = true;
        // }
        // else if (this.auctionData.infoShownToSupplier == config.supplierShown.rank) {
        //   this.rank = true;
        // }
        // else {
        //   this.price = true;
        //   this.rank = true;
        // }

        let minutes = config.dateTimeFilter(new Date(this.socketData.startDate), new Date(this.socketData.currentDate)).minutes;
        if (this.socketData.status == this.auctionStatusList.PB && minutes > 0 && minutes <= 10) {

          this.socketData.seconds = 0;
          this.socketData.status = this.auctionStatusList.PD;
        }
        this.getSupplierBiddingList();
        this.onSelectedTab();
        // if (this.intervalCalOnce) {
        //   this.onSelectedTab();
        //   this.intervalCalOnce = false;
        // }
        //this.getChatData();
        if (this.status.toLowerCase() != 'invited' && this.socketService.callUserInfo) {
          this.onlineAuc();
        }
      }, (err) => {
        clearInterval(this.polling1);
        // if (this.intervalCalOnce) {
        this.aucView('error', err);
        // }
      })
      this.UNOBS.push(un1);
    }
  }

  getSupplierBiddingList() {
    let un2 = this.supplierservice.getSupplierBiddingList(this.auctionID).subscribe((res: any) => {
      // this.commonservice.loader = true;
      this.bestBidInfoShownBy = res.data[0].bestBidInfoShownBy;
      if (res.data[0].status === 'Open') {
        this.showBut = true;
      } else {
        this.showBut = false;
      }
      this.totalCost = res.data[0].totalCost;
      if (res.data[0]['bids'] && res.data[0]['bids'].length > 0) {
        for (let i = 0; res.data[0]['bids'].length > i; i++) {
          if (res.data[0]['bids'][i]['data']['_id'].toLowerCase() === JSON.parse(localStorage.getItem('userdata'))['email'].toLowerCase()) {
            this.auctionRank = res.data[0]['bids'][i].rank;
          }
        }
      }
      this.supplierBiddingSource = res['data'][0].lots.filter((obj) => {
        return obj.items.length > 0;
      })
      this.lot_item_data = res['data'][0].lots.filter((obj) => {
        return obj.items.length > 0;
      })
      if (this.supplierBiddingControlList.size === 0) {
        this.supplierBiddingSource.forEach(lot => {
          lot.items.forEach(bid => {
            this.supplierBiddingControlList.set(bid.itemID, new FormControl(''));
            this.supplierBiddingAllErrorControlList.set(bid.itemID, new FormControl(''));
          });
        });
      }
      if (this.socketData.status == this.auctionStatusList.CO) {
        this.socketData.seconds = 0;
        this.participate = true;
        // this.acceptFlag = (this.participate && (this.socketData.supplierStatus != this.auctionStatusList.RJ)) ? true : false;
        if (this.participate && (this.socketData.supplierStatus != this.auctionStatusList.RJ)) {
          this.acceptFlag = true;
        } else {
          this.acceptFlag = false;
        }
      } else if (this.socketData.status === this.auctionStatusList.PA) {
        this.bidFlag = true;
        if (this.socketData.supplierStatus == this.auctionStatusList.AC || this.socketData.supplierStatus == this.auctionStatusList.BD) {
          this.acceptFlag = true;
          this.participate = true;
        }
        
        // let enddate = new Date(this.socketData.endDate).getTime();
        // let startdate = new Date(this.socketData.startPauseDate).getTime();
        this.socketData.seconds = this.supplierservice.socketDateFil(this.socketData);
      }
      else if (this.socketData.status == this.auctionStatusList.OP || this.socketData.status == this.auctionStatusList.PB) {
        if (this.socketData.supplierStatus == this.auctionStatusList.AC || this.socketData.supplierStatus == this.auctionStatusList.BD) {
          this.acceptFlag = true;
          this.participate = true;
        }

      }
      this.decimalValue = this.auctionData.currencyDecimalPlace;
      this.decimalplace = "0.0-" + this.decimalValue;
      let totalBestBid;
      this.current_total_bid = 0;
      this.supplierBiddingSource.forEach((element, ind) => {
        totalBestBid = 0;
        element.checkedLot = false;
        element.submitAll = false;
        element.items.forEach(data => {
          data.customFieldData.forEach(customFie => {
            data[customFie.name] = customFie.value
          });
          data.flag = true;
          data.checkedItem = false;
          data.lotID = element.lotID;
          data.amount = "";
          data.amountFlag = true;
          // data.errorFlag = false;
          data.submit = false;
          data.currency = this.auctionData.primaryCurrency;
          data.startPrice = data.startPrice ? data.startPrice/this.exchangeRate[this.supplierData.supplierCurrency.currencyCode] : '';
          totalBestBid += +data.itemsBestBidUnitCost;
          this.current_total_bid += data.itemsBestBidUnitCost ? +data.itemsBestBidUnitCost : 0;
          data.bestBidSH = false;

          if (data.bids && data.bids.length > 0) {
            data.bidsBlink = false;
            data.ownRank = false;

            data.bids.forEach(bid => {
              if (bid.rank === 1) {
                data.bidsBlink = true;
                let exchange = this.auctionData["currency"].find(x => x.currencyCode == bid.data["currency"].currencyCode);;
                data.currencyExchange = exchange;
                data.itemsBestBid = bid.data.landedCost;
              }
              if (bid.data.bidderID === this.vendorcode) {
                data.itemWeight = config.calculateItemWeight({ bestBid: bid.data.baseCost, minimumDesiredQuantity: data.minimumDesiredQuantity }, this.supplierBiddingSource, this.vendorcode);
                data.itemWeight = (data.itemWeight * 100).toFixed(this.auctionData["currencyDecimalPlace"]);
                data.baseCost = bid.data.baseCost;
                if (bid.data.landedCost) {
                  bid.data.landedCost = bid.data.landedCost / this.biddingCurrency.exchangeRate;
                  bid.data.totalLandedCost = bid.data.totalLandedCost / this.biddingCurrency.exchangeRate;
                }
                if (!this.bidDataFlag) {
                  this.bidDataFlag = true;
                }
                data.bestBidSH = true;
                if (bid.rank === 1) {
                  data.ownRank = true
                  //data.itemsBestBid = (bid.data.landedCost) ? bid.data.landedCost : bid.data.baseCost;
                  data.itemsBestBid = bid.data.baseCost;

                }
              }
            });
          }
          // if (this.supplierData) {
          //   if (this.supplierData.selectCurrencyCode != data.currency.currencyCode) {
          //     let bidExchangeRate = this.supplierData.exchange.find(x => x.currencyCode = data.currency.currencyCode);
          //     let selectExchangeRate = this.supplierData.exchange.find(x => x.currencyCode == this.supplierData.selectCurrencyCode);
          //     data.itemsBestBid = config.convertCurrency(data.itemsBestBid, bidExchangeRate, selectExchangeRate);
          //     data.itemsBestBidUnitCost = config.convertCurrency(data.itemsBestBidUnitCost, bidExchangeRate, selectExchangeRate);
          //   }
          // }     
        });
        element.bestBid = totalBestBid;
        element.bestBidSHLotLevel = element.items.filter((obj) => { return obj.bestBidSH; }).length ? true : false;
      });
      this.supplierBiddingSource.forEach((element) => {
        element.items.forEach((data) => {
          if (data.bids.length > 0) {
            if (data.itemsBestBid && !data.ownRank) {
              data.itemsBestBid = Number(config.unitPrice(data.itemsBestBid, data.itemWeight, this.supplierData.supplierAF, this.supplierData.supplierMF, this.biddingCurrency.exchangeRate, data.minimumDesiredQuantity, this.decimalValue).toFixed(this.decimalValue));
            }
            else {
              data.itemsBestBid = Number(config.convertCurrency(data.itemsBestBid, data.currencyExchange.exchangeRate, this.biddingCurrency.exchangeRate).toFixed(this.decimalValue));
            }
            data.itemsBestBidUnitCost = data.itemsBestBid * data.minimumDesiredQuantity;
            delete data.currencyExchange;
            delete data.ownRank;
          }
        })
      })

      this.sendDataToParent(this.socketData);
    }, (err) => {
      clearInterval(this.polling1);
      this.aucView('error', err);
    }, () => {
      this.commonservice.loader = true;
    })
    this.UNOBS.push(un2);
  }

  onTextChange(eve, data) {
    if (eve.keyCode === 32 || eve.keyCode >= 65 || eve.keyCode <= 90)
      return false;
    if (this.socketData.status && this.socketData.status == this.auctionStatusList.OP) {
      let checkInput = [];
      this.supplierBiddingSource.forEach(lots => {
        if (lots.items.length > 0) {
          lots.items.find(bid => { checkInput.push(bid) });
        }
      });
      if (checkInput.some(che => { return this.supplierBiddingControlList.get(che.itemID).value; })) {
        clearInterval(this.polling1);
      } else {
        this.onSelectedTab();
      }
    }
    data.amount = this.supplierBiddingControlList.get(data.itemID).value;
    this.supplierBiddingControlList.get(data.itemID).setValue(data.amount);
    data.errorFlag = false;
    this.selectedItem(data)
    var flag = this.textValidation(data);
    data.flag = flag;
    if (!flag) {
      data.toolTip = this.supplierBiddingAllErrorControlList.get(data.itemID).value;
      if (this.errorFlag) {
        let error = false;
        this.supplierBiddingSource.forEach((lot) => {
          error = lot.items.some(x => this.supplierBiddingAllErrorControlList.get(x.itemID).value);
          if (error) {
            return false;
          }
        })
        if (!error)
          this.errorFlag = false;
      }
    }
  }
  textValidation(node) {
    return ((node.amount.length > 0) ? false : true);
  }
  selectedItem(node) {
    let data = this.supplierBiddingSource.filter(lot => lot.lotID == node.lotID);
    let flagItem = data[0].items.map(item => item.checkedItem).includes(false);
    data[0].checkedLot = !flagItem
  }

  // openModalBidAll() {
  //   let localBidData = [];
  //   this.supplierBiddingSource.filter((lot) => {
  //     let data = { lotID: lot.lotID, lotName: lot.lotName, items: [] };
  //     lot.items((item) => {
  //       data.items.push({ ...item });
  //       localBidData.push(data);
  //     })
  //   })
  // }

  openTakeLeadPopup(itemObj) {
    this.supplierItemViewService.openTakeLeadPopup(itemObj, this.auctionID).subscribe((value) => {
      if(value) {
        let payload = { "auctionID": this.auctionID,  "lotID": itemObj.lotID,  "itemID": itemObj.itemID }
        this.supplierItemViewService.takeLead(payload)
          .then((res:any) => {
            itemObj.amount = res.data.baseCost;
            this.openModalRow('takeLead',itemObj)
          })
          .catch(err => this.commonservice.error(err))
      }
    });
  }

  openModalRow(ind, data = null) {
    try {
      if (ind == 'itemBid') {
        data.amount = this.supplierBiddingControlList.get(data.itemID).value;
      }
      let dialogData = {};
      this.biddingCurrency = this.currencyData.exchangeRate.find(x => x.currencyCode == this.currencyData.selectCurrencyCode);
      data.baseCost = data.amount;
      data.bestBid = data.amount;
      let landedData = config.calculateTotalLandedCost(this.supplierData.supplierAF, this.supplierData.supplierMF, [...this.supplierBiddingSource], data, this.biddingCurrency.exchangeRate, false, this.auctionData.currencyDecimalPlace)
      if (landedData["landedUnit"]) {
        data.landedCost = (landedData.landedUnit / this.biddingCurrency.exchangeRate).toFixed(this.auctionData.currencyDecimalPlace);
        data.totalLandedCost = (landedData.totalLanded / this.biddingCurrency.exchangeRate).toFixed(this.auctionData.currencyDecimalPlace);
        data.currency = this.currencyData.selectCurrencyCode;

        const objMatDialogConfig = new MatDialogConfig();
        dialogData = { supplierData: this.supplierData, contentName: ind, data: data, auctionID: this.auctionID, decimalplace: this.decimalValue, auctionData: this.auctionData }

        objMatDialogConfig.panelClass = 'dialog-md';
        objMatDialogConfig.data = {
          dialogMessage: 'Supplier Bidding Item',
          dialogContent: this.common_btn['CONFIRM_MSG'],
          tab: 'bidView',
          dialogPositiveBtn: "Confirm",
          dialogNegativeBtn: "Close",
          bidButton: "supplier-itemcomponent",
          dialogData: dialogData
        }
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
        refMatDialog.afterClosed().subscribe((value) => {
          if (value) {
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
              "currencyCode": data.currency,
              "description": 0,
              "baseCost": data.amount,
              "variableCost": 0,
              "currency": {
                "currencyName": this.supplierData.supplierCurrency.currencyName,
                "currencyCode": this.supplierData.supplierCurrency.currencyCode
              },
              "supplierAF": this.supplierData.supplierAF,
              "supplierMF": this.supplierData.supplierMF,
              "landedCost": landedData.landedUnit.toFixed(this.auctionData.currencyDecimalPlace),
              "totalLandedCost": landedData.totalLanded.toFixed(this.auctionData.currencyDecimalPlace)

            }
            this.supplierservice.insertBidItem(objData).subscribe((res: any) => {
              if (res) {
                this.onSelectedTab();
                this.commonservice.success('Bid saved successfully for the item');
                this.supplierBiddingControlList.set(data.itemID, new FormControl(''));
                this.supplierBiddingAllErrorControlList.set(data.itemID, new FormControl(''));
              }
              data.amount = "";
            }, (err) => {
              data.baseCost = "";
              data.bestBid = "";
              clearInterval(this.polling1);
              this.commonservice.error(err);
            })
          }
        });
      }
    } catch (e) {

    }
  }
  getSocketData() {
    this.timeSocket = this.socketendpoint.subscribe(data => {
      this.socketData = data;
      this.socketData.supplierStatus = this.status;
      if (this.socketData.status === 'Open') {
        this.showBut = true;
      } else {
        this.showBut = false;
      }
      if (this.socketData.status == this.auctionStatusList.CO) {
        this.aucCloseShowPopup.emit(null);
        this.socketData.seconds = 0;
        this.bidFlag = true;
        this.participate = true;
        // this.acceptFlag = (this.participate && (this.socketData.supplierStatus != this.auctionStatusList.RJ)) ? true : false;
        if (this.participate && (this.socketData.supplierStatus != this.auctionStatusList.RJ)) {
          this.acceptFlag = true;
        } else {
          this.acceptFlag = false;
        }
        this.backButton(this.auctionID);
      } else if (this.socketData.status === this.auctionStatusList.PA) {
        this.bidFlag = true;
        // this.acceptFlag = (this.participate && (this.socketData.supplierStatus != this.auctionStatusList.RJ)) ? true : false;
        if (this.participate && (this.socketData.supplierStatus != this.auctionStatusList.RJ)) {
          this.acceptFlag = true;
        } else {
          this.acceptFlag = false;
        }
      }
      else {
        this.clockStatus = false;
        this.bidFlag = false;
        this.acceptFlag = true;
        setTimeout(() => {
          this.clockStatus = true;
        }, 1);
        this.socketData.seconds = this.socketData.seconds - 0.001;
        if (this.status == this.auctionStatusList.RJ) {
          this.acceptFlag = false;
        }
        else if (this.status == this.auctionStatusList.AC) {
          this.acceptFlag = true;
        }
        if (this.socketData.status == this.auctionStatusList.OP || this.socketData.status == this.auctionStatusList.PB) {
          if (this.socketData.supplierStatus == this.auctionStatusList.AC || this.socketData.supplierStatus == this.auctionStatusList.BD) {
            this.acceptFlag = true;
            this.participate = true;
          }
          else {
            this.acceptFlag = false;
            this.participate = false; // this.participate = true; (issue is accept button disable when auction is forsefully open)
          }
        }

      }
      this.onSelectedTab();
      this.commonservice.commonStatus = this.socketData.status;
      this.sendDataToParent(this.socketData);
      // if (this.socketData.status.toLowerCase() === 'open') {
      //   this.getSupplierBiddingList();
      // }
      // this.refreshTableHead();
    })

    this.bidSocket = this.socketService.getBidSocketData(this.auctionID, 'supplier').subscribe(data => {
      let socketDetails = data[0].lots.filter((obj) => {
        return obj.items.length > 0;
      })
      let totalBestBid;
      this.current_total_bid = 0;
      this.totalCost = data[0].totalCost;
      if (data[0]['bids'] && data[0]['bids'].length > 0) {
        for (let i = 0; data[0]['bids'].length > i; i++) {
          if (data[0]['bids'][i]['data']['_id'].toLowerCase() === JSON.parse(localStorage.getItem('userdata'))['email'].toLowerCase()) {
            this.auctionRank = data[0]['bids'][i].rank;
          }
        }
      }
      config.playAudio();
      this.biddingCurrency = this.currencyData.exchangeRate.find(x => x.currencyCode == this.supplierData.supplierCurrency.currencyCode);
      this.supplierBiddingSource.forEach((element, lotIndex) => {
        totalBestBid = 0;
        element.items.forEach((data, itemIndex) => {
          data.itemsBestBidUnitCost = socketDetails[lotIndex].items[itemIndex].itemsBestBidUnitCost;
          data.itemsBestBid = socketDetails[lotIndex].items[itemIndex].itemsBestBid;
          //   if(this.supplierData){
          //     if(this.supplierData.selectCurrencyCode!= socketDetails[lotIndex].items[itemIndex].currency.currencyCode){
          //       let bidExchangeRate=this.supplierData.exchange.find(x=> x.currencyCode= socketDetails[lotIndex].items[itemIndex].currency.currencyCode);
          //       let selectExchangeRate=this.supplierData.exchange.find(x=> x.currencyCode==this.supplierData.selectCurrencyCode);
          //       data.itemsBestBid=config.convertCurrency(data.itemsBestBid,bidExchangeRate,selectExchangeRate);            
          //       data.itemsBestBidUnitCost=config.convertCurrency(data.itemsBestBidUnitCost,bidExchangeRate,selectExchangeRate);            

          //     }
          //  }
          data.bids = socketDetails[lotIndex].items[itemIndex].bids;
          data.newBid = socketDetails[lotIndex].items[itemIndex].newBid;
          data.bestBidSH = false;
        })
      })
      this.supplierBiddingSource.forEach((element, lotIndex) => {
        element.items.forEach((data, itemIndex) => {
          if (data.bids && data.bids.length > 0) {
            data.bidsBlink = false;
            data.ownRank = false;

            data.bids.forEach(bid => {

              if (bid.rank === 1) {
                data.bidsBlink = true;
                // let exchange = this.auctionData["currency"].find(x => x.currencyCode == bid.data["currency"] ? bid.data["currency"]["currencyCode"] : this.auctionData.primaryCurrency);
                let exchange = this.auctionData["currency"].find(x => x.currencyCode == bid.data["currency"].currencyCode);;
                
                data.currencyExchange = exchange;
                data.itemsBestBid = bid.data.landedCost;

              }
              if (bid.data.bidderID === this.vendorcode) {
                data.itemWeight = config.calculateItemWeight({ bestBid: bid.data.baseCost, minimumDesiredQuantity: data.minimumDesiredQuantity }, this.supplierBiddingSource, this.vendorcode);
                data.itemWeight = (data.itemWeight * 100).toFixed(this.auctionData["currencyDecimalPlace"]);
                data.baseCost = bid.data.baseCost;
                if (bid.data.landedCost) {
                  bid.data.landedCost = bid.data.landedCost / this.biddingCurrency.exchangeRate;
                  bid.data.totalLandedCost = bid.data.totalLandedCost / this.biddingCurrency.exchangeRate;
                }
                data.bestBidSH = true;
                if (!this.bidDataFlag) {
                  this.bidDataFlag = true;
                }
                if (bid.rank === 1) {
                  data.ownRank = true;
                  //  data.itemsBestBid = (bid.data.landedCost) ? bid.data.landedCost : bid.data.baseCost;
                  data.itemsBestBid = bid.data.baseCost;
                }

              }
            });
          }
          //data.amount = "";
          // data.errorFlag = false;
          totalBestBid += +data.itemsBestBidUnitCost;
          this.current_total_bid += data.itemsBestBidUnitCost ? +data.itemsBestBidUnitCost : 0;
          setTimeout(function () {
            data.newBid = false;
            data.submit = false;
          }, 3000);
          //  data.itemsBestBid=config.unitPrice(data.itemsBestBid,data.itemWeight,this.supplierData.supplierAF,this.supplierData.supplierMF,biddingCurrency.exchangeRate)
          //  data.itemsBestBidUnitCost=data.itemsBestBid*data.minimumDesiredQuantity;
        });
        element.bestBidSHLotLevel = element.items.filter((obj) => { return obj.bestBidSH; }).length ? true : false;
        element.bestBid = totalBestBid;
        element.bids = socketDetails[lotIndex].bids;
        element.singleSourceAtEveryLevel = socketDetails[lotIndex].singleSourceAtEveryLevel;
      });
      this.supplierBiddingSource.forEach((element) => {
        element.items.forEach((data) => {
          if (data.bids.length > 0) {
            if (data.itemsBestBid && !data.ownRank) {
              data.itemsBestBid = Number(config.unitPrice(data.itemsBestBid, data.itemWeight, this.supplierData.supplierAF, this.supplierData.supplierMF, this.biddingCurrency.exchangeRate, data.minimumDesiredQuantity, this.decimalValue).toFixed(this.decimalValue));

            }
            else {
              data.itemsBestBid = Number(config.convertCurrency(data.itemsBestBid, data.currencyExchange.exchangeRate, this.biddingCurrency.exchangeRate).toFixed(this.decimalValue));
            }
            data.itemsBestBidUnitCost = data.itemsBestBid * data.minimumDesiredQuantity;

            delete data.currencyExchange;
            delete data.ownRank;
          }

        })
      })
    })
  }

  backButton(auctionID) {
    let un3 = this.socketService.supplierBackButtonFromBreadcrumbs(auctionID).subscribe(data => {
      let res = data;
    });
    this.UNOBS.push(un3);
  }

  acceptDetails(remarks = []) {
    try {
      let dialogData = { auctionData: this.auctionData };
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = (this.auctionData.currency.length > 1) ? 'dialog-vlg' : (this.preBid.length > 0) ? 'dialog-vlg' : (remarks.length > 0) ? 'dialog-vlg' : 'dialog-xs'; //(this.preBid.length>0 || this.supplierData.supplierMF || this.supplierData.supplierAF )?'dialog-vlg':'dialog-xs';
      objMatDialogConfig.data = {
        dialogMessage: 'Invitation',
        dialogContent: this.common_btn['CONFIRM_MSG'],
        tab: 'acceptView',
        dialogPositiveBtn: "Accept",
        dialogNegativeBtn: "Close",

        bidButton: "supplier-itemcomponent",
        dialogData: dialogData,
        contentName: "",
        auctionID: this.auctionID,
        decimalplace: this.decimalplace,
        supplier: this.supplierData,
        prelimianryData: [...this.preBid],
        lot_item_data: [...this.lot_item_data],
        allRemarks: remarks
      }
      objMatDialogConfig.disableClose = true;
      // let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
      let refMatDialog = this.matDialog.open(SuppAuctionAcceptPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        // debugger;
        if (value) {
          this.socketData.supplierStatus = value.status;
          if (value.status == this.auctionStatusList.AC) {
            this.commonservice.success("Accepted Successfully");
            this.onlineAuc();
            this.acceptFlag = true;// (this.socketData.status == this.auctionStatusList.OP) ? true : false;
            this.participate = true;
            this.checkFun();
            this.aucAcceptSaveColumns();
          }
          else {
            if (value.status == this.auctionStatusList.RJ) {
              this.commonservice.success("Declined Successfully");
              this.participate = true;
              this.acceptFlag = false;
            }
          }
          this.status = value.status;
          if (value.status) {
            if (value.supplierCurrency.currencyCode != this.supplierData.supplierCurrency.currencyCode) {
              this.supplierData.supplierCurrency = value.supplierCurrency;
              this.currencyData.selectCurrencyCode = this.supplierData.supplierCurrency.currencyCode;
              this.getSupplierBiddingData();
            }
          }
          let acceptDetail = JSON.stringify({ status: this.status, participate: this.participate });
          this.acceptData.emit(acceptDetail);
        }
      });
    } catch (e) {

    }
  }
  onlineAuc() {
    this.userinfosocket = this.socketService.supplierOnline(this.auctionID).subscribe(data => {
      let res = data;
    });
  }
  sendDataToParent(socketData) {
    let items = [];
    this.supplierBiddingSource.forEach(lot => {
      lot.items.forEach(item => {
        items.push({ lotID: lot.lotID, lotName: lot.lotName, ...item });
      });
    });
    //console.log(items);
    let sendData = JSON.stringify({ socketData: socketData, participate: this.participate, status: (this.socketData.supplierStatus) ? this.socketData.supplierStatus : this.status, items: items });
    this.sendSocketData.emit(sendData);
  }
  aucView(dis, msg) {
    try {
      const objMatDialogConfig = new MatDialogConfig();
      if (dis == 'aucView') {
        objMatDialogConfig.panelClass = 'dialog-lg';
        objMatDialogConfig.data = {
          dialogMessage: "Basic Info",
          tab: 'aucView',
          auctionID: this.auctionID,
          bidding: {
            'biddingcurrency': this.biddingCurrency,
            'decimalValue': this.decimalValue
          }
        }
      } else {
        objMatDialogConfig.panelClass = 'dialog-xs';
        objMatDialogConfig.data = {
          dialogMessage: 'Warning...',
          dialogContent: msg,
          tab: 'confirm_msg',
          dialogPositiveBtn: "Ok"
        }
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        if (value) {
        }
        if (dis == 'error' || dis == 'suspended') {
          this.router.navigate([routerconfig.supplier_router_links.SUPPLIER_DASHBOARD]);
        }
      });
    } catch (e) {

    }
  }

  onclickItem(item, lot) {
    if (!item.minimumChangeValue) {
      item.minimumChangeValue = this.auctionData.minBidChangeValue;
      item.minChangeType = this.auctionData.minBidChangeType;
    }
    if (item && item.attachmentList && item.attachmentList.length > 0) {
      item.attachmentList = item.attachmentList.filter((att) => { return att.isExternal });
    }
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-lg';
    objMatDialogConfig.data = {
      data: { 
        'selectedItem': item, 
        'selectedLot': lot, 
        'customfieldList': this.customfieldList
      },
    }
    let refMatDialog = this.matDialog.open(SuppItemPopupViewOnlyComponent, objMatDialogConfig);
    refMatDialog.afterClosed();
  }

  onclickLot(lot) {
    try {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-lg';
      objMatDialogConfig.data = {
        dialogMessage: "View Lot",
        tab: 'LotView',
        data: { 'data': lot, 'pageFrom': 'readonly' },
        auctionID: this.auctionID
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        if (value) {
        }
      });
    } catch (e) { }
  }

  lotclick(ind) {
    this.supplierBiddingSource.forEach((element, index) => {
      if (ind === index) {
        element.dis = element.dis ? false : true;
      }
    });
  }

  switchView() {
    this.typeView = this.typeView ? false : true;
  }

  textValidationAuc(value) {
    var splitValue = value.split('.');
    if (value == "") {
      return false;
    }
    if (value >= 0 && value < 100) {
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

  autoRefreshApi() {
    // Observable.timer(0, 6000)
    //   .takeWhile(() => this.alive)
    //   .subscribe(() => {
    //     this.commonservice.loader = false;
    //     if (this.commonservice.internetConn) {
    //       this.getSupplierBiddingList();
    //     }
    //   });
    this.polling1 = setInterval(() => {
      this.commonservice.loader = false;
      if (this.commonservice.internetConn) {
        this.headerApiRef.emit();
        this.getSupplierBiddingList();
      }
    }, 6000);
  }

  onSelectedTab() {
    clearInterval(this.polling1);
    if (this.socketData.status == this.auctionStatusList.OP) {
      this.autoRefreshApi();
    }
  }

  bidBoxClick(val) {
    if (this.socketData.status && this.socketData.status == this.auctionStatusList.OP) {
      if (val == 'click') {
        clearInterval(this.polling1);
      } else {
        this.onSelectedTab();
      }
    }
  }

  supplierdelData() {
    let userObj = this.vendorcode;
    let un4 = this.socketService.supplierDeleteStatus(this.auctionID, userObj)
      .subscribe(data => {
        this.aucView('suspended', 'You Are Suspended...!!');
      });
    this.UNOBS.push(un4);
  }

  getCustomFields() {
    return new Promise((resolve, reject) => {
      if (this.auctionID) {
        let un5 = this.buyerService.getCustomFieldList(this.auctionID).subscribe((res: any) => {
          let itemCustList = res.data.filter(cust => cust.displayLevel === "item" && cust.vendorLevelDisplay);
          let customFieldList = itemCustList.sort((a, b) => {
            return a._id - b._id;
          });
          resolve(customFieldList);
        }, err => {
          reject();
        })
        this.UNOBS.push(un5);
      } else {
        reject();
      }
    })
  }

  refreshTableHead() {
    if (this.socketData.supplierStatus != this.auctionStatusList.AC && this.socketData.supplierStatus != this.auctionStatusList.BD) {
      this.supplierservice.suppFilCol.filter(item => item.ind > 2).forEach(col => {
        col.disable = true;
      });
    }
  }

  checkFun(){
    let arrlen = 0;
      this.supplierservice.suppFilCol.forEach(col => {
        col.disable = false;
        arrlen += 1;
        if (arrlen == this.supplierservice.suppFilCol.length) {   
          // check multiple currency  
          this.checkCurrAuc();

          // check Price and rank 
          this.checkPriceRank();
        }
      });
  }

  ngOnDestroy() {
    try {
      clearInterval(this.polling1);
      if (this.timeSocket) {
        this.timeSocket.unsubscribe();
      }
      this.UNOBS.forEach(obs => {
        obs.unsubscribe();
      });
    } catch (e) { }
    this.componentActive = false;
  }

  aucAcceptSaveColumns() {
    let payload={
      auctionID: this.auctionID,
      filterColumn: this.supplierservice.suppFilCol
    };
    this.buyerService.saveDisColumnsFil(payload);
  }

  cardViewDisCol(field) {
		return this.commonservice.cardViewDisCol(this.supplierservice.suppFilCol,field);
  }

  getColumnsInd(field) {
    if(this.commonservice.inArrFindColInd(this.supplierservice.suppFilCol,field) != -1) {
      return this.commonservice.inArrFindColInd(this.supplierservice.suppFilCol,field);
    }
  }
    
  checkCurrAuc(){
    if(this.getColumnsInd('cost-weightage')) {
    if (this.auctionData.currency.length <= 1) {
      this.supplierservice.suppFilCol[this.getColumnsInd('cost-weightage')]['disable'] = true;
    } else {
      this.supplierservice.suppFilCol[this.getColumnsInd('cost-weightage')]['selected'] = true;
    }
    if (this.auctionData.currency.length > 1 && (this.buyerService.supplierData.supplierAF || this.buyerService.supplierData.supplierMF)) {
      this.supplierservice.suppFilCol[this.getColumnsInd('landedCost')]['selected'] = true;
      this.supplierservice.suppFilCol[this.getColumnsInd('totalLandedCost')]['selected'] = true;
    } else {
      // this.supplierservice.suppFilCol[this.getColumnsInd('landedCost')]['disable'] = true;
      // this.supplierservice.suppFilCol[this.getColumnsInd('totalLandedCost')]['disable'] = true;
    }
  }
  }

  
  checkPriceRank(){
    if (this.auctionData.infoShownToSupplier == config.supplierShown.price) {
      // this.supplierservice.suppFilCol[this.getColumnsInd('itemsBestBid')]['selected'] = true;
      // this.supplierservice.suppFilCol[this.getColumnsInd('itemsBestBidUnitCost')]['selected'] = true;
      // hide rank fileds
      this.supplierservice.suppFilCol[this.getColumnsInd('rank')]['disable'] = true;
    } else if (this.auctionData.infoShownToSupplier == config.supplierShown.rank || this.auctionData.infoShownToSupplier == config.supplierShown.topRank) {
      // this.supplierservice.suppFilCol[this.getColumnsInd('rank')]['selected'] = true;
      // hide price fileds
      this.supplierservice.suppFilCol[this.getColumnsInd('itemsBestBid')]['disable'] = true;
      this.supplierservice.suppFilCol[this.getColumnsInd('itemsBestBidUnitCost')]['disable'] = true;
    } 
    // else {
    //   this.supplierservice.suppFilCol[this.getColumnsInd('itemsBestBid')]['selected'] = true;
    //   this.supplierservice.suppFilCol[this.getColumnsInd('itemsBestBidUnitCost')]['selected'] = true;
    //   this.supplierservice.suppFilCol[this.getColumnsInd('rank')]['selected'] = true;
    // }
  }

}
