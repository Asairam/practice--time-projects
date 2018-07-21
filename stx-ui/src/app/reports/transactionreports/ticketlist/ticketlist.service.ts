/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class  TicketListService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  searchTicketData(searchData) {
    return this.http.post(this.apiEndPoint + '/api/reports/ticket/date' , searchData)
    .map(this.extractData);
  }
  searchcashinoutData(searchData) {
    return this.http.post(this.apiEndPoint + '/api/reports/cashinout/date' , searchData)
    .map(this.extractData);
  }
  getTicketDetailsReport(stDate, edDate) {
    return this.http.get(this.apiEndPoint + '/api/reports/ticketdetails/' + stDate + '/' + edDate)
    .map(this.extractData);
  }
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
