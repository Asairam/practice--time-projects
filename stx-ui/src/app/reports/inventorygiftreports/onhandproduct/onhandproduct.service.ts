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
export class OnHandProductService {
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
  /*-- Method to get product lines(active or inactive) --*/
  getProductLineDetails(inactive) {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupproductline/' + inactive)
      .map(this.extractData);
  }
  getInventoryGroupData() {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/inventorygroups')
      .map(this.extractData);
  }
  generateReport(productObj) {
    return this.http.post(this.apiEndPoint + '/api/reports/onhandproductreport', productObj)
      .map(this.extractData);
  }
}
