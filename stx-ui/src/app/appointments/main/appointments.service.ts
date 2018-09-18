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
export class AppointmentsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }


  /*  for user list eg first,last names  */
  // getApptUserList() {
  //   return this.http.get(this.apiEndPoint + '/api/appointments/users')
  //     .map(this.extractData);
  // }

  /*  for get appt list  */
  getAppointments(chooseDate, workerId, viewBy) {
    return this.http.get(this.apiEndPoint + '/api/appointments/date/worker/' + chooseDate + '/' + workerId + '/' + viewBy)
      .map(this.extractData);
  }
  /**
   * user comes with active,service avtive and from Worker_Service__c table
   */
  getWorkerLists() {
    return this.http.get(this.apiEndPoint + '/api/appointment/workerList')
      .map(this.extractData);
  }

  postWorkerName(name, date) {
    return this.http.get(this.apiEndPoint + '/api/appointments/personCalendar/' + name + '/' + date)
      .map(this.extractData);
  }

  fetchingBookingInterval() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }

  fetchingActiveMembers(day, date) {
    return this.http.get(this.apiEndPoint + '/api/appointments/activeMembers/' + day + '/' + date)
      .map(this.extractData);
  }

  getData(searchKey) {
    return this.http.get(this.apiEndPoint + '/api/clientsearch/' + searchKey)
      .map(this.extractData);
  }

  getCommonData() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  changeApptStatus(apptDataObj, pckgObj) {
    apptDataObj.pckgObj = pckgObj;
    return this.http.put(this.apiEndPoint + '/api/appointments/changestatus/' + apptDataObj.apptId, apptDataObj)
      .map(this.extractData);
  }
  /* mobile carrier */
  // mobileCarriers() {
  //   return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/mobilecarriers')
  //     .map(this.extractData);
  // }
  /* express booking services */
  expressBookingServices(data) {
    return this.http.get(this.apiEndPoint + '/api/appointments/expressbookingservices/' + data)
      .map(this.extractData);
  }
  getVisitTypes() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/visittype/active')
      .map(this.extractData);
  }
  saveExpressClient(body) {
    const data = new FormData();
    data.append('company', JSON.stringify(body));
    return this.http.post(this.apiEndPoint + '/api/appointment/expressbooking', body)
      .map(this.extractData);
  }
  getClientAutoSearch(id) {
    return this.http.get(this.apiEndPoint + '/api/appointment/getclientnames/' + id)
      .map(this.extractData);
  }
  getAppontmentList(id) {
    return this.http.get(this.apiEndPoint + '/api/appointment/getServices/' + id)
      .map(this.extractData);
  }
  getWorkerWeek(workerId, start, weekOrweekend) {
    return this.http.get(this.apiEndPoint + '/api/appointment/getWorkerWeek/' + workerId + '/' + start + '/' + weekOrweekend)
      .map(this.extractData);
  }
  getDftTmZn() {
    return this.http.get(this.apiEndPoint + '/api/setup/company/companyhours')
      .map(this.extractData);
  }
  showAllWorkers(day, date) {
    return this.http.get(this.apiEndPoint + '/api/showAllWorkers/' + day + '/' + date)
      .map(this.extractData);
  }
  existingExpressBooking(body) {
    const data = new FormData();
    data.append('company', JSON.stringify(body));
    return this.http.post(this.apiEndPoint + '/api/appointment/existingExpressBooking', body)
      .map(this.extractData);
  }
  skipBooking(body) {
    const data = new FormData();
    data.append('company', JSON.stringify(body));
    return this.http.post(this.apiEndPoint + '/api/appointment/skipBooking', body)
      .map(this.extractData);
  }
  getAllServicePackageDetails(value) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicepackages/' + value)
      .map(this.extractData);
  }
  getClientFields() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/clientfields')
      .map(this.extractData);
  }
  getHideCliContactInfo(id) {
    return this.http.get(this.apiEndPoint + '/api/client/getHideClientContactInfo/' + id)
      .map(this.extractData);
  }
  sendApptNotifs(apptsAry) {
    return this.http.post(this.apiEndPoint + '/api/notification/email', { 'apptIds': apptsAry })
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
