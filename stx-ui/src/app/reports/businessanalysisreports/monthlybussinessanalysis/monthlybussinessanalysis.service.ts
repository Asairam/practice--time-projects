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
export class MonthlyBussinessAnalysisService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }

  getUserList() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail')
      .map(this.extractData);
  }

  /*-- Method to get product lines(active or inactive) --*/
  getProductLines() {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupproductline/' + 0)
      .map(this.extractData);
  }

  getSetupServiceGroupsList() {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/')
      .map(this.extractData);
  }

  getBussinessAnalysisReport(reportData) {
    return this.http.post(this.apiEndPoint + '/api/reports/monthlybussinessanalysisreport', reportData)
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
