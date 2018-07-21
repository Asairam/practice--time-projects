/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class ClientQuickEditService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }

getClient(clientId) {
  return this.http.get(this.apiEndPoint + '/api/client/' + clientId)
    .map(this.extractData);
}
  clientQuickEdit(clientId, editObj) {
    return this.http.put( this.apiEndPoint + '/api/client/quick/' + clientId , editObj)
      .map(this.extractData);
  }
  getClientRewardsData(clientId) {
    return this.http.get(this.apiEndPoint + '/api/client/rewards/' + clientId)
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
