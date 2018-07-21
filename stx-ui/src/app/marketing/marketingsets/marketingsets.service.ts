/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class MarketingSetsService {
  private staticPage = 'common.json';
  constructor(private htt: Http, private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }

  getMarketingUserList() {
    return this.http.get(this.apiEndPoint + '/api/marketing/marketingset/:active')
      .map(this.extractData);
  }
  MarketingSetsService(marketingSetData) {
    return this.http.post(this.apiEndPoint + '/api/marketing/marketingset', marketingSetData)
      .map(this.extractData);
  }
  getPreference(name) {
    return this.http.get(this.apiEndPoint + '/api/marketing/preference/' + name)
      .map(this.extractData);
  }
  getFreaquencyTypes() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  getOutputTypes() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  getEmailTypes() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  getTimeHour() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }

  updateMarketingSetsService(marketingSetData, marketingId) {
    return this.http.put(this.apiEndPoint + '/api/marketing/marketingset/' + marketingId, marketingSetData)
      .map(this.extractData);
  }
  deleteMarketingSetsService(marketingId, name) {
    return this.http.delete(this.apiEndPoint + '/api/marketing/marketingset/' + marketingId + '/' + name)
      .map(this.extractData);
  }
  getEmailList(bs64) {
    // const myblob = new Blob([name + ':' + value], {
    //   type: 'text/plain'
    // });
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic' + bs64);
    // myHeaders.setHeader('Authorization', 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(emailAppSubuserPref.Text__c + ':' + emailAppSubuserPref.Encrypted__c)));
    // btoa(JSON.stringify(obj))
    const options = new RequestOptions({ headers: myHeaders });
    return this.htt.get('https://api.sendgrid.com/v3/campaigns?limit=50&offset=0', options)
      .map(this.extractData);
  }


}
