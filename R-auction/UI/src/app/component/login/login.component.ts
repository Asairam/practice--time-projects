import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import * as config from '../../appConfig/index';
import * as configure from '../../appConfig/app.config';
import { AuthService } from '../../authService/index'
import { LoginService } from '../component-service/login.service';
import { CommonService } from '../../commonService/common.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { VendorCodePopupComponent } from './vendor-code-popup/vendor-code-popup.component';
import { resolve } from 'url';
import { APMService } from '../../shared/apm-rum/services/apm.service';
import { VendorCustomerCode } from './vendor-customer-code.service';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';


// interface PromiseConstructor {
//   allSettled(promises: Array<Promise<any>>): Promise<Array<{status: 'fulfilled' | 'rejected', value?: any, reason?: any}>>;
// }
interface PromiseConstructor {
  allSettled(promises: Array<Promise<any>>): Promise<any>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [VendorCustomerCode]
})
export class LoginComponent implements OnInit, PromiseConstructor {
  token: any;
  redirectUrl = config.BASE_URL.loginUrl;
  translateSer: any;
  constructor(
    private MatDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private routes: Router,
    @Inject(DOCUMENT) private document: any,
    private AuthService: AuthService,
    private loginservice: LoginService,
    private common: CommonService,
    private apmService: APMService,
    private codeService: VendorCustomerCode
  ) {
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSer = text;
    });
  }

  ngOnInit() {
    // if (localStorage.getItem('tokenValue') && localStorage.getItem('userdata')) {
    //   this.AuthService.landingPage();
    // } else {
    this.login();
    // }

  }

  login() {
    try {
      this.activatedRoute.queryParams.subscribe(params => {
        this.token = params['token'];

        if (params['token']) {   
          this.AuthService.saveTokenValue(params['token']);
          this.userLogin();
        } else {
          if (localStorage.getItem('tokenValue') && localStorage.getItem('userdata')) {
            this.AuthService.landingPage();
          } else {
            this.goToLoginUrl();
          }
        }
      });
    } catch (e) {

    }
  }

  goToLoginUrl() {
    try {
      this.document.location.href = `${this.redirectUrl}?redirectURL=${window.location.href}`;
    } catch (e) {

    }
  }

  userLogin() {

    this.loginservice.getUserDetails().subscribe((res: any) => {
      if (res['success']) {
        let userInfo = res['data']['userInfo'];

        let notSupplier = false;
        userInfo.roles.forEach(element => {
          if (element.role == "admin" || element.role == "buyer") {
            notSupplier = true;
          }
        });

        if (notSupplier) {
          this.checkCookies();
            //buyer or Admin 
          this.proceedLogin(userInfo);
        } else {
          // supplier or customer
          this.setVendorCodeForVendorOrCustomer(userInfo);
        }
      }
    }, error => {

    });
  }

  notaSupplierPopup() {
    let digitalUrl = config.BASE_URL.digitalplatform;
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-md';
    objMatDialogConfig.data = {
      dialogMessage: 'Warning...',
      dialogContent: `Dear User, Kindly Log into R-Auction only through -<a href="${digitalUrl}" target="_blank"> ${digitalUrl} </a><br/>So that “Single Sign On” based log in to Incident Management System (R-Seva) can be done through R-Auction Application to report any performance issues.`,
      tab: 'confirm_msg',
      dialogPositiveBtn: "Ok"
    }
    objMatDialogConfig.disableClose = true;
    let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
    refMatDialog.afterClosed().subscribe((value) => {
    });
  }

  setVendorCodeForVendorOrCustomer(userInfo) {
    let vendorcodeList = userInfo.settings.ril.vendorcode ? userInfo.settings.ril.vendorcode : [];
    let customerCodeList = userInfo.settings.ril.customerCode ? userInfo.settings.ril.customerCode : [];
    if (vendorcodeList.length == 0 && customerCodeList.length == 0) {
      window.location.href = window.location.origin + window.location.pathname;
    }

    Promise.all([this.getVendorCodeDetails(vendorcodeList), this.getCustomerCodeDetails(customerCodeList)]).then(result => {

      let { vendorDetailList, customerDetailList } = this.codeService.getCodeDetails(result);

      if (vendorDetailList.length + customerDetailList.length > 1) {
        this.showVendorcodeSelectionPopup(vendorDetailList, customerDetailList).subscribe(result => {
          userInfo.settings.ril.vendorcodeSelected = result.vendorcode ? result.vendorcode : result.customerCode;
          userInfo.settings.ril.vendorcodeSelectedDetails = result;
          this.proceedLogin(userInfo);
        });
      } else {
        userInfo.settings.ril.vendorcodeSelected = vendorDetailList.length == 1 ? vendorDetailList[0].vendorcode : customerDetailList[0].customerCode;
        userInfo.settings.ril.vendorcodeSelectedDetails = vendorDetailList.length == 1 ? vendorDetailList[0] : customerDetailList[0];
        this.proceedLogin(userInfo);
      }
    });
  }

  allSettled(promises) {
    return Promise.all(promises.map(p => Promise.resolve(p).then(value => ({
      state: 'fulfilled',
      value
    }), reason => ({
      state: 'rejected',
      reason
    }))));
  };

  getVendorCodeDetails(vendorcodeList) {
    if (vendorcodeList.length == 0) return new Promise((resolve, reject) => resolve([]));
    // Polyfill
    // if(!Promise.allSettled) {
    //   Promise.allSettled = function(promises) {
    //     return Promise.all(promises.map(p => Promise.resolve(p).then(value => ({
    //       state: 'fulfilled',
    //       value
    //     }), reason => ({
    //       state: 'rejected',
    //       reason
    //     }))));
    //   };
    // }
    return this.allSettled(vendorcodeList.map(vendorcode => {
      return new Promise((resolve, reject) => {
        if (vendorcode.toString().length > 12) { // as suggested by vignesh for handling unregistered vendor.
          reject({ type: 'vendor', vendorcode: vendorcode });
          return;
        }
        this.loginservice.getVendorCodeDetils(vendorcode).subscribe(res => {
          resolve(res)
        }, err => {
          reject({ type: 'vendor', vendorcode: vendorcode });
        })
      })
    }));
  }

  getCustomerCodeDetails(customerCodeList) {
    if (customerCodeList.length == 0) return new Promise((resolve, reject) => resolve([]));

    // Polyfill
    // if(!Promise.allSettled) {
    //   Promise.allSettled = function(promises) {
    //     return Promise.all(promises.map(p => Promise.resolve(p).then(value => ({
    //       state: 'fulfilled',
    //       value
    //     }), reason => ({
    //       state: 'rejected',
    //       reason
    //     }))));
    //   };
    // }
    return this.allSettled(customerCodeList.map(customerCode => {
      return new Promise((resolve, reject) => {
        if (customerCode.toString().length > 12) { // as suggested by vignesh for handling unregistered customer.
          reject({ type: 'customer', customerCode: customerCode });
          return;
        }
        this.loginservice.getCustomerCodeDetils(customerCode).subscribe(res => {
          resolve(res)
        }, err => {
          reject({ type: 'customer', customerCode: customerCode });
        })
      })
    }));
  }

  showVendorcodeSelectionPopup(vendorcodeList, customerDetailList) {
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-lg';
    objMatDialogConfig.data = {
      dialogMessage: "",
      tab: '',
      dialogContent: { vendorcodeList, customerDetailList },
      dialogPositiveBtn: "Ok",
    }
    objMatDialogConfig.width = "1100px";
    objMatDialogConfig.height = "250px";
    objMatDialogConfig.disableClose = true;
    let refMatDialog = this.MatDialog.open(VendorCodePopupComponent, objMatDialogConfig);
    return refMatDialog.afterClosed();
  }

  proceedLogin(userInfo) {
    this.AuthService.saveUserData(userInfo);
    this.getProfilepic(userInfo);
    this.AuthService.landingPage();
    this.AuthService.userRole();
    this.setUserAPM(userInfo);
    this.common.success(this.translateSer['LOG_IN']);
  }

  getProfilepic(val) {
    if (config.ROLE_ACCESS_CONTROL.both_supplier.includes(this.AuthService.userRole())) {
      this.AuthService.emitUserInfoChange(val);
    } else if (config.ROLE_ACCESS_CONTROL.both.includes(this.AuthService.userRole())) {
      let domainId = '{"email":' + '"' + val.email + '"';
      this.loginservice.ldapuser(domainId).subscribe((res: any) => {
        if (res.success) {
          Object.assign(val, { profilePic: res.data[0]['profilePic'] });
          this.AuthService.saveUserData(val);
          this.AuthService.emitUserInfoChange(val);
        }
      }, (error) => {
        Object.assign(val, { profilePic: null });
        this.AuthService.saveUserData(val);
        this.AuthService.emitUserInfoChange(val);
      });
    }
  }

  setUserAPM(res) {
    let userName = res.name.firstname + ' ' + res.name.lastname;
    this.apmService.setUserContext(userName, userName, res.email);
  }

  checkCookies() {
    this.loginservice.getlogedinusercookie().subscribe((res: any) => {
      if(!res['success']) {
        this.notaSupplierPopup();
      }
    });
  }

}
