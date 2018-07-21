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
export class SetupServicePackagesService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  setupPackages(createServiceGroupsData) {
    return this.http.post(this.apiEndPoint + '/api/setupservices/servicepackages', createServiceGroupsData)
      .map(this.extractData);
  }
  editPackages(editServiceGroupsData, serviceId) {
    return this.http.put(this.apiEndPoint + '/api/setupservices/servicegroups/' + serviceId, editServiceGroupsData)
      .map(this.extractData);
  }
  getServiceDetails(inactive) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/setupservice')
      .map(this.extractData);
  }
  packageData(packageData) {
    return this.http.post(this.apiEndPoint + '/api/setupservices/servicepackages', packageData)
      .map(this.extractData);
  }
  getSingleServiceDetails(serviceId) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/setupservice/' + serviceId)
      .map(this.extractData);
  }
  getAllServiceDetails(type) {
    if (type === undefined || type === true) {
      type = 'true';
    }
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicepackages/' + type)
      .map(this.extractData);
  }
  updatepackageData(editpackageData, updateId) {
    return this.http.put(this.apiEndPoint + '/api/setupservices/servicepackages/' + updateId, editpackageData)
      .map(this.extractData);
  }
  getServiceTax() {
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
