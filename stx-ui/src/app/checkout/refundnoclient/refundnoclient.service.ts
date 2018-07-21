import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class RefundsNoclientService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
      ) { }
      getRefund(refunddata) {
        return this.http.post(this.apiEndPoint + '/api/checkout/refund', refunddata)
           .map(this.extractData);
       }
       getRefundTO(refunddata) {
        return this.http.get(this.apiEndPoint + '/api/checkout/refund/' + refunddata.Appt_Ticket__c)
           .map(this.extractData);
       }
       postRefundData(refunddata) {
        return this.http.post(this.apiEndPoint + '/api/checkout/refund/payment' , refunddata)
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
