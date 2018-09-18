
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpClient } from '../common/http-client';

@Injectable()
export class ClientappointmentsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string
  ) { }
  /*To extract json data*/
  getVisitTypes() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/visittype/active')
      .map(this.extractData);
  }
  getServiceGroups(type, reqDate) {
    const headers = new Headers();
    headers.append('onlinebooking', 'false');
    headers.append('bookingdate', reqDate);
    return this.http.getHeader(this.apiEndPoint + '/api/setupservices/servicegroups/active/forappts', headers)
      .map(this.extractData);
  }
  searchAppt(dataObj) {
    return this.http.post(this.apiEndPoint + '/api/clientSearch/bookappointments', dataObj)
      .map(this.extractData);
  }
  searchForAppts(dataObj) {
    const header = new Headers();
    header.append('params', JSON.stringify(dataObj));
    return this.http.getHeader(this.apiEndPoint + '/api/appointment/search', header)
      .map(this.extractData);
  }
  getBookingData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }
  getClient(clientId) {
    return this.http.get(this.apiEndPoint + '/api/client/' + clientId)
      .map(this.extractData);
  }
  getAllActivePackages() {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicepackages/' + 'true')
      .map(this.extractData);
  }
  fetchingActiveMembers(dataObj) {
    return this.http.post(this.apiEndPoint + '/api/clientsearch/activemembers', dataObj)
      .map(this.extractData);
  }
  appointmentBooking(apptdata) {
    return this.http.post(this.apiEndPoint + '/api/clientSearch/appointmentbooking', apptdata)
      .map(this.extractData);
  }
  getServices(serviceName, type, bookingdate: string) {
    const headers = new Headers();
    headers.append('bookingdate', bookingdate);
    return this.http.getHeader(this.apiEndPoint + '/api/setupticketpreferences/favorites/types/' + serviceName + '/' + type, headers)
      .map(this.extractData);
  }
  getUsers(bookingdata: any) {
    const headers = new Headers();
    headers.append('onlinebooking', 'false');
    headers.append('bookinginfo', JSON.stringify(bookingdata));
    return this.http.getHeader(this.apiEndPoint + '/api/bookingdata/bookappt', headers)
      .map(this.extractData);
  }
  getApptServices(clientId, apptId, reqDate) {
    const headers = new Headers();
    headers.append('bookingdate', reqDate);
    return this.http.getHeader(this.apiEndPoint + '/api/appointments/services/' + clientId + '/' + apptId, headers)
      .map(this.extractData);
  }
  /**
* Method to get preferences for service tax and retail tax calculation
*/
  getServProdTax() {
    return this.http.get(this.apiEndPoint + '/api/setup/ticketpreferences/pos')
      .map(this.extractData);
  }
  sendApptNotifs(apptsAry) {
    return this.http.post(this.apiEndPoint + '/api/notification/email', { 'apptIds': apptsAry })
      .map(this.extractData);
  }
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
