/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class CheckOutService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  getData(searchKey) {
    return this.http.get(this.apiEndPoint + '/api/clientsearch/' + searchKey)
      .map(this.extractData);
  }
  // getClientAutoSearch(id) {
  //   return this.http.get(this.apiEndPoint + '/api/appointment/getclientnames/' + id)
  //     .map(this.extractData);
  // }
  getCheckOutList() {
    return this.http.get(this.apiEndPoint + '/api/checkout/list')
      .map(this.extractData);
  }
  addTickets(ticketsData) {
    return this.http.post(this.apiEndPoint + '/api/checkout/includetickets', ticketsData)
      .map(this.extractData);
  }
  getHideCliContactInfo(id) {
    return this.http.get(this.apiEndPoint + '/api/client/getHideClientContactInfo/' + id)
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
