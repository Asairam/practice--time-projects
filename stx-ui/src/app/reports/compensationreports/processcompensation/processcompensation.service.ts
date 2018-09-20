/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class ProcessCompensationService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
  workerCompensationList(startDate: Date, endDate: Date) {
    const stDtSt = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
    const endDtSt = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();
    const headers = new Headers();
    const today = new Date();
    headers.append('today', today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
    return this.http.getHeader(this.apiEndPoint + '/api/reports/processcompensation/' + stDtSt + '/' + endDtSt, headers)
      .map(this.extractData);
  }
  archiveSer(archive) {
    return this.http.post(this.apiEndPoint + '/api/reports/processcompensation/archive', archive)
      .map(this.extractData);
  }
  resetSer(archive) {
    return this.http.post(this.apiEndPoint + '/api/reports/processcompensation/reset', archive)
      .map(this.extractData);
  }
  generateData(date, workerids) {
    const headers = new Headers();
    headers.append('workerIds', workerids);
    return this.http.getHeader(this.apiEndPoint + '/api/reports/processcompensation/generate/' + date.stdate + '/' + date.eddate, headers)
      .map(this.extractData);
  }
  fullview(id, workerId, startDate, endDate) {
    const headers = new Headers();
    headers.append('sdate', startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate());
    headers.append('edate', endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate());
    headers.append('workerId', workerId);
    return this.http.getHeader(this.apiEndPoint + '/api/reports/processcompensationrun/view/' + id, headers)
      .map(this.extractData);
  }
}
