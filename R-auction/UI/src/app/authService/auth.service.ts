import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { MatDialog, MatDialogConfig } from '@angular/material';
export const TOKEN_NAME: string = 'jwt_token';
import { CommonPopupComponent } from '../shared/component/common-popup/common-popup.component';
import { Subject } from 'rxjs/Subject';
import * as config from '../appConfig/app.config';
import * as routerconfig from '../appConfig/router.config';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _objMatDialogConfig = new MatDialogConfig();
  private emitUserInfo = new Subject<any>();
  roleName = 'buyer';
  GLOBAL_SEARCH_SELECTOR = [{ key: 'All', value: 'all', show: true }, { key: 'Auction ID', value: 'auctionID', show: true }, { key: 'Auction Name', value: 'auctionName', show: true }, { key: 'Auction Description', value: 'auctionDescription', show: true }, { key: 'Auction Status', value: 'auctionStatus', show: true }, { key: 'Item Name', value: 'itemName', show: true }, { key: 'Item Code', value: 'itemCode', show: true }, { key: 'Item Description', value: 'itemDescription', show: true }, { key: 'Vendor Code', value: 'vendorcode', show: true }, { key: 'Vendor Name', value: 'vendorName', show: true }, { key: 'Cohost Name', value: 'cohostName', show: true },{ key: 'RFQ No', value: 'rfqNo', show: true }];
  constructor(private routes: Router, private MatDialog: MatDialog) { }
  saveTokenValue(tokenValue: string) {
    localStorage.setItem('tokenValue', tokenValue);
  }

  getTokenValue() {
    return localStorage.getItem('tokenValue');
  }

  saveUserData(userdata) {
    localStorage.setItem('userdata', JSON.stringify(userdata));
  }

  getUserData() {
    return JSON.parse(localStorage.getItem('userdata'));
  }

  logout() {
    localStorage.removeItem('tokenValue');
    localStorage.removeItem('userdata');
    this.routes.navigate(['/login']);
  }

  landingPage() {
    let userDat = JSON.parse(localStorage.getItem('userdata'));
    if (userDat && userDat.roles.length > 0) {
      if (config.ROLE_ACCESS_CONTROL.supplier.includes(this.userRole().toLowerCase())) {
        this.routes.navigate([routerconfig.supplier_router_links.SUPPLIER_DASHBOARD]);
      }
      else if (config.ROLE_ACCESS_CONTROL.customer.includes(this.userRole().toLowerCase())) {
        this.routes.navigate([routerconfig.supplier_router_links.SUPPLIER_DASHBOARD]);
      }
      else if (config.ROLE_ACCESS_CONTROL.both.includes(this.userRole().toLowerCase())) {
        this.routes.navigate([routerconfig.buyer_router_links.BUYER_DASHBOARD]);
      }
    } else {
      this.confirmDialog();
    }
  }

  userRole() {
    let userDat = JSON.parse(localStorage.getItem('userdata'));
    this.roleName = '';
    if (userDat && userDat.roles.length > 0) {
      let suppRole = userDat.roles.filter((obj) => {
        return obj.role.toLowerCase() === config.ROLE_ACCESS_CONTROL.supplier;
      });
      let buyerRole = userDat.roles.filter((obj) => {
        return obj.role.toLowerCase() === config.ROLE_ACCESS_CONTROL.buyer;
      });
      let custRole = userDat.roles.filter((obj) => {
        return obj.role.toLowerCase() === config.ROLE_ACCESS_CONTROL.customer;
      });
      let restrictedbuyerRole = userDat.roles.filter((obj) => {
        return obj.role.toLowerCase() === config.ROLE_ACCESS_CONTROL.restricted_buyer;
      });
      if (suppRole.length > 0) {
        this.roleName = config.ROLE_ACCESS_CONTROL.supplier;
        this.GLOBAL_SEARCH_SELECTOR[8]['show'] = false;
        this.GLOBAL_SEARCH_SELECTOR[9]['show'] = false;
        this.GLOBAL_SEARCH_SELECTOR[10]['show'] = false;
      }
      else if (custRole.length > 0) {
        this.roleName = config.ROLE_ACCESS_CONTROL.customer;
        this.GLOBAL_SEARCH_SELECTOR[8]['show'] = false;
        this.GLOBAL_SEARCH_SELECTOR[9]['show'] = false;
        this.GLOBAL_SEARCH_SELECTOR[10]['show'] = false;
      }
      else if (buyerRole.length > 0) {
        this.roleName = config.ROLE_ACCESS_CONTROL.buyer;
      } else if (restrictedbuyerRole.length > 0) {
        this.roleName = config.ROLE_ACCESS_CONTROL.restricted_buyer;
      }
    }
    return this.roleName;
  }

  hasAdminAccess() {
    if (this.getUserData().roles && this.getUserData().roles.length > 0) {
      let adminAccess = this.getUserData().roles.filter((obj) => {
        return obj.role.toLowerCase() === 'admin';
      });
      if (adminAccess.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  // getTokenExpirationDate(token: string): Date {
  //   const decoded = jwt_decode(token);

  //   if (decoded.exp === undefined) return null;

  //   const date = new Date(0);
  //   date.setUTCSeconds(decoded.exp);
  //   return date;
  // }

  // isTokenExpired(token?: string): boolean {
  //   if (!token) token = this.getTokenValue();
  //   if (!token) return true;

  //   const date = this.getTokenExpirationDate(token);
  //   if (date === undefined) return false;
  //   return !(date.valueOf() > new Date().valueOf());
  // }

  confirmDialog() {
    this._objMatDialogConfig.data = {
      // dialogHeader: '',
      dialogMessage: "PNC Platform - R-Auction Role Not Assigned.",
      dialogPositiveBtn: "OK",
      tab: 'login'
    };
    let refMatDialog = this.MatDialog.open(CommonPopupComponent, this._objMatDialogConfig);
    refMatDialog.afterClosed().subscribe(value => {
      this.logout();
    });
  }

  userEmitted$ = this.emitUserInfo.asObservable();
  emitUserInfoChange(userInfo: any) {
    this.emitUserInfo.next(userInfo);
  }
}
