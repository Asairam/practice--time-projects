/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class ApptDetailService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }

  getApptDetails(apptid) {
    return this.http.get(this.apiEndPoint + '/api/appointments/' + apptid)
      .map(this.extractData);
  }
  saveAppointmentDetails(apptid, dataObj) {
    return this.http.put(this.apiEndPoint + '/api/appointment/detail/' + apptid, dataObj)
      .map(this.extractData);
  }
  getVisitTypes() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/visittype/active')
      .map(this.extractData);
  }
  sendReminderToClient(dataObj, apptid) {
    return this.http.put(this.apiEndPoint + '/api/appointments/changestatus/' + apptid, dataObj)
      .map(this.extractData);
  }
  saveNotes(id, updateNotes) {
    const notes = {
      'notes': updateNotes
    };
    return this.http.put(this.apiEndPoint + '/api/client/savenotes/' + id, notes)
      .map(this.extractData);
  }
  sendText(dataObj) {
    return this.http.post(this.apiEndPoint + '/api/client/send/text', dataObj)
      .map(this.extractData);

  }
  sendCancelReminder(apptId) {
    const dataObj = {
      'apptId': apptId
    };
    return this.http.post(this.apiEndPoint + '/api/notification/email/cancel', dataObj)
    .map(this.extractData);


  }
  // getCommonData() {
  //   return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
  //     .map(this.extractData);
  // }
  /*--- Method used to get booking data ---*/
  getBookingData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }

  getApptServices(clientid, apptid, reqDate) {
    const headers = new Headers();
    headers.append('bookingdate', reqDate);
    return this.http.getHeader(this.apiEndPoint + '/api/appointments/services/' + clientid + '/' + apptid, headers)
      .map(this.extractData);
  }
  changeApptStatus(apptDataObj, pckgObj, nonPckgSrvcs) {
    apptDataObj.pckgObj = pckgObj;
    apptDataObj.nonPckgSrvcs = nonPckgSrvcs;
    return this.http.put(this.apiEndPoint + '/api/appointments/changestatus/' + apptDataObj.apptId, apptDataObj)
      .map(this.extractData);
  }
  getHideCliContactInfo(id) {
    return this.http.get(this.apiEndPoint + '/api/client/getHideClientContactInfo/' + id)
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
