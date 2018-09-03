import { Injectable, Inject } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class OnlineClientApptsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string
  ) { }
  getAppointments(clientid) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    headers.append('clientid', clientid);
    return this.http.getHeader(this.apiEndPoint + '/api/client/appointments/online/data', headers)
      .map(this.extractData);
  }

  cancelAppts(dataObj) {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.putHeader(this.apiEndPoint + '/api/onlineclient/appointments/cancel', dataObj, headers)
      .map(this.extractData);
  }
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('clienttoken', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
  getOnlineData() {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('clienttoken'));
    return this.http.getHeader(this.apiEndPoint + '/api/appointmentandemails/onlinebooking', headers)
      .map(this.extractData);
  }
}
