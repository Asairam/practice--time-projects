import { Component, OnInit } from '@angular/core';
import { BuyerStatusService } from '../../component-service/buyer-status.service';
import { CommonService } from '../../../commonService/common.service';
import { Router } from '@angular/router';
import { BuyerEditService } from '../../component-service/buyer-edit.service';
import * as config from '../../../appConfig/app.config';
import * as routerconfig from '../../../appConfig/router.config';
import { getLocaleTimeFormat } from '@angular/common';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-clone-auction',
  templateUrl: './clone-auction.component.html',
  styleUrls: ['./clone-auction.component.css']
})
export class CloneAuctionComponent implements OnInit {
  imageurl = environment.rauction;
  scrollDistance = 1;
  scrollUpDistance = 2;
  throttle = 300;
  sum = 1;
  auctionList = [];
  aucStatus = 'Clone';
  translateSerCommon: any;
  translateSer: any;
  view = 'card';
  basicInfoData: any;
  newAuctionID: any;
  newLotList: any;
  oldLotList: any;
  defaultLotID: any;
  oldItemList: any;
  oldParticipantList: any;
  oldHostList: any;
  hostData: any;
  oldCustomFieldData: any;
  itemData = [];
  cloneAucName = '';
  cloneFromAucName = '';
  
  constructor(private buyerservice: BuyerEditService, private route: Router, private buyerstatusService: BuyerStatusService, private commonService: CommonService, private matDialog: MatDialog) {
    this.commonService.translateSer('STATUS_DETAILS').subscribe(async (text: string) => {
      this.translateSer = text;
    });
    this.commonService.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSerCommon = text;
    });
  }



  ngOnInit() {
    this.getAucList(this.aucStatus, 1);

  }

  getAucList(aucStatus, no) {
    try {
      let status = aucStatus;
      // if (aucStatus === 'Clone') {
      //   status = '';
      // }
      let obj = {
        "status": status,
        "pageNum": no
      }
      this.buyerstatusService.getBuyerList(obj).subscribe((res: any) => {
        if (res['success']) {
          res['data'].forEach((obj) => {
            this.auctionList.push(obj);
            // this.auctionList = this.auctionList.filter(obj => obj.status != 'Draft');
          });
        }
      }, error => { });
    } catch (err) { }
  }
  createClone(auctionID) {
    //this.route.navigate(['/createclone']);
    this.buyerservice.cloneAuctionID = auctionID;
    this.buyerservice.getAuctionData(this.buyerservice.cloneAuctionID).subscribe((res) => {
      if (res["success"]) {
        this.basicInfoData = res["data"]
        this.basicInfoData.currency.forEach(element => {
          delete element._id;
          delete element.exchangeRateDate;
        });
        this.saveBasicinfo();
      }
    });
  }
  onScrollDown() {
    this.sum += 1;
    this.getAucList(this.aucStatus, this.sum);
  }
  saveBasicinfo() {
    let objBasicInfo = {
      type: this.basicInfoData.type,
      // auctionName: this.basicInfoData.auctionName + ' - ' + new Date().toLocaleDateString() + ' - ' + 'Clone',
      auctionName: this.cloneAucName,
      description: this.basicInfoData.description,
      auctionStatus: config.AUCTIONSTATUS.DR,
      primaryCurrency: this.basicInfoData.primaryCurrency,
      company: this.basicInfoData.company,
      auctionLeader: this.basicInfoData.auctionLeader,
      businessUnit: this.basicInfoData.businessUnit,
      currencyDecimalPlace: this.basicInfoData.currencyDecimalPlace,
      testUse: false,
      attachmentList: this.basicInfoData.attachmentList,
      currency: this.basicInfoData.currency,
      cloneFrom: {
        auctionID: this.buyerservice.cloneAuctionID,
        auctionName: this.cloneFromAucName
      },
      isSealedBidAuction: this.basicInfoData.isSealedBidAuction
    };
    this.buyerservice.postAuctionData(objBasicInfo).subscribe((res) => {
      if (res['success']) {
        this.newAuctionID = res['auctionID']
        console.log(this.newAuctionID);
        this.bidingRules();
      }
    }, (err) => {
      this.commonService.error(err);
    });
  }
  bidingRules() {
    let obj = {
      allowties: this.basicInfoData.allowties,
      auctionID: this.newAuctionID,
      bestBidInfoShownBy: this.basicInfoData.bestBidInfoShownBy,
      bidCushionType: this.basicInfoData.bidCushionType,
      bidCushionTypeLowerLimit: this.basicInfoData.bidCushionTypeLowerLimit,
      bidCushionTypeUpperLimit: this.basicInfoData.bidCushionTypeUpperLimit,
      extensionSeconds: this.basicInfoData.extensionSeconds,
      extensionType: this.basicInfoData.extensionType,
      gracePeriod: this.basicInfoData.gracePeriod,
      infoShownToSupplier: this.basicInfoData.infoShownToSupplier,
      minBidChangeType: this.basicInfoData.minBidChangeType,
      minBidChangeValue: this.basicInfoData.minBidChangeValue
    }
    this.buyerservice.updateBiddingRules(obj).subscribe(res => {
    })

    this.getbothlotID()
  }
  customeFieldSave() {
    if (this.oldCustomFieldData.length > 0) {
      var count = 0;
      this.oldCustomFieldData.forEach(element => {
        element.auctionID = this.newAuctionID
        const { createdAt, createdBy, customFieldID, updatedAt, __v, _id, ...noA } = element;
        this.buyerservice.createCustomFieldData(noA).subscribe(res => {
          this.itemData.forEach(item => {
            item.customFieldData.forEach(custom => {
              if (custom.name == res['data']['fieldName']) {
                count += 1;
                custom.customFieldID = res['data']['customFieldID'];
                if (count == this.oldCustomFieldData.length) {
                  this.createItem(this.itemData);
                }
              }
            });
          });

        });
      });

    }
  }
  getbothlotID() {
    this.buyerservice.getBothLot(this.buyerservice.cloneAuctionID, this.newAuctionID).subscribe((res) => {
      if (res[0]['data']) {
        this.oldLotList = res[0]['data']
        this.newLotList = res[1]['data']
        this.oldItemList = res[2]['data']
        this.oldParticipantList = res[3]['data']
        this.oldHostList = res[4]['data']
        this.oldCustomFieldData = res[5]['data']
        this.oldLotList.forEach(element => {
          if (element.lotName === this.newLotList[0].lotName) {
            element.lotID = this.newLotList[0].lotID;
            // element.res = true;
            this.defaultLotID = this.newLotList[0].lotID;

          }
        });
        this.removeLotId();
      }
    });
  }
  removeLotId() {
    // this.customeFieldSave();
    let lotIndex = this.oldLotList.length;
    this.oldLotList.forEach((element, index) => {
      element.auctionID = this.newAuctionID;
      if (element.lotName !== 'Default') {
        const { lotID, createdAt, createdBy, updatedAt, updatedBy, __v, _id, items, dis, ...noA } = element;
        this.createLot(noA, lotIndex, index);

      }
      else {
        if (lotIndex == 1) {
          this.RemoveItemId(true);
        }
      }
    });
  }
  createLot(lotObj, lotIndex, index) {
    this.buyerservice.createLot(lotObj).subscribe((res) => {
      if (res["success"]) {
        lotObj = res["data"];
        this.oldLotList.forEach(element => {
          if (element.lotName.toLowerCase() == lotObj.lotName.toLowerCase()) {
            element.lotID = lotObj.lotID;
          }

        });
        this.oldItemList.forEach(element => {


          if (element.lotType.toLowerCase() == lotObj.lotName.toLowerCase()) {
            element.lotID = lotObj.lotID;
          }
          else if (element.lotType.toLowerCase() == "default") {
            element.lotID = this.defaultLotID;
          }

        });
        if ((lotIndex - 1) == index) {
          this.RemoveItemId();
        }
      }
    })
  }
  RemoveItemId(defultflag: boolean = false) {
    this.itemData = [];
    this.oldItemList.forEach(elements => {
      if (defultflag) {
        elements.lotID = this.defaultLotID;
      }
      elements.auctionID = this.newAuctionID;
      const { amount, amountFlag, bestBid, createdAt, createdBy, currency, flag, itemID, updatedAt, updatedBy, _id, __v, submit, attachmentListLength, totalBestBid, ...noB } = elements;
      this.itemData.push(noB);
    });

    if (this.itemData && this.itemData.length > 0 && this.itemData[0]['customFieldData'] && this.itemData[0]['customFieldData'].length > 0) {
      this.customeFieldSave();
    } else {
      this.createItem(this.itemData);
    }
  }
  createItem(itemList) {
    this.buyerservice.saveItemList(itemList, this.newAuctionID).subscribe((res) => {
      if (res["success"]) {
        let supplierdata = [];
        this.hostData = [];
        this.oldParticipantList.supplierList.forEach(elements => {
          const { status, ...noB } = elements;
          supplierdata.push(noB);
        });
        this.oldHostList.hostInvites.forEach(element => {
          this.hostData.push(element)
        });
        this.saveMailBody().then((result)=>{
          this.saveSupplier(supplierdata);
        })    

      }
    })
  }

  saveMailBody = () => {
    return new Promise((resolve, reject) => {
      try {
        this.buyerservice.supplierMail = this.oldParticipantList ? this.oldParticipantList.body : "";
        this.buyerservice.hostMail = this.oldHostList ? this.oldHostList.body : "";
        this.buyerservice.supplierMail = String(this.buyerservice.supplierMailBody(null,"Draft"));
        this.buyerservice.hostMail = String(this.buyerservice.hostMailBody(null,"Draft"));
        resolve();
      } catch (ex) {
        this.commonService.error("Unable to save particpants and co-hosts.");
        reject(ex);
      }
    })
  }

  saveSupplier(supplierdata) {
      let supplierDetail = {
      auctionID: this.newAuctionID,
      body: this.buyerservice.supplierMail,
      supplierList: supplierdata
    }
    let hostDetail = {
      auctionID: this.newAuctionID,
      body: this.buyerservice.hostMail,
      hostInvites: this.hostData
    }
    this.buyerservice.insertSupplierData(supplierDetail).subscribe((res: any) => {
      if (res["success"]) {
        if (this.hostData && this.hostData.length > 0) {
          this.buyerservice.insertHostData(hostDetail).subscribe((res: any) => {
          })
        }
        this.route.navigate([routerconfig.buyer_router_links.EDIT_AUCTION+'/', this.newAuctionID], { queryParams: { status: 'Draft' } });
      }
    });
  }
  viewType(type) {
    this.view = type;
  }

  onTextClickData(auc) {
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-sm';
    objMatDialogConfig.data = {
      dialogMessage: 'Please Confirm',
      tab: 'template-confirm',
      dialogPositiveBtn: "Yes",
      dialogNegativeBtn: "No"
    }
    objMatDialogConfig.disableClose = true;
    let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
    refMatDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.cloneAucName = value;
        this.cloneFromAucName = auc.auctionName;
        this.createClone(auc.auctionID);
      }
    });
  }
  openLiveBidding(list) {
    this.route.navigate([`/livebidding/${list.auctionID}`, { breadCrumbStatus: list.status }]);
  }

  oncli() {
    this.commonService.buyerRedirectLanding();
  }
}
