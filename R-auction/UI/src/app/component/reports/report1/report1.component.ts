import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { BuyerBiddingService } from '../../../component/component-service/buyer-bidding.service';
import * as config from '../../../appConfig/app.config';
import { CommonService } from '../../../commonService/common.service';
import { ActivatedRoute } from '@angular/router';
import { reportAnimation } from '../animation';

@Component({
  selector: 'app-report1',
  templateUrl: './report1.component.html',
  styleUrls: ['./report1.component.css'],
  animations: [reportAnimation]
})
export class Report1Component implements OnInit {
  supplierStatusData: any;
  liveParticipantAdded = [];
  @Input() auctionID: any;
  auctionIdData: any;
  auctionDetails: any = {};
  supplierDetails = [];
  lotsAndItem: any = []
  decimalplace: any;
  buyerData: any = [];
  advanceSummaryData = [];
  suppliersDtls: any = [];
  @Input() displayType: any = null;

  downButt: boolean = false;
  reportType: any = 'bestCase';
  report = [
    { value: 'singleSource', viewValue: 'Single Source' },
    { value: 'bestCase', viewValue: 'Best Cost Outcome' },
  ];
  landscapeData: any = [];

  constructor(
    private bidService: BuyerBiddingService,
    public route: ActivatedRoute,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.getReport().then(result => {
      this.getPreAndBidCount(result);
    });
  }


  reportTypeChanged() {
    this.getReport();
  }

  getPreAndBidCount = (result) => {
    this.suppliersDtls.forEach(element => {
      let data = result.find(x => x._id == element.supplierID);
      element.liveBidCount = data ? data["liveBid"] : 0;
      element.preBidCount = data ? data["preliminaryBid"] : 0;
    });
    this.auctionDetails.inviteSupplier = this.suppliersDtls.filter(x => x.status == config.AUCTIONSTATUS.IN).length;
    this.auctionDetails.acceptSupplier = this.suppliersDtls.filter(x => x.status == config.AUCTIONSTATUS.AC).length;
    this.auctionDetails.bidSupplier = this.suppliersDtls.filter(x => x.status == config.AUCTIONSTATUS.BD).length;
    this.auctionDetails.preBidCount = this.suppliersDtls.map(x => x.preBidCount).reduce((a, b) => a + b);
    this.auctionDetails.liveBidCount = this.suppliersDtls.map(x => x.liveBidCount).reduce((a, b) => a + b);
  }


  getDataLandscape() {
    if (this.displayType != 'p') {
      this.lotsAndItem = this.lotsAndItem.filter(x => x["items"].length > 0);
      this.lotsAndItem.forEach(lot => {
        lot.items.forEach((item) => {
          item.lot = { lotName: lot.lotName, lotID: lot.lotID, bids: lot.bids };
          this.landscapeData.push(item);
        })
      });
    }

  }

