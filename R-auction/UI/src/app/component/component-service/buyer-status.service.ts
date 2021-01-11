import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as config from '../../appConfig/index';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class BuyerStatusService {

  apiEndPoint = config.APP_CONSTANTS;
  port = config.BASE_URL;
  constructor(private http: HttpClient, private router: Router) { }

  getBuyerList(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.BUYER_LIST, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAdminCalendarData(obj) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.CALENDAR_VIEW + obj.month + '/' + obj.year)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 && error.statusText === 'Unauthorized') {
      localStorage.removeItem('tokenValue');
      localStorage.removeItem('userdata');
      this.router.navigate(['/login']);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Unable to connect few services.');
  };
}
