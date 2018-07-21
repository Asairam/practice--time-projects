/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Headers} from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class BookStandingApptService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }

  getServiceGroups(type) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/' + type)
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
  getClient(clientId) {
    return this.http.get(this.apiEndPoint + '/api/client/' + clientId)
      .map(this.extractData);
  }
  getVisitTypes() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/visittype/active')
      .map(this.extractData);
  }
  getBookOutTimeHour() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  getbookEveryTypes() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  getEveryTypes() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  getAllServiceDetails() {
    return this.http.get(this.apiEndPoint + '/api/setupservices/setupservice')
      .map(this.extractData);
  }
  getBookingData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }
  searchForAppointmentAction(apptdata) {
    return this.http.post(this.apiEndPoint + '/api/appointments/bookoutappoinment', apptdata)
      .map(this.extractData);
  }
  scheduleAvailable(dates) {
    return this.http.post(this.apiEndPoint + '/api/appointments/bookstandingappoinmentswithdata', dates)
      .map(this.extractData);
  }
  getWorkerList() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail')
      .map(this.extractData);
  }
  searchAppt(dataObj) {
    return this.http.post(this.apiEndPoint + '/api/clientSearch/bookappointments', dataObj)
      .map(this.extractData);
  }
  getPackageGroups() {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicepackages/' + 'true')
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
