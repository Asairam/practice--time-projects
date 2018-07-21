/*
  * Displays product line details
  * getProductLineDetails(inactive): This method is used to get product lines(active or inactive)
  * createProductLine(productLineObj): This method is used to create product line
  * getInventoryGroups(): This method is used to get inventory groups
  * updateInventoryProductLine(updateProductLineObj, updateId): This method is used to edit product line
  * deleteProductLine(updateId): This method is used to delete product line
  * getDeleteResponse(updateId, type): This method is used to get response to show delete button
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupcompansationscalesService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
/*-- Method to get product lines(active or inactive) --*/
getscales() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupcompensation')
    .map(this.extractData);
  }
  getBasis() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
    .map(this.extractData);
  }
  createScales(scalesObj) {
    return this.http.post(this.apiEndPoint + '/api/setupworkers/setupcompensation', scalesObj)
    .map(this.extractData);
  }
  editScales(scalesUpdateObj, scaleId) {
    return this.http.put(this.apiEndPoint + '/api/setupworkers/setupcompensation/' + scaleId, scalesUpdateObj)
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
