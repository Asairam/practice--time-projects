/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class OnlineBookService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /*--- To getAppointments ---*/

  getClientOnlineData() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/onlineclientappts/data', headers)
      .map(this.extractData);
  }

  searchForAppts(dataObj) {
    const header = new Headers();
    header.append('params', JSON.stringify(dataObj));
    header.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/appointment/search', header)
      .map(this.extractData);
  }
  getServiceGroups(type, reqDate) {
    const headers = new Headers();
    headers.append('onlinebooking', 'true');
    headers.append('bookingdate', reqDate);
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setupservices/servicegroups/active/forappts', headers)
      .map(this.extractData);
  }
  getServices(serviceName, type, bookingdate: string) {
    const headers = new Headers();
    headers.append('bookingdate', bookingdate);
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setupticketpreferences/favorites/types/' + serviceName + '/' + type, headers)
      .map(this.extractData);
  }

  getClient(clientId) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/client/' + clientId, headers)
      .map(this.extractData);
  }
  getVisitTypes() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setup/clientpreferences/visittype/active', headers)
      .map(this.extractData);
  }


  getAllServiceDetails() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setupservices/setupservice', headers)
      .map(this.extractData);
  }

  getWorkerList() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setupworkers/setupworkerdetail', headers)
      .map(this.extractData);
  }

  getPackageGroups() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setupservices/servicepackages/' + 'true', headers)
      .map(this.extractData);
  }
  /**
 * Method to get preferences for service tax and retail tax calculation
 */
  getServProdTax() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setup/ticketpreferences/pos', headers)
      .map(this.extractData);
  }

  appointmentBooking(apptdata) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.postHeader(this.apiEndPoint + '/api/clientSearch/appointmentbooking', apptdata, headers)
      .map(this.extractData);
  }
  sendEmailToOwner(apptId) {
    const headers = new Headers();
    const dataObj = {
      apptId: apptId
    };
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.postHeader(this.apiEndPoint + '/api/notification/email/owner', dataObj, headers)
      .map(this.extractData);

  }
  getUsers(bookingdata: any) {
    const headers = new Headers();
    headers.append('onlinebooking', 'true');
    headers.append('bookinginfo', JSON.stringify(bookingdata));
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/bookingdata/bookappt', headers)
      .map(this.extractData);
  }

  getOnlineBookingClientData(apptid) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/onlineclient/appointments/data/' + apptid, headers)
      .map(this.extractData);
  }

  /* Method to get appointment services */
  getApptServices(clientId, apptId, reqDate) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    headers.append('bookingdate', reqDate);
    return this.http.getHeader(this.apiEndPoint + '/api/appointments/services/' + clientId + '/' + apptId, headers)
      .map(this.extractData);
  }

  getStates(countryName) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/v1/lookups/states/' + countryName, headers)
      .map(this.extractData);
  }
  getPaymentTypesData() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/setup/company/paymenttypes', headers)
      .map(this.extractData);
  }
  getOnlineBookingData() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/appointmentandemails/onlinebooking', headers)
      .map(this.extractData);
  }
  getClientData(clientId) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/client/' + clientId, headers)
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
  addDepositToOthers(dataObj) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.postHeader(this.apiEndPoint + '/api/checkout/ticketother/' + 'New', dataObj, headers)
      .map(this.extractData);

  }
  xmlPayment(reqObj) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.postHeader(this.apiEndPoint + '/api/payment', reqObj, headers)
      .map(this.extractData);
  }

  addToPaymentsTicket(paymentObj) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.postHeader(this.apiEndPoint + '/api/checkout/ticketpayments', paymentObj, headers)
      .map(this.extractData);
  }
  deleteThePaymentFailedRecords(apptId) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    headers.append('onlinebooking', 'onlinebook');
    return this.http.deleteHeader(this.apiEndPoint + '/api/payment/' + apptId, headers)
      .map(this.extractData);
  }
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('clienttoken', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
