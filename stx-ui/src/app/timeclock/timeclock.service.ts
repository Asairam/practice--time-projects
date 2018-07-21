/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpClient } from '../common/http-client';

@Injectable()
export class TimeClockService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  getWorkerByPin(pin, date) {
    const headers = new Headers();
    headers.append('workerdate', date);
    return this.http.getHeader(this.apiEndPoint + '/api/worker/timeclock/' + pin, headers)
      .map(this.extractData);
  }
  saveWorkerTimeClock(dataObj) {
    return this.http.post(this.apiEndPoint + '/api/timeclock', dataObj)
      .map(this.extractData);
  }
  getWorkerTimeClock(date) {
    const headers = new Headers();
    headers.append('workerdate', date);
    return this.http.getHeader(this.apiEndPoint + '/api/timeclock', headers)
      .map(this.extractData);
  }
  saveMultiple(dataObj) {

    return this.http.post(this.apiEndPoint + '/api/timeclock/multiple', dataObj)
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
