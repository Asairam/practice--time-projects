
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class InventoryUsageService {
    private commonData = 'common.json';
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
    ) { }
    getProductsBySKU(searchKeyWord) {
        return this.http.get(this.apiEndPoint + '/api/inventory/usage/' + searchKeyWord)
            .map(this.extractData);
    }
    getUsedByDataValues() {
        return this.http.get(this.staticJsonFilesEndPoint + this.commonData)
            .map(this.extractData);
    }
    getUserList() {
        return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail')
            .map(this.extractData);
    }
    getProductsBySelect() {
        return this.http.get(this.apiEndPoint + '/api/inventory/products')
            .map(this.extractData);
    }
    saveUsageData(productsList) {
        return this.http.post(this.apiEndPoint + '/api/inventory/usage', productsList)
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
