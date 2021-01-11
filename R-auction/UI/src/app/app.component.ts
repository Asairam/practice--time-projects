import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CommonService } from '../../src/app/commonService/common.service';
import { VendormodificationComponent } from './component/buyer/edit/particpant/vendormodification/vendormodification.component';
import { ParticpantComponent } from './component/buyer/edit/particpant/particpant.component';
import { BuyerEditService } from './component/component-service/buyer-edit.service';
import { from } from 'rxjs';
import { HostListener } from '@angular/core';
import { LoaderService } from './shared/services/loader.service';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ViewPopupComponent } from './shared/component/view-popup/view-popup.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import * as config from '../app/appConfig/app.config';
import { SocketService } from '../app/component/socketService/socket.service';
import { AuthService } from '../app/authService/auth.service';
import { APMService } from './shared/apm-rum/services/apm.service';
import * as api from '../environments/environment';
// import{ filter }  from 'rxjs/operators';
// import{ Subscription }  from 'rxjs';
// import{ Router , NavigationEnd }  from '@angular/router';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { CommonLoaderService } from './shared/component/loader/loader.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  attachDisplay = false;
  drawerData = "";
  auctionId: any;
  selectedIndex = 0;
  currencyData = [];
  openCustom: boolean;
  supplierFlag = false;
  contactData = null;
  userList = [];
  remarks = [];
  chat = false;
  online$: Observable<boolean>;
  name: string;
  _objMatDialogConfig = new MatDialogConfig();
  envURL = api.environment;
  @ViewChild(ParticpantComponent) supplier: ParticpantComponent;

  // router: any;
  // subscription : Subscription;
  constructor(private router: Router, private commonloader: CommonLoaderService, public common: CommonService, private buyereditservice: BuyerEditService, public loader: LoaderService, private MatDialog: MatDialog, public socketService: SocketService, public AuthService: AuthService, private apmservice: APMService) {
    this.common.toggleDiv.subscribe(
      (data: any) => {
        this.drawerData = data;
        this.selectedIndex = data.selectedInd;
        if (data.flag === 'openAttach') {
          this.auctionId = data.auctionID;
          this.openCustom = true;
          document.getElementsByTagName('body')[0].style.overflow = "hidden";
          this.attachDisplay = true;
          this.currencyData = (data.currency) ? data.currency : null;
          this.remarks = (data["buyerRemarks"]) ? data["buyerRemarks"] : [];
          this.supplierFlag = (this.drawerData["data"]) ? this.drawerData["data"]["supplier"] : false;
          if (data.pageFrom == 'existvendor') {
            this.contactData = (this.drawerData["data"]["contactData"]) ? this.drawerData["data"]["contactData"] : null;
          }
          if (data.pageFrom == 'queryHistory') {
            this.chat = true;
          }
        }
        else if (data.flag == 'closeAttach') {
          document.getElementsByTagName('body')[0].style.overflow = "auto";
          this.openCustom = false;
          this.attachDisplay = false;
          this.supplierFlag = false;
          this.contactData = null;
          if (data.pageFrom == 'LotView') {
            if (data.itemCall) {
              this.common.apiCall.emit();
            }
          }
          if (data.pageFrom == 'new_supplier') {
            //  this.supplier.getData(data.data);
            this.buyereditservice.vendorNewaddData.next(data.data)
          }
          if (data.pageFrom == 'exist_supplier') {
            //  this.supplier.getData(data.data);
            this.buyereditservice.vendorNewaddData.next(data.data)
          }
        }

      });
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    )
    this.networkStatus()
  }

  closeChat(data) {
    document.getElementsByTagName('body')[0].style.overflow = "auto";
    this.openCustom = false;
    this.attachDisplay = false;
    this.supplierFlag = false;
    this.contactData = null;
    this.chat = false;

  }

  ngOnInit() {
    // this.subscription = this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // )
    // .subscribe(() => window.scroll(0,0));
    this.apmFun(this.envURL);
  }

  ngAfterViewInit() {
    this.eventLoader();
  }

  loadStatus(loadFlag) {
    try {
      // this.common.loader = loadFlag;
    }
    catch (e) {

    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    document.getElementsByTagName('body')[0].style.overflow = "auto"
    this.attachDisplay = false;
  }

  public networkStatus() {
    this.online$.subscribe(value => {
      this.common.internetConn = value;
      if (!value) {
        this.MatDialog.closeAll();
        let audioPlayer = <HTMLAudioElement>document.getElementById('myAudio');
        audioPlayer.play();
        this.offlineDialog();
      }
      if (value && this.common.supplierbiddingPage.auctionid && this.AuthService.userRole() && this.AuthService.userRole() === 'supplier') {
        this.socketService.socketReconnect(this.common.supplierbiddingPage.auctionid);
      }
    })
  }

  offlineDialog() {
    try {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-xs';
      objMatDialogConfig.data = {
        dialogMessage: 'Internet connection status',
        tab: 'offline',
        dialogPositiveBtn: "Ok"
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {

      });
    } catch (err) { }
  }

  apmFun(env) {
    this.apmservice.initializeApm(env, '');
  }

  ngOnDistroy() {
    // this.subscription.unsubscribe();
  }

  eventLoader() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.commonloader.isLoading.next(true);
        }
        else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          this.commonloader.isLoading.next(false);
        }
      });

  }

}
