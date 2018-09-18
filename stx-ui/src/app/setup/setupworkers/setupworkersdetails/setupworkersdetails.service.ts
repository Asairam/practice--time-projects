/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupWorkersDetailsService {
  private bookingDataUrl = 'common.json';
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  getUserList() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail')
      .map(this.extractData);
  }
  saveUser(updateId, dataObj, imgFile) {
    if (updateId) {
      dataObj.page = 'edit';
    } else {
      dataObj.page = 'add';
    }
    const data = new FormData();
    data.append('workerInfo', JSON.stringify(dataObj));
    data.append('workerImage', imgFile);
    return this.http.put(this.apiEndPoint + '/api/setupworkers/setupworkerdetail/' + updateId, data)
      .map(this.extractData);
  }
  saveWorkerServices(workerServiceData) {
    return this.http.put(this.apiEndPoint + '/api/setupworkers/setupworkerservice', workerServiceData)
      .map(this.extractData);
  }
  getLookupsList(lookupType) {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/' + lookupType)
      .map(this.extractData);
  }
  getWorekrRoleData() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  getStates(countryName) {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/states/' + countryName)
      .map(this.extractData);
  }
  getMobileData() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/mobilecarriers')
      .map(this.extractData);
  }
  getSetupServicesData() {
    const inactive = 1;
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/' + inactive)
      .map(this.extractData);
  }
  getSetupServiceGroupsList() {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/')
      .map(this.extractData);
  }
  showInactiveServiceListByGroupName(active, serviceGroupName) {
    return this.http.get(this.apiEndPoint + '/api/setup/setupservice/activeinactive/' + active + '/' + serviceGroupName)
      .map(this.extractData);
  }
  getClasses() {
    const type = 'true';
    return this.http.get(this.apiEndPoint + '/api/setup/setupclass/activeinactive/' + type)
      .map(this.extractData);
  }
  getBookingData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }
  hoursForOnline() {
    return this.http.get(this.apiEndPoint + '/api/setup/company/companyhours')
      .map(this.extractData);
  }
  getservicesByUser(updateId) {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail/workerservices/' + updateId)
      .map(this.extractData);
  }
  getpermissioneList() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setuppermissions')
      .map(this.extractData);
  }
  getMethods() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupcompensationmethods')
      .map(this.extractData);
  }
  getLevels() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  /*--- Goals code ---*/
  getGoals() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupgoals')
      .map(this.extractData);
  }
  previousGoals(goals, workerId, date) {
    const header = new Headers();
    const dataObj = {
      'type': goals,
      'workerId': workerId,
      'date': date
    };
    header.append('params', JSON.stringify(dataObj));
    return this.http.getHeader(this.apiEndPoint + '/api/setup/workers/workergoals', header)
      .map(this.extractData);
  }
  createGoals(goalsData) {
    //  alert('service' + JSON.stringify(goalsData));
    return this.http.post(this.apiEndPoint + '/api/setup/workers/workergoals', goalsData)
      .map(this.extractData);
  }
  updateGoal(goallist, workerId) {
    //  alert(workerId);
    return this.http.put(this.apiEndPoint + '/api/setup/workers/workergoals/calculategoal/' + workerId, goallist)
      .map(this.extractData);
  }
  updatePassword(userId, password) {
    return this.http.put(this.apiEndPoint + '/api/users/password/' + userId, { 'password': password })
      .map(this.extractData);
  }
  // deleteGoal(workerGoalId) {
  //   return this.http.delete(this.apiEndPoint + '/api/setup/workersworkers/workergoals/' + workerGoalId)
  //     .map(this.extractData)
  //     .catch(this.handleError);

  // }
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
