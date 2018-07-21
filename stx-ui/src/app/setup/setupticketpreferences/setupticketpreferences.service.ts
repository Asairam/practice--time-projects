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
export class SetupTicketPreferencesService {
  private staticJSONName = 'common.json';
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /*--- Pos related methods starts ---*/
  createPos(posDataObj) {
    return this.http.post(this.apiEndPoint + '/api/setup/ticketpreferences/pos', posDataObj)
      .map(this.extractData);
  }
  getPos() {
    return this.http.get(this.apiEndPoint + '/api/setup/ticketpreferences/pos')
      .map(this.extractData);
  }
  /*--- Pos related methods ends ---*/
  /*--- Pos Device related methods starts ---*/
  createPosdevices(posdevicesDataObj) {
    return this.http.post(this.apiEndPoint + '/api/setup/ticketpreferences/posdevices', posdevicesDataObj)
      .map(this.extractData);
  }
  getPosdevices() {
    return this.http.get(this.apiEndPoint + '/api/setup/ticketpreferences/posdevices')
      .map(this.extractData);
  }
  deviceData() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  /*--- Pos Device related methods ends ---*/
  /*--- Favorites related methods starts ---*/
  getFavourites() {
    return this.http.get(this.apiEndPoint + '/api/setupticketpreferences/favorites')
      .map(this.extractData);
  }
  /**
   * This function lists Ticket Preferences Types
   */
  ticketPreferencesTypes() {
    return this.http.get(this.staticJsonFilesEndPoint + this.staticJSONName)
      .map(this.extractData);
  }
  getServiceGroups(type) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/' + type)
      .map(this.extractData);
  }
  getProductLines(type) {
    return this.http.get(this.apiEndPoint + '/api/setupticketpreferences/favorites/' + type)
      .map(this.extractData);
  }
  getServices(serviceName) {
    return this.http.get(this.apiEndPoint + '/api/setupticketpreferences/favorites/types/' + serviceName + '/' + 'Service')
      .map(this.extractData);
  }
  getProducts(productLineId) {
    return this.http.get(this.apiEndPoint + '/api/setupticketpreferences/favorites/types/' + productLineId + '/' + 'Product')
      .map(this.extractData);
  }
  addToFavorites(order, favortiesData) {
    if (favortiesData.favoriteId === undefined) {
      favortiesData = {
        favoriteId: '',
        type: '',
        color: ''
      };
    }
    return this.http.put(this.apiEndPoint + '/api/setupticketpreferences/favorites/' + order, favortiesData)
      .map(this.extractData);
  }
  getSearchProducts(searchString) {
    return this.http.get(this.apiEndPoint + '/api/setupticketpreferences/favorites/search/' + searchString)
      .map(this.extractData);
  }
  /*--- Favorites related methods ends ---*/
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
