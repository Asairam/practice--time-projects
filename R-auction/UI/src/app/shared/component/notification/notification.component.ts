import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import {AuthService} from "../../../authService/auth.service";
import {CommonService} from "../../../commonService/common.service";
import {UserNotificationService} from "../../../component/component-service/user-notification.service";
import { Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { HttpClient } from '@angular/common/http';
import * as routerconfig from 'src/app/appConfig/router.config';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;
  @Output() notificationCount = new EventEmitter();
  @Output() notificationH = new EventEmitter();
  notificationCountLocal:any=0; 
 tempItemList = []; 
 itemList = []; 
 notiStatus:boolean=true;
 purchaseGroupValue:any;
 token: any; 
 vendorcode: String; 
 purchaseGroup: any; 
 buyerFlag: boolean = false; 
 supplierFlag: boolean = false;
 viewFlag: boolean = true; 
 NoOfNotification: any; 
 userRole: any; userInfo: any; 
 user: any;
 pageNumber:any = 1;
 constructor(public dialog: MatDialog,private router: Router,
   private commonService: CommonService, private notificationService:UserNotificationService,
   private authService: AuthService, public http:HttpClient
 ) { }

 ngOnInit() {    
   setTimeout(() => {
   this.notification();
   }, 3000); 
 }

 notification() {    
   this.token = this.authService.getTokenValue();
   this.userRole = this.authService.userRole();
   this.userInfo = this.authService.getUserData();
   this.user = this.userInfo.name.firstname;
     this.supplierNotification();
 }

 getNotificationH() {
  this.pageNumber = 1;
  //this.itemList = [];
  this.supplierNotification();
 }


 supplierNotification(){
   this.supplierFlag = true;
    this.notificationService.getBellNotification(this.pageNumber).subscribe(res => {
      var notificationList = res["data"].data;  
      this.notificationCountLocal = res["data"].count;
      this.notificationCount.emit(res["data"].count); 
      if(this.pageNumber == 1) {
        this.itemList = [];
      }   
      notificationList.forEach( item => {
        this.itemList.push(item);
      })
     });
 }
 onScrollDown() {
  this.pageNumber += 1;
  this.supplierNotification();
}

 readNotifAndRedirectToViewDetails(notif:any) {
   var notifId = notif._id;
   var auctionID = notif.auctionID;

   if(!notif.isRead) {
      this.notificationService.setReadNotification(notifId).subscribe(res => {
        this.notificationCountLocal--;
        this.notificationCount.emit(this.notificationCountLocal);
        if (this.authService.roleName.toLowerCase() === 'supplier') {
          this.router.navigate([routerconfig.supplier_router_links.PARTICIPANT_SUMMARY_VIEW+`/${auctionID}`, { breadCrumbStatus: 'All' }]);
        } else {
          this.router.navigate([`/livebidding/${auctionID}`, { breadCrumbStatus: 'All' }]);
        }
      }); 
    } else {
      if (this.authService.roleName.toLowerCase() === 'supplier') {
        this.router.navigate([routerconfig.supplier_router_links.PARTICIPANT_SUMMARY_VIEW+`/${auctionID}`, { breadCrumbStatus: 'All' }]);
      } else {
        this.router.navigate([`/livebidding/${auctionID}`, { breadCrumbStatus: 'All' }]);
      } 
    }
 }  
 viewAllList($event: any) {
  this.router.navigate(["viewallnotification"])   
 }

}
