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
export class ClientAppointmentsService {
  private bookingDataUrl = 'common.json';
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  // booking methods starts
  /*--- Method used to create client booking data ---*/
  clientBookingData(bookingData) {
    return this.http.post(this.apiEndPoint + '/api/appointmentsandemails/booking', bookingData)
      .map(this.extractData);
  }
  /*--- Method used to get booking data ---*/
  getBookingData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
      .map(this.extractData);
  }
  /*--- Method used to get static data ---*/
  bookingStaticData() {
    return this.http.get(this.staticJsonFilesEndPoint + this.bookingDataUrl)
      .map(this.extractData);
  }
  // booking methods ends
  // notifications methods starts
  getCommonData() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  // setup notification data
  setupNotificationData(notificationData) {
    return this.http.post(this.apiEndPoint + '/api/setup/appointmentsandemails/notifications', notificationData)
      .map(this.extractData);
  }
  // method to send email notifications
  sendEmailNotifications(emailData) {
    return this.http.post(this.apiEndPoint + '/api/setup/appointmentsandemails/sendemailnotifications', emailData)
      .map(this.extractData);
  }
  // method to get notifications
  getNotifications() {
    return this.http.get(this.apiEndPoint + '/api/setup/appointmentsandemails/notifications')
      .map(this.extractData);
  }
  // notifications methods ends
  // reminders methods starts
  getHourse() {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/HOURS')
      .map(this.extractData);
  }
  // method to save remainder
  saveRemainder(dataObject) {
    return this.http.post(this.apiEndPoint + '/api/setup/appointmentsandemails/reminders', dataObject)
      .map(this.extractData);
  }
  // method to get remainder
  getRemainder() {
    return this.http.get(this.apiEndPoint + '/api/setup/appointmentsandemails/reminders')
      .map(this.extractData);
  }
  // method to send email
  sendMail(mailData) {
    return this.http.post(this.apiEndPoint + '/api/setup/appointmentsandemails/sendemailreminders', mailData)
      .map(this.extractData);
  }
  // reminders methods ends
  // online booking methods starts
  onlineData(onlineBookingData) {
    return this.http.post(this.apiEndPoint + '/api/appointments/onlinebooking', onlineBookingData)
      .map(this.extractData);
  }
  // method to get online data
  getOnlineData() {
    return this.http.get(this.apiEndPoint + '/api/appointmentandemails/onlinebooking')
      .map(this.extractData);
  }
  // method to format time
  timeFormats() {
    return this.http.get(this.staticJsonFilesEndPoint + this.bookingDataUrl)
      .map(this.extractData);
  }
  // method to get hours for online
  hoursForOnline() {
    return this.http.get(this.apiEndPoint + '/api/setup/company/companyhours')
      .map(this.extractData);
  }
  failedDepositeOfNotifications() {
    return this.http.get(this.apiEndPoint + '/api/checkout/product/workers/' + 'retailonly')
      .map(this.extractData);
  }
  // online booking methods ends
  // gifts online methods starts
  Giftonline(dataObject) {
    return this.http.post(this.apiEndPoint + '/api/appointment/onlinegifts', dataObject)
      .map(this.extractData);
  }
  getGiftOnlineData() {
    return this.http.get(this.apiEndPoint + '/api/appointment/onlinegifts')
      .map(this.extractData);
  }
  /*--- Method used to get merge fields ---*/
  mergefield() {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/states/India')
      .map(this.extractData);
  }
  /* method to invite friends data*/
  invitefriend(friendDataObject) {
    return this.http.post(this.apiEndPoint + '/api/appointment/referfriend', friendDataObject)
      .map(this.extractData);
  }
/* method to get friend data */
  getInviteFriendData() {
    return this.http.get(this.apiEndPoint + '/api/appointment/referfriend')
      .map(this.extractData);
  }
  // mergefield() {
  //     return this.http.get(this.apiEndPoint + '/api/v1/lookups/states/India')
  //         .map(this.extractData)
  //         .catch(this.handleError);
  // }
  // gifts online methods ends

  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
