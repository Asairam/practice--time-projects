import { Injectable, Inject } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class OnlinePackagePurchaseService {

  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string
  ) { }

  getApptDetails(apptId: string) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/appointments/modify/' + apptId, headers)
      .map(this.extractData);
  }
  getClientOnlineData() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/onlineclientappts/data', headers)
      .map(this.extractData);
  }
  addToTicket(ticketObj, action) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.postHeader(this.apiEndPoint + '/api/checkout/ticketother/' + action, ticketObj, headers)
      .map(this.extractData);
  }
  getAllServiceDetails(type) {
    if (type === undefined || type === true) {
      type = 'true';
    }
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setupservices/servicepackages/' + type, headers)
      .map(this.extractData);
  }
  getStates(countryName) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/v1/lookups/states/' + countryName, headers)
      .map(this.extractData);
  }
  addToPaymentsTicket(paymentObj) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.postHeader(this.apiEndPoint + '/api/checkout/ticketpayments', paymentObj, headers)
      .map(this.extractData);
  }
  getTicketPaymentData(apptId) {
    return this.http.get(this.apiEndPoint + '/api/checkout/ticketpayments/' + apptId)
      .map(this.extractData);
  }
  /**
  * To get paymenttypes Data
  */
  getPaymentTypesData() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setup/company/paymenttypes', headers)
      .map(this.extractData);
  }
  /**
     * To getWorkerMerchantsData for payments
     */
  getWorkerMerchantsData() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/checkout/ticketpayments/worker/merchant', headers)
      .map(this.extractData);
  }

  xmlPayment(reqObj) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.postHeader(this.apiEndPoint + '/api/payment', reqObj, headers)
      .map(this.extractData);
  }
  deleteThePaymentFailedRecords(apptId) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.deleteHeader(this.apiEndPoint + '/api/payment/' + apptId, headers)
      .map(this.extractData);
  }
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('clienttoken', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }

}
