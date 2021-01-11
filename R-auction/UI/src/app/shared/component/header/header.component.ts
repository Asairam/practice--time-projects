import { Component, OnInit, AfterContentInit, AfterViewInit, Input, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from '../../../authService/auth.service';
import { LoginService } from '../../../component/component-service/login.service';
import { CommonService } from '../../../commonService/common.service';
import * as api from '../../../../environments/environment';
import { SocketService } from '../../../component/socketService/socket.service';
import * as config from '../../../appConfig/index';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { ResponsiveService } from '../../services/responsive.service';
import { environment } from 'src/environments/environment.replica';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as routerconfig from '../../../appConfig/router.config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userInfo: any;
  @Input() onclickBell = new EventEmitter()
  translateSer: any;
  route: string;
  imageURL = api.environment.rauction;
  globalSearchSelector = config.GLOBAL_SEARCH_SELECTOR;
  searchHide: boolean = true;
  currentURL: any;
  notificationCount: any;
  notificationList: any;
  apiEndPoint = config.APP_CONSTANTS;
  featureFlags = api.environment.featureFlags;
  supplierLiveScreen = false;
  constructor(public http: HttpClient, public authService: AuthService, private loginservice: LoginService,
    public CommonService: CommonService, private socketService: SocketService, private router: Router, private actroute: ActivatedRoute, private location: Location, public responsiveService: ResponsiveService,
    ) {
    authService.userEmitted$.subscribe(
      userInfo => {
        this.userInfo = userInfo;
      });
    this.CommonService.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSer = text;
    });
    this.router.events.subscribe((event) => {
      this.currentURL = this.router.url.substring(1);
      this.supplierLiveScreen = this.currentURL.indexOf(routerconfig.supplier_router_links.PARTICIPANT_SUMMARY_VIEW) != -1 || this.currentURL.indexOf(routerconfig.supplier_router_links.PARTICIPANT_BID_HIS_VIEW) != -1;
      this.searchHide = true;
      if (this.router.url.match(/livebidding/g) || this.supplierLiveScreen) {
        this.searchHide = false;
      }
      if (event instanceof NavigationEnd) {
        if (this.router.url.indexOf('/login') == -1 && this.router.url.indexOf('/search') == -1) {
          this.CommonService.usersearch.headersearch = null;
          this.CommonService.usersearch.searchType = 'all';
        }
      }
    });
  }

  ngOnInit() {
    this.CommonService.getConfigDetails().catch(err => {});
    $(document).ready(function () {
      $(".header-search").click(function () {
        $(".search-slide").toggleClass("full-width");
        $(".header-search-input").focus();
      });
      $(".search-slide-close").click(function () {
        $(".search-slide").toggleClass("full-width");
        $(".header-search-input").val("");
        $(".search-filter").val("all");
      });
    });
    if (!this.userInfo) {
      this.userInfo = this.authService.getUserData();
    }
    this.onResize();
    this.responsiveService.checkWidth();
  }

  getNotification() {
    this.onclickBell.next("true");
  }

  countChange(count) {
    this.notificationCount = count;
  }

  logout() {
    this.loginservice.logout().subscribe((res) => {
      if (res['success']) {
        let role = this.authService.roleName;
        if (this.authService.userRole() && role && role.length > 0 && role.toLowerCase() === 'supplier') {
          this.socketService.supplierLogout(JSON.parse(localStorage.getItem('userdata')).email).subscribe(data => {
            let res = data;
          });
        }
        this.userInfo = null;
        this.authService.logout();
        this.CommonService.success(this.translateSer['LOG_OUT']);
      }
    }, (err) => {

    });
  }

  logoCli() {
    this.authService.landingPage();
    if (this.authService.userRole() === 'supplier' && Object.keys(this.CommonService.supplierbiddingPage).length != 0 && this.CommonService.supplierbiddingPage.page === 'bid') {
      this.backButton(this.CommonService.supplierbiddingPage.auctionid);
      this.CommonService.objectRefresh(this.CommonService.supplierbiddingPage);
    }
  }

  errorHandler(event) {
    event.target.src = this.imageURL + "assets/images/profile-2.svg";
  }

  backButton(auctionID) {
    this.socketService.supplierBackButtonFromBreadcrumbs(auctionID).subscribe(data => {
      let res = data;
    });
  }

  globalsearch(eve) {
    if (this.CommonService.usersearch.headersearch.trim()) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        let urlSer = routerconfig.supplier_router_links.PARTICIPANT_SEARCH;
        if (this.authService.roleName.toLowerCase() == 'buyer') {
          urlSer = routerconfig.buyer_router_links.BUYER_SEARCH;
        }
        this.router.navigate([urlSer], { queryParams: { value: this.CommonService.usersearch.headersearch.trim(), type: this.CommonService.usersearch.searchType } });
      });
    }
  }

  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.CommonService.isMobile = isMobile;
    });
  }

  openRsevaAndStatus(butt) {
    // let featureType;
    // if (this.currentURL && this.currentURL === routerconfig.buyer_router_links.BUYER_DASHBOARD) {   // Buyer Landing Page
    //   featureType = 'Buyer Dashboard';
    // } else if (this.currentURL.indexOf(routerconfig.buyer_router_links.BUYER_SEARCH) != -1 || this.currentURL.indexOf(routerconfig.buyer_router_links.BUYER_LIST_VIEW) != -1) {   // Buyer Auction Cards Page
    //   featureType = 'Buyer List View';
    // } else if (this.currentURL === routerconfig.buyer_router_links.CREATE_AUCTION || this.router.url.match(/edit/g)) {  // Buyer Create & Edit Page
    //   featureType = 'Buyer Create Screen';
    // } else if (this.router.url.match(/livebidding/g)) {    // Buyer Live Bidding Page
    //   switch (this.CommonService.currentURLParams) {
    //     case 'item':   // Summary page
    //       featureType = 'Buyer Summary View';
    //       break;
    //     case 'supplier': // Matrix Page
    //       featureType = 'Buyer Matrix View';
    //       break;
    //     case 'bid':    // Bid History Page
    //       featureType = 'Buyer Bid History View';
    //       break;
    //     default:
    //     // code block
    //   }
    // } else if (this.currentURL === routerconfig.supplier_router_links.SUPPLIER_DASHBOARD) {   // Supplier Landing Page
    //   featureType = 'Participant Dashboard';
    // } else if (this.supplierLiveScreen) {  // Supplier Live Bidding Page
    //   featureType = 'Participant Live bidding page';
    // } else if (this.currentURL.indexOf(routerconfig.supplier_router_links.PARTICIPANT_LIST_VIEW) != -1 || this.currentURL.indexOf(routerconfig.supplier_router_links.PARTICIPANT_SEARCH) != -1) { // Supplier Auction Cards Page
    //   featureType = 'Participant List View';
    // } else {
    //   featureType = 'Settlement';
    // }
    // if (butt == 'status') {
    //   window.open(api.environment.IIMS + config.APP_CONSTANTS.IIMS_MY_ISSUES + featureType + '&Role=' + this.authService.roleName, "_blank");
    // } else {
    //   window.open(api.environment.IIMS + config.APP_CONSTANTS.IIMS_PROBLEM + featureType + '&Role=' + this.authService.roleName, "_blank");
    // }
    window.open(api.environment.IIMS + '/im/?Application=' + api.environment.GUID + '&Role=' + this.authService.roleName, "_blank");
  }


  editProfile() {
    let sendData = {
      flag: 'openAttach',
      pageFrom: 'edit-profile'
    }
    this.CommonService.toggleDiv.emit(sendData);
  }

}
