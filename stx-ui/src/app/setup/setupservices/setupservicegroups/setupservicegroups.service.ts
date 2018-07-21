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
export class SetupServGroupService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  postSetupServicesData(createServiceGroupsData) {
    return this.http.post(this.apiEndPoint + '/api/setupservices/servicegroups', createServiceGroupsData)
      .map(this.extractData);
  }
  editSetupServicesData(editServiceGroupsData, oldServiceName, oldOnlineName) {
    if (oldOnlineName === '') {
      oldOnlineName = null;
    }
    return this.http.put(this.apiEndPoint
      + '/api/setupservices/servicegroups/' + oldServiceName + '/'
      + oldOnlineName, editServiceGroupsData)
      .map(this.extractData);
  }
  /*-- Method used to delete product line --*/
  deleteServiceGroup(oldServiceName) {
    return this.http.delete(this.apiEndPoint + '/api/setupservices/servicegroups/' + oldServiceName)
    .map(this.extractData);
  }
  getSetupServicesData(inactive) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/' + inactive)
      .map(this.extractData);
  }
  getSetupServiceGroupData(oldServiceName) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/services/' + oldServiceName)
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
