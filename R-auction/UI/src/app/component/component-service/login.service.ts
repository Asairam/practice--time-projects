import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as config from '../../appConfig/index';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiEndPoint = config.APP_CONSTANTS;
  port = config.BASE_URL;
  constructor(private http: HttpClient) { }
  getUserDetails() {
    return this.http.get(this.port.userProfile + this.apiEndPoint.AUTH_ME)
      .pipe(
        map(x => {
          if (x["data"]["userInfo"]["settings"]) {
            if (x["data"]["userInfo"]["settings"]["ril"]["customerCode"]) {
              // x["data"]["userInfo"]["settings"]["ril"]["vendorcode"]; = x["data"]["userInfo"]["settings"]["ril"]["customerCode"];
              // x["data"]["userInfo"]["settings"]["ril"]["customerCode"] = true;
              return x;
            }
             return x;
          }
          return x;
        }),
        catchError(this.handleError)
      );
  }

  getVendorList(data) {
    return this.http.post(this.port.baseUrlCore + this.apiEndPoint.GET_VENDORLIST, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getVendorCodeDetils(vendorCode) {
    return this.http.get(this.port.baseUrlCore + this.apiEndPoint.VENDOR_CODE_DETAILS + vendorCode)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCustomerCodeDetils(customerCode) {
    return this.http.get(this.port.baseUrlCore + this.apiEndPoint.CUSTOMER_CODE_DETAILS + customerCode)
      .pipe(
        catchError(this.handleError)
      );
  }

  getlogedinusercookie() {
    return this.http.get(this.port.baseUrlCore + this.apiEndPoint.CHECK_COOKIE)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUserDetails(value) {
    return this.http.put(this.port.userProfile + this.apiEndPoint.AUTH_ME, value)
      .pipe(
        catchError(this.handleError)
      );
  }

  ldapuser(domainId) {
    return this.http.get(this.port.commonUrlDocument + this.apiEndPoint.GET_PROFILE_PIC + domainId + '}')
      .pipe(
        catchError(this.handleError)
      );
  }

  logout() {
    return this.http.post(this.port.userProfile + this.apiEndPoint.LOG_OUT, '')
      .pipe(
        catchError(this.handleError)
      );
  }



  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Unable to connect to server.');
  };
}

