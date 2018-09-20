/*---
  cancel():Method to cancel changes
  ngOnit(): Method to page load
  getBookingData() : Method to get booking data
  bookingData1(): Method used to get static data
  getDisplayAvailabilitiesData(value): Method to display availability data
  getNotifications(): Method used to get notifications data
  sendEmailNotifications(): Method used to send email notifications
  displayInTemplate(value) : Method used to display template
  sendMail(): method used to send mail in remainders
  getRemainder(): Method is used to get remainder data
  timeFormatsData(): Method used to get time formats data
  hoursForOnlineData() :  Method used to get hours for online data
  failedDepositeOfNotificationsData():Method used to get failed deposites of notifications
  formatData(value): Method used to get formatted data
  formatDataForEnd(value) :Method used to get formated data for end
  listClientFields(): Method used to get client fieds list
  getGiftOnlineData(): Method used to get giftonline list
  getServicess(): Method used to get services
  clearmessage(): Method used to clear messages
  getInviteFriendData(): Method used to get referfriend data
  clearErrMsg(): Method used to clear error messages
  commonSave(): Method used for common save validations
---*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ClientAppointmentsService } from './clientappointments.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { JwtHelper } from 'angular2-jwt';
import * as config from '../../app.config';

@Component({
  selector: 'app-clientappointments-popup',
  templateUrl: './clientappointments.html',
  styleUrls: ['./clientappointments.css'],
  providers: [ClientAppointmentsService]
})
export class ClientAppointmentsComponent implements OnInit {
  isClassVisible: any = false;
  activeTab: any;
  toastermessage: any;
  // booking
  bookingIntervalMinutes: any;
  bookedStatusColor: any;
  reminderSentStatusColor: any;
  calledStatusColor: any;
  conflictingStatusColor: any;
  canceledStatusColor: any;
  checkedInStatusColor: any;
  noShowStatusColor: any;
  completeStatusColor: any;
  confirmedStatusColor: any;
  pendingDepositStatusColor: any;
  maximumAvailableToShow: any;
  availabilityOrder: any;
  expressBookingClientNameNotRequired = false;
  bookingData: any;
  DisplayAvailData: any;
  error: any;
  error1: any;
  error2: any;
  colorerror: any;
  bookingDataList: any;
  // notifications
  mergeFieldsList: any;
  sendAppointmentNotifications = false;
  notificationMessage: any;
  fromTextTag: any;
  fromEmailAddress: any;
  fromEmailName: any;
  subject: any;
  mergeField: any;
  emailTemplate: any;
  notificationData: any = {};
  notificationError: any;
  notificationError1: any;
  notificationError2: any;
  sendNotification: any;
  notificationsList: any;
  notificationTextTag: any;
  notificationTextMessage: any;
  notificationEmailAddress: any;
  notificationEmailName: any;
  emailData: any;
  success: any;
  // reminders
  reminderEmailData: any;
  email: any;
  getHourse: any;
  dataObjects: any;
  sendRemainder = false;
  getHourses: any;
  inputWhen: any;
  timeBeforeapp: any;
  fromText: any;
  textMessage: any;
  emailAddress: any;
  emailName: any;
  reminderSubject: any;
  mergeFields: any;
  mergeFieldss: any;
  reminderEmailTemplate: any;
  remainderListing: any;
  sendReminders: any;
  reminderTextTag: any;
  reminderTextMessage: any;
  reminderEmailName: any;
  timeUnit: any;
  howMuch: any;
  remainder: any;
  reminderEmailAddress: any;
  inputs = [];
  remainderError: any;
  remainderError1: any;
  remainderError2: any;
  remainderError3: any;
  remainderError4: any;
  // online booking
  bookingWindowStarts: any = {};
  windowStartTime: any;
  windowStarts: any;
  bookingWindowEnds: any = {};
  windowEndTime: any;
  windowEnds: any;
  hoursforOnlineBooking: any;
  allowApptCancellations: any;
  allowApptChanges: any;
  displayOptions: any = {};
  ShowTotalPrice = false;
  ShowTotalDuration = false;
  NumberofAvailabilities: any;
  OnlineBookingLoginMessage: any;
  OnlineBookingLoginMessage1: any;
  pendingDepositHandling: any = {};
  deleteFailedOnlineDeposits: any;
  sendNotificationofFailed: any;
  onlineBookingEnabled = false;
  onlineBookingData: any = {};
  ApptOnlineBooking: any;
  timesData: any;
  onlineValues: any;
  dataByFields: any = [];
  onlineBookingError: any;
  onlineBookingError1: any;
  // gifts online
  private ckeditorContent: string;
  giftsEmailTemplate: any;
  giftsMergeField: any;
  dataObject: any = {};
  servicedata: any;
  giftOnlineData: any = {};
  giftOnlineDatalist: any = [];
  giftOnlineList: any;
  // refer friend
  friendEmailTemplate: any;
  friendMergeField: any;
  friendDataObject: any = {};
  friendServicedata: any;
  inviteFriendData: any = {};
  inviteFriendDataList: any = [];
  public editorValue = 'the';
  decodedToken: any;
  rows: any = [];
  isDuplicate: any;
  ckConfig = {
    'toolbar': [['Undo', 'Redo'],
    ['Bold', 'Italic', 'Underline', 'Strike'],
    ['Link', 'Image'],
    ['JustifyLeft', 'JustifyCenter', 'JustifyRight'],
    ['BulletedList', 'NumberedList', 'Indent', 'Outdent']],
    'allowedContent': true
  };
  activeTab2 = [false, false, false, false, false, false];
  activeTabClass = ['active', '', '', '', '', ''];
  url = config['BASE_URL'] + '/#/clientlogin/';
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  selectTab(tab_id: number) {
    this.staticTabs.tabs[tab_id].active = true;
  }
  addInput() {
    this.inputs.push({ 'howMuch': '1', 'timeUnit': 'days' });
  }
  deleteFieldValue(index) {
    this.inputs.splice(index, 1);
    this.remainderError1 = '';
    this.remainderError2 = '';
    this.remainderError3 = '';
  }
  disableEnable() {
    this.staticTabs.tabs[0].disabled = !this.staticTabs.tabs[0].disabled;
    this.staticTabs.tabs[0].active = true;
  }
  constructor(private clientAppointmentsService: ClientAppointmentsService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router) {
  }
  ngOnInit() {
    // booking
    this.bookingData1();
    this.getBookingData();
    // notifications
    this.getNotifications();
    this.getCommonData();
    // reminders
    this.getServices();
    this.getRemainder();
    // online booking
    this.timeFormatsData();
    this.hoursForOnlineData();
    // gift online
    this.getGiftOnlineData();
    // refer friend
    this.getInviteFriendData();

    this.listClientFields();
    this.failedDepositeOfNotificationsData();
    if (this.windowStarts === undefined) {
      this.windowStarts = 'Hours';
    }
    if (this.windowEnds === undefined) {
      this.windowEnds = 'Hours';
    }
    // gifts online
    this.getServicess();
    this.updateTabs(0);
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('token'));
      // this.firstName = this.decodedToken.data.firstName;
      // this.lastName = this.decodedToken.data.lastName;
      this.url += this.decodedToken['data']['db'];
    } catch (error) {
      this.decodedToken = {};
    }


  }
  /**
   * Booking methods starts
   */

  /*--- Method used to get booking data ---*/
  getBookingData() {
    this.clientAppointmentsService.getBookingData().subscribe(
      data => {
        this.bookingDataList = data['result'];
        this.bookingIntervalMinutes = this.bookingDataList.bookingIntervalMinutes;
        this.bookedStatusColor = this.bookingDataList.bookedStatusColor;
        this.calledStatusColor = this.bookingDataList.calledStatusColor;
        this.conflictingStatusColor = this.bookingDataList.conflictingStatusColor;
        this.canceledStatusColor = this.bookingDataList.canceledStatusColor;
        this.checkedInStatusColor = this.bookingDataList.checkedInStatusColor;
        this.confirmedStatusColor = this.bookingDataList.confirmedStatusColor;
        this.noShowStatusColor = this.bookingDataList.noShowStatusColor;
        this.completeStatusColor = this.bookingDataList.completeStatusColor;
        this.reminderSentStatusColor = this.bookingDataList.reminderSentStatusColor;
        this.pendingDepositStatusColor = this.bookingDataList.pendingDepositStatusColor;
        this.maximumAvailableToShow = this.bookingDataList.maximumAvailableToShow;
        this.availabilityOrder = this.bookingDataList.availabilityOrder;
        this.expressBookingClientNameNotRequired = this.bookingDataList.expressBookingClientNameNotRequired;
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /*--- Method used to get static data ---*/
  bookingData1() {
    this.clientAppointmentsService.bookingStaticData().subscribe(
      data => {
        this.DisplayAvailData = data['data'];
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /*--- Method to display availabilities data ---*/
  getDisplayAvailabilitiesData(value) {
    this.availabilityOrder = value;
  }
  /**
   * Booking methods ends
   */
  /**
   * Notifications methods starts
   */
  /*--- Method used to get notifications ---*/
  getNotifications() {
    this.clientAppointmentsService.getNotifications().subscribe(
      data => {
        this.notificationsList = data['result'];
        this.sendNotification = this.notificationsList.sendNotifications;
        this.notificationTextTag = this.notificationsList.notificationTextTag;
        this.notificationTextMessage = this.notificationsList.notificationTextMessage;
        this.notificationEmailAddress = this.notificationsList.notificationEmailAddress;
        this.notificationEmailName = this.notificationsList.notificationEmailName;
        this.subject = this.notificationsList.subject;
        this.editorValue = this.notificationsList.emailTemplate;
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '9961') {
            } else if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            } break;
        }
      }
    );
  }
  /*--- Method used to send email notifications ---*/
  sendEmailNotifications() {

    this.emailData = {
      'notificationEmailAddress': this.notificationEmailAddress,
      'subject': this.subject,
      'emailTemplate': this.editorValue
    };
    this.clientAppointmentsService.sendEmailNotifications(this.emailData).subscribe(
      data => {
        this.emailData = data['status'];
        if (this.emailData === '2057') {
          this.success = 'COMMON_STATUS_CODES.' + this.emailData;
        }
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '9961') {
            } else if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            } break;
        }
      }
    );
  }
  /*--- Method used to display in template ---*/
  displayInTemplate(value, ckEditorId) {
    if (value === '') {
      this.mergeField = '';
    } else {
      this.mergeField = '{{' + value.replace(/ /g, '') + '}}';
      // this.editorValue += this.mergeField;
      const editor = ckEditorId.instance;
      editor.insertText('{{' + value.replace(/ /g, '') + '}}');
    }
  }
  getCommonData() {
    this.clientAppointmentsService.getCommonData().subscribe(
      data => {
        this.mergeFieldsList = data['giftMergeFields'];
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      }
    );
  }
  /**
   * Notifications methods ends
   */
  /**
   * Reminders methods starts
   */
  sendMail() {
    this.reminderEmailData = {
      'subject': this.reminderSubject,
      'reminderEmailAddress': this.reminderEmailAddress,
      'emailTemplate': this.reminderEmailTemplate
    };
    this.clientAppointmentsService.sendMail(this.reminderEmailData)
      .subscribe(
        data => {
          this.email = data['status'];
          if (this.email === '2057') {
            this.success = 'COMMON_STATUS_CODES.' + this.email;
          }
        },
        error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
  }
  /*method used to get remainders data */
  getRemainder() {
    this.clientAppointmentsService.getRemainder()
      .subscribe(
        data => {
          this.remainderListing = data['result'];
          this.sendReminders = this.remainderListing.sendReminders;
          this.inputs = this.remainderListing.reminderList;
          this.reminderTextTag = this.remainderListing.reminderTextTag;
          this.reminderTextMessage = this.remainderListing.reminderTextMessage;
          this.reminderEmailAddress = this.remainderListing.reminderEmailAddress;
          this.reminderEmailName = this.remainderListing.reminderEmailName;
          this.reminderSubject = this.remainderListing.subject;
          this.mergeFields = this.remainderListing.mergeField;
          this.getHourses = this.remainderListing.dailyRemindersAt;
          this.reminderEmailTemplate = this.remainderListing.emailTemplate;
        },
        error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
  }
  displayInTemplateRemainder(value, ckEditorId) {
    if (value === '') {
      this.mergeFieldss = '';
    } else {
      this.mergeFieldss = '{{' + value.replace(/ /g, '') + '}}';
      // this.reminderEmailTemplate += this.mergeFieldss;
      const editor = ckEditorId.instance;
      editor.insertText('{{' + value.replace(/ /g, '') + '}}');
    }
  }
  getServices() {
    this.clientAppointmentsService.getHourse()
      .subscribe(data => {
        this.getHourse = data['result'];
      },
        error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
  }
  /**
   * Reminders methods ends
   */
  /**
   * Online booking methods starts
   */
  /*--- Method used to get time formats data ---*/
  timeFormatsData() {
    this.clientAppointmentsService.timeFormats().subscribe(
      data => {
        this.timesData = data['timeFormats'];
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /*--- Method used to get hours for online data ---*/
  hoursForOnlineData() {
    this.clientAppointmentsService.hoursForOnline().subscribe(
      data => {
        this.onlineValues = data['result'].filter(filterList => filterList.isActive__c);
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /*--- Method used to get failed deposites of notifications ---*/
  failedDepositeOfNotificationsData() {
    this.clientAppointmentsService.failedDepositeOfNotifications()
      .subscribe(data => {
        this.dataByFields = data['result'];
      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (status) {
            case 500:
              break;
            case 400:
              if (statuscode === '2040') {
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                window.scrollTo(0, 0);
              } else if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                  localStorage.setItem('page', this.router.url);
                  this.router.navigate(['/']).then(() => { });
                }
              } break;
          }
        });
  }
  /*--- Method used to get formated data ---*/
  formatData(value) {
    this.windowStarts = value;
  }
  /*--- Method used to get formated data for end ---*/
  formatDataForEnd(value) {
    this.windowEnds = value;
  }
  /*--- Method used to list client fields ---*/
  listClientFields() {
    this.clientAppointmentsService.getOnlineData().subscribe(
      data => {
        this.onlineBookingEnabled = data['result'].onlineBookingEnabled;
        this.windowStartTime = data['result'].windowStartNumber;
        this.windowStarts = data['result'].windowStartOption;
        this.windowEnds = data['result'].windowEndOption;
        this.windowEndTime = data['result'].windowEndNumber;
        this.allowApptCancellations = data['result'].allowApptCancellations;
        this.allowApptChanges = data['result'].allowApptChanges;
        this.ShowTotalPrice = data['result'].showTotalPrice;
        this.ShowTotalDuration = data['result'].showTotalDuration;
        this.NumberofAvailabilities = data['result'].maximumAvailableToShow;
        this.OnlineBookingLoginMessage = data['result'].loginMessage;
        this.OnlineBookingLoginMessage1 = data['result'].loginMessage1;
        this.sendNotificationofFailed = data['result'].pendingDepositFailureNotify;
        this.deleteFailedOnlineDeposits = data['result'].pendingDepositFailureAutoDelete;
        this.hoursforOnlineBooking = data['result'].hoursForOnlineBooking;
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
            break;
        }
      }
    );
  }
  /**
   * Online booking methods ends
   */
  /**
   * Gifts online methods starts
   */
  getGiftOnlineData() {
    this.clientAppointmentsService.getGiftOnlineData().subscribe(
      data => {
        this.giftOnlineDatalist = data['result'];
        // this.giftsMergeField = this.giftOnlineDatalist.mergeField;
        this.giftsEmailTemplate = this.giftOnlineDatalist.emailTemplate;
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      }
    );
  }
  displayGiftsOnlineTemplate(value, ckEditorId) {
    if (value === 'None') {
      this.giftsMergeField = '';
    } else {
      this.giftsMergeField = '{{' + value.replace(/ /g, '') + '}}';
      // this.giftsEmailTemplate +=  this.giftsMergeField;
      const editor = ckEditorId.instance;
      editor.insertText('{{' + value.replace(/ /g, '') + '}}');
    }
  }

  /*--- Method used to get services ---*/
  getServicess() {
    this.clientAppointmentsService.mergefield()
      .subscribe(data => {
        this.servicedata = data['result'];
      },
        error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
  }

  /*--- Method used to clear messages ---*/
  clearmessage() {
    this.giftsMergeField = '';
    this.giftsEmailTemplate = '';
    // refer friend
    this.friendMergeField = '';
    this.friendEmailTemplate = '';
  }
  /**
   * Gifts online method ends
   */
  /*refer friend methods*/
  getInviteFriendData() {
    this.clientAppointmentsService.getInviteFriendData().subscribe(
      data => {
        this.inviteFriendDataList = data['result'];
        // this.friendMergeField = this.inviteFriendDataList.mergeField;
        this.friendEmailTemplate = this.inviteFriendDataList.emailTemplate;
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      }
    );
  }
  displayFriendTemplate(value, ckEditorId) {
    if (value === 'None') {
      this.friendMergeField = '';
    } else {
      this.friendMergeField = '{{' + value.replace(/ /g, '') + '}}';
      //   this.friendEmailTemplate += this.friendMergeField;
      const editor = ckEditorId.instance;
      editor.insertText('{{' + value.replace(/ /g, '') + '}}');
    }
  }
  /*refer friend method end */

  /*--- Method used to clear error messages ---*/
  clearErrMsg() {
    this.error = '';
    this.error1 = '';
    this.error2 = '';
    this.colorerror = '';
    this.onlineBookingError = '';
    this.onlineBookingError1 = '';
    this.remainderError3 = '';
    this.remainderError4 = '';
    this.notificationError = '';
    this.notificationError1 = '';
    this.remainderError = '';
    this.remainderError1 = '';
    this.remainderError2 = '';
    this.notificationError2 = '';
  }
  /* Method to redirect page to setup */
  cancel() {
    this.router.navigate(['/setup']);
  }
  checkIfColorExists(rows) {
    const valueArr = this.rows.map(function (item) {
      return item.Col1;
    });
    this.isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx;
    });
  }

  /* Method to save all tabs at one time */
  commonSave() {
    this.windowStartTime = parseInt(this.windowStartTime, 10);
    this.windowEndTime = parseInt(this.windowEndTime, 10);
    this.rows = [];
    this.rows.push(
      { 'Col1': this.reminderSentStatusColor },
      { 'Col1': this.bookedStatusColor },
      { 'Col1': this.calledStatusColor },
      { 'Col1': this.confirmedStatusColor },
      { 'Col1': this.canceledStatusColor },
      { 'Col1': this.checkedInStatusColor },
      { 'Col1': this.noShowStatusColor },
      { 'Col1': this.completeStatusColor },
      { 'Col1': this.conflictingStatusColor },
      { 'Col1': this.pendingDepositStatusColor },
    );
    if (this.rows.length > 0) {
      this.checkIfColorExists(this.rows);
    }
    let nearestFive;
    let nearestRound;
    const remainderNearest = this.bookingIntervalMinutes % 5;
    if (remainderNearest === 0) {
      nearestFive = remainderNearest;
    } else {
      nearestFive = remainderNearest;
      nearestRound = Math.ceil(this.bookingIntervalMinutes / 5) * 5;
    }

    let remainders;
    remainders = this.timeUnit;
    const remainder = this.inputs;
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    for (let i = 0; i < remainder.length; i++) {
      if (remainder[i].howMuch > 24 && remainder[i].timeUnit === 'hours') {
        this.remainderError1 = 'SETUP_CLIENTOPPOINTMENTS.RAMINDERS_VALID_HOURS_FEILD';
        window.scrollTo(0, 0);
        this.updateTabs(2);
      } else if (remainder[i].howMuch === '' && (remainder[i].timeUnit === 'hours' || remainder[i].timeUnit === 'days')) {
        this.remainderError2 = 'SETUP_CLIENTOPPOINTMENTS.ONLINE_BOOKING_NOBALNK_FILED';
        window.scrollTo(0, 0);
        this.updateTabs(2);
      } else if (remainder[i].howMuch <= 0 && (remainder[i].timeUnit === 'hours' || remainder[i].timeUnit === 'days')) {
        this.remainderError3 = 'SETUP_CLIENTOPPOINTMENTS.ONLINE_BOOKING_NOBALNK_FILED';
        window.scrollTo(0, 0);
        this.updateTabs(2);
      }
    }
    if (this.bookingIntervalMinutes === undefined || this.bookingIntervalMinutes === '' ||
      this.bookingIntervalMinutes === null || this.bookingIntervalMinutes === 'undefined') {
      this.error1 = 'BOOKING.VALID_NOBLANK_BOOKING_INTERVAL';
      window.scrollTo(0, 0);
      this.updateTabs(0);
    } else if (this.bookingIntervalMinutes < 5 || this.bookingIntervalMinutes > 240) {
      this.error1 = 'BOOKING.VALID_BOOKING_INTERVAL_LIMIT';
      window.scrollTo(0, 0);
      this.updateTabs(0);
    } else if (nearestFive !== 0) {
      this.error1 = 'Please enter a valid value. The two nearest valid values are ' + (nearestRound - 5) + ' and ' + nearestRound + '.';
      window.scrollTo(0, 0);
      this.updateTabs(0);
    } else if (this.maximumAvailableToShow === undefined || this.maximumAvailableToShow === '' ||
      this.maximumAvailableToShow === null || this.maximumAvailableToShow === 'undefined') {
      this.error2 = 'BOOKING.VALID_NOBLANK_MAXIMUM_AVAILABILTY';
      window.scrollTo(0, 0);
      this.updateTabs(0);
    } else if (this.maximumAvailableToShow < 10 || this.maximumAvailableToShow > 100) {
      this.error2 = 'BOOKING.VALID_MAXIMUM_AVAILABILTY_LIMIT';
      window.scrollTo(0, 0);
      this.updateTabs(0);
    } else if (this.notificationEmailAddress !== '' && !EMAIL_REGEXP.test(this.notificationEmailAddress)) {
      this.notificationError = 'COMMON.VALID_EMAIL_ID_FORMAT';
      window.scrollTo(0, 0);
      this.updateTabs(1);
    } else if (this.subject === undefined || this.subject === '' || this.subject === 'undefined') {
      this.notificationError1 = 'SETUP_CLIENTOPPOINTMENTS.NOTIFICATIONS_NO_BLANK_SUBJECT_FEILD';
      window.scrollTo(0, 0);
      this.updateTabs(1);
    } else if (this.NumberofAvailabilities < 10 || this.NumberofAvailabilities > 100) {
      this.onlineBookingError = 'BOOKING.VALID_MAXIMUM_AVAILABILTY_LIMIT';
      window.scrollTo(0, 0);
      this.updateTabs(3);
    } else if (this.isDuplicate) {
      this.colorerror = 'BOOKING.VALID_COLOR';
      window.scrollTo(0, 0);
      this.updateTabs(0);
    } else if (this.sendReminders === true && (this.reminderEmailAddress === '' || this.reminderEmailAddress === 'undefined')) {
      this.remainderError = 'SETUP_CLIENTOPPOINTMENTS.REMINDERS_NOBLANK_FROM_EMAIL_ADDRESS';
      this.updateTabs(2);
      window.scrollTo(0, 0);
    } else if (this.reminderEmailAddress !== '' && !EMAIL_REGEXP.test(this.reminderEmailAddress)) {
      this.remainderError4 = 'SETUP_CLIENTOPPOINTMENTS.REMINDERS_INVALID_FROM_EMAIL_ADDRESS';
      this.updateTabs(2);
      window.scrollTo(0, 0);
    } else if (this.sendNotification === true && (this.notificationEmailAddress === '' || this.notificationEmailAddress === 'undefined')) {
      this.notificationError2 = 'SETUP_CLIENTOPPOINTMENTS.NOTIFICATIONS_NOBLANK_FROM_EMAIL_ADDRESS';
      this.updateTabs(1);
      window.scrollTo(0, 0);
    } else if (((this.windowStartTime && this.windowStarts === 'Days') && (this.windowEndTime && this.windowEnds === 'Hours'))
      && (this.windowStartTime * 24) > this.windowEndTime) {
      this.onlineBookingError1 = 'SETUP_CLIENTOPPOINTMENTS.BOOKING_WINDOW_STARTS_BEFORE_BOOKING_WINDOW_END';
      this.updateTabs(3);
      window.scrollTo(0, 0);
    } else if (((this.windowStartTime && this.windowStarts === 'Hours') && (this.windowEndTime && this.windowEnds === 'Days'))
      && (this.windowStartTime) > (this.windowEndTime * 24)) {
      this.onlineBookingError1 = 'SETUP_CLIENTOPPOINTMENTS.BOOKING_WINDOW_STARTS_BEFORE_BOOKING_WINDOW_END';
      this.updateTabs(3);
      window.scrollTo(0, 0);
    } else if (((this.windowStartTime && this.windowStarts === 'Days') && (this.windowEndTime && this.windowEnds === 'Days'))
      && (this.windowStartTime > this.windowEndTime)) {
      this.onlineBookingError1 = 'SETUP_CLIENTOPPOINTMENTS.BOOKING_WINDOW_STARTS_BEFORE_BOOKING_WINDOW_END';
      this.updateTabs(3);
      window.scrollTo(0, 0);
    } else if (((this.windowStartTime && this.windowStarts === 'Hours') && (this.windowEndTime && this.windowEnds === 'Hours'))
      && (this.windowStartTime > this.windowEndTime)) {
      this.onlineBookingError1 = 'SETUP_CLIENTOPPOINTMENTS.BOOKING_WINDOW_STARTS_BEFORE_BOOKING_WINDOW_END';
      this.updateTabs(3);
      window.scrollTo(0, 0);
    } else if ((this.remainderError1 === '' || this.remainderError1 === undefined || this.remainderError1 === 'undefined') &&
      (this.remainderError2 === '' || this.remainderError2 === undefined || this.remainderError2 === 'undefined') &&
      (this.remainderError3 === '' || this.remainderError3 === undefined || this.remainderError3 === 'undefined')) {
      this.bookingData = {
        'bookingIntervalMinutes': this.bookingIntervalMinutes,
        'bookedStatusColor': this.bookedStatusColor,
        'reminderSentStatusColor': this.reminderSentStatusColor,
        'calledStatusColor': this.calledStatusColor,
        'confirmedStatusColor': this.confirmedStatusColor,
        'canceledStatusColor': this.canceledStatusColor,
        'checkedInStatusColor': this.checkedInStatusColor,
        'noShowStatusColor': this.noShowStatusColor,
        'completeStatusColor': this.completeStatusColor,
        'conflictingStatusColor': this.conflictingStatusColor,
        'pendingDepositStatusColor': this.pendingDepositStatusColor,
        'maximumAvailableToShow': this.maximumAvailableToShow,
        'availabilityOrder': this.availabilityOrder,
        'expressBookingClientNameNotRequired': this.expressBookingClientNameNotRequired
      };
      this.notificationData = {
        'sendNotifications': this.sendNotification,
        'notificationTextMessage': this.notificationTextMessage,
        'notificationTextTag': this.notificationTextTag,
        'notificationEmailAddress': this.notificationEmailAddress,
        'notificationEmailName': this.notificationEmailName,
        'subject': this.subject,
        'mergeField': this.mergeField,
        'emailTemplate': this.editorValue
      };
      this.dataObjects = {
        'sendReminders': this.sendReminders,
        'dailyRemindersAt': this.getHourses,
        'reminderTextTag': this.reminderTextTag,
        'reminderTextMessage': this.reminderTextMessage,
        'reminderList': remainder,
        'reminderEmailAddress': this.reminderEmailAddress,
        'reminderEmailName': this.reminderEmailName,
        'subject': this.reminderSubject,
        'mergeField': this.mergeFields,
        'emailTemplate': this.reminderEmailTemplate
      };
      this.ApptOnlineBooking = {
        'onlineBooking': this.onlineBookingEnabled,
        'windowStartOption': this.windowStarts,
        'windowStartNumber': this.windowStartTime === '' ? this.windowStartTime = 0 : this.windowStartTime,
        'windowEndOption': this.windowEnds,
        'windowEndNumber': this.windowEndTime === '' ? this.windowEndTime = 0 : this.windowEndTime,
        'allowApptCancellations': this.allowApptCancellations,
        'allowApptChanges': this.allowApptChanges,
        'showTotalPrice': this.ShowTotalPrice,
        'showTotalDuration': this.ShowTotalDuration,
        'maximumAvailableToShow': this.NumberofAvailabilities,
        'loginMessage': this.OnlineBookingLoginMessage,
        'loginMessage1': this.OnlineBookingLoginMessage1,
        'pendingDepositFailureNotify': this.sendNotificationofFailed,
        'pendingDepositFailureAutoDelete': this.deleteFailedOnlineDeposits,
        'hoursForOnlineBooking': this.hoursforOnlineBooking
      };
      this.dataObject = {
        'mergeField': this.giftsMergeField,
        'emailTemplate': this.giftsEmailTemplate,
      };
      this.friendDataObject = {
        'mergeField': this.friendMergeField,
        'emailTemplate': this.friendEmailTemplate,
      };
      this.clientAppointmentsService.clientBookingData(this.bookingData)
        .subscribe(
          data => {
            this.bookingData = data['data'];
            // this.clearmessage();
          },
          error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });
      this.clientAppointmentsService.setupNotificationData(this.notificationData).subscribe(
        data => {
          this.notificationData = data['result'];
        },
        error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
      this.clientAppointmentsService.saveRemainder(this.dataObjects)
        .subscribe(
          data => {

          },
          error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });
      this.clientAppointmentsService.onlineData(this.ApptOnlineBooking)
        .subscribe(
          data => {
            this.onlineBookingData = data['data'];
          },
          error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });
      this.clientAppointmentsService.Giftonline(this.dataObject)
        .subscribe(
          data => {
            this.giftOnlineData = data['data'];
            this.clearmessage();
          },
          error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });
      this.clientAppointmentsService.invitefriend(this.friendDataObject)
        .subscribe(
          data => {
            this.inviteFriendData = data['data'];
            this.clearmessage();
          },
          error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          }
        );
      this.router.navigate(['/setup']).then(() => {
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SETUP_APP');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
      });

    }// else
  } // commonSave end here


  updateTabs(order: number) {
    for (let i = 0; i < this.activeTab2.length; i++) {
      if (i === order) {
        this.activeTab2[i] = true;
        this.activeTabClass[i] = 'active';
      } else {
        this.activeTab2[i] = false;
        this.activeTabClass[i] = '';
      }
    }
  }
}
