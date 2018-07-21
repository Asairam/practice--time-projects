/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class LoginService {
  constructor(private http: Http,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  authorised(loginObj) {
    return this.http.post(this.apiEndPoint + '/api/users/login', loginObj)
      .map(this.extractData);
  }

  forgotPassword(userName) {
    return this.http.post(this.apiEndPoint + '/api/users/forgot', userName)
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
