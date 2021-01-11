import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as config from '../../../../../appConfig/index';
@Injectable({
  providedIn: 'root'
})
export class RoundsAuctionService {
  apiEndPoint = config.APP_CONSTANTS;
  port = config.BASE_URL;
  constructor(private http: HttpClient) { }

  createRoundsAuctionData(data) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.CREATE_ROUNDS_AUC, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getRoundsAuctionData(auctionID) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.CREATE_ROUNDS_AUC + auctionID)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateRoundsAuctionData(data) {
    return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.CREATE_ROUNDS_AUC, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteRoundsAuctionData(data) {
    return this.http.delete(this.port.baseUrlAuction + this.apiEndPoint.CREATE_ROUNDS_AUC + data.auctionID + '/' + data.roundID)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    // return an observable with a user-facing error message
    return throwError(
      (error.error.message) ? error.error.message : 'Unable to connect to server.');
  };
}
