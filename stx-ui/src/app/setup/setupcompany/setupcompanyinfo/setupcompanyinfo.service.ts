/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupCompanyInfoService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
    createSetupCompanyData(company, companyLogo) {
    const data = new FormData();
    data.append('company', JSON.stringify(company));
    data.append('companyLogo', companyLogo);
    return this.http.post(this.apiEndPoint + '/api/setup/companies', data)
      .map(this.extractData);
  }
  timings() {
    return this.http.get(this.staticJsonFilesEndPoint + 'timings.json')
      .map(this.extractData);

  }
  booking() {
    return this.http.get(this.staticJsonFilesEndPoint + 'timings.json')
      .map(this.extractData);

  }
  getLookupsList(lookupType) {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/' + lookupType)
      .map(this.extractData);
  }
  getStates(countryName) {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/states/' + countryName)
      .map(this.extractData);
  }
  getCompanyInfo() {
    return this.http.get(this.apiEndPoint + '/api/setup/compananyinfo')
    .map(this.extractData);
  }
  editCompanyInfo(company, companyLogo, companyId) {
    const data = new FormData();
    data.append('company', JSON.stringify(company));
    data.append('companyLogo', companyLogo);
    return this.http.put(this.apiEndPoint + '/api/setup/companyinfo/' + companyId, data)
      .map(this.extractData);
  }
  postPostalcode(postalCode) {
    return this.http.get(this.apiEndPoint + '/api/setup/companies/postalCode/' + postalCode)
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
