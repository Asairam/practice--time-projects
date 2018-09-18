/*
  * Modify Service contains following methods:
  * getApptDetails(apptid): Method to get appointment details.
  * getApptServices(clientId, apptId): Method to get appointment services.
  * getServiceGroups(type): Method to get service groups.
  * getServices(serviceName, type): Method to get services.
  * getUsers(arr): Method to get users.
  * getAllActivePackages(): Method to get all active packages.
  * getBookingData(): Method to get booked data.
  * fetchingActiveMembers(dataObj): Method to fetch active members data.
  * searchAppt(dataObj):  Method to search appointment data.
  * modifyAppointment(modifyBookingData): Method to save modified appointment.
  * extractData(): To extract the data
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';
import { Headers } from '@angular/http';
@Injectable()
export class ModifyApptService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /* Method to get appointment details */
  getApptDetails(apptid) {
    return this.http.get(this.apiEndPoint + '/api/appointments/' + apptid)
      .map(this.extractData);
  }
  /* Method to get appointment services */
  getApptServices(clientId, apptId, reqDate) {
    const headers = new Headers();
    headers.append('bookingdate', reqDate);
    return this.http.getHeader(this.apiEndPoint + '/api/appointments/services/' + clientId + '/' + apptId, headers)
      .map(this.extractData);
  }
  /* Method to get service groups */
  getServiceGroups(type, reqDate) {
    const headers = new Headers();
    headers.append('bookingdate', reqDate);
    return this.http.getHeader(this.apiEndPoint + '/api/setupservices/servicegroups/active/forappts', headers)
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
    headers.append('bookinginfo', JSON.stringify(bookingdata));
    return this.http.getHeader(this.apiEndPoint + '/api/bookingdata/bookappt', headers)
      .map(this.extractData);
  }
  /* Method to get all active packages */
  getAllActivePackages() {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicepackages/' + 'true')
      .map(this.extractData);
  }
  /* Method to get booked data */
  getBookingData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }
  /* Method to fetch active members data */
  fetchingActiveMembers(dataObj) {
    return this.http.post(this.apiEndPoint + '/api/clientsearch/activemembers', dataObj)
      .map(this.extractData);
  }
  /* Method to search appointment data */
  searchAppt(dataObj) {
    return this.http.post(this.apiEndPoint + '/api/appointments/bookoutappoinment', dataObj)
      .map(this.extractData);
  }
  /* Method to save modified appointment */
  modifyAppointment(modifyBookingData) {
    return this.http.post(this.apiEndPoint + '/api/clientSearch/appointmentbooking', modifyBookingData)
      .map(this.extractData);
  }
  searchForAppts(dataObj) {
    const header = new Headers();
    header.append('params', JSON.stringify(dataObj));
    return this.http.getHeader(this.apiEndPoint + '/api/appointment/search', header)
      .map(this.extractData);
  }
  /**
 * Method to get preferences for service tax and retail tax calculation
 */
  getServProdTax() {
    return this.http.get(this.apiEndPoint + '/api/setup/ticketpreferences/pos')
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
