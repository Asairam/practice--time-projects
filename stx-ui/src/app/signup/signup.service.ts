import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../common/http-client';

@Injectable()
export class SignupService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
    ) { }
    getStates(countryName) {
        return this.http.get(this.apiEndPoint + '/api/v1/lookups/states/' + countryName)
            .map(this.extractData);
    }
    getCountry(lookupType) {
        return this.http.get(this.apiEndPoint + '/api/v1/lookups/' + lookupType)
            .map(this.extractData);
    }
    private extractData(res: Response) {
        if (res.headers && res.headers.get('token')) {
            localStorage.setItem('token', res.headers.get('token'));
        }
        const body = res.json();
        return body || {};
    }
}