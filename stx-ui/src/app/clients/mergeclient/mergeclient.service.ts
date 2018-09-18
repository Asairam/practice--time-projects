/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class MergeClientService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }

  getClient(clientId1, clientId2) {
    return this.http.get(this.apiEndPoint + '/api/clients/' + clientId1 + '/' + clientId2)
      .map(this.extractData);
  }
  mergeClients(dataObj) {
    return this.http.post(this.apiEndPoint + '/api/merge/clients/', dataObj)
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
