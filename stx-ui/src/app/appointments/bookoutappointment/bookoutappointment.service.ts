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
export class BookOutApptService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }

  getWorkerList() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail')
      .map(this.extractData);
  }
  scheduleAvailable(dates) {
    return this.http.post(this.apiEndPoint + '/api/appointments/bookoutappoinmentswithdata', dates)
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
  getBookOutTimeHour() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
    .map(this.extractData);
  }
  getBookOutEvery() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
    .map(this.extractData);
  }
  getNumberofBookOuts() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
    .map(this.extractData);
  }
  getBookingData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }
  searchForAppointmentAction(apptdata) {
    return this.http.post(this.apiEndPoint + '/api/appointments/bookoutappoinment' , apptdata )
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
