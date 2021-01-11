import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerStatusService } from '../../../component/component-service/buyer-status.service';
import { CommonService } from '../../../commonService/common.service';
import { Location } from '@angular/common';
import * as config from '../../../appConfig/app.config';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../../authService/auth.service';
import { BuyerBiddingService } from '../../../component/component-service/buyer-bidding.service';
import { BuyerEditService } from '../../../component/component-service/buyer-edit.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { HttpClient } from '@angular/common/http';
import {UserNotificationService} from "../../../component/component-service/user-notification.service";
import * as routerconfig from '../../../appConfig/router.config';

@Component({
  selector: 'app-notificationlist',
  templateUrl: './notificationlist.component.html',
  styleUrls: ['./notificationlist.component.css']
})
export class NotificationlistComponent implements OnInit {

 @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;
  translateSer: any;
  translateSerCommon: any;
  pageLoc = window.location.pathname.indexOf('/search') != -1 ? false : true;
  auctStatus = this.route.snapshot.queryParamMap.get('status');
  auctionList = [];
  view = 'list';
  sum = 1;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  isBuyer:any = false;
  uData:any;
  selectedFilter = { filterName: config.filterAllAuction[0].id, sort: 'DESC' }
  constructor(private http: HttpClient, private router: Router, private notificationService:UserNotificationService, private route: ActivatedRoute, private buyerstatusService: BuyerStatusService, private commonService: CommonService, private location: Location, private matDialog: MatDialog, private auth: AuthService, public bidService: BuyerBiddingService, private buyerService: BuyerEditService,private authService: AuthService) {
    this.commonService.translateSer('STATUS_DETAILS').subscribe(async (text: string) => {
      this.translateSer = text;
    });
    this.commonService.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSerCommon = text;
    }); 
  }
  ngOnInit() {
    this.uData = this.auth.getUserData();
    if(this.uData.roles.length > 0) {
      var role = this.uData.roles.filter(item => { 
        return item.role == "buyer";
      })
      if(role.length>0) {
        this.isBuyer = true;
      } else {
        this.isBuyer = false;
      }
    }
    if (this.pageLoc) {
      this.getAucList(this.auctStatus, 1);
    } 
    else {
      this.route.queryParams.subscribe(params => {
        if (params['value']) {
          this.commonService.usersearch.headersearch = params['value'];
          this.commonService.usersearch.searchType = params['type'];
        }
      });
    }
  }
  getAucList(auctStatus, no) {
    try {
      let obj = {
        status:"",
        pageNum:this.sum,
        sort:"desc"
      }
      console.log("get notifi------");
     this.notificationService.getAllNotification(obj).subscribe((res: any) => {
        if(res.data.length>0) {
          res.data.forEach(element => {
            this.auctionList.push(element);
          });
        }
      }, error => { this.commonService.loader = false; });
    } catch (err) { this.commonService.loader = false; }
  }
  checkStatus(message, status) {
    return message.toLowerCase().indexOf(status) != -1;
  }
  onScrollDown() {
    this.sum += 1;
    this.getAucList("", "");
  }
}

