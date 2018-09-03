import { Injectable, Inject } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class ClientLoginService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string
  ) { }
  getClientInfo(dbName) {
    return this.http.get(this.apiEndPoint + '/api/client/info/' + dbName)
      .map(this.extractData);
  }

  authorised(loginObj) {
    const headers = new Headers();
    headers.append('params', JSON.stringify(loginObj));
    return this.http.getHeader(this.apiEndPoint + '/api/client/online/login', headers)
      .map(this.extractData);
  }
  forgotPin(userName) {
    return this.http.post(this.apiEndPoint + '/api/client/online/forgot', userName)
      .map(this.extractData);
  }
  onlineMerchantAccount() {
    return this.http.get(this.apiEndPoint + '/api/setup/ticketpreferences/posWithoutLogin/' + localStorage.getItem('param'))
      .map(this.extractData);
  }
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('clienttoken', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
