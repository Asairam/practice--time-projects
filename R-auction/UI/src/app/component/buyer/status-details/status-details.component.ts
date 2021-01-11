import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerStatusService } from '../../component-service/buyer-status.service';
import { CommonService } from '../../../commonService/common.service';
import { Location } from '@angular/common';
import * as config from '../../../appConfig/app.config';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { AuthService } from '../../../authService/auth.service';
import { BuyerBiddingService } from '../../component-service/buyer-bidding.service';
import { BuyerEditService } from '../../component-service/buyer-edit.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { EditService } from '../edit/edit.service';
import { Store } from '@ngrx/store';
import * as routerconfig from '../../../appConfig/router.config';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-status-details',
  templateUrl: './status-details.component.html',
  styleUrls: ['./status-details.component.css'],
  providers: [EditService]
})
export class StatusDetailsComponent implements OnInit {
  imageURL = environment.rauction;
  @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;
  translateSer: any;
  translateSerCommon: any;
  aucStatusList = [{ 'name': 'All', 'value': 'All' }, { 'name': 'Draft', 'value': 'Draft' }, { 'name': 'Open', 'value': 'Open' }, { 'name': 'Paused', 'value': 'Paused' }, { 'name': 'Published', 'value': 'Published' }, { 'name': 'Closed', 'value': 'Closed' }, { 'name': 'Cancelled', 'value': 'Cancelled' }];
  auctionFilter = config.filterAllAuction;
  sorting = false;
  selectFilter = config.filterAllAuction[0].value;
  pageLocation = window.location.pathname.indexOf('/'+routerconfig.buyer_router_links.BUYER_SEARCH) != -1 ? false : true;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private buyerstatusService: BuyerStatusService, 
    private commonService: CommonService, 
    private location: Location, 
    private matDialog: MatDialog, 
    private auth: AuthService, 
    public bidService: BuyerBiddingService, 
    private buyerService: BuyerEditService,
    private store: Store<any>,
    private editService: EditService
    ) {
    this.commonService.translateSer('STATUS_DETAILS').subscribe(async (text: string) => {
      this.translateSer = text;
    });
    this.commonService.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSerCommon = text;
    });
    // this.commonService.toggleDiv.subscribe(
    //   (data: any) => {
    //     if (data.flag === 'globalsearch') {
    //       this.auctionList = [];
    //       this.sum = 1;
    //       this.globalSearch(this.sum);
    //       data.flag = null;
    //     }
    //   });
  }
  aucStatus = this.route.snapshot.queryParamMap.get('status');
  auctionList = [];
  view = 'card';
  sum = 1;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  selectedFilter = { filterName: config.filterAllAuction[0].id, sort: 'DESC' }
  ngOnInit() {
    if (this.pageLocation) {
      this.getAucList(this.aucStatus, 1);
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

  getAucList(aucStatus, no) {
    // this.commonService.loader = true;
    try {
      let status = aucStatus;
      if (aucStatus === 'All') {
        status = '';
      }
      let obj = {
        "status": status,
        "pageNum": no,
        "sort": [this.selectedFilter.filterName, this.selectedFilter.sort]
      }
      this.buyerstatusService.getBuyerList(obj).subscribe((res: any) => {
        if (res['success']) {
          res['data'].forEach((obj) => {
            this.auctionList.push(obj);
            // obj.isHost = this.auth.getUserData().email !== obj.auctionLeader.email ? true : false;
            if(this.auth.getUserData().email !== obj.auctionLeader.email) {
              obj.isHost = true;
            } else {
              obj.isHost = false;
            }
            if ((obj.status === 'Open' || obj.status === 'Paused') && new Date(obj.endDate) >= new Date()) {
              const filterRes = this.commonService.dateTimeFilter(new Date(), new Date(obj.endDate));
              obj.TimeRemaining = filterRes.days + " day " + filterRes.hours + " hours " + filterRes.minutes + " minutes to go";
            } else if (obj.status === 'Published' && new Date(obj.startDate) > new Date()) {
              const filterRes = this.commonService.dateTimeFilter(new Date(), new Date(obj.startDate));
              obj.TimeRemaining = filterRes.days + " day " + filterRes.hours + " hours " + filterRes.minutes + " minutes to go";
            }
            if (obj.profilePicture) {
              obj.profilePicture = this.commonService.downloadAttachmentData(obj.profilePicture);
            }
            obj.lessMore = 'less';
          });
          // this.commonService.loader = false;

        }
      }, error => { this.commonService.loader = false; });
    } catch (err) { this.commonService.loader = false; }
  }

  viewType(type) {
    this.view = type;
  }

  lessAndMore(ind, opt) {
    this.auctionList[ind].lessMore = opt;
  }

  aucFilter(type) {
    this.aucStatus = type.value;
    this.location.replaceState('/'+routerconfig.buyer_router_links.BUYER_LIST_VIEW+'?status=' + type.value);
    this.getAucList(type.value, 1);
    this.auctionList = [];
    this.sum = 1;
    this.infiniteScroll.ngOnDestroy();
    this.infiniteScroll.setup()
  }

  onScrollDown() {
    this.sum += 1;
    if (this.pageLocation) {
      this.getAucList(this.aucStatus, this.sum);
    } else {
      this.globalSearch(this.sum);
    }
  }

  openLiveAuction() {
    this.router.navigate([routerconfig.buyer_router_links.LIVE_AUCTION]);
  }
  openLiveBidding(id) {
    this.router.navigate([`/livebidding/${id}`, { breadCrumbStatus: this.aucStatus ? this.aucStatus : 'All' }]);
  }

  auctionSorting(sort = 0) {
    let selectedField = this.auctionFilter.find(x => x.value == this.selectFilter);
    if (selectedField.id) {
      if (sort < 2) {
        if(sort == 0) {
          this.sorting = false;
        } else {
          this.sorting = true;
        }
        // this.sorting = (sort == 0) ? false : true;
      }
      this.selectedFilter = {
        filterName: selectedField.id,
        sort: this.sorting ? 'DESC' : 'ASC'
      }
      this.auctionList = [];
      this.getAucList(this.aucStatus, this.sum);
    }
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
    this.commonService.globalsearch(obj).subscribe((res: any) => {
      res['data'].forEach((obj) => {
        // obj.isHost = this.auth.getUserData().email !== obj.auctionLeader.email ? true : false;
        if(this.auth.getUserData().email !== obj.auctionLeader.email) {
          obj.isHost = true;
        } else {
          obj.isHost = false;
        }
        this.auctionList.push(obj);
        if (obj.status === 'Open' || obj.status === 'Paused' && new Date(obj.endDate) >= new Date()) {
          const filterRes = this.commonService.dateTimeFilter(new Date(), new Date(obj.endDate));
          obj.TimeRemaining = filterRes.days + " day " + filterRes.hours + " hours " + filterRes.minutes + " minutes to go";
        } else if (obj.status === 'Published' && new Date(obj.startDate) > new Date()) {
          const filterRes = this.commonService.dateTimeFilter(new Date(), new Date(obj.startDate));
          obj.TimeRemaining = filterRes.days + " day " + filterRes.hours + " hours " + filterRes.minutes + " minutes to go";
        }
        if (obj.profilePicture) {
          obj.profilePicture = this.commonService.downloadAttachmentData(obj.profilePicture);
        }
        obj.lessMore = 'less';
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
        // supplierList: this.supplierList,
        chat: "offline"
      }
    };
    this.commonService.toggleDiv.emit(dialogData);
  }
  openAuditLog(id) {
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-vlg';
    objMatDialogConfig.data = {
      dialogMessage: "Audit Log",
      tab: 'audit-log',
      dialogNegativeBtn: "Close",
      auctionID: id
    }
    objMatDialogConfig.disableClose = true;
    let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
    refMatDialog.afterClosed().subscribe((value) => {
    })
  }

  confirmPopup(val, obj) {
    var msg;
    switch (val) {
      case 'pauseButt':
        msg = this.translateSer['MSG_CAP_STA']['PAUSE'];
        break;
      case 'playButt':
        msg = this.translateSer['MSG_CAP_STA']['RESUME'];
        break;
      case 'stopButt':
        msg = this.translateSer['MSG_CAP_STA']['CLOSE'];
        break;
      case 'canelButt':
        msg = this.translateSer['MSG_CAP_STA']['CANCEL'];
        break;
      case 'deleteButt':
        msg = this.translateSer['MSG_CAP_STA']['DELETE'];
        break;
      default:
      // code block
    }
    try {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-xs';
      objMatDialogConfig.data = {
        dialogMessage: this.translateSerCommon['PLZ_CON'],
        dialogContent: this.translateSerCommon['DO_U_W_T']['DO'] + msg + ': <b>' + obj.auctionName + '</b>?',
        tab: 'confirm_msg',
        dialogPositiveBtn: "Yes",
        dialogNegativeBtn: "No"
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        if (value) {
          if (val == 'stopButt') {
            this.forceClose(obj);
          } else if (val == 'canelButt') {
            this.cancelAuc(obj);
          } else if (val == 'deleteButt') {
            this.deleteAuc(obj);
          } else {
            this.pausePlayButt(obj);
          }
        }
      });
    } catch (e) { }
  }

  pausePlayButt(val) {
    var obj = {
      "auctionID": val.auctionID,
      "type": val.status.toLowerCase() === 'paused' ? 'Resume' : 'Paused'
    };
    this.bidService.pauseResumeAuction(obj).subscribe((res) => {
      if (res['success']) {
        if (obj.type.toLowerCase() == 'resume') {
          val.status = 'Open';
        } else if (obj.type.toLowerCase() == 'paused') {
          val.status = 'Paused';
        }
        this.commonService.success(val.auctionName + ' ' + obj.type + " Successfully.");
      }
    }, (err) => { });
  }

  forceClose(val) {
    let objDtls = {
      auctionID: val.auctionID,
      type: "closeAuction"
    }
    if (val.status.toLowerCase() == 'open') {
      this.buyerService.updateStatusOpenClose(objDtls).subscribe((res: any) => {
        if (res['success']) {
          val.status = 'Closed';
          this.commonService.success(val.auctionName + ' closed successfully.');
        }
      });
    }
  }

  seleAtt(val) {
    if (val.attachmentList && val.attachmentList.length == 0) {
      this.commonService.warning(this.translateSerCommon['NO_REC_FOU']);
    } else {
      let sendData = {
        flag: 'openAttach',
        pageFrom: 'header_attachment',
        data: { data: val, 'pageFrom': 'readonly' }
      }
      this.commonService.toggleDiv.emit(sendData);
    }
  }

  cancelAuc(val) {
    this.buyerService.auctionDelete(val.auctionID).subscribe((res) => {
      if (res['success']) {
        val.status = 'Cancelled';
        this.commonService.success(val.auctionName + ' cancelled successfully.')
      }
    })
  }

  showSupplier(type, list) {
    var invited = list.supplierInvited + list.supplierAccepted + list.supplierBidded;
    var accepted = list.supplierAccepted + list.supplierBidded;
    var bidded = list.supplierBidded;
    if ((type.toLowerCase() === 'invited' && invited) || (type.toLowerCase() === 'accepted' && accepted) || (type.toLowerCase() === 'bidded' && bidded)) {
      let dialogData = {
        flag: 'openAttach',
        pageFrom: 'show_card_suppliers',
        data: {
          seleType: type,
          auctionData: list
        }
      };
      this.commonService.toggleDiv.emit(dialogData);
    } else {
      this.commonService.warning(this.translateSerCommon['NO_REC_FOU']);
    }
  }

  

  redirectToEdit(val) {
    this.editService.redirectToEdit(val)
  }
  

  deleteAuc(obj) {
    this.buyerService.auctionHardDelete(obj.auctionID).subscribe((res) => {
      if (res['success']) {
        let ind = this.auctionList.findIndex(res => res['auctionID'] === obj.auctionID);
        this.auctionList.splice(ind, 1);
        this.commonService.success(obj.auctionName + ' deleted successfully.')
      }
    })
  }

  roundAuc(val) {
  let obj = {
    status: val.status,
    mode :'readonly',
    roundsAuc:true
  }
    this.router.navigate([routerconfig.buyer_router_links.EDIT_AUCTION+`/${val.auctionID}`], { queryParams: obj });
  }

}
