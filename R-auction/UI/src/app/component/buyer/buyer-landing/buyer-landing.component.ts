import { Component, OnInit } from '@angular/core';
import * as config from '../../../appConfig/index';
import { CommonService } from '../../../commonService/common.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BuyerLandingService } from '../../component-service/buyer-landing.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CommonPopupComponent } from '../../../shared/component/common-popup/common-popup.component';
import { BuyerEditService } from '../../../component/component-service/buyer-edit.service';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../../../authService/auth.service';
import 'rxjs/add/operator/takeUntil';
import * as routerconfig from '../../../appConfig/router.config';

@Component({
  selector: 'app-buyer-landing',
  templateUrl: './buyer-landing.component.html',
  styleUrls: ['./buyer-landing.component.scss']
})
export class BuyerLandingComponent implements OnInit {
  totalIncome = config.BUYER_PASTDETAILS[1];
  translateSer: any;
  buyerData: any;
  userType:any;
  daysInThisWeek = config.BUYER_PASTDETAILS;
  aucType = config.AUC_TYPE;
  aucTypeValue = config.AUC_TYPE[1];
  subscription: Subscription;
  comingSoon = config.BUYER_PASTDETAILS.filter((obj) => { return obj.name !== 'Day' });
  comingSoonValue = this.comingSoon[0];
  destroySubcriptions$: Subject<boolean> = new Subject<boolean>();
  adminAccess: boolean = false;
  constructor(private MatDialog: MatDialog, private commonService: CommonService, private buyerlandingservice: BuyerLandingService, private routes: Router, private buyerService: BuyerEditService, private authService: AuthService , private actRoute: ActivatedRoute) {
    this.commonService.translateSer('BUYER_LANDING').subscribe(async (text: string) => {
      this.translateSer = text;
    });
  }

  ngOnInit() {
    
    this.adminAccess = this.authService.hasAdminAccess();
    this.userType = this.authService.roleName;
    this.getBuyerData();
    this.commonVarClear();
  }
  ngOnDestroy() {
    try {
      this.destroySubcriptions$.next(true);
      // Now let's also unsubscribe from the subject itself:
      this.destroySubcriptions$.complete();
    } catch (e) {

    }
  }


  ChangeSortOrder(newSortOrder) {
    this.totalIncome = newSortOrder;
    this.getBuyerData();
  }

  ChangeComingSoon(sort) {
    this.comingSoonValue = sort;
    this.getBuyerData();
  }

  getBuyerData() {
    // this.commonService.loader = true;
    try {
      let obj = {
        'type': this.aucTypeValue.value,
        'futureDuration': this.comingSoonValue.value,
        'duration': this.totalIncome.value
      };
      this.buyerlandingservice.getBuyerData(obj).takeUntil(this.destroySubcriptions$).subscribe((res: any) => {
        if (res['success']) {
          console.log(res.data);
          this.buyerData = res.data;
          // this.commonService.loader = false;
        }
      }, error => { this.commonService.loader = false; });
    } catch (err) { this.commonService.loader = false; }
  }

  selectAucType(type) {
    this.aucTypeValue = type;
    this.getBuyerData();
  }


  onClickBox(card)
  { 
    if(card == 'live') {
       this.routes.navigate([routerconfig.buyer_router_links.LIVE_AUCTION]); 
    } else {
      this.routes.navigate([routerconfig.buyer_router_links.CALENDAR_VIEW]); 
   }
  }

  

  onType(type) {
    this.routes.navigate([routerconfig.buyer_router_links.BUYER_LIST_VIEW], { queryParams: { status: type } });
  }

  onTemplateClick(){
    this.routes.navigate(['/templateauction']);
  }

  onSettingClick(){
    this.routes.navigate([routerconfig.buyer_router_links.ADMIN_PANEL]);
  }

  onAuctionDocument() {
    try {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.data = {
        dialogMessage: "",
        tab: 'aucOpt'
      }
      // objMatDialogConfig.width = "500px";
      // objMatDialogConfig.height = "250px";
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.MatDialog.open(CommonPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        console.log("popup closed");
      });
    } catch (e) {

    }
  }
  commonVarClear() {
    this.buyerService.lotList = [];
    this.buyerService.itemDetails = [];
    // this.buyerService.supplierDetails = [];
    this.buyerService.auctionData = {
      auctionID: null,
      minimumChangeValue: 0,
      auctionStatus: null,
      auctionIdData: null,
      decimalPlace: null,
      minimumChangeType: 'amount',
      primaryCurrency: null
    };
  }

}
