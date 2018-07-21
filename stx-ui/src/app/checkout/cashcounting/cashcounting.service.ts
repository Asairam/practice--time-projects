import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class CashCountingService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
    ) { }
    /*-- Method to get POS devices list --*/

    getPosdevices() {
        return this.http.get(this.apiEndPoint + '/api/setup/ticketpreferences/posdevices')
            .map(this.extractData);
    }

    getCashCountingReport(date: string, drawer: string) {
        return this.http.get(this.apiEndPoint + '/api/checkout/cashcounting/' + date + '/' + drawer)
            .map(this.extractData);
    }
    saveCashCounting(cashCountingData) {
        return this.http.post(this.apiEndPoint + '/api/checkout/cashcounting' , cashCountingData)
            .map(this.extractData);
    }
    editCashCounting(id , editcashcountingData) {
        return this.http.put(this.apiEndPoint + '/api/checkout/cashcounting/' + id , editcashcountingData)
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
