import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BuyerBiddingService } from 'src/app/component/component-service/buyer-bidding.service';
import { CommonService } from 'src/app/commonService/common.service';
import { Subscription } from 'rxjs';
import { SummaryService } from '../item-view/summary.service';

/* NgRx */
import { Store, select} from '@ngrx/store';
import * as fromLiveBiddingModule from '../state/live-bidding-module.reducer';
import { takeWhile } from 'rxjs/operators';
import * as fromAppModule from '../../../../state/app.reducer';
import { promise } from 'protractor';
@Component({
  selector: 'app-supplier-matrix-view',
  templateUrl: './supplier-matrix-view.component.html',
  styleUrls: ['./supplier-matrix-view.component.css'],
  providers: [SummaryService]
})
export class SupplierMatrixViewComponent implements OnInit, OnDestroy {

  afMfEnabled: boolean = false;
  componentActive: boolean = true;
  @Input() issealedBidDis = false;
  @Input() auctionID: any;
  @Input() auctionData = null
  supplierDtls = [];
  buyerData: any;
  dataLotItem: any;
  decimalplace: any;
  itemListData = [];
  // @Input() 
  select_sav_bid = 2;
  type = null;
  dataSource = null;
  totalValue: { type: string; data: { name: string; bids: any; baseline: any; }; minimumDesiredQuantity: any; unitMeasure: any; baseline: any; };
  serDestroy: Subscription;
  serDestroy1: Subscription;
  constructor(
    public bidService: BuyerBiddingService, 
    private common: CommonService,
    public sService: SummaryService,    
    private store: Store<fromLiveBiddingModule.LiveBiddingModuleState>) {
  }

