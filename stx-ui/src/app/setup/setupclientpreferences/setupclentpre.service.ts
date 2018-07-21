/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class SetupClientPreferenceService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  // Client fields methods starts
  /*--- Method used to create client fields ---*/
  setupClientFields(clientPrefenceDetails) {
    return this.http.post(this.apiEndPoint + '/api/setup/clientpreferences/clientfields', clientPrefenceDetails)
      .map(this.extractData);
  }
  /*--- Method used to get client fields ---*/
  getClientFields() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/clientfields')
      .map(this.extractData);
  }
  // Client fields methods ends
  // Visit types methods starts
  postVisitTypes(visitTypes) {
    return this.http.post(this.apiEndPoint + '/api/setup/clientpreferences/visittypes', visitTypes)
      .map(this.extractData);
  }
  /*--- Get the getVisitTypes ---*/
  getVisitTypes() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/visittypes')
      .map(this.extractData);
  }
  // Visit types methods ends
  // Client flags starts
  postClientFlags(clientFlags) {
    return this.http.post(this.apiEndPoint + '/api/setup/clientpreferences/clientflags', clientFlags)
      .map(this.extractData);
  }
  /*--- Get the getVisitTypes ---*/
  getClientFlags() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/clientflags')
      .map(this.extractData);
  }
  // Client flags ends
  // Occupations methods starts
  postOccupations(occupations) {
    return this.http.post(this.apiEndPoint + '/api/setup/clientpreferences/occupations', occupations)
      .map(this.extractData);
  }
  getOccupations() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/occupations')
      .map(this.extractData);
  }
  // Occupations methods ends
  // Mobile carriers methods starts
  mobileCarriernames(lookupType) {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/' + lookupType)
      .map(this.extractData);
  }
  getMobileData() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/mobilecarriers')
      .map(this.extractData);
  }
  postMobileData(mobileCarrier) {
    return this.http.post(this.apiEndPoint + '/api/setup/clientpreferences/mobilecarriers', mobileCarrier)
      .map(this.extractData);
  }
  // Mobile carriers methods ends
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