  getReport() {
    return new Promise((resolve, reject) => {
      this.bidService.getBidReport(this.auctionID, this.reportType).subscribe((data: any) => {
        // AUCTION DATA

        this.supplierStatusData = data.data.supplierStatus;
        let auctionData = data.data.auctionData;
        this.auctionDetails.auctionId = this.auctionID;
        this.auctionIdData = ((auctionData.type.toLowerCase() == "forward") ? "AUCFWD-" : "AUCRVS-") + String(auctionData.auctionID);
        this.auctionDetails.runBy = auctionData.auctionLeader.name;
        this.auctionDetails.reportDate = auctionData.currentDate;
        this.auctionDetails.auctionName = auctionData.auctionName;
        this.auctionDetails.auctionType = (auctionData.type.toLowerCase() == "forward") ? config.AUC_TYPE[0].name : config.AUC_TYPE[1].name;
        this.auctionDetails.auctionStatus = auctionData.status;
        this.auctionDetails.primaryCurrency = auctionData.primaryCurrency;
        this.auctionDetails.auctionOpen = new Date(auctionData.startDate);
        this.auctionDetails.auctionClose = new Date(auctionData.endDate);
        this.auctionDetails.forceClosed = auctionData.actionTaken === "forcefully closed" ? "Yes" : "No";
        this.auctionDetails.extensionPeriod = auctionData.extensionSeconds / 60 + " mins";
        this.auctionDetails.gracePeriod = auctionData.gracePeriod / 60 + " mins";
        this.auctionDetails.noOfExtension = auctionData.extensions && auctionData.extensions.length > 0 ? auctionData.extensions.length : 0;
        this.auctionDetails.minBidChangeValue = auctionData.minBidChangeValue;
        this.auctionDetails.minBidChangeType = auctionData.minBidChangeType;
        this.decimalplace = auctionData.currencyDecimalPlace;

        //SUPPLIER DATA
        let supplierData = data.data.supplierInvite;
        this.suppliersDtls = [...supplierData];
        this.supplierDetails = JSON.parse(JSON.stringify(this.suppliersDtls.filter(obj => obj.status.toLowerCase() != 'suspended')));
        this.suppliersDtls.forEach(supObj => {
          if (supObj.supplierLiveRemark || supObj.supplierSuspendRemark) {
            this.liveParticipantAdded.push(supObj);
          }
        });

        // LOTS AND ITEMS
        let buyerMatrix = data.data.buyerMatrix;
        this.lotsAndItem = buyerMatrix[0].lots;
        this.buyerData = buyerMatrix;
        //BID WINNER
        this.buyerData.forEach(auc => {

          if (auc.bids.length > 0) {
            auc.bidWinner = this.getSupplierByRank(auc.bids);
          }
          auc.lots = auc.lots.filter((obj) => {
            return obj.items.length > 0;
          });
          auc.lots.forEach(lot => {
            lot.supplier = this.supplierDetails;
            if (lot.bids.length > 0) {
              lot.winner = this.getSupplierByRank(lot.bids);
            }
            lot.items.forEach(item => {
              if (item.bids.length > 0) {
                item.winner = this.getSupplierByRank(item.bids);
              }
              item.lotName = lot.lotName;
            });
          });
        });

        let bidData = [];
        // ADVANCED SUMMARY
        let advanceSummary = data.data.advanceSummary.filter((obj) => {
          return obj.items.length > 0;
        });
        //// ..for each lot.
        advanceSummary.forEach(lot => {
          // ..for each item in every lot.
          lot.items.forEach(item => {
            // ..add additional properties to each item in every lot.
            item.lotName = lot.lotName;
            item.supplierAdvanceData = [];
            item.totalHistoricalCost = 0;
            this.supplierDetails.forEach(supplier => {
              let dataBid = item.bidData.filter(x => x._id == supplier.supplierID)[0];
              let bidLength = (dataBid) ? dataBid.bidData.length : 0;
              dataBid = (dataBid) ? dataBid : new Object();
              item.supplierAdvanceData.push({ supplierID: supplier.supplierID, supplierName: supplier.supplierName1, data: null, bidLength: 0 })
              item.supplierAdvanceData.push({ supplierID: supplier.supplierID, supplierName: supplier.supplierName1, data: dataBid, bidLength: bidLength })
            });
            if (item.bidData.length > 0)
              bidData = [...bidData, ...item.bidData];

            item.totalHistoricalCost = ((item.historicalCost ? +item.historicalCost : 0) * (item.minimumDesiredQuantity ? +item.minimumDesiredQuantity : 0));
            this.advanceSummaryData.push(item);
          });
        });
        this.getDataLandscape();
        resolve(JSON.parse(JSON.stringify(data.data.bidCountData)));
      }, (err) => {
        reject(err);
      })
    })
  }

  getSupplierByRank(dataBid) {
    let supplierName = "";
    let rankData = dataBid.filter(x => x.rank == 1);
    if (rankData && rankData.length > 0) {
      supplierName = this.supplierDetails.filter(x => x.supplierID == rankData[0].data._id)[0].supplierName1;
    }
    return supplierName;
  }

  getReportExcel() {
    if (this.route.snapshot.params.breadCrumbStatus && this.route.snapshot.params.breadCrumbStatus.toLowerCase() === 'closed') {
      this.downButt = true;
      setTimeout(() => {
        this.downButt = false;
      }, 5000);
      if (this.displayType.type == 'p') {
        this.bidService.getBidReportExcel(this.auctionID, this.reportType).subscribe(res => {
          this.common.success("Request raised for report generation");
        }, err => { this.common.error("Failed to raise request for report generation") })
      }
      else {
        this.bidService.getBidReportExcelLandscape(this.auctionID, this.reportType).subscribe(res => {
          this.common.success("Request raised for report generation");
        }, err => { this.common.error("Failed to raise request for report generation") })
      }
    } else {
      this.common.warning('Not Available');
    }

  }

}
