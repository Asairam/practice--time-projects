import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as config from '../../appConfig/index';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class BuyerLandingService {
  apiEndPoint = config.APP_CONSTANTS;
  port = config.BASE_URL;
  constructor(private http: HttpClient, private router: Router) { }

  getBuyerData(obj) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.BUYER_LANDING + 'duration=' + obj.duration + '&futureDuration=' + obj.futureDuration + '&type=' + obj.type)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    // return an observable with a user-facing error message
    return throwError(
      'Unable to connect to server.');
  };
}
