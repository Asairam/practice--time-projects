/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

@Injectable()
export class ResetService {
  private headers = new Headers();
  constructor(private http: Http,
    @Inject('apiEndPoint') private apiEndPoint: string
  ) { }

  resetPassword(password, token) {
    this.headers.append('token', token);
    return this.http.post(this.apiEndPoint + '/api/users/restpassword', { 'password': password }, {
      headers: this.headers
    }).map(this.extractData);
  }

  /*To extract json data*/
  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }
}
