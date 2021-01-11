import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from '../../component-service/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../commonService/common.service';
import { Location } from '@angular/common';
import { CommonPopupComponent } from 'src/app/shared/component/common-popup/common-popup.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import * as config from 'src/app/appConfig/app.config';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import * as routerconfig from '../../../appConfig/router.config';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { AuthService } from 'src/app/authService';
import { BuyerEditService } from '../../component-service/buyer-edit.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-supplier-status-details',
  templateUrl: './supplier-status-details.component.html',
  styleUrls: ['./supplier-status-details.component.css']
})
export class SupplierStatusDetailsComponent implements OnInit {
  imageURL1 = environment.rauction;
  @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;
  auctionList = [];
  view = 'card';
  aucStatusList = [{ 'name': 'All', 'value': 'All' }, { 'name': 'Open', 'value': 'live' }, { 'name': 'Paused', 'value': 'paused' }, { 'name': 'Published', 'value': 'published' }, { 'name': 'Closed', 'value': 'closed' }];
  sum = 1;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  translateSer: any;
  translateSerCommon:any;
	reportType: any = 'bestCase';
  pageLocation = window.location.pathname.indexOf('/'+routerconfig.supplier_router_links.PARTICIPANT_SEARCH) != -1 ? false : true; supplierStatus = config.AUCTIONSTATUS;
  constructor(
    private buyerService: BuyerEditService,
    private MatDialog: MatDialog, 
    private supplierservice: SupplierService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private commonService: CommonService, 
    private location: Location,
    private auth: AuthService,) {
    this.commonService.translateSer('STATUS_DETAILS').subscribe(async (text: string) => {
      this.translateSer = text;
    });
    this.commonService.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSerCommon = text;
    });
  }

  aucStatus = this.route.snapshot.queryParamMap.get('status');

  ngOnInit() {
    if (this.pageLocation) {
      this.getSupplierList(this.aucStatus, 1);
    } else {
      this.route.queryParams.subscribe(params => {
        if (params['value']) {
          this.commonService.usersearch.headersearch = params['value'];
          this.commonService.usersearch.searchType = params['type'];
          if (this.commonService.usersearch.headersearch) {
            this.globalSearch(1);
          }
        }
      });
    }
  }
  
  downloadReport(auctionId) {
    
    this.supplierservice.getBidReport(auctionId, this.reportType)
    // .subscribe((res: any) => {
    //   if (res) { 
    //     // console.log("report---", res);
    //     var blob = new Blob([res], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    //     var url = URL.createObjectURL(blob);
    //     // download process
    //     var a = document.createElement("a");
    //     a.setAttribute("href", url);
    //     a.setAttribute("download", url);
    //     a.click();
    //     document.removeChild(a);

    //    window.open(url); 

    //   }
    // });
  }

  getSupplierList(aucStatus, no) {
    try {
      let status = aucStatus;
      let obj = {
        "status": status,
        "pageNum": no
      }
      this.supplierservice.getSupplierData(obj).subscribe((res: any) => {
        if (res['success']) {
          res['data'].forEach(element => {
            this.auctionList.push(element);
            if (element.auction.status.toLowerCase() === 'published' && new Date(element.auction.startDate) >= new Date()) {
              const filterRes = this.commonService.dateTimeFilter(new Date(), new Date(element.auction.startDate));
              element.auction.TimeRemaining = filterRes.days + " day " + filterRes.hours + " hours " + filterRes.minutes + " minutes to go";
            } else if (element.auction.status.toLowerCase() !== 'published' && element.auction.status.toLowerCase() !== 'closed' && new Date(element.auction.endDate) > new Date()) {
              const filterRes = this.commonService.dateTimeFilter(new Date(), new Date(element.auction.endDate));
              element.auction.TimeRemaining = filterRes.days + " day " + filterRes.hours + " hours " + filterRes.minutes + " minutes to go";
            }
          });
        }
      }, error => { });
    } catch (err) { }
  }

  viewType(type) {
    this.view = type;
  }
  openSupplierBidding(id, supplierStatus) {
    if (supplierStatus == this.supplierStatus.RJ) {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.data = {
        dialogMessage: this.translateSer['REJECT'],
        tab: 'reject',
        dialogPositiveBtn: "Yes",
        dialogNegativeBtn: "No"
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.MatDialog.open(CommonPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {

      });
    }
    else {
      this.router.navigate([routerconfig.supplier_router_links.PARTICIPANT_SUMMARY_VIEW+`/${id}`]);
    }
  }
  onScrollDown() {
    const start = this.sum;
    this.sum += 1;
    if (this.pageLocation) {
      this.getSupplierList(this.aucStatus, this.sum);
    } else {
      this.globalSearch(this.sum);
    }
  }
  aucFilter(type) {
    this.aucStatus = type.value;
    this.location.replaceState('/'+routerconfig.supplier_router_links.PARTICIPANT_LIST_VIEW+'?status=' + type.value);
    this.getSupplierList(type.value, 1);
    this.auctionList = [];
    this.sum = 1;
    this.infiniteScroll.ngOnDestroy();
    this.infiniteScroll.setup()
  }

  globalSearch(num) {
    let search = this.commonService.usersearch.headersearch;
    let obj = {
      "auctionName": search,
      "auctionID": isNaN(search) ? null : Number(search),
      "vendorcode": search,
      "auctionDescription": search,
      "auctionStatus": search,
      "vendorName": search,
      "itemName": search,
      "itemCode": search,
      "cohostName": search,
      "itemDescription": search,
      "rfqNo": isNaN(search) ? null : Number(search)
    };
    if (this.commonService.usersearch.searchType != 'all') {
      Object.keys(obj).forEach(key => {
        if (key == 'auctionID' && this.commonService.usersearch.searchType !== 'auctionID') {
          obj[key] = null;
        } else if (key == 'rfqNo' && this.commonService.usersearch.searchType !== 'rfqNo') {
          obj[key] = null;
        } else if (this.commonService.usersearch.searchType !== key && key !== 'auctionID') {
          obj[key] = '';
        }
      });
    }
    Object.assign(obj, { "pageNo": num });
    this.commonService.globalsearchSupplier(obj).subscribe((res: any) => {
      res['data'].forEach((obj) => {
        this.auctionList.push(obj);
      });
    }, err => { });
  }

  queryDialog(auctionID) {
    let dialogData = {
      flag: 'openAttach',
      pageFrom: 'query_history_auction',
      data: {
        auctionID: auctionID,
        auctionData: null,
        chat: "offline"
      }
    };
    this.commonService.toggleDiv.emit(dialogData);
  }

  viewSummaryDialog(auctionId){
console.log("print-priview");
    Promise.all([
      this.getSupplierData(auctionId),
      this.getAuctiondata(auctionId),
      this.getItems(auctionId)
    ]).then((result: any) => {
      let supplierData = result[0];
      let auctionData = result[1];
      let items = result[2];
      let userDtls = this.auth.getUserData();
      let customeFields = [];
      if(items.length>0) {
        customeFields = items[0].customFieldData;
        customeFields = customeFields.map(item => {
          item.fieldName = item.name;
          return item;
        });
      }
      let printViewObj = {
        basicInformation: auctionData,
        contactperson: {
          name: userDtls.name.firstname + ' ' + userDtls.name.lastname,
          email: userDtls.email ? userDtls.email : '',
          number: userDtls.mobile ? userDtls.mobile : ''
        },
        biddingRules: {
          extendauctionNewBid: auctionData.extensionType ? auctionData.extensionType : '',
          gracePeriod: auctionData.gracePeriod ? auctionData.gracePeriod : '',
          extentionTime: auctionData.extensionSeconds ? auctionData.extensionSeconds : '',
          minBidChange: auctionData.minBidChangeValue,
          bidCusionLimit: ( auctionData.type!==config.AUC_TYPE[0].value)?auctionData.bidCushionTypeLowerLimit:auctionData.bidCushionTypeUpperLimit,
          minBidChangeType: auctionData.minBidChangeType,
          bidCushionTypeLimit: auctionData.bidCushionType,
          primaryCurrency: auctionData.primaryCurrency ? auctionData.primaryCurrency : '',
          biddingCurrency: auctionData.currency ? auctionData.currency : ''

        },
        shedule: {
          startDate: auctionData.startDate ? auctionData.startDate : '',
          endDate: auctionData.endDate,
        },
        supplier: [{...supplierData}],
        item:  items,
        flag:'supplier',
        customField:customeFields
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
      let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
      })
    })
    


    


    
  }

  getAuctiondata(auctionId) {
    return new Promise((resolve, reject) => {
      this.supplierservice.getLiveBidDetails(auctionId).subscribe((result : any) => {
        let auctionData = result.data;
        resolve(auctionData)
      }, (err) => {
        reject({message: 'api failed'});
      });
    })
  }

  getSupplierData(auctionID) {
    return new Promise((resolve, reject) => {
      let supplierData: any = [];
      this.buyerService.getSupplierAndPreliminary(auctionID,this.auth.getUserData().settings.ril.vendorcodeSelected).subscribe((res: any) => {
        supplierData = res[0]["data"] ? res[0]["data"].supplierList : [];
        if (supplierData.length > 0) {
          supplierData = supplierData.find(x => x.supplierID == this.auth.getUserData().settings.ril.vendorcodeSelected);
          if (!supplierData["supplierCurrency"]) {
            supplierData.supplierCurrency = { currencyCode: "INR", currencyName: "Indian Rupee" };
            supplierData.supplierAF = 0;
            supplierData.supplierMF = 0;
          }
        }
        resolve(supplierData);
      }, err => {
        reject({message: 'Supplier api failed'});
      })
    })
    
  }

  getItems(auctionId) {
    return new Promise((resolve, reject) => {
      this.supplierservice.getSupplierBiddingList(auctionId).subscribe((result : any) => {
        let obj = result.data[0];
        let newItemList = []
        obj.lots.forEach(lot => {
          lot.items.forEach(item => {
            item['lotID'] = lot.lotID;
            item['lotName'] = lot.lotName;
            newItemList.push(item);
          });
        })
        resolve(newItemList);
      }, (err) => {
        reject({message: 'api failed'});
      });
    });    
  }


}
