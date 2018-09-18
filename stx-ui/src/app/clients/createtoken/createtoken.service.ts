import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { HttpClient } from '@angular/common/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class CreateTokenService {

  constructor(private http: HttpClient, @Inject('apiEndPoint') private apiEndPoint: string) { }

  getLookupsList(lookupType) {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/' + lookupType)
      .map(this.extractData);
  }

  getClientData(clientId) {
    return this.http.get(this.apiEndPoint + '/api/client/' + clientId)
      .map(this.extractData);
  }

  saveClient(clientId, clientObj) {
    return this.http.put(this.apiEndPoint + '/api/client/tokenUpdate/' + clientId, clientObj)
      .map(this.extractData);
  }

  xmlPayment(reqObj) {
    return this.http.post(this.apiEndPoint + '/api/payment', reqObj)
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
