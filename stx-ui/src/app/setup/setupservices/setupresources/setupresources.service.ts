/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupServiceResourceService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  createSetupResourceServiceData(setupResourseDataObj) {
    return this.http.post(this.apiEndPoint + '/api/setupservices/resources', setupResourseDataObj)
      .map(this.extractData);
  }
  getSetupResourceServiceData(showInactiveRecords) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/resources/' + showInactiveRecords)
      .map(this.extractData);
  }
  editSetupResourceData(editResourceServiceData, updateId) {
    return this.http.put(this.apiEndPoint + '/api/setupservices/resources/' + updateId, editResourceServiceData)
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
