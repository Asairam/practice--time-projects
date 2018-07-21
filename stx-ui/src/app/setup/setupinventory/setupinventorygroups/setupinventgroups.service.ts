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
export class SetupInventGroupsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  saveInventoryGroupData(groupObj) {
    return this.http.post(this.apiEndPoint + '/api/setupinventory/inventorygroups', groupObj)
      .map(this.extractData);
  }
  getInventoryGroupData() {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/inventorygroups')
      .map(this.extractData);
  }
  getInventoryGroupDependencyData(updateInventoryGroupName) {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/inventorygroups/dependency/' + updateInventoryGroupName)
      .map(this.extractData);
  }
  deleteInvGrp(updateInventoryGroupName) {
    return this.http.delete(this.apiEndPoint + '/api/setupinventory/inventorygroups/' + updateInventoryGroupName)
      .map(this.extractData);
  }
  editProductGroupData(oldInventoryGroupName, updateInventoryGroupName, productGroupEditData) {
    return this.http.put(this.apiEndPoint + '/api/setupinventory/inventorygroups/' + oldInventoryGroupName
      + '/' + updateInventoryGroupName, productGroupEditData)
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
