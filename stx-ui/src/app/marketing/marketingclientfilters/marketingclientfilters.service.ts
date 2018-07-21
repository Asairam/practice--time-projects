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
export class MarketingClientFilterService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
    ) { }

    getServiceGroups() {
        return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/service')
            .map(this.extractData);
    }
    getMarketingSetById(clientId) {
        return this.http.get(this.apiEndPoint + '/api/marketing/marketingsetbyid/' + clientId)
            .map(this.extractData);
    }
    getClientFlags() {
        return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/clientflags')
            .map(this.extractData);
    }
    getUserList() {
        return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail')
            .map(this.extractData);
    }
    saveMarketingFilter(clientId, filterdata) {
        return this.http.put(this.apiEndPoint + '/api/marketing/marketingfilter/' + clientId, filterdata)
            .map(this.extractData);
    }
    getAllSetupServices() {
        return this.http.get(this.apiEndPoint + '/api/setup/allservices')
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
