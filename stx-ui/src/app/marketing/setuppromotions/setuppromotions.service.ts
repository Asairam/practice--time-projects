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
export class SetupPromotionsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  getPromotions() {
    return this.http.get(this.apiEndPoint + '/api/marketing/promotion')
     .map(this.extractData);
   }
   createPromotion(promotionData) {
    return this.http.post(this.apiEndPoint + '/api/marketing/promotion', promotionData)
    .map(this.extractData);
   }
   editPromotion(updatePromotionId, updatePromotionData) {
     return this.http.put(this.apiEndPoint + '/api/marketing/promotion/' + updatePromotionId, updatePromotionData)
     .map(this.extractData);
   }
   getSortList(promotionSortOrderData) {
    return this.http.put(this.apiEndPoint + '/api/marketing/promotions/sortorder', promotionSortOrderData)
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
