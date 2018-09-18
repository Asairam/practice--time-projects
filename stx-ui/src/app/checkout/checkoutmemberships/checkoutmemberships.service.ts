import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class CheckOutMembershipsService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
      ) { }
      /*-- Method to get memberships list --*/
  getSetupMemberships(inActive) {
    return this.http.get(this.apiEndPoint + '/api/setupmemberships/' + inActive)
    .map(this.extractData);
  }
  getpaymentList() {
    return this.http.get(this.apiEndPoint + '/api/setup/company/paymenttypes')
     .map(this.extractData);
   }
   getClient(clientId) {
    return this.http.get(this.apiEndPoint + '/api/client/' + clientId)
      .map(this.extractData);
  }
  getPosdevices() {
    return this.http.get(this.apiEndPoint + '/api/setup/ticketpreferences/posdevices')
      .map(this.extractData);
  }
  saveCheckoutMemberships(clientMembershipsObj) {
    return this.http.post(this.apiEndPoint + '/api/checkout/clientmembership', clientMembershipsObj)
    .map(this.extractData);
  }
  getClientMemberships() {
    return this.http.get(this.apiEndPoint + '/api/checkout/clientmembership')
    .map(this.extractData);
  }
  xmlPayment(reqObj) {
    return this.http.post(this.apiEndPoint + '/api/payment', reqObj)
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