  ngOnInit() {
    this.store.pipe(select(fromAppModule.getAuctionConfigOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionConfig => {
			if(auctionConfig && auctionConfig.features) { 
				this.afMfEnabled = auctionConfig.features.currency;
			}
		});
    try {
      // if (this.auctionID && !this.issealedBidDis) {
      //   this.getMatrixAPI();
      // } 
      if(this.issealedBidDis && (this.auctionData.status == 'Open' || this.auctionData.status == 'Paused')) {
         this.ifSealedBidMatrixAPI().then(()=>{
          this.getCusFilList();
          this.getMatrixAPI()
         });
      } else {
        this.getMatrixAPI();
      this.getCusFilList();
      }
    }
    catch (e) {
      this.common.error(e);
      this.common.loader = false;
    }
  }
  ngOnDestroy() {
    try {
      if (this.serDestroy) {
        this.serDestroy.unsubscribe();
      }
      if (this.serDestroy1) {
        this.serDestroy1.unsubscribe();
      }
    } catch (e) { }
  }

  getMatrixAPI() {
    this.componentActive = false;
    if (this.auctionID) {
      this.serDestroy = this.bidService.getMatrixDetails(this.auctionID).subscribe((res) => {
        if (res["success"]) {
          this.getBuyerMatrixData(res['data']);
        }
      })
    }
  }


  getBuyerMatrixData(res) {
    let ELEMENT_DATA = [];
    this.dataSource = [];
    this.itemListData = [];
    if (this.supplierDtls.length == 0) {
      this.supplierDtls = this.bidService.supplierDetails;
      // this.supplierDtls.forEach((supplier) => {
      //   this.displayedColumns.push(supplier.supplierID);
      // })
    }
    this.changeBidderStatus(res);
    this.buyerData = res;
    this.decimalplace = this.buyerData[0].currencyDecimalPlace;
    this.type = res[0]['type'];
    this.buyerData[0].lots = this.buyerData[0].lots.filter((obj) => {
      return obj.items.length > 0;
    });
    this.buyerData[0].lots.forEach(lot => {
      lot.items.forEach(item => {
        this.itemListData.push({ ...item })
      })
    })
    this.supplierDtls.forEach((supplier) => {
      supplier.items = [];
    })
    this.itemListData.forEach(item => {
      if (item.bids.length > 0) {
        this.supplierDtls.forEach((supplier) => {
          let bidData = item.bids.filter(x => x.data.bidderID == supplier.supplierID);
          if (bidData.length > 0) {
            let itemBidData = {
              itemID: item.itemID,
              bestBid: bidData[0].data.baseCost,
              minimumDesiredQuantity: item.minimumDesiredQuantity,
              currency: bidData[0].data["currency"] ? item.bids[0].data["currency"]["currencyCode"] : this.auctionData.primaryCurrency,
              landedUnitRate: bidData[0].data["landedCost"],
              totalLandedCost: bidData[0].data["totalLandedCost"]
            }
            supplier.items.push(itemBidData);
          }
        })
      }
    });


    // this.supplierDtls.forEach((supplier) => {
    //   if (supplier.items.length > 0) {
    //     supplier.items.forEach(item => {
    //       let exchangeRate = this.auctionData.currency.find(x => x.currencyCode = item.currency.currencyCode);
    //       let landedData = null;
    //       landedData = config.calculateTotalLandedCost(supplier.supplierAF, supplier.supplierMF, supplier.items, item, exchangeRate.exchangeRate, true);
    //       item.landedUnitRate = landedData.landedUnit;
    //       item.totalLandedCost = landedData.totalLanded;
    //       item.currencyCode = exchangeRate.currencyCode;
    //     });
    //   }
    // })
    this.buyerData.forEach(auc => {
      auc.baseline_INR = 0;
      auc.lots.forEach(lot => {
        lot.supplier = this.supplierDtls
        lot.baseline_INR = 0;
        lot.items.forEach(item => {
          item.baseline_INR = 0;
          item.baseline_INR = ((item.historicalCost ? +item.historicalCost : 0) * (item.minimumDesiredQuantity ? +item.minimumDesiredQuantity : 0));
          lot.baseline_INR += item.baseline_INR;
        });
        auc.baseline_INR += lot.baseline_INR
      });

    });


    this.buyerData.forEach((auc) => {
      ELEMENT_DATA.push({ type: 'event', data: { name: auc.auctionName, bids: auc.bids, baseline: auc.baseline_INR }, minimumDesiredQuantity: null, unitMeasure: null, baseline: null })
      auc.lots.forEach(lot => {
        ELEMENT_DATA.push({ type: 'lot', expand: true, data: { name: lot.lotName, lotID: lot.lotID, bids: lot.bids, baseline: lot.baseline_INR }, minimumDesiredQuantity: null, unitMeasure: null, baseline: null })
        lot.items.forEach(item => {
          ELEMENT_DATA.push({ type: 'item', expand: true, data: { item: { ...item }, itemlotID: lot.lotID, name: item.itemName, itemID: item.itemID, bids: item.bids, baseline: item.baseline_INR }, minimumDesiredQuantity: item.minimumDesiredQuantity, unitMeasure: item.unitOfMeasure, baseline: item.baseline_INR })
        });
      });
      ELEMENT_DATA.push({ type: 'totalEvent', data: { name: "Total Value", bids: auc.bids, baseline: auc.baseline_INR }, minimumDesiredQuantity: null, unitMeasure: null, baseline: null })
    });
    this.totalValue = ELEMENT_DATA[ELEMENT_DATA.length - 1];
    ELEMENT_DATA.splice((ELEMENT_DATA.length - 1), 1);
    this.dataSource = ELEMENT_DATA;
    this.dataLotItem = this.buyerData[0].lots;
  }

  lotClick(id) {
    return this.dataSource.filter(x => x.data.itemlotID == id || x.data.lotID == id).map(x => { return x.expand = !x.expand });
  }

  expandItem(i) {
    try {
      this.dataLotItem.forEach((element, index) => {
        if (i === index) {
          element.dis = element.dis ? false : true;
        }
      })
    }
    catch (e) {
      this.common.error(e);
    }
  }

  getSupplierName(supp) {
    if (this.issealedBidDis) {
      return this.bidService.columnNamesMatrix.find(obj => obj.item_id == supp.supplierID)['item_text'];
    } else {
      return this.bidService.supplierDetails.find(obj => obj.supplierID == supp.supplierID)['supplierName1'];
    }
  }

  getColor(col) {
    switch (col) {
      case 'lot':
        return '#eaeaea';
      case 'event':
        return '#e9fff9';
    }
  }
  getCusFilList() {
    this.bidService.getMatrixCusFilDetails(this.auctionID).subscribe((res) => {
      if (res['data'] && res['data']['filterColumn'] && res['data']['filterColumn'].length > 0) {
        this.bidService.columnNamesMatrix = res['data']['filterColumn'];
        this.bidService.columnNames = res['data']['filterColumn'];
        this.bidService.setColumn = 'name';
      }
      this.matrixSupplierNameSuffle();
      setTimeout(() => {
        this.checkSupplierSuspend();
      }, 500);
    })
  }

  checkSupplierSuspend() {
    if(this.common.inArrFindColInd(this.bidService.columnNames,'bidders') == -1){
      this.bidService.columnNamesMatrix.push({
        ind: (this.bidService.columnNamesMatrix.length - 1) + 1, item_id: 'bidders', item_text: 'Active Participants', selected: false
      })
    }

    // it will check new participant added in during the live auc
    this.bidService.supplierDetails.forEach(element => {
      if (!(this.bidService.columnNamesMatrix.find((v1) => v1.participant && v1.item_id === element.supplierID))) {
        this.bidService.columnNamesMatrix.push({
          ind: (this.bidService.columnNamesMatrix.length - 1) + 1, item_id: element.supplierID, item_text: element.supplierName1, selected: true, participant: true
        })
      }
    });
      // if you delete the participant during live
      this.bidService.columnNamesMatrix.forEach((element, i) => {
        if (element.participant && !(this.bidService.supplierDetails.find((f1) => f1.supplierID == element.item_id))) {
          this.bidService.columnNamesMatrix.splice(i, 1);
        }
      });
    if(this.issealedBidDis) {
      this.bidService.columnNames = this.bidService.columnNames.filter((obj)=>!obj.participant);
      this.bidService.columnNames.splice(this.common.inArrFindColInd(this.bidService.columnNames,'bidders'),1);      
    }
    
    this.bidService.setColumn = 'name';
  }

  changeBidderStatus(data) {
    if (data && data.length > 0 && data[0]['bids'] && data[0]['bids'].length > 0) {
      this.bidService.supplierDetails.forEach(element => {
        if (data[0]['bids'].find((obj) => obj.data._id === element.supplierID)) {
          element.status = 'Bidded'
        }
      });
      this.bidService.matrixShowOnlyBidders('');
      this.bidService.setColumn = 'name';
    }
  }

  matrixSupplierNameSuffle() {
    if (this.auctionData.isSealedBidAuction) {
      if (this.issealedBidDis) {
        let getMatrixSupplierNames = this.bidService.columnNamesMatrix.filter((obj) => obj.participant);
        let getMatrixOtherFields = this.bidService.columnNamesMatrix.filter((obj) => !obj.participant);
        let suffleSuppliers = this.common.getRandomElementsFromArray(getMatrixSupplierNames);
        suffleSuppliers.forEach((element, i) => {
          element.item_text = 'Participant ' + (i + 1);
          getMatrixOtherFields.push(element);
        });
        this.bidService.columnNamesMatrix = getMatrixOtherFields;
      } else {
        this.bidService.columnNamesMatrix.forEach((element, i) => {
          let value = this.bidService.supplierDetails.find(obj => obj.supplierID == element.item_id);
          if (value) {
            element.item_text = value['supplierName1'];
          }
        });
      }
      this.bidService.setColumn = 'name';
      this.bidService.matrixColumn = 'supplier';
    }
  }

  ifSealedBidMatrixAPI() {
    return new Promise((resolve, reject) => {
      this.serDestroy1 = this.bidService.getInviteSealedBid(this.auctionID).subscribe((res) => {
        if (res["success"]) {
          let resData = res['data']['supplierList'].filter((obj) => obj.status.toLowerCase() !== 'suspended');
          let arr = this.common.getRandomElementsFromArray(resData);
          arr.forEach((supplier, i) => {
            if (!supplier["supplierCurrency"]) {
              supplier.supplierCurrency = { currencyCode: "INR", currencyName: "Indian Rupee" };
              supplier.supplierAF = 0;
              supplier.supplierMF = 0;
            }
            supplier.supplierName1 = 'Participant ' + (i + 1)
          });
          this.bidService.supplierDetails = arr;
          resolve();
        }
      });
    });
  }

}


