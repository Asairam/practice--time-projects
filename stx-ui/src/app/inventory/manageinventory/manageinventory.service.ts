
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class ManageInventoryService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
    ) { }
    /*method is used to get sort options */
    getInventorySortOptions() {
        return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
            .map(this.extractData);
    }
    /* Method used to get product line data */
    getProductLinesData() {
        return this.http.get(this.apiEndPoint + '/api/setupinventory/setupproductline/' + 0)
            .map(this.extractData);
    }
    /* Method used to get inventory group data */
    getInventoryGroupsData() {
        return this.http.get(this.apiEndPoint + '/api/setupinventory/inventorygroups')
            .map(this.extractData);
    }
    /* Method used search the product data */
    productsSearch(searchObj) {
        return this.http.post(this.apiEndPoint + '/api/setupinventory/manage/searchproducts/', searchObj)
            .map(this.extractData);
    }
    /* Method used to update product data */
     saveProductData(updateProducts) {
        return this.http.put(this.apiEndPoint + '/api/setupinventory/manage/products', updateProducts)
            .map(this.extractData);
    }
    /* Method used to get view options */
    getViewOptions() {
        return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
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
