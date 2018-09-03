import { Injectable, Inject } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class OnlineClientAddService {

  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string
  ) { }

  saveClientProfile(clientObj) {
    return this.http.post(this.apiEndPoint + '/api/onlineclientlogin', clientObj)
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
