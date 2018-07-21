import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class CashInOutService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
      ) { }
      saveCashInOut(cashInOutObj) {
        return this.http.post(this.apiEndPoint + '/api/checkout/cashinout', cashInOutObj)
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
