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
export class SetupSuppliersService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  setupSuppliers(suppliersData) {
    return this.http.post(this.apiEndPoint + '/api/setupinventory/setupsuppliers', suppliersData)
      .map(this.extractData);
  }
  editSetupSuppliersData(editSuppliersData, updateId) {
    // const data = new Data();
    return this.http.put(this.apiEndPoint + '/api/setupinventory/setupsuppliers/' + updateId, editSuppliersData)
      .map(this.extractData);
  }
  getSetupSuppliersData(inActive) {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupsuppliers/' + inActive)
      .map(this.extractData);
  }
   /*-- Method used to get response to show delete button --*/
   getDeleteResponse(updateId, type, name) {
    return this.http.delete(this.apiEndPoint + '/api/setupinventory/setupsuppliers/' + updateId + '/' + type + '/' + name)
      .map(this.extractData);
  }
  deleteSupplier(id, updateSupplierName) {
    return this.http.delete(this.apiEndPoint + '/api/setupinventory/setupsuppliers/' + id + '/' + 'delete' + '/' + updateSupplierName)
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
