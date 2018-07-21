/*
  * Setup Goals Service Having following methods:
  * getGoals(): This method is used to get goals
  * saveGoals(goalsObj): This method is used to save goals obj
  * editGoals(updateId, updateGoalsObj): This method is used to edit goals
  * getValues(): This method is used to get values
  * getActions(): This method is used to get actions
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupGoalsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /*--- Method used to get goals ---*/
  getGoals() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupgoals')
    .map(this.extractData);
  }
  /*--- Method used to save goals ---*/
  saveGoals(goalsObj) {
    return this.http.post(this.apiEndPoint + '/api/setupworkers/setupgoals', goalsObj)
    .map(this.extractData);
  }
  /*--- Method to edit goals ---*/
  editGoals(updateId, updateGoalsObj) {
    return this.http.put(this.apiEndPoint + '/api/setupworkers/setupgoals/' + updateId, updateGoalsObj)
    .map(this.extractData);
  }
  /*--- Method to get values ---*/
  getValues() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
    .map(this.extractData);
  }
  /*--- Method to get actions ---*/
  getActions() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
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
