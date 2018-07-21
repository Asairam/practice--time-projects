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
export class SetupCompanyhrsService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
    ) { }
    /*--- To getAppointments ---*/
    createSetupCompanyhrsData(company) {
        return this.http.post(this.apiEndPoint + '/api/setup/company/companyhours', company)
            .map(this.extractData);
    }
    getCompanyLists() {
        return this.http.get(this.apiEndPoint + '/api/setup/company/companyhours')
            .map(this.extractData);
    }
    editCompany(Id, dataObject) {
        return this.http.put(this.apiEndPoint + '/api/setup/company/companyhours/' + Id, dataObject)
            .map(this.extractData);
    }
    timeZones() {
        return this.http.get(this.apiEndPoint + '/api/timezones')
            .map(this.extractData);
    }
    /* getting the customer hours */
    getCompanyCustomhours(Id) {
        return this.http.get(this.apiEndPoint + '/api/setup/company/customhours/' + Id)
            .map(this.extractData);
    }
    /* custom hours post */
    postCustomHours(hours) {
        return this.http.post(this.apiEndPoint + '/api/setup/company/customhours', hours)
            .map(this.extractData);
    }
    putCustomHours(edit) {
        return this.http.put(this.apiEndPoint + '/api/setup/company/customhours', edit)
            .map(this.extractData);
    }
    deleteCustomHours(Id) {
        return this.http.delete(this.apiEndPoint + '/api/setup/company/customhours/' + Id)
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
