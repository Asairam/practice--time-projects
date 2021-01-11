import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as config from '../appConfig/index';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AuthService } from '../authService/auth.service';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import * as routerconfig from '../appConfig/router.config';
/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromAppModule from '../state/app.reducer';
import * as appModuleActions from '../state/app.actions';
@Injectable({
  providedIn: 'root'
})

export class CommonService {

  isMobile: boolean = false;
  toggleDiv = new EventEmitter<any>();
  port = config.BASE_URL;
  apiEndPoint = config.APP_CONSTANTS;
  loader = true;
  token = this.authService.getTokenValue()
  commonStatus = "";
  auctionLeader = {
    email: null,
    host: false,
    name: null
  };
  apiCall = new EventEmitter<any>();
  supplierbiddingPage = { page: null, auctionid: null };
  usersearch = {
    headersearch: null,
    searchType: 'all'
  };
  internetConn = true;
  currentURLParams: any;
  constructor(private translate: TranslateService, private snackBar: MatSnackBar, private zone: NgZone, private http: HttpClient, private authService: AuthService, private routes: Router,
    private store: Store<fromAppModule.AppModuleState>) {
    translate.setDefaultLang('en');
  }

  translateSer(name) {
    return this.translate.get(name);
  }

  success(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['background-green'];
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';
    config.duration = 5000;
    this.zone.run(() => {
      this.snackBar.open(message, 'x', config);
    });
  }

  error(message: string) {
    const confige = new MatSnackBarConfig();
    confige.panelClass = ['background-red'];
    confige.verticalPosition = 'bottom';
    confige.horizontalPosition = 'center';
    confige.duration = 5000;
    this.zone.run(() => {
      this.snackBar.open(message, 'x', confige);
    });
  }

  warning(message: string) {
    const configw = new MatSnackBarConfig();
    configw.panelClass = ['background-yellow'];
    configw.verticalPosition = 'bottom';
    configw.horizontalPosition = 'center';
    configw.duration = 5000;
    this.zone.run(() => {
      this.snackBar.open(message, 'x', configw);
    });
  }



  //gap between two dates filter
  dateTimeFilter(date1, date2) {
    const diffMs = (date2 - date1); // milliseconds between now & Christmas
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    const diffSeconds = (((diffMs % 86400000) % 3600000) / 60000) * 60; //seconds
    return { 'days': diffDays, 'hours': diffHrs, 'minutes': diffMins, 'seconds': diffSeconds };
  }

  //start a method for save the attachment image
  downloadAttachmentData(data) {
    let commonUrl = this.port.commonUrlDocument;
    if (environment.flag != "local") {
      //NOTE :: this is implemented to make sure that clicking on an attachment in side a PDF file downloads the file.
      //NOTE :: below code extracts the domain name and adds '/commons/' to it.
      commonUrl = environment.applicationUrl.split('/').splice(0, 3).join('/') + this.port.commonUrlDocument;
    }
    return commonUrl + this.apiEndPoint.IMAGE_DOWNLOAD + data.docFileId + '?token=' + this.authService.getTokenValue();
  }
  //end

  playAudio() {
    let audio = new Audio();
    audio.src = this.port.rauction + 'assets/notification sound.mp3';
    audio.load();
    audio.play();
  }



  // chatAudio = () => {
  //   let audio = new Audio();
  //   audio.src = this.port.rauction + 'assets/chat_notification.mp3';
  //   audio.load();
  //   audio.play();
  // }

  sortOn(arr, prop) {
    arr.sort(
      function (a, b) {
        if (a[prop] < b[prop]) {
          return -1;
        } else if (a[prop] > b[prop]) {
          return 1;
        } else {
          return 0;
        }
      }
    );
  }

  firstLetterCapital(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  async objectRefresh(obj) {
    return await Object.keys(obj).map((key) => obj[key] = null);
  }


  uploadAttachmentData(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': 'Bearer ' + this.authService.getTokenValue(),
        'appId': this.port.appID
      })
    }
    return this.http.post(this.port.commonUrlDocument + this.apiEndPoint.IMAGE_UPLOAD, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  globalsearch(obj) {
    return this.http.post(this.port.baseUrlBid + this.apiEndPoint.GLOBAL_SEARCH, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  globalsearchSupplier(obj) {
    return this.http.post(this.port.baseUrlBid + this.apiEndPoint.GLOBAL_SEARCH + 'Supplier', obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  refreshAuctionLeader() {
    Object.keys(this.auctionLeader).forEach((key) => {
      if (key == 'host') {
        this.auctionLeader[key] = false;
      } else {
        this.auctionLeader[key] = null;
      }
    });
  }

  buyerRedirectLanding() {
    this.routes.navigate([routerconfig.buyer_router_links.BUYER_DASHBOARD]);
  }

  supplierRedirectLanding() {
    this.routes.navigate([routerconfig.supplier_router_links.SUPPLIER_DASHBOARD]);
  }

  resetpwdEmailValidation(email) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_SUPPLIERBYEMAILID + email)
  }


  orgFeature(orgid) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_ORG_FEATURE + orgid)
      .pipe(
        catchError(this.handleError)
      );
  }


  resetPwd(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.RESET_PWD, obj)
    .pipe(
      catchError(this.handleError)
    );
  }

  getConfigDetails() {
    return new Promise((resolve, reject) => {
      if (this.authService.userRole() !== 'supplier' && this.authService.getUserData() && this.authService.getUserData().org) {
        let orgId = this.authService.getUserData().org;
        this.orgFeature(orgId).subscribe((res) => {
          if (res['success']) {
            this.store.dispatch(new appModuleActions.SetAppConfigerMode(
              res['data']
            ));
            resolve(res);
          }
        }, (err) => {
          reject()
        });
      } else {
        reject();
      }
    })
    
  }

  cardViewDisCol(arr,field) {
		return arr.find((obj)=> obj.item_id.toLowerCase() == field.toLowerCase());
  }

  inArrFindColInd(arr,field) {
   return arr.findIndex(obj => obj.item_id.toLowerCase() == field.toLowerCase());
  }
  
  arrCompare(arrayOne,arrayTwo) {
    return arrayOne.filter(({ item_id: id1 }) => !arrayTwo.some(({ item_id: id2 }) => id2 === id1));
  }

  getRandomElementsFromArray(array) {
    let numberOfRandomElementsToExtract = array.length;
    const elements = [];

    function getRandomElement(arr) {
      if (elements.length < numberOfRandomElementsToExtract) {
        const index = Math.floor(Math.random() * arr.length)
        const element = arr.splice(index, 1)[0];

        elements.push(element)

        return getRandomElement(arr)
      } else {
        return elements
      }
    }

    return getRandomElement([...array])
  }

  private handleError(error: HttpErrorResponse) {
    // return an observable with a user-facing error message
    return throwError(
      'Unable to connect to server.');
  };
}
