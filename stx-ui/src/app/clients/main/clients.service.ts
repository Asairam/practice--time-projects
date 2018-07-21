/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class ClientsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }

  getData(searchKey) {
    return this.http.get(this.apiEndPoint + '/api/clientsearch/' + searchKey)
      .map(this.extractData);
  }

  getAllData() {
    return this.http.get(this.apiEndPoint + '/api/clientsearch/')
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
