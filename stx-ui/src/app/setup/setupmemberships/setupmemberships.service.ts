/*
  * Dispays setup memberships service methods:
  * createMemberships(membershipsObj): This method is used to create memberships
  * editMemberships(updateMembershipObj, updateId): This method is used to update memberships
  * getSetupMemberships(inActive): This method is used to get memberships
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class SetupMembershipsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /*--- Method used to create memberships ---*/
  createMemberships(membershipsObj) {
    return this.http.post(this.apiEndPoint + '/api/setupmemberships', membershipsObj)
    .map(this.extractData);
  }
  /*--- Method used to edit memberships ---*/
  editMemberships(updateMembershipObj, updateId) {
     return this.http.put(this.apiEndPoint + '/api/setupmemberships/' + updateId, updateMembershipObj)
    .map(this.extractData);
  }
  /*-- Method to get memberships list --*/
  getSetupMemberships(inActive) {
    return this.http.get(this.apiEndPoint + '/api/setupmemberships/' + inActive)
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
