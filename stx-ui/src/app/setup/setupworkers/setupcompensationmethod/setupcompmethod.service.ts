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
export class SetupCompMethodService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  getMethods() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupcompensationmethods')
    .map(this.extractData);
  }
  saveMethods(methodObj) {
    return this.http.post(this.apiEndPoint + '/api/setupworkers/setupcompensationmethods', methodObj)
    .map(this.extractData);
  }
  editMethods(updateId, updateMethodObj) {
    return this.http.put(this.apiEndPoint + '/api/setupworkers/setupcompensationmethods/' + updateId, updateMethodObj)
    .map(this.extractData);
  }
  getValues() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
    .map(this.extractData);
  }
  getActions() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
    .map(this.extractData);
  }
  getServices() {
    const type = 1;
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/' + type)
    // return this.http.get(this.apiEndPoint + '/api/setup/setupclass/activeinactive/' + type)
    .map(this.extractData);
  }
  getscales() {
    const type = 1;
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupcompensation/' + type)
    .map(this.extractData);
  }
  getInventoryGroupData() {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/inventorygroups')
    .map(this.extractData);
  }
  getProductLineDetails() {
    const type = 0;
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupproductline/' + type)
    .map(this.extractData);
  }
  getStaticServiceGroups() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
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
