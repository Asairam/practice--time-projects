import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BuyerStatusService } from '../../component-service/buyer-status.service';
import { CommonService } from '../../../commonService/common.service';
import { Subscription } from 'rxjs';
import { SocketService } from '../../socketService/socket.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { BuyerBiddingService } from '../../component-service/buyer-bidding.service';
import { AuthService } from '../../../authService/auth.service';
import { BuyerEditService } from '../../component-service/buyer-edit.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as routerconfig from '../../../appConfig/router.config';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-live-auction-details',
  templateUrl: './live-auction-details.component.html',
  styleUrls: ['./live-auction-details.component.css'],
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(179deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])
  ]
})
export class LiveAuctionDetailsComponent implements OnInit {
  imageURLLive = environment.rauction;
  translateSerCommon: any;
  translateSer1 : any;
  sum = 1;
  pauseAucName = '';
  msgBoxShow = true;
  constructor(private router: Router, private buyerstatusService: BuyerStatusService, private commonService: CommonService, private socketService: SocketService, private matDialog: MatDialog, public bidService: BuyerBiddingService, private auth: AuthService, private buyereditService: BuyerEditService) {
    this.commonService.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSerCommon = text;
    });
    this.commonService.translateSer('STATUS_DETAILS').subscribe(async (text: string) => {
      this.translateSer1 = text;
    });
  }
  auctionList1: any = [];
  view = 'card';
  bidtimeSocket3: Subscription;
  timeSocketdetail: Subscription;
  scrollDistancedetail = 1;
  scrollUpDistancedetail = 2;
  throttledetail = 300;
  ngOnInit() {
    this.getAucListLiveDetail(1);
  }

  ngOnDestroy() {
    try {
      this.timeSocketdetail.unsubscribe();
      this.bidtimeSocket3.unsubscribe();
    } catch (e) {
    }
  }
  getAucListLiveDetail(no) {
    try {

      let obj = {
        "status": "Open",
        "pageNum": no
      }
      this.buyerstatusService.getBuyerList(obj).subscribe((res: any) => {
        if (res['success']) {
          if (res['success'])
            console.log(res['data'])
          res['data'].forEach((obj) => {
            this.auctionList1.push(obj);
            this.initalizeSocketDetail(obj.auctionID);
            this.getPausePlaySocketDataDetail(obj.auctionID);
            if (new Date(obj.startDate) > new Date()) {
              const filterRes = this.commonService.dateTimeFilter(new Date(), new Date(obj.startDate));
              obj.TimeRemaining = filterRes.days + " day " + filterRes.hours + " hours to go";
            }
            if (obj.profilePicture) {
              obj.profilePicture = this.commonService.downloadAttachmentData(obj.profilePicture);
            }
            obj.lessMore = 'less';
            // obj.isHost = this.auth.getUserData().email !== obj.auctionLeader.email ? true : false;
            obj.flip = 'inactive';
          });

        }
      }, error => { this.commonService.loader = false; });
    } catch (err) { this.commonService.loader = false; }
  }

  viewType(type) {
    this.view = type;
  }

  // lessAndMore(ind, opt) {
  //   this.auctionList[ind].lessMore = opt;
  // }

  openLiveBidding(id) {
    this.router.navigate([`/livebidding/${id}`, { breadCrumbStatus: 'Open' }]);
  }

  goBack() {
    this.router.navigate([routerconfig.buyer_router_links.BUYER_LIST_VIEW], { queryParams: { status: 'Open' } });
  }

  initalizeSocketDetail(aucID) {
    this.bidtimeSocket3 = this.socketService.getAllAucData(aucID)
      .subscribe(data => {
        let index = this.auctionList1.findIndex(obj => obj['auctionID'] === data[0].auctionID);
        // data[0]['isHost'] = this.auth.getUserData().email !== data[0].auctionLeader.email ? true : false;
        for (let [key, value] of Object.entries(data[0])) {
          this.auctionList1[index][key] = value;
        }
      });
  }

  confirmPopup(val, obj, ind) {
    var msg;
    switch (val) {
      case 'pauseButt':
        msg = this.translateSer1['MSG_CAP_STA']['PAUSE'];
        break;
      case 'stopButt':
        msg = this.translateSer1['MSG_CAP_STA']['CLOSE'];
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
          this.msgBoxShow = false;
          if (val == 'stopButt') {
            this.forceClose(obj, ind);
          } else {
            this.pausePlayButt(obj, ind);
          }
        }
      });
    } catch (e) { }
  }

  pausePlayButt(val, ind) {
    var obj = {
      "auctionID": val.auctionID,
      "type": 'Paused'
    };
    this.bidService.pauseResumeAuction(obj).subscribe((res) => {
      if (res['success']) {
        this.auctionList1.splice(ind, 1);
        this.commonService.success(val.auctionName + ' ' + obj.type + " Successfully.");
      }
    }, (err) => { });
  }

  forceClose(val, ind) {
    let objDtls = {
      auctionID: val.auctionID,
      type: "closeAuction"
    }
    if (val.status.toLowerCase() == 'open') {
      this.buyereditService.updateStatusOpenClose(objDtls).subscribe((res: any) => {
        if (res['success']) {
          this.auctionList1.splice(ind, 1);
          this.commonService.success(val.auctionName + ' closed successfully.');
        }
      });
    }
  }

  onScrollDown() {
    this.sum += 1;
    this.getAucListLiveDetail(this.sum);
  }

  getPausePlaySocketDataDetail(id) {
    this.timeSocketdetail = this.socketService.getSocketData(id)
      .subscribe(data => {
        this.pauseAucName = '';
        if (data.status.toLowerCase() == 'paused') {
          this.pauseAucName = this.msgBoxShow ? data.auctionName : '';
          let index = this.auctionList1.findIndex(obj => obj['auctionID'] === data.auctionID);
          this.auctionList1.splice(index, 1);
        }
        setTimeout(() => {
          this.pauseAucName = '';
          this.msgBoxShow = true;
        }, 20000);
      });
  }

  toggleFlip(ind) {
    this.auctionList1[ind]['flip'] = (this.auctionList1[ind]['flip'] == 'inactive') ? 'active' : 'inactive';
  }
  oncli() {
    this.commonService.buyerRedirectLanding();
  }
}
