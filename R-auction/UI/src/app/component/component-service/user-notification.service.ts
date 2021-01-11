import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as config from '../../appConfig/index';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {

  constructor(private http: HttpClient) {}
  
  apiEndPoint = config.APP_CONSTANTS;
  port = config.BASE_URL;

  setReadNotification(notifId) {
    let url =  this.port.baseUrlCore +this.apiEndPoint.NOTIFICATION_READ+notifId;
    return this.http.post(url, {})
      .pipe(
        catchError(this.handleError)
      );
  }
  getBellNotification(pageNo) {
    let url =  this.port.baseUrlCore +this.apiEndPoint.NOTIFICATION_BELL + pageNo;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllNotification(data) {
    let url =  this.port.baseUrlCore +this.apiEndPoint.ALL_NOTIFICATION;
    return this.http.post(url, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(
      'Unable to connect to server.');
  };
}
