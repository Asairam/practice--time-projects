import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class CompletedTicketService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
    ) { }
    getApptDetails(apptid) {
        return this.http.get(this.apiEndPoint + '/api/appointments/' + apptid)
            .map(this.extractData);
    }
    /**
   * to get the ticket services from ticketservice table
   */
    getTicketServicesByApptId(apptid) {
        return this.http.get(this.apiEndPoint + '/api/checkout/services/' + apptid)
            .map(this.extractData);
    }
    /**
    * to get the ticket products from ticketproduct table
    */
    getTicketProducts(apptId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/ticketproducts/' + apptId)
            .map(this.extractData);
    }
    /**
* To get ticket payment Records by ApptId
*/
    getTicketPaymentData(apptId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/ticketpayments/' + apptId)
            .map(this.extractData);
    }
    /**
     * To get workerTips list
     */
    getTipsList(apptId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/tips/' + apptId)
            .map(this.extractData);
    }
    /**
     * To get other list
     */
    getOthersTicketList(ticketId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/ticketother/' + ticketId)
            .map(this.extractData);
    }
    /**
    * To get Included Tickets
    */
    getIncludedTicketList(ticketId) {
        return this.http.get(this.apiEndPoint + '/api/checkout/apptincludetickets/' + ticketId)
            .map(this.extractData);
    }
    /**
   * To get other list
   */
    sendReciept(dataObj) {
        return this.http.post(this.apiEndPoint + '/api/checkout/emailreciept', { 'data': dataObj })
            .map(this.extractData);
    }
 /**
   * To get clientRewards List
   */
  clientRewardDatabyApptId(apptid) {
    return this.http.get(this.apiEndPoint + '/api/checkout/clientRewards/' + apptid)
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
