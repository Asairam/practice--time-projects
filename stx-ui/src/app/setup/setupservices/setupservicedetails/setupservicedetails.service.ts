import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { URLSearchParams } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupServiceDetailsService {
  private staticJSONName = 'common.json';
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /**
   * This function is to fetch services list respecting active and service group name
   * @param active true / false
   * @param serviceGroupName is service group name
   */
  showInactiveServiceListByGroupName(active, serviceGroupName) {
    return this.http.get(this.apiEndPoint + '/api/setup/setupservice/activeinactive/' + active + '/' + serviceGroupName)
      .map(this.extractData);
  }
  /**
   * This function is to save service detail record
   * @param servicesObj is a service data object
   */
  setupServiceDetails(servicesObj) {
    const data = new URLSearchParams();
    data.append('setupService', JSON.stringify(servicesObj));
    return this.http.post(this.apiEndPoint + '/api/setup/setupservice', data)
      .map(this.extractData);
  }
  /**
   * This function is to update service detail record
   * @param id is a service id
   * @param servicesUpdateObj sarvice data object
   */
  updateServiceDetails(id, servicesUpdateObj) {
    const data = new URLSearchParams();
    data.append('updateObj', JSON.stringify(servicesUpdateObj));
    return this.http.put(this.apiEndPoint + '/api/setup/setupservice/' + id, data)
      .map(this.extractData);
  }
  /**
   * This function is to delete service detail record
   * @param id is a service id
   */
  deleteServiceDetail(id, serviceName) {
    const data = new URLSearchParams();
    return this.http.delete(this.apiEndPoint + '/api/setup/setupservice/' + id + '/' + serviceName)
      .map(this.extractData);
  }
  /**
   * This function is to fetch service group list
   */
  getSetupServiceGroupsList() {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/')
      .map(this.extractData);
  }
  /**
   * This function fetches data from Preferences table for 'Appt Booking'
   * to validate total duration with appt booking intervals
   */
  getAppointmentBookingData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }
  /**
   * This function is to fetch resources data
   * @param showAllResources is 1/0 to load the active/inactive resouces list
   */
  getResourcesNameList(showAllResources) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/resources/' + showAllResources)
      .map(this.extractData);
  }
  /**
   * This function lists Resources filters
   */
  resourceUsedFilterList() {
    return this.http.get(this.staticJsonFilesEndPoint + this.staticJSONName)
      .map(this.extractData);
  }
  /**
   * This function fetches data to poulate when click on edit
   * @param id is a service id
   */
  fetchServiceDetails(id) {
    return this.http.get(this.apiEndPoint + '/api/setup/service/' + id)
      .map(this.extractData);
  }
  getResourceDropdown(RESOURCE_USE) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/resources/' + RESOURCE_USE)
      .map(this.extractData);
  }
  /**
   * This function is to extract JSON data
   * @param res is a JSON responce from REST API
   */
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
