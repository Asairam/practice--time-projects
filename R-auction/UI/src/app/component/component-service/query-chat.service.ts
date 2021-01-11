import { Injectable } from '@angular/core';
import * as config from '../../appConfig/index';
import { Observable, throwError, forkJoin, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../authService/auth.service';
import { CommonService } from '../../commonService/common.service';

@Injectable({
  providedIn: 'root'
})

export class QueryChatService {
  apiEndPoint = config.APP_CONSTANTS;
  port = config.BASE_URL;
  constructor(private http: HttpClient, private authService: AuthService, private common: CommonService) { }

  insertQueryData(data) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.POST_QUERY_DATA, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateQueryData(data) {
    return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.PUT_QUERY_DATA, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getQuery(objData: any) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_QUERY + objData.application + '/' + objData.appNo + '/' + objData.vendorNo)
      .pipe(
        catchError(this.handleError)
      );
  }

  getQueryList(objData: any) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_QUERY_LIST + objData.application + '/' + objData.appNo + '/' + objData.vendorNo + '/' + objData.queryNo)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(
      (error.error.message) ? error.error.message : 'Unable to connect to server.');
  };
}
