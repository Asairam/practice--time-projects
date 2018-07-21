/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class SetupRewardsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }

  rewardData() {
    return this.http.get(this.apiEndPoint + '/api/marketing/rewards')
      .map(this.extractData);
  }
  
  postRewardsData(rewardData) {
    return this.http.post(this.apiEndPoint + '/api/marketing/rewardspost', rewardData)
      .map(this.extractData);
  }

  updateRewardsData(rewardData) {
    return this.http.put(this.apiEndPoint + '/api/marketing/rewardsUpdate/' + rewardData.id, rewardData)
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
