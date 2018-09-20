import {
  Component, ViewContainerRef, ViewEncapsulation, OnInit, ViewChild, OnDestroy,
  AfterViewInit, Inject, Output, EventEmitter, Directive, HostListener, ElementRef, NgZone,
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment/moment';
import { AppointmentsService } from './appointments.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { componentFactoryName, Parser } from '@angular/compiler';
// import { BsDatepickerComponent } from 'ngx-bootstrap/datepicker/bs-datepicker.component';
import { validateConfig } from '@angular/router/src/config';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { forEach } from '@angular/router/src/utils/collection';
import { resource } from 'selenium-webdriver/http';
import { count } from 'rxjs/operator/count';
import { CommonService } from '../../common/common.service';
import { ApptDetailService } from '../appointmentdetail/appointmentdetail.service';
import { element, utils } from 'protractor';
import { isNullOrUndefined } from 'util';
import { Alert } from 'selenium-webdriver';
import { JwtHelper } from 'angular2-jwt';
import { exists } from 'fs';

declare let $: any;
declare var swal: any;

@Component({
  selector: 'app-appointments-popup,demo-typeahead-scrollable',
  templateUrl: './appointments.html',
  providers: [AppointmentsService, CommonService, ApptDetailService],
  styleUrls: ['./appointments.css']
})

export class AppointmentsComponent implements OnInit, OnDestroy {
  public searchField = new FormControl();
  public datePickerDate: any;
  public getWorker: any = [];
  Users: any;
  View_Only_My_Appointments__c: any = 0;
  minDate: any;
  calendarPicker: any;
  customDate: any;
  formBuilder: any;
  // model: Date;
  myDate: any;
  markCurrentDay: any;
  onTodayClicked: any;
  name = 'All';
  calendarList: any;
  eventCalendar: any;
  event: any;
  dateCatch: any;
  dt: any;
  dt1: any;
  i: any;
  booking: any;
  booking1: any;
  add_minutes: Date;
  times = [];
  book = [];
  day: any;
  date: Date;
  allmembers: any = true;
  singleMembers: any;
  searchKey: any;
  DataObj: any = [];
  error: any;
  rowsPerPage = 10;
  apptDate = '';
  apptViews = [];
  startTime: any;
  endTime: any;
  start: any;
  end: any;
  startTimeMins: any;
  endTimeMins: any;
  finalTimes = [];
  appointmentsList: any;
  apptdate: any;
  chooseDate: any = new Date();
  listDate: any = new Date();
  workerId: any = 'all';
  toastermessage: any;
  select: any;
  selectresource: any;
  viewBy = 'One Day';
  mobileCarriers: any;
  mobileCarrierslist: any = [];
  bookingExpress: any = [];
  individualWorkerId: any = [];
  startbooking = [];
  endbooking = [];
  workerIds: any = [];
  srvcname = [];
  ed_time: any;
  st_time: any;
  finalArry1: any[];
  apptIds: any = [];
  dataObjects: any = [];
  nonPckgSrvcs = [];
  visitTypes: any;
  serviceName: any;
  servicePrice: any;
  duration: any;
  inputs = [];
  duplicateArray = [];
  serviceDurations: any = [];
  sumDuration: any;
  serviceColor: any = [];
  clientName: any = [];
  statusColor: any = [];
  borderColor: any = [];

  firstName: any;
  lastName: any;
  fullName: any;
  mobileNumber: any;
  countrycode: any;
  mobileCarrier: any;
  primaryEmail: any;
  visitType: any;
  expressVisitType: any;
  textArea: any;
  workername: any;
  startDateTime: any;
  bookingDate: any;
  skipBookingDates: any;
  reminderSent: any = [];
  pendingDeposit: any = [];
  noShow: any = [];
  confirmed: any = [];
  booked: any = [];
  checkedIn: any = [];
  canceled: any = [];
  complete: any = [];

  startCalendarTime: any = [];
  finalMax: any;
  finalMin: any;

  errorFirstName: any;
  errorLastName: any;
  errormobilephone: any;
  errorEmail: any;
  validationEmailError: any;
  existingValidationError: any;
  existingCountrycodeError: any;
  countrycodeError: any;
  autoList = [];
  individualServiceColor: any = [];
  calendarUsersListing: any;
  individualcalendarUsersListing: any;
  serviceStartTime: any;
  serviceEndTime: any;
  selWorker = 'all';
  selWeek = 'One Day';
  individualWorkerWeek: any = [];
  expressBookinWorkerId: any;
  expressBookinWorkerName: any;
  expressBookingEnd: any;
  expressBookingStart: any;
  TimeData: any;
  showButton = false;
  cldDate: any;
  mainApptDate: any;
  msgBoardDate: any;
  /*side menu */
  activeClass: any;
  activeClass1: any;
  marketingActiveClass: any;
  classesActive: any;
  showAllWorkers: any;
  apiEndPoints: any;
  amountDuration: any;
  decodedToken: any;
  expressWorkerIds: any;
  isKeyPressed: any = false;
  expressClientIds: any;
  sumDuration2: any;
  conflicting: any;
  called: any;
  expbookskipbutton: any;
  skipPrice: any;
  skipDuration: any;
  skipVisitType: any;
  skiptextArea: any;
  noclient: any;
  timeSlot: any;
  packagesList: any;
  tokenFirstName: any;
  tokenLastName: any;
  Id: any;
  NotificationReminderMobile: any;
  NotificationReminderEmail: any;
  errResources: any;
  bookAnyWay: any;
  bookRoomAnyWay: any;
  weekdayDateDisplay: any;
  /* client fileds */
  allowQuickAddAccess: any;
  clientfieldMobilePhone: any;
  clientfieldPrimaryEmail: any;
  cale: any;
  /* client fields end */
  decodeUserToken: any;
  hideClientInfo: any;
  finaRes: any;

  callenderIcons = [
    { 'id': 'One Day', 'img': 'assets/images/calender-icon-1.png', 'name': 'day', 'opacity': '' },
    { 'id': 'One Week', 'img': 'assets/images/calender-icon-3.png', 'name': 'week', 'opacity': '0.5' },
    { 'id': 'One Weekday', 'img': 'assets/images/calender-icon-2.png', 'name': 'weekday', 'opacity': '0.5' },
    // { 'id': 'month', 'img': 'assets/images/calender-icon-4.png', 'name': 'month', 'opacity': '0.5' }
  ];
  submitParam = true;

  @ViewChild('bookStandingModal') public bookStandingModal: ModalDirective;
  @ViewChild('bookApptModal') public bookApptModal: ModalDirective;
  @ViewChild('msgBoardModal') public msgBoardModal: ModalDirective;
  @ViewChild('calendar') public calendar;
  @ViewChild('serviceNotesModal') public serviceNotesModal: ModalDirective;
  constructor(private appointmentsServices: AppointmentsService,
    @Inject('apiEndPoint') public apiEndPoint: string,
    @Inject('defaultCountry') public defaultCountry: string,
    // @Inject('appt_note_symbol') public appt_note_symbol: string,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private apptDetailService: ApptDetailService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private zone: NgZone,
    private commonService: CommonService) {

  }

  public myForm: FormGroup;

  public myDatePickerOptions: IMyDpOptions = {
    inline: true,
    todayBtnTxt: 'Today',
    showTodayBtn: true,
    markCurrentDay: false,
    sunHighlight: false,
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'su',
    dayLabels: { su: 'S', mo: 'M', tu: 'T', we: 'W', th: 'TH', fr: 'F', sa: 'S' },
    disableUntil: { year: 2017, month: 12, day: 30 },
    disableSince: { year: 2025, month: 12, day: 30 },
    allowSelectionOnlyInCurrentMonth: false,
  };


  ngOnInit() {
    // ---Start of code for Permissions Implementation--- //
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('rights'));
      this.decodeUserToken = new JwtHelper().decodeToken(localStorage.getItem('token'));
    } catch (error) {
      this.decodedToken = {};
      this.decodeUserToken = {};
    }
    if (this.decodedToken.data && this.decodedToken.data.permissions) {
      this.decodedToken = JSON.parse(this.decodedToken.data.permissions);
    } else {
      this.decodedToken = {};
    }
    // ---End of code for permissions Implementation--- //
    this.searchField.valueChanges
      .debounceTime(400)
      // .distinctUntilChanged()
      .switchMap(term => this.appointmentsServices.getClientAutoSearch(term)
      ).subscribe(
        data => {
          this.autoList = [];
          this.autoList = data['result'];
          if (this.autoList.length === 0) {
            this.toastr.warning('No record found. ', null, { timeOut: 3000 });
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
    let apptDate = new Date();
    let date;
    this.route.queryParamMap.subscribe((params) => {
      date = params.get('date');
      if (!isNullOrUndefined(date)) {
        const year = date.split('-')[0];
        const month = +date.split('-')[1] - 1;
        const day = date.split('-')[2];
        apptDate = new Date(year, month, day, 0, 0, 0);
      }
      this.router.navigate(['/appointments']);
    });
    // this.appointmentsServices.getDftTmZn().subscribe(
    //   data => {
    //     const tmZnObj = data['result']
    //       .filter((obj) => obj.isDefault__c)[0]['TimeZoneSidKey__c']
    //       .split(')')[0]
    //       .replace('(GMT', '')
    //       .split(':');
    //     const hrs = parseInt(tmZnObj[0], 10);
    //     const min = parseInt(tmZnObj[1], 10);
    //     let timDiff = 0;
    //     if (tmZnObj[0][0] === '+') {
    //       timDiff = (hrs * 60) + min;
    //     } else {
    //       timDiff = (hrs * 60) - min;
    //     }
    //     const curDate = apptDate;
    //     // if (isNullOrUndefined(date)) {
    //     // curDate.setMinutes(curDate.getMinutes() + curDate.getTimezoneOffset() + timDiff);
    //     // curDate.setHours(0);
    //     // curDate.setMinutes(0);
    //     // curDate.setSeconds(0);
    //     //  }
    //     this.listDate = curDate;
    //     this.getWorkerList();
    //     this.getApptUserList();
    //     this.updateHeaderDate(this.listDate);
    //     this.updateDatepickerDate(this.listDate);
    //     this.getCommonData();
    //     this.onDateChanged(this.dateCatch);
    //     this.allWorkers();
    //     // this.getAppointments(this.listDate, this.workerId, this.selWeek);
    //     this.mobileCarriersList();
    //     this.getVisitTypes();
    //     this.addInput();
    //     this.fetchingBookingInterval();
    //   },
    //   error => {
    //     const errStatus = JSON.parse(error['_body'])['status'];
    //     if (errStatus === '2085' || errStatus === '2071') {
    //       if (this.router.url !== '/') {
    //         localStorage.setItem('page', this.router.url);
    //         this.router.navigate(['/']).then(() => { });
    //       }
    //     }
    //   });
    const curDate = apptDate;
    this.listDate = curDate;
    this.getWorkerList();
    // this.getApptUserList();
    this.updateHeaderDate(this.listDate);
    this.updateDatepickerDate(this.listDate);
    this.getCommonData();
    this.onDateChanged(this.dateCatch);
    this.fetchingBookingInterval();
    this.allWorkers();
    // this.getAppointments(this.listDate, this.workerId, this.selWeek);
    this.getVisitTypes();
    this.addInput();
    this.getHideClientContactInfo();
    localStorage.setItem('wokersChkd', '');
    localStorage.setItem('apptDateSlot', '');
    localStorage.setItem('apptTimeSlot', '');
    this.getpackagesListing();

  }

  ngOnDestroy() {
    localStorage.removeItem('wokersChkd');
  }

  updateHeaderDate(date) {
    const weekday = new Array(7);
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';

    this.apptDate = ': ' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + weekday[date.getDay()];  // 2018-05-21
    this.cldDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);    // 5/21/2018 monday
    this.mainApptDate = this.apptDate.split(' ')[2] + ', '.concat(moment(this.cldDate, 'YYYY-MM-DD').format('LL'));            // Monday,May 21, 2018
    this.msgBoardDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + weekday[date.getDay()]; // date is used in msg board pop up
    this.fetchingBookingInterval();
    //   this.allWorkers();
    this.getAppointments(date, this.workerId, this.selWeek);
    this.fetchWeek(this.selWeek);

  }
  datepickerChange(event) {
    this.chooseDate = event.jsdate;
    // this.listDate = event.jsdate;
    this.updateHeaderDate(new Date(event.jsdate));
    //   this.allWorkers();
    this.getAppointments(this.chooseDate, this.workerId, this.selWeek);
    // this.fetchWeek(this.selWeek);
  }
  updateDatepicker(wkNum: number) {
    let datPicDate = new Date();
    if (wkNum !== 0) {
      datPicDate = new Date(
        this.datePickerDate.date.year,
        this.datePickerDate.date.month - 1,
        this.datePickerDate.date.day + wkNum * 7);
    }
    this.updateDatepickerDate(datPicDate);
    this.updateHeaderDate(datPicDate);
    this.chooseDate = datPicDate;
    this.listDate = datPicDate;
    // this.allWorkers();
    this.fetchingBookingInterval();
    this.getAppointments(this.listDate, this.workerId, this.selWeek);
    // this.fetchWeek(this.selWeek);
  }
  updateDatepickerDate(date) {
    this.datePickerDate = {
      date:
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
    };
    this.fetchingBookingInterval();
  }
  getCommonData() {
    this.appointmentsServices.getCommonData().subscribe(
      data => {
        this.apptViews = data['apptViews'];
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

  // onDateChanged(event: IMyDateModel) {
  //   event.date, ' - jsdate: ',
  //   event.jsdate.toLocaleDateString(),
  //   ' - formatted: ', event.formatted,
  //   ' - epoc timestamp: ', event.epoc
  // );
  // }

  /**
 * booking interval
 */
  fetchingBookingInterval() {
    this.appointmentsServices.fetchingBookingInterval().subscribe(
      data => {
        this.booking = JSON.parse(data['result'].bookingIntervalMinutes);
        const skipButton = data['result'].expressBookingClientNameNotRequired;
        if (skipButton) {
          this.expbookskipbutton = 'true';
        }
        this.called = data['result'].calledStatusColor;
        this.conflicting = data['result'].conflictingStatusColor;
        this.booked = data['result'].bookedStatusColor;
        this.canceled = data['result'].canceledStatusColor;
        this.checkedIn = data['result'].checkedInStatusColor;
        this.complete = data['result'].completeStatusColor;
        this.confirmed = data['result'].confirmedStatusColor;
        this.noShow = data['result'].noShowStatusColor;
        this.pendingDeposit = data['result'].pendingDepositStatusColor;
        this.reminderSent = data['result'].reminderSentStatusColor;
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

  // getApptUserList() {
  //   this.appointmentsServices.getApptUserList().subscribe(
  //     data => {
  //       this.Users = data['result'];
  //     },
  //     error => {
  //       const errStatus = JSON.parse(error['_body'])['status'];
  //       if (errStatus === '2085' || errStatus === '2071') {
  //         if (this.router.url !== '/') {
  //           localStorage.setItem('page', this.router.url);
  //           this.router.navigate(['/']).then(() => { });
  //         }
  //       }
  //     }
  //   );
  // }

  isRebookingAllowed(apptData) {
    const apptDateandTime = new Date(apptData.apdate);
    const apptDate = new Date(this.commonService.getDBDatStr(apptDateandTime));
    const todayDateandTime = new Date();
    const todayDate = new Date(this.commonService.getDBDatStr(todayDateandTime));
    const isTodayAppt = apptDate.getTime() === todayDate.getTime() ? true : false;
    if (isTodayAppt && (apptData.apstatus === 'Checked In' || apptData.apstatus === 'Complete')) {
      return true;
    }
  }

  gotoRouting(apptData, checkReebok?: boolean) {
    if (!isNullOrUndefined(checkReebok) && checkReebok) {
      if (this.isRebookingAllowed(apptData)) {
        this.router.navigate(['/appointment/book/' + apptData.clientId + '/' + apptData.apptid], { queryParams: { bookingType: 'rebook' } });
      } else {
        this.router.navigate(['/appointment/book/' + apptData.clientId + '/' + apptData.apptid]);
      }
    } else {
      if (apptData.Is_Booked_Out__c === 0) {
        this.router.navigate(['/appointmentdetail/' + apptData.clientId + '/' + apptData.apptid]).then(() => { });
      } else if (apptData.Is_Booked_Out__c === 1) {
        this.router.navigate(['appointment/bookoutdetail/' + apptData.apptid]).then(() => { });
      }
    }

  }
  /**
   * ask madhu for this function
   */
  getAppointments(chooseDate, workerId, selWeek) {
    this.appointmentsServices.getAppointments(this.commonService.getDBDatStr(chooseDate), workerId, this.selWeek).subscribe(
      data => {
        this.appointmentsList = data['result']
          .filter(filterList => filterList.apstatus !== 'Canceled');
        this.apiEndPoints = this.apiEndPoint;
        this.apptIds = [];
        this.startbooking = [];
        this.endbooking = [];
        this.workerIds = [];
        this.srvcname = [];
        this.serviceColor = [];
        const currDate = new Date();
        const curtdate = moment(currDate).format('YYYY-MM-DD');
        const datenow = moment(this.chooseDate).format('YYYY-MM-DD');
        const datepickerPreviosdate = moment(this.chooseDate.setDate(this.chooseDate.getDate() - 1)).format('YYYY-MM-DD');
        const yesterday = moment(currDate.setDate(currDate.getDate() - 1)).format('YYYY-MM-DD');
        for (let i = 0; i < this.appointmentsList.length; i++) {
          this.appointmentsList[i].displayAptdate = this.commonService.getUsrDtStrFrmDBStr(this.appointmentsList[i].apdate);
          this.apptIds.push(this.appointmentsList[i].apptid);                          // AptId
          this.workerIds.push(this.appointmentsList[i].workerId);                      // worker id
          this.srvcname.push(this.appointmentsList[i].srvcname);                       // service name
          this.serviceColor.push(this.appointmentsList[i].Service_Group_Color__c);     // service color
          this.statusColor.push(this.appointmentsList[i].apstatus);                    // status color
          this.clientName.push(this.appointmentsList[i].clientName);                   // client name
          const startTime1 = this.appointmentsList[i].apdate.split(' ')[0];            // date time
          const startTime2 = this.appointmentsList[i].apdate.split(' ')[1];            // start time
          const string1 = 'T';
          this.startbooking.push(startTime1.concat(string1).concat(startTime2));
          const durationInMinutes = this.appointmentsList[i].duration;   // duration
          const endTime = moment(startTime2, 'HH:mm:ss').add(durationInMinutes, 'minutes').format('HH:mm');
          this.endbooking.push(startTime1.concat(string1).concat(endTime));
          this.appointmentsList[i]['statusButtonValue'] = undefined;
          const todayDate = new Date(this.commonService.getDBDatStr(new Date));
          const appointmentDate = new Date(this.commonService.getDBDatStr(new Date(this.appointmentsList[i].apdate)));
          if (this.showCheckedIn(todayDate, appointmentDate, this.appointmentsList[i].apstatus)) {
            this.showButton = true;
            this.appointmentsList[i]['statusButtonValue'] = 'Check In';
          } else if (this.appointmentsList[i].apstatus === 'Checked In') {
            this.appointmentsList[i]['statusButtonValue'] = 'Check out';
            this.showButton = true;
          } else if (this.appointmentsList[i].apstatus === 'Checked In' || this.appointmentsList[i].apstatus === 'Checked out') {
            this.showButton = true;
          }
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
      }
    );
  }

  isCheckedInStatus(status) {
    const statusName = status.toLowerCase();
    if ((statusName === 'booked' || statusName === 'called' || statusName === 'confirmed' || statusName === 'pending deposit' ||
      statusName === 'reminder sent' || statusName === 'conflicting')) {
      return true;
    } else {
      return false;
    }
  }

  showCheckedIn(currentDate: Date, apptDate: Date, status: string): boolean {
    const statusName = status.toLowerCase();
    const YesterdayDate = new Date(currentDate.getTime());
    YesterdayDate.setDate(currentDate.getDate() - 1);
    if ((statusName === 'booked' || statusName === 'called' || statusName === 'confirmed' || statusName === 'pending deposit' ||
      statusName === 'reminder sent' || statusName === 'conflicting')
      && (apptDate.getTime() === YesterdayDate.getTime() || apptDate.getTime() === currentDate.getTime())) {
      return true;
    } else {
      return false;
    }
  }

  getWorkerList() {

    this.appointmentsServices.getWorkerLists().subscribe(
      data => {
        this.getWorker = data['result'];
        const dat1 = this.getWorker[0];
        if (dat1.hasOwnProperty('View_Only_My_Appointments__c')) {
          this.View_Only_My_Appointments__c = 1;
          this.selWorker = dat1.workerId + '$' + dat1.names;
          this.fetchWorkerCalendar(dat1.workerId + '$' + dat1.names);
          this.fetchWorkerCalendarPerDay(dat1.workerId + '$' + dat1.names);
        } else {
          this.View_Only_My_Appointments__c = 0;
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
      }
    );
  }


  getUserData(DataObj) {
    this.router.navigate(['/appointment/book/' + DataObj.Id]).then(() => { });
  }
  /*client search data */
  searchClients() {
    this.appointmentsServices.getData(this.searchKey)
      .subscribe(data => {
        this.isKeyPressed = true;
        this.DataObj = data['result'];
      }, error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
            window.scrollTo(0, 0);
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  addNewClient() {
    localStorage.setItem('isNewClient', JSON.stringify(true));
  }

  showBookApptModal() {
    this.isKeyPressed = false;
    $('#bookApptModal').show();
    this.getHideClientContactInfo();
  }
  closeBookApptModal() {
    const standingSearchKeys = $('#FindApptSearchKeys').val('');
    const clearData = $('#findApptClear').val('');
    this.autoList = [];
    $('#bookApptModal').hide();
  }

  showBookStandingModal() {
    this.isKeyPressed = false;
    $('#bookStandingModal').show();
    // this.bookStandingModal.show();
    this.getHideClientContactInfo();
  }
  closeBookingStanding() {
    const standingSearchKeys = $('#standingSearchKeys').val('');
    const clearData = $('#bookStandingClear').val('');
    this.autoList = [];
    $('#bookStandingModal').hide();
  }
  // showappointmentsTimeslot() {
  //   this.isKeyPressed = false;
  //   this.showappointmentTimeslot.show();
  // }
  showMessageBoardModal() {
    this.isKeyPressed = false;
    this.msgBoardModal.show();
  }
  // cancelModel() {
  //   this.bookStandingModal.hide();
  //   this.bookApptModal.hide();
  //   this.msgBoardModal.hide();
  //   this.searchKey = '';
  //   this.DataObj = [];
  // }

  onDateChanged(event: IMyDateModel) {
    if (event === undefined) {
      const tmpArray = this.cldDate.split('-');
      this.listDate = new Date(tmpArray[0], parseInt(tmpArray[1], 10) - 1, tmpArray[2]);
    } else {
      this.listDate = new Date(event.formatted);
    }
    // this.apptdate = moment(event.formatted).format('L');
    // if (this.dateCatch === NaN || this.dateCatch === undefined || this.dateCatch === 'undefined') {
    //   this.dateCatch = moment().format('dddd');
    // } else if (this.dateCatch !== '') {
    //   this.dateCatch = moment(event.formatted).format('dddd');
    //   this.apptdate = moment(event.formatted).format('L');
    // }
  }

  bookStandingPage(userDetails) {
    this.router.navigate(['/appointment/bookstandingappt/' + userDetails.Id]).then(() => {
      // localStorage.setItem('temp', JSON.stringify(userDetails));
      // localStorage.setItem('bookstanding', JSON.stringify(userDetails));
    });
  }
  loadCalender(calObj) {
    calObj.eventClick = function (event) {
      if (!event.apptId) {
        return false;
      } else if (event.clientID === '') {
        window.open('#/appointment/bookoutdetail/' + event.apptId, '_self');
      } else {
        window.open('#/appointmentdetail/' + event.clientID + '/' + event.apptId, '_self');
      }
    };

    const appointmentSlots: any = this.calendarUsersListing;
    calObj.eventAfterAllRender = function (view) {
      const assdd = $('.fc-event-container');
      const slotInterval = $('#bookingSlot').val();
      const sad = $('.fc-slats tr');
      const time = new Date();
      const hh = time.getHours();
      const mm = time.getMinutes();
      const ss = time.getSeconds();

      const hrsMin = hh * 60 + mm;
      const minInterval = hrsMin / slotInterval;
      const sumOfTimeInMin = minInterval.toString().split('.')[0];
      const convertSumToInterval = parseInt(sumOfTimeInMin, 10) * slotInterval;
      const sumOfActualMin = (convertSumToInterval % 60).toString();
      let CalendartimeSlot: any;
      if (sumOfActualMin === '0') {
        CalendartimeSlot = '00';
      } else if (sumOfActualMin !== '0') {
        CalendartimeSlot = sumOfActualMin;
      }
      const todayDate = moment().format('YYYY-MM-DD');
      const calDates = $('#cldDate').val();


      if (calDates === todayDate) {
        for (let p = 0; p < sad.length; p++) {
          const calTime = moment(sad[p].dataset.time, 'HH:mm').format('HH:mm');
          const realTimeConvertToAccInterval = moment(hh + ':' + CalendartimeSlot, 'HH:mm').format('HH:mm');
          if (calTime === realTimeConvertToAccInterval) {
            sad[p].classList.add('currentTime');
          }
        }
      }

      const temp1 = document.getElementsByClassName('fc-axis fc-time fc-widget-content');
      for (let j = 0; j < temp1.length; j++) {
        if (temp1[j].innerHTML.split(':')[1] === undefined) {
          temp1[j].innerHTML = temp1[j].innerHTML.split(':')[0];
        } else if (temp1[j].innerHTML.split(':')[1] !== undefined) {
          temp1[j].innerHTML = temp1[j].innerHTML.split(':')[1];
          const ds = '<span class="changeTimeClass">' + ':' + temp1[j].innerHTML.slice(0, 2) + '</span>';
          temp1[j].innerHTML = ds;
          temp1[j].classList.add('active');
        }
      }

      const temp = document.getElementsByClassName('fc-title');
      for (let i = 0; i < temp.length; i++) {
        const tempInnerHTMl = temp[i].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        temp[i].innerHTML = tempInnerHTMl;
      }
      // $('.fc-slats').html($('.fc-widget-content').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
      for (let i = 0; i < appointmentSlots.length; i++) {
        const color: any = document.getElementsByClassName(appointmentSlots[i].tsid.toString());
        if (!isNullOrUndefined(color) && color.length > 0) {

          //  color[0].children[1].style.opacity = 1;
          const aviable = ['Duration_1_Available_for_Other_Work__c', 'Duration_2_Available_for_other_Work__c', 'Duration_3_Available_for_other_Work__c'];
          ['Duration_1__c', 'Duration_2__c', 'Duration_3__c'].map((key, j) => {
            if (appointmentSlots[i][key] && appointmentSlots[i][key] > 0) {
              const availabilityDiv = document.createElement('div');
              availabilityDiv.setAttribute('style', `position: relative;
                                          z-index: 2;
                                          left: 0;
                                          width: 100%;
                                          height: ${(appointmentSlots[i][key] / appointmentSlots[i].Duration__c) * 100}%;
                                          background-color:#fff;
                                          opacity:  ${appointmentSlots[i][aviable[j]] === 1 ? 0.5 : 0};`);
              color[0].children[1].append(availabilityDiv);
            }
          });
        }
      }
      const tempas: any = document.getElementsByClassName('fc-time-grid-event fc-v-event fc-event fc-not-start fc-end');

      for (let i = 0; i < tempas.length; i++) {
        const asda = tempas[i].style.width = '100%';
      }
    };
    $('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar(calObj);
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: any) {
    const prevClasses = ['fc-icon fc-icon-left-single-arrow',
      'fc-prev-button fc-button fc-state-default fc-state-hover fc-state-down',
      'fc-prev-button fc-button fc-state-default fc-state-hover'];
    const nextClasses = ['fc-icon fc-icon-right-single-arrow',
      'fc-next-button fc-button fc-state-default fc-state-hover fc-state-down',
      'fc-next-button fc-button fc-state-default fc-state-hover'];
    const ssd = 'fc-axis fc-time fc-widget-content';
    if (this.calendar.nativeElement.contains(event.target)) {
      const target = event.target || event.srcElement || event.currentTarget;
      const idAttr = target.attributes.id;
      const classAttr = target.attributes.class;
      const parentClassAttr = target.parentElement.attributes.class;
      if ((isNullOrUndefined(classAttr) && !isNullOrUndefined(parentClassAttr))) {
        if (parentClassAttr.nodeValue === 'fc-axis fc-time fc-widget-content') {
          this.timeSlot = event.target.parentElement.parentNode.getAttribute('data-time');
          if (this.timeSlot) {
            localStorage.setItem('apptDateSlot', this.apptDate.split(' ')[1] + ' ' + this.timeSlot);
          }
          this.appointmentTimeslot(this.timeSlot);
          $('.close').click(function () {
            $('#myModal').hide();
          });
        }
      } else if (!isNullOrUndefined(classAttr)) {
        if (classAttr.nodeValue === 'fc-axis fc-time fc-widget-content' || classAttr.nodeValue === 'fc-axis fc-time fc-widget-content active' || classAttr.nodeValue === 'changeTimeClass') {
          if (classAttr.nodeValue === 'changeTimeClass') {
            this.timeSlot = event.target.parentElement.parentNode.getAttribute('data-time');
            if (this.timeSlot) {
              localStorage.setItem('apptDateSlot', this.apptDate.split(' ')[1] + ' ' + this.timeSlot);
            }
            this.appointmentTimeslot(this.timeSlot);
            $('.close').click(function () {
              $('#myModal').hide();
            });
          } else {
            this.timeSlot = '';
            this.timeSlot = event.target.parentElement.getAttribute('data-time');
            if (this.timeSlot) {
              localStorage.setItem('apptDateSlot', this.apptDate.split(' ')[1] + ' ' + this.timeSlot);
            }
            this.appointmentTimeslot(this.timeSlot);
            $('.close').click(function () {
              $('#myModal').hide();
            });
          }
        } else if (this.isClassExsists(prevClasses, classAttr.nodeValue)) {
          this.goToDate(this.listDate, -1);
        } else if (this.isClassExsists(nextClasses, classAttr.nodeValue)) {
          this.goToDate(this.listDate, 1);
        }
      } else if (!isNullOrUndefined(idAttr)) {
        const value = idAttr.nodeValue;
        if (value === 'workerCheckerd') {
          const u: any = document.getElementById('workerCheckerd');
          const checkWorker: any = u.checked;
          if (checkWorker === true) {
            localStorage.setItem('wokersChkd', 'checked');
            this.ShowAllworker();
          } else if (checkWorker === false) {
            localStorage.setItem('wokersChkd', '');
            this.allWorkers();
          }
        }
      }
    }
  }
  goToDate(date: Date, noOfDays: number) {
    date.setDate(date.getDate() + (noOfDays));
    this.listDate = new Date(date);
    this.updateDatepickerDate(this.listDate);
    this.updateHeaderDate(this.listDate);
  }

  isClassExsists(classesList, className): boolean {
    return classesList.indexOf(className) !== -1;
  }

  appointmentTimeslot(time) {
    if (time) {
      // this.inputs = [];
      // const workerId = this.getWorker.length > 0 ? this.getWorker[0]['workerId'] : '';
      // this.expressService(workerId, 0);
      $('#myModal').show();
    } else {
      alert('select again');
    }
  }

  ShowAllworker() {
    const CalendatDate = moment(this.chooseDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    this.appointmentsServices.getAppontmentList(this.cldDate).subscribe(
      data => {
        const events = [];
        this.calendarUsersListing = data['result'];
        for (let i = 0; i < this.calendarUsersListing.length; i++) {
          if (this.calendarUsersListing[i].status === 'Conflicting') {
            this.borderColor[i] = this.conflicting;
          } else if (this.calendarUsersListing[i].status === 'Checked In') {
            this.borderColor[i] = this.checkedIn;
          } else if (this.calendarUsersListing[i].status === 'Booked') {
            this.borderColor[i] = this.booked;
          } else if (this.calendarUsersListing[i].status === 'Complete') {
            this.borderColor[i] = this.complete;
          } else if (this.calendarUsersListing[i].status === 'Called') {
            this.borderColor[i] = this.called;
          } else if (this.calendarUsersListing[i].status === 'Canceled') {
            this.borderColor[i] = this.canceled;
          } else if (this.calendarUsersListing[i].status === 'Confirmed') {
            this.borderColor[i] = this.confirmed;
          } else if (this.calendarUsersListing[i].status === 'Reminder Sent') {
            this.borderColor[i] = this.reminderSent;
          } else if (this.calendarUsersListing[i].status === 'No Show') {
            this.borderColor[i] = this.noShow;
          } else if (this.calendarUsersListing[i].status === 'Pending Deposit') {
            this.borderColor[i] = this.pendingDeposit;
          }

          this.calendarUsersListing[i].Service_Date_Time__c = this.calendarUsersListing[i].Service_Date_Time__c;
          this.serviceStartTime = moment(this.calendarUsersListing[i].Service_Date_Time__c).format().split('+')[0];
          const durationInMinutes = this.calendarUsersListing[i].Duration__c;   // duration
          this.serviceEndTime = moment(this.serviceStartTime).add(durationInMinutes, 'minutes').format().split('+')[0];
          let booked: any;
          let userName: any;
          if (this.calendarUsersListing[i].Name === 'null' || this.calendarUsersListing[i].Name === null) {
            userName = 'No Client';
          } else {
            userName = this.calendarUsersListing[i].Name;
          }
          // '&#8727;' = *
          // '&#8857;' = online booking
          // '&#9839;' = #
          // '&#9834;' = note

          const bookOut = this.calendarUsersListing[i].Is_Booked_Out__c;
          const notes = this.calendarUsersListing[i].Notes__c;
          const newClient = this.calendarUsersListing[i].New_Client__c;
          const asterix = this.calendarUsersListing[i].Appt_Icon;   // it mean more than one service is booked for that *
          const serviceNames = this.calendarUsersListing[i].serviceName;
          const onlineBooking = this.calendarUsersListing[i].Booked_Online__c;
          const standing = this.calendarUsersListing[i].standing;

          if (onlineBooking === 1) {
            if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
              booked = '&#8857; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
              booked = '&#8857; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (onlineBooking === 1 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
              booked = '&#8857; ' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (onlineBooking === 1 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
              booked = '&#8857; ' + '&#9834; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
              booked = '&#8857; ' + userName + '/' + serviceNames;
            } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
              booked = '&#8857; ' + '&#8727; ' + userName + '/' + serviceNames;
            } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
              booked = '&#8857; ' + '&#9834; ' + userName + '/' + serviceNames;
            } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
              booked = '&#8857; ' + '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
            }
          }

          if (onlineBooking === 0) {
            if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
              booked = '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
              booked = '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (onlineBooking === 0 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
              booked = '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (onlineBooking === 0 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
              booked = '&#9834; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
              booked = userName + '/' + serviceNames;
            } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
              booked = '&#8727; ' + userName + '/' + serviceNames;
            } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
              booked = '&#9834; ' + userName + '/' + serviceNames;
            } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
              booked = '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
            }
          }

          if (standing === 1) {
            if (newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
              booked = '&#9839;' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
              booked = '&#9839;' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
              booked = '&#9839;' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
              booked = '&#9839;' + '&#9834' + '&#8727' + + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
            } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
              booked = '&#9839;' + userName + '/' + serviceNames;
            } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
              booked = '&#9839;' + '&#8727;' + userName + '/' + serviceNames;
            } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
              booked = '&#9839;' + '&#9834;' + userName + '/' + serviceNames;
            } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
              booked = '&#9839;' + '&#9834;' + '&#8727;' + userName + '/' + serviceNames;
            }
          }

          if (bookOut === 1 && notes !== '') {
            booked = '&#9834; ' + 'Book Out Time';
          } else if (bookOut === 1 && notes === '') {
            booked = 'Book Out Time';
          }

          let clientIDs: any;
          if (this.calendarUsersListing[i].clientID === '') {
            clientIDs = null;
          } else {
            clientIDs = this.calendarUsersListing[i].clientID;
          }
          events.push(
            {
              'resourceId': this.calendarUsersListing[i].Worker__c,
              'apptId': this.calendarUsersListing[i].Appt_Ticket__c,
              'ticket_service_id': this.calendarUsersListing[i].tsid,
              'title': booked,
              'start': this.serviceStartTime,
              'end': this.serviceEndTime,
              'textColor': 'black',
              'borderColor': this.borderColor[i],
              'color': this.calendarUsersListing[i].serviceGroupColor,
              'clientID': clientIDs,
              'status': this.calendarUsersListing[i].status,
              'className': this.calendarUsersListing[i].tsid
            },
          );
        }
        var resourceRender = function (resourceObj, labelTds, bodyTds) {
          const name = '<div class="appnt-pro-name"><h6>' + resourceObj.name + ' </h6> </div>';
          labelTds.prepend(name);
          let homeimage = '';
          if (resourceObj.imagesUrl && resourceObj.imagesUrl !== '') {
            homeimage = '<div class="appnt-pro-image">' +
              '<img src="' + resourceObj.api + '/' + resourceObj.imagesUrl + '"  width="58" height="48"  '
              + 'onerror=this.src="assets/images/user-icon.png"></div>';
          } else {
            homeimage = '<div class="appnt-pro-image">' +
              '<div class="appnt-pro-letter"><strong> ' + resourceObj.name[0].toUpperCase() + ' </strong></div></div>';
          }
          labelTds.prepend(homeimage);
        };

        // this.getAppointments(this.listDate, this.workerId, this.selWeek);
        this.appointmentsServices.showAllWorkers(this.apptDate.split(' ')[2], this.cldDate).subscribe(
          data1 => {
            if (data1['result'] === null || data1['result'].length === 0) {
              this.toastr.warning('Present no worker in active ', null, { timeOut: 4000 });
            }
            this.eventCalendar = [];
            this.eventCalendar = data1['result'];
            const resources = [];
            const bussinessHrs = [];
            const year = this.datePickerDate.date.year;
            const month = this.datePickerDate.date.month;
            const day = this.datePickerDate.date.day;
            for (let p = 0; p < this.eventCalendar.length; p++) {
              const st = this.eventCalendar[p].start;
              const ed = this.eventCalendar[p].end;
              const names1 = this.eventCalendar[p].names;
              const image = this.eventCalendar[p].image;
              const workerId = this.eventCalendar[p].workerId;
              const start1 = moment(st, ['h:mm A']).format('HH:mm');
              const end1 = moment(ed, ['h:mm A']).format('HH:mm');
              resources.push(
                {
                  id: workerId,
                  title: names1,
                  name: names1,
                  imagesUrl: image,
                  api: this.apiEndPoints,
                  businessHours: {
                    start: start1,
                    end: end1,
                    dow: [0, 1, 2, 3, 4, 5, 6],
                  },
                }
              );
              bussinessHrs.push(
                {
                  dow: [0, 1, 2, 3, 4, 5, 6],               // Sunday - satarday
                  start: start1,
                  end: end1,
                });
              const finMin = moment(st, 'h:mm:ss A').format('LTS').split(':')[0];
              const finMax = moment(ed, 'h:mm:ss A').format('HH:mm:ss').split(':')[0];
              if (finMin < this.finalMin || p === 0) {
                this.finalMin = finMin;
              }
              if (finMax > this.finalMax || p === 0) {
                this.finalMax = finMax;
              }
              const ole = JSON.parse(this.booking);
              var select = function (start, end, jsEvent, view, selectresource) {
                let datIndex = 0;
                const crDate = new Date();
                // const startDate = new Date(0, 0, 0, parseInt(selectresource.businessHours.start.split(':')[0], 10), 0, 0, 0);
                // const endDate = new Date(0, 0, 0, parseInt(selectresource.businessHours.end.split(':')[0], 10), 0, 0, 0);
                const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
                const endDate = new Date(0, 0, 0, 23, 59, 0, 0);
                this.TimeData = [];
                const firstName = $('#firstName').val('');
                const LastName = $('#lastName').val('');
                const mobileNumber = $('#mobileNumber').val('');
                // const mobileCarrier = $('#mobileCarrier').val('');
                const primaryEmail = $('#primaryEmail').val('');
                const listServices = $('#listServices').val('');
                const sumDuration = $('#sumDuration').val('');
                const textArea = $('#textArea').val('');
                const visitType = $('#visitType').val('');
                do {
                  let elem = '';
                  if (startDate.getHours() < 12) {
                    if (startDate.getHours() === 0) {
                      elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                    } else {
                      elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                    }
                  } else {
                    if ((startDate.getHours() - 12) === 0) {
                      elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                    } else {
                      elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                    }
                  }
                  this.TimeData.push(elem);

                  if (crDate.getHours() < startDate.getHours()) {
                    datIndex++;
                  }
                  startDate.setMinutes(startDate.getMinutes() + ole);
                }
                while (startDate < endDate);
                this.expressBookingStart = selectresource.businessHours.start;      // worker start
                this.expressBookingEnd = selectresource.businessHours.end;         // worker end
                this.startDateTime = start.format();
                this.end = end.format();
                $('#myModal').show();
                let appoitmentdate: any;
                let expressDate2: any;
                let skipCalendarDate: any;
                let calendarDate: any;
                calendarDate = moment(this.startDateTime).format('MM/DD/YYYY');
                if (this.timeSlot) {
                  appoitmentdate = $('#CalendarDate').val(this.apptDate);
                  expressDate2 = $('#CalendarDate2').val(this.apptDate);
                  skipCalendarDate = $('#skipCalendarDate').val(this.apptDate);
                } else if (this.timeSlot === '' || this.timeSlot === undefined) {
                  appoitmentdate = $('#CalendarDate').val(calendarDate);    // date of appointments
                  expressDate2 = $('#CalendarDate2').val(calendarDate);
                  skipCalendarDate = $('#skipCalendarDate').val(calendarDate);
                }
                // const apptTimeSlot = $('#apptTimeSlot').val(calendarDate);
                let selTimOpt = '';
                const hrs = parseInt(start.format().split('T')[1].split(':')[0], 10);
                const min = parseInt(start.format().split('T')[1].split(':')[1], 10);

                if (hrs < 12) {
                  if (hrs === 0) {
                    selTimOpt = '12:' + ('0' + min).slice(-2) + ' AM';
                  } else {
                    selTimOpt = ('0' + hrs).slice(-2) + ':' + ('0' + min).slice(-2) + ' AM';
                  }
                } else {
                  if ((hrs - 12) === 0) {
                    selTimOpt = '12:' + ('0' + min).slice(-2) + ' PM';
                  } else {
                    selTimOpt = ('0' + (hrs - 12)).slice(-2) + ':' + ('0' + min).slice(-2) + ' PM';
                  }
                }
                const selectBox = <HTMLSelectElement>document.getElementById('times');
                selectBox.options.length = 0;
                for (let i = 0; i < this.TimeData.length; i++) {
                  const optionVal = this.TimeData[i];
                  selectBox.options.add(new Option(optionVal, optionVal));
                }
                selectBox.value = selTimOpt;                          // main time
                this.expressBookinWorkerName = $('#workername').val(selectresource.title);       //   worker name
                const worSel = <HTMLSelectElement>document.getElementById('workerIds');          // worker id
                worSel.value = selectresource.id;
                const modal = document.getElementById('myModal');
                const btn = document.getElementById('myBtn');
                $('#cancelExpress').click(function () {
                  $('#myModal').hide();
                });
                $('.close').click(function () {
                  $('#myModal').hide();
                });
              };


            }

            let MaxStartTime = '';
            let MaxEndTime = '';
            if (this.eventCalendar[0].min !== null && this.eventCalendar[0].max !== null) {
              MaxStartTime = (this.eventCalendar[0].min - 1) + ':00:00';
              MaxEndTime = (this.eventCalendar[0].max + 1) + ':00:00';
            } else {
              const durationInMinutes1 = '-60';
              const durationInMinutes2 = '60';
              MaxStartTime = moment(this.finalMin, 'h:mm:ss A').add(durationInMinutes1, 'minutes').format('HH:mm:ss');
              MaxEndTime = moment(this.finalMax, 'h:mm:ss A').add(durationInMinutes2, 'minutes').format('HH:mm:ss');
            }
            this.weekdayDateDisplay = '';
            const calObj = {
              defaultView: 'agendaDay',
              defaultDate: this.cldDate,
              editable: true,
              selectable: true,
              eventLimit: true,
              allDaySlot: false,
              weekends: true,
              slotEventOverlap: true,
              eventOverlap: true,
              minTime: MaxStartTime,
              maxTime: MaxEndTime,
              allDayDefault: false,
              slotLabelInterval: '00:' + (JSON.parse(this.booking)) + ':00',
              slotDuration: '00:' + (JSON.parse(this.booking)) + ':00',
              viewSubSlotLabel: true,
              header: {
                left: '',
                center: 'prev,title,next',
                right: ''
              },
              slotLabelFormat: [
                'h(:mm) a'
              ],
              viewRender: function (view, element) {
                const chked = localStorage.getItem('wokersChkd');
                const s = '<div  id="myId"><input id="workerCheckerd" ' + chked + ' type="checkbox"/> '
                  + '<label for="workerCheckerd">Show All Workers</label></div><div class="appnt-pro-name"><h6>TIME</h6> </div>';
                element.find('.fc-axis:first').html(s);
              },
              views: {
                agendaDay: {
                  type: 'agendaDay',
                  groupByResource: true,
                  titleFormat: 'dddd MMMM D, YYYY',
                },
              },
              resources: resources,
              resourceRender: resourceRender,
              events: events,
              select: select,
              eventDrop: function (event, delta, revertFunc) {
                const todayMoment = moment();
                const dayDelta = delta.days();
                const minuteDelta = delta.hours() * 60 + delta.minutes();
                const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                const todayDate = todayMoment.year() * 10000 + (todayMoment.month() + 1) * 100 + todayMoment.date();
                if (event.status === 'Canceled' || event.status === 'Complete') {
                  swal({
                    text: 'The App is cancelled or completed stage',
                    timer: 2000,
                    buttons: false,
                  });
                  revertFunc();
                  return;
                } else if (eventStartDate < todayDate) {
                  swal({
                    text: 'Appointment cannot be moved. Either the appointment is in the past or is being moved into the past.',
                    icon: 'warning',
                    button: 'ok',
                  });
                  revertFunc();
                  return;
                } else {
                  const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                  if (event.start._f === 'YYYY-MM-DDTHH:mm:ss') {
                    const eventStartTime = moment(eventDate + event.start._i + event.start._i, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm');
                    const eventEndTime = moment(eventDate + event.end._i + event.end._i, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm');
                    const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                    const duration = startAndEnd.asMinutes();
                    $.ajax({
                      type: 'POST',
                      url: (this.apiEndPoint + '/api/calendarEventsUpdates'),
                      beforeSend: function (request) {
                        request.setRequestHeader('token', localStorage.getItem('token'));
                      },
                      data: {
                        'apptId': event.apptId,
                        'resourceId': event.resourceId,
                        'ticket_service_id': event.ticket_service_id,
                        'eventStartTime': eventStartTime,
                        'duration': duration
                      },
                      success: function (dataString, textStatus, request) {
                        swal({
                          text: 'Appointment Updated Successfully',
                          timer: 2000,
                          buttons: false
                        });
                        localStorage.setItem('token', request.getResponseHeader('token'));
                      }
                    });
                  } else if (event.start._f === '' || event.start._f === undefined) {
                    const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                    const eventEndTime = moment(eventDate + event.end._i[3] + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                    const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                    const duration = startAndEnd.asMinutes();
                    $.ajax({
                      type: 'POST',
                      url: (this.apiEndPoint + '/api/calendarEventsUpdates'),
                      beforeSend: function (request) {
                        request.setRequestHeader('token', localStorage.getItem('token'));
                      },
                      data: {
                        'apptId': event.apptId,
                        'resourceId': event.resourceId,
                        'ticket_service_id': event.ticket_service_id,
                        'eventStartTime': eventStartTime,
                        'duration': duration
                      },
                      success: function (dataString, textStatus, request) {
                        swal({
                          text: 'Appointment Updated Successfully',
                          timer: 2000,
                          buttons: false
                        });
                        localStorage.setItem('token', request.getResponseHeader('token'));
                      }
                    });
                  } else {
                    swal({
                      text: 'Unable to move Appt ,refresh page and try again',
                      timer: 2000,
                      buttons: false
                    });
                    revertFunc();
                    return;
                  }
                }
              },
              eventResize: function (event, delta, revertFunc) {
                const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                const eventEndTime = moment(eventDate + event.end._i[3] + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                const duration = startAndEnd.asMinutes();
                $.ajax({
                  type: 'POST',
                  url: (this.apiEndPoint + '/api/calendarEventsUpdates'),
                  beforeSend: function (request) {
                    request.setRequestHeader('token', localStorage.getItem('token'));
                  },
                  data: {
                    'apptId': event.apptId,
                    'resourceId': event.resourceId,
                    'ticket_service_id': event.ticket_service_id,
                    'eventStartTime': eventStartTime,
                    'duration': duration
                  },
                  success: function (dataString, textStatus, request) {
                    swal({
                      text: 'Appointment Updated Successfully',
                      timer: 2000,
                      buttons: false
                    });
                    localStorage.setItem('token', request.getResponseHeader('token'));
                  }
                });
              },
              businessHours: bussinessHrs,
              selectConstraint: 'businessHours',
              schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
            };
            $('#calendar').fullCalendar('destroy');
            this.loadCalender(calObj);
          },
          error => {
          });
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

  fetchWorkerCalendarPerDay(value) {
    this.workerId = value.split('$')[0];
    this.getAppointments(this.listDate, this.workerId, this.selWeek);
  }

  /**
   * @param personal Calendar
   */
  fetchWorkerCalendar(value) {   // value means worker id
    var apiEndPoint = this.apiEndPoint;
    let calendarDate: any = [];
    calendarDate = [];
    if (this.apptdate !== '') {
      const date1 = moment(this.apptdate).format('L');
      calendarDate = date1;
    }
    if (value !== 'all' && this.selWeek === 'One Week') {
      this.fetchWeek(this.selWeek.split('$')[0]);
    } else if (value !== 'all' && this.selWeek === 'One Weekday') {
      this.fetchWeek('');
    } else if (value !== 'all' && this.selWeek === 'One Day') {
      this.finalArry1 = [];
      const CalendatDate = this.datePickerDate.date.year + '-' + 0 + this.datePickerDate.date.month + '-' + this.datePickerDate.date.day;
      this.borderColor = [];

      this.weekdayDateDisplay = '';
      let borderColors: any;
      this.appointmentsServices.getAppontmentList(this.cldDate).subscribe(
        data => {
          this.individualcalendarUsersListing = data['result'];
          for (let i = 0; i < this.individualcalendarUsersListing.length; i++) {
            this.borderColor = [];
            if (this.individualcalendarUsersListing[i].status === 'Conflicting') {
              borderColors = this.conflicting;
            } else if (this.individualcalendarUsersListing[i].status === 'Checked In') {
              borderColors = this.checkedIn;
            } else if (this.individualcalendarUsersListing[i].status === 'Booked') {
              borderColors = this.booked;
            } else if (this.individualcalendarUsersListing[i].status === 'Complete') {
              borderColors = this.complete;
            } else if (this.individualcalendarUsersListing[i].status === 'Called') {
              borderColors = this.called;
            } else if (this.individualcalendarUsersListing[i].status === 'Canceled') {
              borderColors = this.canceled;
            } else if (this.individualcalendarUsersListing[i].status === 'Confirmed') {
              borderColors = this.confirmed;
            } else if (this.individualcalendarUsersListing[i].status === 'Reminder Sent') {
              borderColors = this.reminderSent;
            } else if (this.individualcalendarUsersListing[i].status === 'No Show') {
              borderColors = this.noShow;
            } else if (this.individualcalendarUsersListing[i].status === 'Pending Deposit') {
              borderColors = this.pendingDeposit;
            }
            let booked: any;
            let userName: any;
            if (this.individualcalendarUsersListing[i].Name === '' || this.individualcalendarUsersListing[i].Name === null) {
              userName = 'No Client';
            } else {
              userName = this.individualcalendarUsersListing[i].Name;
            }
            // '&#8727;' = *
            // '&#8857;' = online booking
            // '&#9839;' = #
            // '&#9834;' = note

            const bookOut = this.individualcalendarUsersListing[i].Is_Booked_Out__c;
            const notes = this.individualcalendarUsersListing[i].Notes__c;
            const newClient = this.individualcalendarUsersListing[i].New_Client__c;
            const asterix = this.individualcalendarUsersListing[i].Appt_Icon;   // it mean more than one service is booked for that *
            const serviceNames = this.individualcalendarUsersListing[i].serviceName;
            const onlineBooking = this.individualcalendarUsersListing[i].Booked_Online__c;
            const standing = this.individualcalendarUsersListing[i].standing;
            if (onlineBooking === 1) {
              if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                booked = '&#8857; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                booked = '&#8857; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (onlineBooking === 1 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                booked = '&#8857; ' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (onlineBooking === 1 && newClient === 1 && (notes == 'null' || notes !== '') && asterix === 'asterix') {
                booked = '&#8857; ' + '&#9834; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                booked = '&#8857; ' + userName + '/' + serviceNames;
              } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                booked = '&#8857; ' + '&#8727; ' + userName + '/' + serviceNames;
              } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                booked = '&#8857; ' + '&#9834; ' + userName + '/' + serviceNames;
              } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                booked = '&#8857; ' + '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
              }
            }

            if (onlineBooking === 0) {
              if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                booked = '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                booked = '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (onlineBooking === 0 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                booked = '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (onlineBooking === 0 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                booked = '&#9834; ' + '&#8727;' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                booked = userName + '/' + serviceNames;
              } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                booked = '&#8727; ' + userName + '/' + serviceNames;
              } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                booked = '&#9834; ' + userName + '/' + serviceNames;
              } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                booked = '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
              }
            }

            if (standing === 1) {
              if (newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                booked = '&#9839;' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                booked = '&#9839;' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                booked = '&#9839;' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                booked = '&#9839;' + '&#9834; ' + '&#8727' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
              } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                booked = '&#9839;' + userName + '/' + serviceNames;
              } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                booked = '&#9839;' + '&#8727; ' + userName + '/' + serviceNames;
              } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                booked = '&#9839;' + '&#9834' + userName + '/' + serviceNames;
              } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                booked = '&#9839;' + '&#9834' + '&#8727' + userName + '/' + serviceNames;
              }

            }
            if (bookOut === 1 && notes !== '') {
              booked = '&#9834; ' + 'Book Out Time';
            } else if (bookOut === 1 && notes === '') {
              booked = 'Book Out Time';
            }

            this.serviceStartTime = moment(this.individualcalendarUsersListing[i].Service_Date_Time__c).format().split(' ')[0];
            const durationInMinutes = this.individualcalendarUsersListing[i].Duration__c;   // duration
            this.serviceEndTime = moment(this.serviceStartTime).add(durationInMinutes, 'minutes').format().split('+')[0];

            this.finalArry1.push(
              {
                'resourceId': this.individualcalendarUsersListing[i].Worker__c,
                'apptId': this.individualcalendarUsersListing[i].Appt_Ticket__c,
                'ticket_service_id': this.individualcalendarUsersListing[i].tsid,
                'title': booked,
                'start': this.serviceStartTime.split('+')[0],
                'end': this.serviceEndTime,
                'textColor': 'black',
                'borderColor': borderColors,
                'color': this.individualcalendarUsersListing[i].serviceGroupColor,
                'clientID': this.individualcalendarUsersListing[i].clientID,
                'status': this.individualcalendarUsersListing[i].status,
                'className': this.individualcalendarUsersListing[i].tsid
              }
            );
          }
          this.individualWorkerId = (value + '').split('$')[0];
          this.name = (value + '').split('$')[1];
          if (this.individualWorkerId === '') {
            this.individualWorkerId = this.selWorker.split('$')[0];

          }
          if (this.individualWorkerId !== '') {
            this.appointmentsServices.postWorkerName(this.individualWorkerId, this.cldDate).subscribe(
              data1 => {
                this.calendarList = data1['result'];

                const durationInMinutes1 = '-60';
                const durationInMinutes2 = '60';
                let MinTime: any;
                let MaxTime: any;
                if (this.calendarList[0].min === '' || this.calendarList[0].max === '') {
                  MinTime = '00:00';
                  MaxTime = '23:59';
                } else if (this.calendarList[0].min !== undefined && this.calendarList[0].max !== undefined) {
                  MinTime = moment(this.calendarList[0].min, 'h:mm:ss A').add(durationInMinutes1, 'minutes').format('HH:mm');
                  MaxTime = moment(this.calendarList[0].max, 'h:mm:ss A').add(durationInMinutes2, 'minutes').format('HH:mm');
                } else {
                  MinTime = '00:01';
                  MaxTime = '23:59';
                }

                if (this.calendarList.length > 0) {
                  const resources = [];
                  const events = [];
                  const year = this.datePickerDate.date.year;
                  const month = this.datePickerDate.date.month;
                  const day = this.datePickerDate.date.day;
                  for (let p = 0; p < this.calendarList.length; p++) {
                    const st = this.calendarList[p].start;
                    const ed = this.calendarList[p].end;
                    const names1 = this.calendarList[p].names;
                    this.st_time = moment(this.calendarList[p].start, 'h:mm:ss A').format('HH:mm:ss');
                    this.ed_time = moment(this.calendarList[p].end, 'h:mm:ss A').format('HH:mm:ss');
                    var resourceRender = function (resourceObj, labelTds, bodyTds) {
                      const name = '<div class="appnt-pro-name"><h4>' + resourceObj.name + ' </h4> </div>';
                      labelTds.prepend(name);
                    };
                    resources.push(
                      {
                        id: this.individualWorkerId,
                        title: names1,
                        name: names1,
                        businessHours: {
                          start: this.st_time,
                          end: this.ed_time,
                          dow: [0, 1, 2, 3, 4, 5, 6],
                        },
                      }
                    );
                  }
                  const ole = JSON.parse(this.booking);



                  var select = function (start, end, jsEvent, view, selectresource) {
                    let datIndex = 0;
                    const crDate = new Date();
                    // const startDate = new Date(0, 0, 0, parseInt(selectresource.businessHours.start.split(':')[0], 10), 0, 0, 0);
                    // const endDate = new Date(0, 0, 0, parseInt(selectresource.businessHours.end.split(':')[0], 10), 0, 0, 0);
                    const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
                    const endDate = new Date(0, 0, 0, 23, 59, 0, 0);
                    this.TimeData = [];
                    const firstName = $('#firstName').val('');
                    const LastName = $('#lastName').val('');
                    const mobileNumber = $('#mobileNumber').val('');
                    // const mobileCarrier = $('#mobileCarrier').val('');
                    const primaryEmail = $('#primaryEmail').val('');
                    const listServices = $('#listServices').val('');
                    const sumDuration = $('#sumDuration').val('');
                    const textArea = $('#textArea').val('');
                    const visitType = $('#visitType').val('');
                    do {
                      let elem = '';
                      if (startDate.getHours() < 12) {
                        if (startDate.getHours() === 0) {
                          elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                        } else {
                          elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                        }
                      } else {
                        if ((startDate.getHours() - 12) === 0) {
                          elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                        } else {
                          elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                        }
                      }
                      this.TimeData.push(elem);
                      if (crDate.getHours() < startDate.getHours()) {
                        datIndex++;
                      }

                      startDate.setMinutes(startDate.getMinutes() + ole);
                    }
                    while (startDate < endDate);
                    this.expressBookingStart = selectresource.businessHours.start;      // worker start
                    this.expressBookingEnd = selectresource.businessHours.end;         // worker end
                    this.startDateTime = start.format();
                    this.end = end.format();
                    $('#myModal').show();
                    const appoitmentdate = $('#CalendarDate').val(calendarDate);    // date of appointments
                    const appoitmentdate2 = $('#CalendarDate2').val(calendarDate);
                    const dateAndTime = $('#startDateTime').val(this.startDateTime);  // in this date with time
                    const dateAndTime2 = $('#expressstartDateTime').val(this.startDateTime);

                    let selTimOpt = '';
                    const hrs = parseInt(start.format().split('T')[1].split(':')[0], 10);
                    const min = parseInt(start.format().split('T')[1].split(':')[1], 10);

                    if (hrs < 12) {
                      if (hrs === 0) {
                        selTimOpt = '12:' + ('0' + min).slice(-2) + ' AM';
                      } else {
                        selTimOpt = ('0' + hrs).slice(-2) + ':' + ('0' + min).slice(-2) + ' AM';
                      }
                    } else {
                      if ((hrs - 12) === 0) {
                        selTimOpt = '12:' + ('0' + min).slice(-2) + ' PM';
                      } else {
                        selTimOpt = ('0' + (hrs - 12)).slice(-2) + ':' + ('0' + min).slice(-2) + ' PM';
                      }
                    }
                    const selectBox = <HTMLSelectElement>document.getElementById('times');
                    selectBox.options.length = 0;
                    for (let i = 0; i < this.TimeData.length; i++) {
                      const optionVal = this.TimeData[i];
                      const opt3 = new Option(optionVal, optionVal);
                      opt3.className = 'select-bg-option';
                      selectBox.options.add(opt3);
                    }
                    selectBox.value = selTimOpt; // main time

                    const selectBox1 = <HTMLSelectElement>document.getElementById('expresstimes');
                    selectBox1.options.length = 0;
                    for (let i = 0; i < this.TimeData.length; i++) {
                      const optionVal = this.TimeData[i];
                      const opt3 = new Option(optionVal, optionVal);
                      opt3.className = 'select-bg-option';
                      selectBox1.options.add(opt3);
                    }
                    selectBox1.value = selTimOpt;

                    this.expressBookinWorkerName = $('#workername').val(selectresource.title);       //   worker name
                    this.expressBookinWorkerName = $('#expressworkername').val(selectresource.title);
                    const worSel = <HTMLSelectElement>document.getElementById('workerIds');          // worker id
                    worSel.value = selectresource.id;
                    const worSel2 = <HTMLSelectElement>document.getElementById('expressworkerId');
                    worSel2.value = selectresource.id;
                    const modal = document.getElementById('myModal');
                    const btn = document.getElementById('myBtn');
                    $('#cancelExpress').click(function () {
                      $('#myModal').hide();
                    });
                    $('.close').click(function () {
                      $('#myModal').hide();
                    });
                  };
                  const calObj = {
                    defaultView: 'agendaDay',
                    defaultDate: this.cldDate,
                    editable: true,
                    selectable: true,
                    eventLimit: true,
                    allDaySlot: false,
                    allDayDefault: false,
                    slotEventOverlap: true,
                    minTime: MinTime,
                    maxTime: MaxTime,
                    // weekends: false,
                    slotLabelInterval: '00:' + (JSON.parse(this.booking)) + ':00',
                    slotDuration: '00:' + (JSON.parse(this.booking)) + ':00',
                    header: {
                      left: '',
                      center: 'prev,title,next',
                      right: ''
                    },
                    slotLabelFormat: [
                      'h(:mm) a'
                    ],
                    viewRender: function (view, element) {
                      const s = '<div class="appnt-pro-name"><h6>TIME</h6> </div>';
                      element.find('.fc-axis:first').html(s);
                    },
                    views: {
                      agendaDay: {
                        type: 'agendaDay',
                        groupByResource: true,
                        titleFormat: 'dddd, MMMM D, YYYY',
                      },
                    },
                    resources: resources,
                    events: this.finalArry1,
                    select: select,
                    eventDrop: function (event, delta, revertFunc) {
                      const todayMoment = moment();
                      const dayDelta = delta.days();
                      const minuteDelta = delta.hours() * 60 + delta.minutes();
                      const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                      const todayDate = todayMoment.year() * 10000 + (todayMoment.month() + 1) * 100 + todayMoment.date();
                      if (event.status === 'Canceled' || event.status === 'Complete') {
                        swal({
                          text: 'The App is cancelled or completed stage',
                          timer: 2000,
                          buttons: false,
                        });
                        revertFunc();
                        return;
                      } else if (eventStartDate < todayDate) {
                        swal({
                          text: 'Appointment cannot be moved. Either the appointment is in the past or is being moved into the past.',
                          icon: 'warning',
                          button: 'ok',
                        });
                        revertFunc();
                        return;
                      } else {
                        const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                        if (event.start._f === 'YYYY-MM-DDTHH:mm:ss') {
                          const eventStartTime = moment(eventDate + event.start._i + event.start._i, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm');
                          const eventEndTime = moment(eventDate + event.end._i + event.end._i, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm');
                          const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                          const duration = startAndEnd.asMinutes();
                          $.ajax({
                            type: 'POST',
                            url: (apiEndPoint + '/api/calendarEventsUpdates'),
                            beforeSend: function (request) {
                              request.setRequestHeader('token', localStorage.getItem('token'));
                            },
                            data: {
                              // 'clientID': event.clientID,
                              // 'status': event.status,
                              // 'title': event.title,
                              // 'textColor': event.textColor,
                              // 'color': event.color,
                              'apptId': event.apptId,
                              'resourceId': event.resourceId,
                              'ticket_service_id': event.ticket_service_id,
                              'eventStartTime': eventStartTime,
                              'duration': duration
                            },
                            success: function (dataString, textStatus, request) {
                              swal({
                                text: 'Appointment Updated Successfully',
                                timer: 2000,
                                buttons: false
                              });
                              localStorage.setItem('token', request.getResponseHeader('token'));
                            }
                          });
                        } else if (event.start._f === '' || event.start._f === undefined) {
                          if (event.start._i[3] < 10) {
                            event.start._i[3] = '0' + event.start._i[3];
                          } else {
                            event.start._i[3] = event.start._i[3];
                          }
                          const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                          const eventEndTime = moment(eventDate + event.end._i[3] + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                          const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                          const duration = startAndEnd.asMinutes();
                          $.ajax({
                            type: 'POST',
                            url: (apiEndPoint + '/api/calendarEventsUpdates'),
                            beforeSend: function (request) {
                              request.setRequestHeader('token', localStorage.getItem('token'));
                            },
                            data: {
                              'apptId': event.apptId,
                              'resourceId': event.resourceId,
                              'ticket_service_id': event.ticket_service_id,
                              'eventStartTime': eventStartTime,
                              'duration': duration
                            },
                            success: function (dataString, textStatus, request) {
                              swal({
                                text: 'Appointment Updated Successfully',
                                timer: 2000,
                                buttons: false
                              });
                              localStorage.setItem('token', request.getResponseHeader('token'));
                            }
                          });
                        } else {
                          swal({
                            text: 'Unable to move Appt ,refresh page and try again',
                            timer: 2000,
                            buttons: false
                          });
                          revertFunc();
                          return;
                        }
                      }
                    },
                    eventResize: function (event, delta, revertFunc) {
                      const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                      const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                      if (event.start._i[3] < 10) {
                        event.start._i[3] = '0' + event.start._i[3];
                      } else {
                        event.start._i[3] = event.start._i[3];
                      }
                      const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                      const eventEndTime = moment(eventDate + event.end._i[3] + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                      const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                      const duration = startAndEnd.asMinutes();
                      $.ajax({
                        type: 'POST',
                        url: (apiEndPoint + '/api/calendarEventsUpdates'),
                        beforeSend: function (request) {
                          request.setRequestHeader('token', localStorage.getItem('token'));
                        },
                        data: {
                          'apptId': event.apptId,
                          'resourceId': event.resourceId,
                          'ticket_service_id': event.ticket_service_id,
                          'eventStartTime': eventStartTime,
                          'duration': duration
                        },
                        success: function (dataString, textStatus, request) {
                          swal({
                            text: 'Appointment Updated Successfully',
                            timer: 2000,
                            buttons: false
                          });
                          localStorage.setItem('token', request.getResponseHeader('token'));
                        }
                      });
                    },
                    resourceRender: resourceRender,
                    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
                  };
                  $('#calendar').fullCalendar('destroy');
                  this.loadCalender(calObj);
                } else {
                  $('#calendar').fullCalendar('destroy');
                  this.appointmentsList = [];
                }
              }, error => {
              });
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
    } else if (value === 'all' && this.selWeek === 'One Day') {
      this.allWorkers();
    } else if ((value === 'all' && this.selWeek === 'One Week') || (value === 'all' && this.selWeek === 'One Weekday')) {
      this.toastr.warning('One Week or One Weekday view requires selection of a Worker', null, { timeOut: 6000 });
    }
  }

  allWorkers() {
    var apiEndPoint = this.apiEndPoint;
    if (this.selWorker === 'all' && this.selWeek === 'One Day') {
      const events = [];
      const CalendatDate = moment(this.chooseDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      this.appointmentsServices.getAppontmentList(this.cldDate).subscribe(
        data => {
          this.calendarUsersListing = data['result'];
          for (let i = 0; i < this.calendarUsersListing.length; i++) {
            if (this.calendarUsersListing[i].status !== 'Canceled') {
              if (this.calendarUsersListing[i].status === 'Conflicting') {
                this.borderColor[i] = this.conflicting;
              } else if (this.calendarUsersListing[i].status === 'Checked In') {
                this.borderColor[i] = this.checkedIn;
              } else if (this.calendarUsersListing[i].status === 'Booked') {
                this.borderColor[i] = this.booked;
              } else if (this.calendarUsersListing[i].status === 'Complete') {
                this.borderColor[i] = this.complete;
              } else if (this.calendarUsersListing[i].status === 'Called') {
                this.borderColor[i] = this.called;
              } else if (this.calendarUsersListing[i].status === 'Canceled') {
                this.borderColor[i] = this.canceled;
              } else if (this.calendarUsersListing[i].status === 'Confirmed') {
                this.borderColor[i] = this.confirmed;
              } else if (this.calendarUsersListing[i].status === 'Reminder Sent') {
                this.borderColor[i] = this.reminderSent;
              } else if (this.calendarUsersListing[i].status === 'No Show') {
                this.borderColor[i] = this.noShow;
              } else if (this.calendarUsersListing[i].status === 'Pending Deposit') {
                this.borderColor[i] = this.pendingDeposit;
              }

              this.calendarUsersListing[i].Service_Date_Time__c = this.calendarUsersListing[i].Service_Date_Time__c;
              this.serviceStartTime = moment(this.calendarUsersListing[i].Service_Date_Time__c).format().split('+')[0];
              const durationInMinutes = this.calendarUsersListing[i].Duration__c;   // duration
              this.serviceEndTime = moment(this.serviceStartTime).add(durationInMinutes, 'minutes').format().split('+')[0];
              // let symbol: any;
              // if (this.calendarUsersListing[i].Notes__c != null && this.calendarUsersListing[i].Notes__c.length > 0) {
              //   symbol = this.appt_note_symbol;
              // }
              let booked: any;
              let userName: any;
              if (this.calendarUsersListing[i].Name === 'null' || this.calendarUsersListing[i].Name === null) {
                userName = 'No Client';
              } else {
                userName = this.calendarUsersListing[i].Name;
              }
              // '&#8727;' = *
              // '&#8857;' = online booking
              // '&#9839;' = # bookout
              // '&#9834;' = note

              const bookOut = this.calendarUsersListing[i].Is_Booked_Out__c;
              const notes = this.calendarUsersListing[i].Notes__c;
              const newClient = this.calendarUsersListing[i].New_Client__c;
              const asterix = this.calendarUsersListing[i].Appt_Icon;   // it mean more than one service is booked for that *
              const serviceNames = this.calendarUsersListing[i].serviceName;
              const onlineBooking = this.calendarUsersListing[i].Booked_Online__c;
              const standing = this.calendarUsersListing[i].standing;

              if (onlineBooking === 1) {
                if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  booked = '&#8857; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  booked = '&#8857; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  booked = '&#8857; ' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  booked = '&#8857; ' + '&#9834; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  booked = '&#8857; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  booked = '&#8857; ' + '&#8727; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  booked = '&#8857; ' + '&#9834; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  booked = '&#8857; ' + '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
                }
              }

              if (onlineBooking === 0) {

                if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  booked = '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  booked = '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  booked = '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  booked = '&#9834; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  booked = userName + '/' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  booked = '&#8727; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  booked = '&#9834; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  booked = '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
                }
              }

              if (standing === 1) {
                if (newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  booked = '&#9839;' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  booked = '&#9839;' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  booked = '&#9839;' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  booked = '&#9839;' + '&#9834' + '&#8727' + + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  booked = '&#9839;' + userName + '/' + serviceNames;
                } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  booked = '&#9839;' + '&#8727;' + userName + '/' + serviceNames;
                } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  booked = '&#9839;' + '&#9834;' + userName + '/' + serviceNames;
                } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  booked = '&#9839;' + '&#9834;' + '&#8727;' + userName + '/' + serviceNames;
                }

              }
              if (bookOut === 1 && notes !== '') {
                booked = '&#9834; ' + 'Book Out Time';
              } else if (bookOut === 1 && notes === '') {
                booked = 'Book Out Time';
              }
              let clientIDs: any;
              if (this.calendarUsersListing[i].clientID === '') {
                clientIDs = null;
              } else {
                clientIDs = this.calendarUsersListing[i].clientID;
              }
              events.push(
                {
                  'resourceId': this.calendarUsersListing[i].Worker__c,
                  'apptId': this.calendarUsersListing[i].Appt_Ticket__c,
                  'ticket_service_id': this.calendarUsersListing[i].tsid,
                  'title': booked,
                  'start': this.serviceStartTime,
                  'end': this.serviceEndTime,
                  'textColor': 'black',
                  'borderColor': this.borderColor[i],
                  'color': this.calendarUsersListing[i].serviceGroupColor,
                  'clientID': clientIDs,
                  'status': this.calendarUsersListing[i].status,
                  'className': this.calendarUsersListing[i].tsid
                },
              );
            }
          }
          var resourceRender = function (resourceObj, labelTds, bodyTds) {
            const name = '<div class="appnt-pro-name"><h6>' + resourceObj.name + ' </h6> </div>';
            labelTds.prepend(name);
            let homeimage = '';
            if (resourceObj.imagesUrl && resourceObj.imagesUrl !== '') {
              homeimage = '<div class="appnt-pro-image">' +
                '<img src="' + resourceObj.api + '/' + resourceObj.imagesUrl + '"  width="58" height="48"  '
                + 'onerror=this.src="assets/images/user-icon.png"></div>';
            } else {
              homeimage = '<div class="appnt-pro-image">' +
                '<div class="appnt-pro-letter"><strong>' + resourceObj.name[0].toUpperCase() + ' </strong></div></div>';
            }
            // labelTds.prepend(names);
            labelTds.prepend(homeimage);
            // labelTds.css('background-color', resourceObj.color);
            // labelTds.css('color', resourceObj.textColor);
          };
          this.appointmentsServices.fetchingActiveMembers(this.apptDate.split(' ')[2], this.cldDate).subscribe(
            data1 => {
              if (data1['result'] === null || data1['result'].length === 0) {
                this.toastr.warning('No works schedule.', null, { timeOut: 4000 });
                $('#calendar').fullCalendar('destroy');
              }
              this.eventCalendar = data1['result'];
              const resources = [];
              const bussinessHrs = [];
              const year = this.datePickerDate.date.year;
              const month = this.datePickerDate.date.month;
              const day = this.datePickerDate.date.day;

              for (let p = 0; p < this.eventCalendar.length; p++) {
                if (this.eventCalendar[p].workerId !== undefined && this.eventCalendar[p].names !== null) {
                  const st = this.eventCalendar[p].start;
                  const ed = this.eventCalendar[p].end;
                  const names1 = this.eventCalendar[p].names;
                  const image = this.eventCalendar[p].image;
                  const workerId = this.eventCalendar[p].workerId;
                  const start1 = moment(st, ['h:mm A']).format('HH:mm');
                  const end1 = moment(ed, ['h:mm A']).format('HH:mm');
                  resources.push(
                    {
                      id: workerId,
                      imagesUrl: image,
                      title: names1,
                      name: names1,
                      api: this.apiEndPoints,
                      // color: 'gray',
                      // textColor: 'black',
                      businessHours: {
                        start: start1,
                        end: end1,
                        dow: [0, 1, 2, 3, 4, 5, 6],
                      },
                    }
                  );
                  bussinessHrs.push(
                    {
                      dow: [0, 1, 2, 3, 4, 5, 6],               // Sunday - satarday
                      start: start1,
                      end: end1,
                    });
                  const finMin = moment(st, 'h:mm:ss A').format('LTS').split(':')[0];
                  const finMax = moment(ed, 'h:mm:ss A').format('HH:mm:ss').split(':')[0];
                  if (finMin < this.finalMin || p === 0) {
                    this.finalMin = finMin;
                  }
                  if (finMax > this.finalMax || p === 0) {
                    this.finalMax = finMax;
                  }

                  const ole = JSON.parse(this.booking);
                  var select = function (start, end, jsEvent, view, selectresource) {
                    let datIndex = 0;
                    const crDate = new Date();
                    // const startDate = new Date(0, 0, 0, parseInt(selectresource.businessHours.start.split(':')[0], 10), 0, 0, 0);
                    // const endDate = new Date(0, 0, 0, parseInt(selectresource.businessHours.end.split(':')[0], 10), 0, 0, 0);
                    const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
                    const endDate = new Date(0, 0, 0, 23, 59, 0, 0);
                    this.TimeData = [];
                    const firstName = $('#firstName').val('');
                    const LastName = $('#lastName').val('');
                    const mobileNumber = $('#mobileNumber').val('');
                    // const mobileCarrier = $('#mobileCarrier').val('');
                    const primaryEmail = $('#primaryEmail').val('');
                    const listServices = $('#listServices').val('');
                    const sumDuration = $('p sumDuration').val('');
                    const textArea = $('#textArea').val('');
                    const visitType = $('#visitType option').val('');
                    do {
                      let elem = '';
                      if (startDate.getHours() < 12) {
                        if (startDate.getHours() === 0) {
                          elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                        } else {
                          elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                        }
                      } else {
                        if ((startDate.getHours() - 12) === 0) {
                          elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                        } else {
                          elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                        }
                      }
                      this.TimeData.push(elem);
                      if (crDate.getHours() < startDate.getHours()) {
                        datIndex++;
                      }
                      startDate.setMinutes(startDate.getMinutes() + ole);
                    }

                    while (startDate < endDate);
                    this.expressBookingStart = selectresource.businessHours.start;      // worker start
                    this.expressBookingEnd = selectresource.businessHours.end;         // worker end
                    this.startDateTime = start.format();
                    this.end = end.format();
                    $('#myModal').show();
                    let appoitmentdate: any;
                    let expressDate2: any;
                    let skipCalendarDate: any;
                    let calendarDates: any;
                    calendarDates = moment(this.startDateTime).format('MM/DD/YYYY');
                    if (this.timeSlot) {
                      appoitmentdate = $('#CalendarDate').val(calendarDates);
                      expressDate2 = $('#CalendarDate2').val(calendarDates);
                      skipCalendarDate = $('#skipCalendarDate').val(calendarDates);
                    } else if (this.timeSlot === '' || this.timeSlot === undefined) {
                      appoitmentdate = $('#CalendarDate').val(calendarDates);    // date of appointments
                      expressDate2 = $('#CalendarDate2').val(calendarDates);
                      skipCalendarDate = $('#skipCalendarDate').val(calendarDates);
                    }
                    const dateAndTime = $('#startDateTime').val(this.startDateTime);  // in this date with time
                    const dateAndTime2 = $('#expressstartDateTime').val(this.startDateTime);  // in this date with time
                    const skipdateAndTime = $('#skipdateAndTime').val(this.startDateTime);  // in this date with time

                    let selTimOpt = '';
                    const hrs = parseInt(start.format().split('T')[1].split(':')[0], 10);
                    const min = parseInt(start.format().split('T')[1].split(':')[1], 10);

                    if (hrs < 12) {
                      if (hrs === 0) {
                        selTimOpt = '12:' + ('0' + min).slice(-2) + ' AM';
                      } else {
                        selTimOpt = ('0' + hrs).slice(-2) + ':' + ('0' + min).slice(-2) + ' AM';
                      }
                    } else {
                      if ((hrs - 12) === 0) {
                        selTimOpt = '12:' + ('0' + min).slice(-2) + ' PM';
                      } else {
                        selTimOpt = ('0' + (hrs - 12)).slice(-2) + ':' + ('0' + min).slice(-2) + ' PM';
                      }
                    }
                    let selectBox: any;
                    selectBox = <HTMLSelectElement>document.getElementById('times');
                    selectBox.options.length = 0;
                    for (let i = 0; i < this.TimeData.length; i++) {
                      const optionVal = this.TimeData[i];
                      const opt = new Option(optionVal, optionVal);
                      opt.className = 'select-bg-option';
                      selectBox.options.add(opt);
                    }
                    selectBox.value = selTimOpt;
                    const selectBox2 = <HTMLSelectElement>document.getElementById('expresstimes');
                    selectBox2.options.length = 0;
                    for (let i = 0; i < this.TimeData.length; i++) {
                      const optionVal = this.TimeData[i];
                      const opt2 = new Option(optionVal, optionVal);
                      opt2.className = 'select-bg-option';
                      selectBox2.options.add(opt2);
                    }
                    selectBox2.value = selTimOpt;

                    const selectBox3 = <HTMLSelectElement>document.getElementById('skiptimes');
                    selectBox3.options.length = 0;
                    for (let i = 0; i < this.TimeData.length; i++) {
                      const optionVal = this.TimeData[i];
                      const opt3 = new Option(optionVal, optionVal);
                      opt3.className = 'select-bg-option';
                      selectBox3.options.add(opt3);
                    }
                    selectBox3.value = selTimOpt;                          // main time
                    this.expressBookinWorkerName = $('#workername').val(selectresource.title);       //   worker name
                    const BookinWorkerName = $('#expressworkername').val(selectresource.title);       //   worker name
                    const skipworkername = $('#skipworkername').val(selectresource.title);           // worker name

                    const workedrId = $('#workerId').val(selectresource.id);
                    const expressworkerId = $('#expressworkerId').val(selectresource.id);
                    const skipexpressworkerId = $('#skipexpressworkerId').val(selectresource.id);

                    const worSel = <HTMLSelectElement>document.getElementById('workerIds');           // here
                    worSel.value = selectresource.id;

                    const worSel2 = <HTMLSelectElement>document.getElementById('ExpworkerIds');          // worker id
                    worSel2.value = selectresource.id;

                    const worSel3 = <HTMLSelectElement>document.getElementById('skipworkerIds');          // worker id
                    worSel3.value = selectresource.id;

                    const modal = document.getElementById('myModal');
                    const btn = document.getElementById('myBtn');
                    $('#cancelExpress').click(function () {
                      $('#myModal').hide();
                    });
                  };
                }
              }
              let MaxStartTime = '';
              let MaxEndTime = '';
              const durationInMinutes1 = '-60';
              const durationInMinutes2 = '60';
              if (this.eventCalendar[0].min !== null && this.eventCalendar[0].max !== null) {
                MaxStartTime = moment(this.eventCalendar[0].min + ':' + '00', 'HH:mm').add(durationInMinutes1, 'minutes').format('HH' + ':00');
                MaxEndTime = moment(this.eventCalendar[0].max + ':' + '00', 'HH:mm').add(durationInMinutes2, 'minutes').format('HH' + ':00');
                if (MaxEndTime === '00:00') {
                  MaxEndTime = '23:59';
                } else if (MaxStartTime === '23:00') {
                  MaxStartTime = '00:00';
                }
              } else {
                MaxStartTime = moment(this.finalMin, 'h:mm:ss A').add(durationInMinutes1, 'minutes').format('HH:mm');
                MaxEndTime = moment(this.finalMax, 'h:mm:ss A').add(durationInMinutes2, 'minutes').format('HH:mm');
              }
              const hideShowAll = this.eventCalendar[0].View_Only_My_Appointments__c;
              this.weekdayDateDisplay = '';
              const calObj = {
                defaultView: 'agendaDay',
                defaultDate: this.cldDate,
                editable: true,
                selectable: true,
                eventLimit: true,
                allDaySlot: false,
                weekends: true,
                slotEventOverlap: true,
                eventOverlap: true,
                minTime: MaxStartTime,
                maxTime: MaxEndTime,
                allDayDefault: false,
                slotLabelInterval: '00:' + (JSON.parse(this.booking)) + ':00',
                slotDuration: '00:' + (JSON.parse(this.booking)) + ':00',
                viewSubSlotLabel: true,
                header: {
                  left: '',
                  center: 'prev,title,next',
                  right: ''
                },
                viewRender: function (view, element) {
                  if (hideShowAll !== 1) {
                    var title = this.dateCatch;
                    const chked = localStorage.getItem('wokersChkd');
                    const s = '<div  id="myId"><input id="workerCheckerd" ' + chked + ' type="checkbox"/> '
                      + '<label for="workerCheckerd">Show All Workers</label></div><div class="appnt-pro-name"><h6>TIME</h6> </div>';
                    element.find('.fc-axis:first').html(s);
                    const u: any = document.getElementById('workerCheckerd');
                    u.checked = false;
                  } else if (hideShowAll === 1) {
                    const chked = localStorage.getItem('wokersChkd');
                    const s = '<div id="myId"></div><div class="appnt-pro-name"><h6>TIME</h6> </div>';
                    element.find('.fc-axis:first').html(s);
                  }
                },
                views: {
                  agendaDay: {
                    type: 'agendaDay',
                    groupByResource: true,
                    titleFormat: 'dddd, MMMM D, YYYY',
                  },
                },
                slotLabelFormat: [
                  'h(:mm) a'
                ],
                resources: resources,
                resourceRender: resourceRender,
                events: events,
                select: select,
                eventDrop: function (event, delta, revertFunc) {
                  const todayMoment = moment();
                  const dayDelta = delta.days();
                  const minuteDelta = delta.hours() * 60 + delta.minutes();
                  const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                  const todayDate = todayMoment.year() * 10000 + (todayMoment.month() + 1) * 100 + todayMoment.date();
                  if (event.status === 'Canceled' || event.status === 'Complete') {
                    swal({
                      text: 'The App is cancelled or completed stage',
                      timer: 2000,
                      buttons: false,
                    });
                    revertFunc();
                    return;
                  } else if (eventStartDate < todayDate) {
                    swal({
                      text: 'Appointment cannot be moved. Either the appointment is in the past or is being moved into the past.',
                      icon: 'warning',
                      button: 'ok',
                    });
                    revertFunc();
                    return;
                  } else {
                    const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                    if (event.start._f === 'YYYY-MM-DDTHH:mm:ss') {
                      const eventStartTime = moment(eventDate + event.start._i + event.start._i, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm');
                      const eventEndTime = moment(eventDate + event.end._i + event.end._i, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm');
                      const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                      const duration = startAndEnd.asMinutes();
                      if (eventStartTime === 'Invalid date') {
                        swal({
                          text: 'Unable to move appt try after some time',
                          icon: 'warning',
                          button: 'ok',
                        });
                        revertFunc();
                        return;
                      }
                      if (eventStartTime !== 'Invalid date') {
                        $.ajax({
                          type: 'POST',
                          url: (apiEndPoint + '/api/calendarEventsUpdates'),
                          beforeSend: function (request) {
                            request.setRequestHeader('token', localStorage.getItem('token'));
                          },
                          data: {
                            // 'clientID': event.clientID,
                            // 'status': event.status,
                            // 'title': event.title,
                            // 'textColor': event.textColor,
                            // 'color': event.color,
                            'apptId': event.apptId,
                            'resourceId': event.resourceId,
                            'ticket_service_id': event.ticket_service_id,
                            'eventStartTime': eventStartTime,
                            'duration': duration
                          },
                          success: function (dataString, textStatus, request) {
                            swal({
                              text: 'Appointment Updated Successfully',
                              timer: 2000,
                              buttons: false
                            });
                            localStorage.setItem('token', request.getResponseHeader('token'));
                          }
                        });
                      }
                    } else if (event.start._f === '' || event.start._f === undefined) {
                      if (event.start._i[3] < 10) {
                        event.start._i[3] = '0' + event.start._i[3];
                      } else {
                        event.start._i[3] = event.start._i[3];
                      }
                      const eventStartTime = moment(eventDate + ' ' + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                      const eventEndTime = moment(eventDate + ' ' + event.end._i[3] + ':' + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                      const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                      const duration = startAndEnd.asMinutes();
                      if (eventStartTime === 'Invalid date') {
                        swal({
                          text: 'Unable to move appt try after some time',
                          icon: 'warning',
                          button: 'ok',
                        });
                        revertFunc();
                        return;
                      }
                      if (eventStartTime !== 'Invalid date') {
                        $.ajax({
                          type: 'POST',
                          url: (apiEndPoint + '/api/calendarEventsUpdates'),
                          beforeSend: function (request) {
                            request.setRequestHeader('token', localStorage.getItem('token'));
                          },
                          data: {
                            'apptId': event.apptId,
                            'resourceId': event.resourceId,
                            'ticket_service_id': event.ticket_service_id,
                            'eventStartTime': eventStartTime,
                            'duration': duration
                          },
                          success: function (dataString, textStatus, request) {
                            swal({
                              text: 'Appointment Updated Successfully',
                              timer: 2000,
                              buttons: false
                            });
                            localStorage.setItem('token', request.getResponseHeader('token'));
                          }
                        });
                      } else {
                        swal({
                          text: 'Unable to move Appt ,refresh page and try again',
                          timer: 2000,
                          buttons: false
                        });
                        revertFunc();
                        return;
                      }
                    }
                  }
                },
                eventResize: function (event, delta, revertFunc) {
                  const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                  const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                  if (event.start._i[3] < 10) {
                    event.start._i[3] = '0' + event.start._i[3];
                  } else {
                    event.start._i[3] = event.start._i[3];
                  }
                  const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                  const eventEndTime = moment(eventDate + ' ' + event.end._i[3] + ':' + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                  const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                  const duration = startAndEnd.asMinutes();
                  if (eventStartTime !== 'Invalid date' || duration.toString() !== 'Invalid date') {
                    $.ajax({
                      type: 'POST',
                      url: (apiEndPoint + '/api/calendarEventsUpdates'),
                      beforeSend: function (request) {
                        request.setRequestHeader('token', localStorage.getItem('token'));
                      },
                      data: {
                        'apptId': event.apptId,
                        'resourceId': event.resourceId,
                        'ticket_service_id': event.ticket_service_id,
                        'eventStartTime': eventStartTime,
                        'duration': duration
                      },
                      success: function (dataString, textStatus, request) {
                        swal({
                          text: 'Appointment Updated Successfully',
                          timer: 2000,
                          buttons: false
                        });
                        localStorage.setItem('token', request.getResponseHeader('token'));
                      }
                    });
                  } else {
                    swal({
                      text: 'Unable to move appt try after some time',
                      icon: 'warning',
                      button: 'ok',
                    });
                    revertFunc();
                    return;
                  }

                },
                businessHours: bussinessHrs,
                selectConstraint: 'businessHours',
                schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
              };
              $('#calendar').fullCalendar('destroy');
              this.loadCalender(calObj);
            },
            error => {
            });
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
    } else if (this.selWorker !== 'all' && this.selWeek === 'One Week') {
      this.fetchWeek('');
    } else if (this.selWorker !== 'all' && this.selWeek === 'One Weekday') {
      this.fetchWeek('');
    }
  }

  fetchWeek(event) {
    const value = event;
    this.callenderIcons.forEach(element => {
      if (element.id === event) {
        element.opacity = '';
      } else {
        element.opacity = '0.5';
      }
    });
    if (event) {
      this.selWeek = event;
      var apiEndPoint = this.apiEndPoint;

      if ((this.selWorker === 'All' && this.selWeek === 'One Day') || (this.selWorker === 'all' && this.selWeek === 'One Day')) {
        this.allWorkers();
      } else if (this.selWorker !== 'all' && this.selWeek === 'One Week') {
        const CalendatDate = moment(this.cldDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const particularWorkname = this.selWorker.split('$')[0];
        const startOfWeek = moment(CalendatDate).startOf('week');
        const endOfWeek = moment(CalendatDate).endOf('week');
        const startOfWeek1 = moment(startOfWeek).format('YYYY-MM-DD');
        const endOfWeek1 = moment(endOfWeek).format('YYYY-MM-DD');

        this.appointmentsServices.getWorkerWeek(this.selWorker.split('$')[0], this.cldDate, this.selWeek).subscribe(
          data => {
            this.individualWorkerWeek = data['result'];
            let Min;
            let Max;
            const MinTimesInMinutes = '-60';
            const MaxTimesInMinutes = '60';
            Min = moment(this.individualWorkerWeek[0]['min'], 'H').add(MinTimesInMinutes, 'minutes').format('HH:mm');
            Max = moment(this.individualWorkerWeek[0]['max'], 'H').add(MaxTimesInMinutes, 'minutes').format('HH:mm');
            if (Min === '23:00') {
              Min = '00:00';
            }
            if (Max === '00:00') {
              Max = '23:59';
            }
            const worker_Id = this.individualWorkerWeek[0].Id;
            const worker_Name = this.individualWorkerWeek[0].FirstName;
            const index = this.individualWorkerWeek.findIndex((result) => isNullOrUndefined(result['tsid']));
            const workerTimings = this.individualWorkerWeek.splice(index, 1)[0];
            let calWeekDates = [];
            calWeekDates = this.apptWeekCalculate(workerTimings);
            const events = [];
            const resources = [];
            const bussinessHrs = [];
            this.borderColor = [];

            for (let i = 0; i < this.individualWorkerWeek.length; i++) {
              if (this.individualWorkerWeek[i].status === 'Conflicting') {
                this.borderColor = this.conflicting;
              } else if (this.individualWorkerWeek[i].status === 'Checked In') {
                this.borderColor = this.checkedIn;
              } else if (this.individualWorkerWeek[i].status === 'Booked') {
                this.borderColor = this.booked;
              } else if (this.individualWorkerWeek[i].status === 'Complete') {
                this.borderColor = this.complete;
              } else if (this.individualWorkerWeek[i].status === 'Called') {
                this.borderColor = this.called;
              } else if (this.individualWorkerWeek[i].status === 'Canceled') {
                this.borderColor = this.canceled;
              } else if (this.individualWorkerWeek[i].status === 'Confirmed') {
                this.borderColor = this.confirmed;
              } else if (this.individualWorkerWeek[i].status === 'Reminder Sent') {
                this.borderColor = this.reminderSent;
              } else if (this.individualWorkerWeek[i].status === 'No Show') {
                this.borderColor = this.noShow;
              } else if (this.individualWorkerWeek[i].status === 'Pending Deposit') {
                this.borderColor = this.pendingDeposit;
              }



              let oneWeekList: any;
              let userName: any;
              if (this.individualWorkerWeek[i].Name === '' || this.individualWorkerWeek[i].Name === null) {
                userName = 'No Client';
              } else {
                userName = this.individualWorkerWeek[i].Name;
              }
              // '&#8727;' = *
              // '&#8857;' = online booking
              // '&#9839;' = #
              // '&#9834;' = note
              const bookOut = this.individualWorkerWeek[i].Is_Booked_Out__c;
              const notes = this.individualWorkerWeek[i].Notes__c;
              const newClient = this.individualWorkerWeek[i].New_Client__c;
              const asterix = this.individualWorkerWeek[i].Appt_Icon;   // it mean more than one service is booked for that *
              const serviceNames = this.individualWorkerWeek[i].serviceName;
              const onlineBooking = this.individualWorkerWeek[i].Booked_Online__c;
              const standing = this.individualWorkerWeek[i].standing;

              if (onlineBooking === 1) {
                if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  oneWeekList = '&#8857; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  oneWeekList = '&#8857; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  oneWeekList = '&#8857; ' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  oneWeekList = '&#8857; ' + '&#9834; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  oneWeekList = '&#8857; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  oneWeekList = '&#8857; ' + '&#8727; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  oneWeekList = '&#8857; ' + '&#9834; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  oneWeekList = '&#8857; ' + '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
                }
              }

              if (onlineBooking === 0) {
                if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  oneWeekList = '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  oneWeekList = '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  oneWeekList = '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  oneWeekList = '&#9834; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  oneWeekList = userName + '/' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  oneWeekList = '&#8727; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  oneWeekList = '&#9834; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  oneWeekList = '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
                }
              }

              if (standing === 1) {
                if (newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  oneWeekList = '&#9839;' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  oneWeekList = '&#9839;' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  oneWeekList = '&#9839;' + '&#8727' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  oneWeekList = '&#9839;' + userName + '/' + serviceNames;
                } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  oneWeekList = '&#9839;' + '&#8727; ' + userName + '/' + serviceNames;
                } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  oneWeekList = '&#9839;' + '&#9834;' + userName + '/' + serviceNames;
                } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  oneWeekList = '&#9839;' + '&#9834;' + '&#8727' + userName + '/' + serviceNames;
                }

              }
              if (bookOut === 1 && notes !== '') {
                oneWeekList = '&#9834; ' + 'Book Out Time';
              } else if (bookOut === 1 && notes === '') {
                oneWeekList = 'Book Out Time';
              }
              let clientIDs: any;
              if (this.individualWorkerWeek[i].clientID === '') {
                clientIDs = null;
              } else {
                clientIDs = this.individualWorkerWeek[i].clientID;
              }




              this.serviceStartTime = moment(this.individualWorkerWeek[i].Service_Date_Time__c).format().split('+')[0];
              const durationInMinutes = this.individualWorkerWeek[i].Duration__c;   // duration
              this.serviceEndTime = moment(this.serviceStartTime).add(durationInMinutes, 'minutes').format().split('+')[0];
              // let oneWeekList;
              // let weekPerson;
              // if (this.individualWorkerWeek[i].Name === null || this.individualWorkerWeek[i].Name === 'null') {
              //   weekPerson = 'No Client';
              // } else {
              //   weekPerson = this.individualWorkerWeek[i].Name;
              // }





              // let serviceNames;
              // if (this.individualWorkerWeek[i].serviceName === '' || this.individualWorkerWeek[i].serviceName === undefined) {
              //   serviceNames = '';
              // } else {
              //   serviceNames = this.individualWorkerWeek[i].serviceName;
              // }
              // if (this.individualWorkerWeek[i].New_Client__c === 1) {
              //   oneWeekList = '<span style="color:red;font-weight:bold;">' + weekPerson + '</span> / ' + serviceNames;
              // } else {
              //   oneWeekList = weekPerson + ' / ' + serviceNames;
              // }

              events.push(
                {
                  'resourceId': this.individualWorkerWeek[i].Worker__c,
                  'apptId': this.individualWorkerWeek[i].Appt_Ticket__c,
                  'ticket_service_id': this.individualWorkerWeek[i].tsid,
                  'title': oneWeekList,
                  'start': this.serviceStartTime,
                  'end': this.serviceEndTime,
                  'textColor': 'black',
                  'borderColor': this.borderColor,
                  'color': this.individualWorkerWeek[i].serviceGroupColor,
                  'clientID': this.individualWorkerWeek[i].clientID,
                  'status': this.individualWorkerWeek[i].status,
                  'className': this.individualWorkerWeek[i].tsid,
                }
              );
            }
            const startOfWeek12 = moment(startOfWeek1).startOf('week').format('LL');
            const endOfWeek12 = moment(startOfWeek1).endOf('week').format('LL');
            this.mainApptDate = '';
            this.weekdayDateDisplay = '';
            this.mainApptDate = startOfWeek12 + ' - ' + endOfWeek12;

            let MaxStartTime;
            let MaxEndTime;
            MaxStartTime = moment(this.finalMin, 'h:mm:ss', ).format('LTS').split(' ')[0];
            MaxEndTime = moment(this.finalMax, 'h:mm:ss A').format('HH:mm:ss').split(' ')[0];
            const ole = JSON.parse(this.booking);
            var select = function (start, end, jsEvent, view, selectresource) {

              let datIndex = 0;
              const crDate = new Date();
              const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
              const endDate = new Date(0, 0, 0, 23, 59, 0, 0);
              this.TimeData = [];
              const firstName = $('#firstName').val('');
              const LastName = $('#lastName').val('');
              const mobileNumber = $('#mobileNumber').val('');
              // const mobileCarrier = $('#mobileCarrier').val('');
              const primaryEmail = $('#primaryEmail').val('');
              const listServices = $('#listServices').val('');
              const sumDuration = $('#sumDuration').val('');
              const textArea = $('#textArea').val('');
              const visitType = $('#visitType').val('');
              do {
                let elem = '';
                if (startDate.getHours() < 12) {
                  if (startDate.getHours() === 0) {
                    elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                  } else {
                    elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                  }
                } else {
                  if ((startDate.getHours() - 12) === 0) {
                    elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                  } else {
                    elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                  }
                }
                this.TimeData.push(elem);
                if (crDate.getHours() < startDate.getHours()) {
                  datIndex++;
                }

                startDate.setMinutes(startDate.getMinutes() + ole);
              }
              while (startDate < endDate);
              this.expressBookingStart = MaxStartTime;      // worker start
              this.expressBookingEnd = MaxEndTime;         // worker end
              this.startDateTime = start.format();
              let calendarDates: any;
              calendarDates = moment(this.startDateTime).format('MM/DD/YYYY');
              this.end = end.format();
              $('#myModal').show();


              const appoitmentdate = $('#CalendarDate').val(calendarDates);    // date of appointments
              const expressDate2 = $('#CalendarDate2').val(calendarDates);
              const skipCalendarDate = $('#skipCalendarDate').val(calendarDates);


              const dateAndTime = $('#startDateTime').val(this.startDateTime);  // in this date with time
              const dateAndTime2 = $('#expressstartDateTime').val(this.startDateTime);  // in this date with time
              const skipdateAndTime = $('#skipdateAndTime').val(this.startDateTime);  // in this date with time


              let selTimOpt = '';
              const hrs = parseInt(start.format().split('T')[1].split(':')[0], 10);
              const min = parseInt(start.format().split('T')[1].split(':')[1], 10);

              if (hrs < 12) {
                if (hrs === 0) {
                  selTimOpt = '12:' + ('0' + min).slice(-2) + ' AM';
                } else {
                  selTimOpt = ('0' + hrs).slice(-2) + ':' + ('0' + min).slice(-2) + ' AM';
                }
              } else {
                if ((hrs - 12) === 0) {
                  selTimOpt = '12:' + ('0' + min).slice(-2) + ' PM';
                } else {
                  selTimOpt = ('0' + (hrs - 12)).slice(-2) + ':' + ('0' + min).slice(-2) + ' PM';
                }
              }

              let selectBox: any;
              selectBox = <HTMLSelectElement>document.getElementById('times');
              selectBox.options.length = 0;
              for (let i = 0; i < this.TimeData.length; i++) {
                const optionVal = this.TimeData[i];
                const opt = new Option(optionVal, optionVal);
                opt.className = 'select-bg-option';
                selectBox.options.add(opt);
              }
              selectBox.value = selTimOpt;
              const selectBox2 = <HTMLSelectElement>document.getElementById('expresstimes');
              selectBox2.options.length = 0;
              for (let i = 0; i < this.TimeData.length; i++) {
                const optionVal = this.TimeData[i];
                const opt2 = new Option(optionVal, optionVal);
                opt2.className = 'select-bg-option';
                selectBox2.options.add(opt2);
              }
              selectBox2.value = selTimOpt;

              const selectBox3 = <HTMLSelectElement>document.getElementById('skiptimes');
              selectBox3.options.length = 0;
              for (let i = 0; i < this.TimeData.length; i++) {
                const optionVal = this.TimeData[i];
                const opt3 = new Option(optionVal, optionVal);
                opt3.className = 'select-bg-option';
                selectBox3.options.add(opt3);
              }

              selectBox3.value = selTimOpt;
              this.expressBookinWorkerName = $('#workername').val(selectresource.title);
              const BookinWorkerName = $('#expressworkername').val(selectresource.title);
              const skipworkername = $('#skipworkername').val(selectresource.title);

              const workedrId = $('#workerId').val(selectresource.id);
              const expressworkerId = $('#expressworkerId').val(selectresource.id);
              const skipexpressworkerId = $('#skipexpressworkerId').val(selectresource.id);

              const worSel = <HTMLSelectElement>document.getElementById('workerIds');
              worSel.value = selectresource.id;

              const worSel2 = <HTMLSelectElement>document.getElementById('ExpworkerIds');
              worSel2.value = selectresource.id;

              const worSel3 = <HTMLSelectElement>document.getElementById('skipworkerIds');
              worSel3.value = selectresource.id;


              const modal = document.getElementById('myModal');
              const btn = document.getElementById('myBtn');
              $('#cancelExpress').click(function () {
                $('#myModal').hide();
              });
              $('.close').click(function () {
                $('#myModal').hide();
              });
            };


            resources.push(
              {
                id: worker_Id,
                title: worker_Name,

              });
            const calObj = {
              defaultView: 'agendaWeek',
              defaultDate: startOfWeek1,
              editable: true,
              selectable: true,
              eventLimit: true,
              allDaySlot: false,
              slotEventOverlap: true,
              allDayDefault: false,
              minTime: Min,
              maxTime: Max,
              slotLabelInterval: '00:' + (JSON.parse(this.booking)) + ':00',
              slotDuration: '00:' + (JSON.parse(this.booking)) + ':00',
              weekends: true,
              header: {
                left: '',
                center: 'title',
                right: ''
              },
              slotLabelFormat: [
                'h(:mm) a'
              ],
              viewRender: function (view, element) {
                const s = '<div class="appnt-pro-name"><h6>TIME</h6> </div>';
                element.find('.fc-axis:eq(1)').html(s);
              },
              views: {
                agendaWeek: {
                  type: 'agendaWeek',
                  duration: {
                    days: 7,
                  },
                  title: 'agendaWeek',
                  groupByResource: true,
                  columnFormat: 'ddd M/D',
                },
              },
              resources: resources,
              events: events,
              select: select,
              eventDrop: function (event, delta, revertFunc) {
                const todayMoment = moment();
                const dayDelta = delta.days();
                const minuteDelta = delta.hours() * 60 + delta.minutes();
                const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                const todayDate = todayMoment.year() * 10000 + (todayMoment.month() + 1) * 100 + todayMoment.date();
                const w = moment(new Date()).format('YYYY-MM-DD');   // todat date
                if (event.status === 'Canceled' || event.status === 'Complete') {
                  swal({
                    text: 'The App is cancelled or completed stage',
                    timer: 2000,
                    buttons: false,
                  });
                  revertFunc();
                  return;
                } else if (eventStartDate < todayDate) {
                  swal({
                    text: 'Appointment cannot be moved. Either the appointment is in the past or is being moved into the past.',
                    icon: 'warning',
                    button: 'ok',
                  });
                  revertFunc();
                  return;
                } else if (eventStartDate > todayDate) {
                  const times = (delta['_data'].days * 24 * 60) + (delta['_data'].hours * 60) + delta['_data'].minutes;

                  $.ajax({
                    type: 'POST',
                    url: (apiEndPoint + '/api/calendarEventsUpdatesWeek'),
                    beforeSend: function (request) {
                      request.setRequestHeader('token', localStorage.getItem('token'));
                    },
                    data: {
                      'apptId': event.apptId,
                      'AppTtimes': times,
                    },
                    success: function (dataString, textStatus, request) {
                      swal({
                        text: 'Appointment Updated Successfully',
                        timer: 2000,
                        buttons: false
                      });

                      var el = document.getElementById('ajaxRefreshweek');
                      if (el) {
                        const evObj = document.createEvent('Events');
                        evObj.initEvent('click', true, false);
                        el.dispatchEvent(evObj);
                      }
                      localStorage.setItem('token', request.getResponseHeader('token'));
                    }
                  });
                }
                // } else if (event.start._f === '' || event.start._f === undefined) {
                //   if (event.start._i[3] < 10) {
                //     event.start._i[3] = '0' + event.start._i[3];
                //   } else {
                //     event.start._i[3] = event.start._i[3];
                //   }
                //   const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                //   const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                //   const eventEndTime = moment(eventDate + event.end._i[3] + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                //   const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                //   const duration = startAndEnd.asMinutes();
                //   $.ajax({
                //     type: 'POST',
                //     url: (apiEndPoint + '/api/calendarEventsUpdates'),
                //     beforeSend: function (request) {
                //       request.setRequestHeader('token', localStorage.getItem('token'));
                //     },
                //     data: {
                //       'apptId': event.apptId,
                //       'resourceId': event.resourceId,
                //       'ticket_service_id': event.ticket_service_id,
                //       'eventStartTime': eventStartTime,
                //       'duration': duration
                //     },
                //     success: function (dataString, textStatus, request) {
                //       swal({
                //         text: 'Appointment Updated Successfully',
                //         timer: 2000,
                //         buttons: false
                //       });
                //       localStorage.setItem('token', request.getResponseHeader('token'));
                //     }
                //   });
                // } else {
                //   swal({
                //     text: 'Unable to move Appt ,refresh page and try again',
                //     timer: 2000,
                //     buttons: false
                //   });
                //   revertFunc();
                //   return;
                // }
              },
              eventResize: function (event, delta, revertFunc) {
                const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                if (event.start._i[3] < 10) {
                  event.start._i[3] = '0' + event.start._i[3];
                } else {
                  event.start._i[3] = event.start._i[3];
                }
                const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                const eventEndTime = moment(eventDate + event.end._i[3] + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                const duration = startAndEnd.asMinutes();
                $.ajax({
                  type: 'POST',
                  url: (apiEndPoint + '/api/calendarEventsUpdates'),
                  beforeSend: function (request) {
                    request.setRequestHeader('token', localStorage.getItem('token'));
                  },
                  data: {
                    'apptId': event.apptId,
                    'resourceId': event.resourceId,
                    'ticket_service_id': event.ticket_service_id,
                    'eventStartTime': eventStartTime,
                    'duration': duration
                  },
                  success: function (dataString, textStatus, request) {
                    swal({
                      text: 'Appointment Updated Successfully',
                      timer: 2000,
                      buttons: false
                    });
                    var el = document.getElementById('ajaxRefreshweek');
                    if (el) {
                      const evObj = document.createEvent('Events');
                      evObj.initEvent('click', true, false);
                      el.dispatchEvent(evObj);
                    }

                    localStorage.setItem('token', request.getResponseHeader('token'));
                  }
                });
              },
              selectConstraint: 'businessHours',
              businessHours: calWeekDates,
              schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
            };
            $('#calendar').fullCalendar('destroy');
            this.loadCalender(calObj);
            this.getAppointments(this.chooseDate, this.workerId, this.selWeek);
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




      } else if (this.selWorker !== 'all' && this.selWeek === 'One Weekday') {
        this.appointmentsServices.getWorkerWeek(this.selWorker.split('$')[0], this.cldDate, this.selWeek).subscribe(
          data => {
            this.individualWorkerWeek = [];
            this.individualWorkerWeek = data['result']['finalResult'];
            const worker_Id = data['result']['finaRes'][0].Worker__c;
            // const worker_Name = this.individualWorkerWeek[0].FirstName ? this.individualWorkerWeek[0].FirstName : ;

            // const index = this.individualWorkerWeek.findIndex((result) => isNullOrUndefined(result['tsid']));
            // const workerTimings = this.individualWorkerWeek.splice(index, 1)[0];
            // let calWeekDates = [];
            // if (workerTimings !== undefined) {
            //   calWeekDates = this.apptWeekCalculate(workerTimings);
            // }

            const events = [];
            const resources = [];
            this.borderColor = [];
            for (let i = 0; i < this.individualWorkerWeek.length; i++) {

              if (this.individualWorkerWeek[i].status === 'Conflicting') {
                this.borderColor = this.conflicting;
              } else if (this.individualWorkerWeek[i].status === 'Checked In') {
                this.borderColor = this.checkedIn;
              } else if (this.individualWorkerWeek[i].status === 'Booked') {
                this.borderColor = this.booked;
              } else if (this.individualWorkerWeek[i].status === 'Complete') {
                this.borderColor = this.complete;
              } else if (this.individualWorkerWeek[i].status === 'Called') {
                this.borderColor = this.called;
              } else if (this.individualWorkerWeek[i].status === 'Canceled') {
                this.borderColor = this.canceled;
              } else if (this.individualWorkerWeek[i].status === 'Confirmed') {
                this.borderColor = this.confirmed;
              } else if (this.individualWorkerWeek[i].status === 'Reminder Sent') {
                this.borderColor = this.reminderSent;
              } else if (this.individualWorkerWeek[i].status === 'No Show') {
                this.borderColor = this.noShow;
              } else if (this.individualWorkerWeek[i].status === 'Pending Deposit') {
                this.borderColor = this.pendingDeposit;
              }



              let WeekDayList: any;
              let userName: any;
              if (this.individualWorkerWeek[i].Name === '' || this.individualWorkerWeek[i].Name === null) {
                userName = 'No Client';
              } else {
                userName = this.individualWorkerWeek[i].Name;
              }
              // '&#8727;' = *
              // '&#8857;' = online booking
              // '&#9839;' = #
              // '&#9834;' = note
              const bookOut = this.individualWorkerWeek[i].Is_Booked_Out__c;
              const notes = this.individualWorkerWeek[i].Notes__c;
              const newClient = this.individualWorkerWeek[i].New_Client__c;
              const asterix = this.individualWorkerWeek[i].Appt_Icon;   // it mean more than one service is booked for that *
              const serviceNames = this.individualWorkerWeek[i].serviceName;
              const onlineBooking = this.individualWorkerWeek[i].Booked_Online__c;
              const standing = this.individualWorkerWeek[i].standing;

              if (onlineBooking === 1) {
                if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  WeekDayList = '&#8857; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  WeekDayList = '&#8857; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  WeekDayList = '&#8857; ' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  WeekDayList = '&#8857; ' + '&#9834; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  WeekDayList = '&#8857; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  WeekDayList = '&#8857; ' + '&#8727; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  WeekDayList = '&#8857; ' + '&#9834; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 1 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  WeekDayList = '&#8857; ' + '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
                }
              }

              if (onlineBooking === 0) {
                if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  WeekDayList = '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  WeekDayList = '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  WeekDayList = '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  WeekDayList = '&#9834; ' + '&#8727; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  WeekDayList = userName + '/' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  WeekDayList = '&#8727; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  WeekDayList = '&#9834; ' + userName + '/' + serviceNames;
                } else if (onlineBooking === 0 && newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  WeekDayList = '&#9834; ' + '&#8727; ' + userName + '/' + serviceNames;
                }
              }

              if (standing === 1) {
                if (newClient === 1 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  WeekDayList = '&#9839;' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 1 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  WeekDayList = '&#9839;' + '&#9834; ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 1 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  WeekDayList = '&#9839;' + '&#8727' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 1 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  WeekDayList = '&#9839;' + '&#9834' + '&#8727' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + serviceNames;
                } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix !== 'asterix') {
                  WeekDayList = '&#9839;' + userName + '/' + serviceNames;
                } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix !== 'asterix') {
                  WeekDayList = '&#9839;' + '&#9834; ' + userName + '/' + serviceNames;
                } else if (newClient === 0 && (notes === 'null' || notes === '') && asterix === 'asterix') {
                  WeekDayList = '&#9839;' + '&#8727' + userName + '/' + serviceNames;
                } else if (newClient === 0 && (notes !== 'null' || notes !== '') && asterix === 'asterix') {
                  WeekDayList = '&#9839;' + '&#9834; ' + '&#8727' + userName + '/' + serviceNames;
                }

              }
              if (bookOut === 1 && notes !== '') {
                WeekDayList = '&#9834; ' + 'Book Out Time';
              } else if (bookOut === 1 && notes === '') {
                WeekDayList = 'Book Out Time';
              }
              let clientIDs: any;
              if (this.individualWorkerWeek[i].clientID === '') {
                clientIDs = null;
              } else {
                clientIDs = this.individualWorkerWeek[i].clientID;
              }


              this.serviceStartTime = moment(this.individualWorkerWeek[i].Service_Date_Time__c).format().split('+')[0];
              const durationInMinutes = this.individualWorkerWeek[i].Duration__c;   // duration
              this.serviceEndTime = moment(this.serviceStartTime).add(durationInMinutes, 'minutes').format().split('+')[0];
              // let WeekDayList;
              // let weekPerson;
              // let serviceNames;
              // if (this.individualWorkerWeek[i].Name === null || this.individualWorkerWeek[i].Name === '') {
              //   weekPerson = 'No Client';
              // } else {
              //   weekPerson = this.individualWorkerWeek[i].Name;
              // }


              // if (this.individualWorkerWeek[i].serviceName === '' || this.individualWorkerWeek[i].serviceName === undefined) {
              //   serviceNames = '';
              // } else {
              //   serviceNames = this.individualWorkerWeek[i].serviceName;
              // }
              // if (this.individualWorkerWeek[i].New_Client__c === 1) {
              //   WeekDayList = '<span style="color:red;font-weight:bold;">' + weekPerson + '</span> / ' + serviceNames;
              // } else {
              //   WeekDayList = weekPerson + ' / ' + serviceNames;
              // }

              if (this.individualWorkerWeek[i].Appt_Ticket__c !== undefined || this.individualWorkerWeek[i].Appt_Ticket__c !== '') {
                events.push(
                  {
                    'resourceId': this.individualWorkerWeek[i].Worker__c,
                    'apptId': this.individualWorkerWeek[i].Appt_Ticket__c,
                    'ticket_service_id': this.individualWorkerWeek[i].tsid,
                    'title': WeekDayList,
                    'start': this.serviceStartTime,
                    'end': this.serviceEndTime,
                    'textColor': 'black',
                    'borderColor': this.borderColor,
                    'color': this.individualWorkerWeek[i].serviceGroupColor,
                    'clientID': this.individualWorkerWeek[i].clientID,
                    'status': this.individualWorkerWeek[i].status,
                    'className': this.individualWorkerWeek[i].tsid,
                  }
                );
              }

            }
            this.weekdayDateDisplay = '';
            this.mainApptDate = moment(this.cldDate).format('MMMM YYYY dddd');
            this.weekdayDateDisplay = moment(this.cldDate).format('MMMM YYYY dddd'); // weekday display date in view page
            const MinTimesInMinutes = '-60';
            const MaxTimesInMinutes1 = '60';
            // const MinTimes = moment(this.individualWorkerWeek[0].min, 'HH:mm').add(MinTimesInMinutes, 'minutes').format('HH:mm');
            // const MaxTimes = moment(this.individualWorkerWeek[0].max, 'HH:mm').add(MaxTimesInMinutes1, 'minutes').format('HH:mm');

            const selDate = this.commonService.getDateFrmDBDateStr(this.cldDate);
            this.viewBy = value;

            const hiddenDaysObj = [0, 1, 2, 3, 4, 5, 6];
            hiddenDaysObj.splice(selDate.getDay(), 1);
            resources.push(
              {
                id: worker_Id,
                businessHours: {
                  start: '00:00',
                  end: '24:00',
                },
              });

            const ole = JSON.parse(this.booking);
            var select = function (start, end, jsEvent, view, selectresource) {
              let datIndex = 0;
              const crDate = new Date();
              const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
              const endDate = new Date(0, 0, 0, 23, 59, 0, 0);
              this.TimeData = [];
              const firstName = $('#firstName').val('');
              const LastName = $('#lastName').val('');
              const mobileNumber = $('#mobileNumber').val('');
              // const mobileCarrier = $('#mobileCarrier').val('');
              const primaryEmail = $('#primaryEmail').val('');
              const listServices = $('#listServices').val('');
              const sumDuration = $('#sumDuration').val('');
              const textArea = $('#textArea').val('');
              const visitType = $('#visitType').val('');
              do {
                let elem = '';
                if (startDate.getHours() < 12) {
                  if (startDate.getHours() === 0) {
                    elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                  } else {
                    elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                  }
                } else {
                  if ((startDate.getHours() - 12) === 0) {
                    elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                  } else {
                    elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                  }
                }
                this.TimeData.push(elem);

                if (crDate.getHours() < startDate.getHours()) {
                  datIndex++;
                }
                startDate.setMinutes(startDate.getMinutes() + ole);
              }
              while (startDate < endDate);
              this.expressBookingStart = this.serviceStartTime;
              this.expressBookingEnd = this.serviceEndTime;
              this.startDateTime = start.format();
              const date = this.startDateTime.split('T')[0];
              let WeekEndformatDates: any;
              WeekEndformatDates = moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
              this.end = end.format();
              $('#myModal').show();

              const appoitmentdate = $('#CalendarDate').val(WeekEndformatDates);    // date of appointments
              const expressDate2 = $('#CalendarDate2').val(WeekEndformatDates);
              const skipCalendarDate = $('#skipCalendarDate').val(WeekEndformatDates);


              const dateAndTime = $('#startDateTime').val(this.startDateTime);  // in this date with time
              const dateAndTime2 = $('#expressstartDateTime').val(this.startDateTime);  // in this date with time
              const skipdateAndTime = $('#skipdateAndTime').val(this.startDateTime);  // in this date with time

              let selTimOpt = '';
              const hrs = parseInt(start.format().split('T')[1].split(':')[0], 10);
              const min = parseInt(start.format().split('T')[1].split(':')[1], 10);

              if (hrs < 12) {
                if (hrs === 0) {
                  selTimOpt = '12:' + ('0' + min).slice(-2) + ' AM';
                } else {
                  selTimOpt = ('0' + hrs).slice(-2) + ':' + ('0' + min).slice(-2) + ' AM';
                }
              } else {
                if ((hrs - 12) === 0) {
                  selTimOpt = '12:' + ('0' + min).slice(-2) + ' PM';
                } else {
                  selTimOpt = ('0' + (hrs - 12)).slice(-2) + ':' + ('0' + min).slice(-2) + ' PM';
                }
              }

              let selectBox: any;
              selectBox = <HTMLSelectElement>document.getElementById('times');
              selectBox.options.length = 0;
              for (let i = 0; i < this.TimeData.length; i++) {
                const optionVal = this.TimeData[i];
                const opt = new Option(optionVal, optionVal);
                opt.className = 'select-bg-option';
                selectBox.options.add(opt);
              }
              selectBox.value = selTimOpt;
              const selectBox2 = <HTMLSelectElement>document.getElementById('expresstimes');
              selectBox2.options.length = 0;
              for (let i = 0; i < this.TimeData.length; i++) {
                const optionVal = this.TimeData[i];
                const opt2 = new Option(optionVal, optionVal);
                opt2.className = 'select-bg-option';
                selectBox2.options.add(opt2);
              }
              selectBox2.value = selTimOpt;

              const selectBox3 = <HTMLSelectElement>document.getElementById('skiptimes');
              selectBox3.options.length = 0;
              for (let i = 0; i < this.TimeData.length; i++) {
                const optionVal = this.TimeData[i];
                const opt3 = new Option(optionVal, optionVal);
                opt3.className = 'select-bg-option';
                selectBox3.options.add(opt3);
              }
              selectBox3.value = selTimOpt;                          // main time
              this.expressBookinWorkerName = $('#workername').val(selectresource.title);       //   worker name
              const BookinWorkerName = $('#expressworkername').val(selectresource.title);       //   worker name
              const skipworkername = $('#skipworkername').val(selectresource.title);           // worker name

              const workedrId = $('#workerId').val(selectresource.id);
              const expressworkerId = $('#expressworkerId').val(selectresource.id);
              const skipexpressworkerId = $('#skipexpressworkerId').val(selectresource.id);

              const worSel = <HTMLSelectElement>document.getElementById('workerIds');           // here
              worSel.value = selectresource.id;

              const worSel2 = <HTMLSelectElement>document.getElementById('ExpworkerIds');          // worker id
              worSel2.value = selectresource.id;

              const worSel3 = <HTMLSelectElement>document.getElementById('skipworkerIds');          // worker id
              worSel3.value = selectresource.id;

              const modal = document.getElementById('myModal');
              const btn = document.getElementById('myBtn');
              $('#cancelExpress').click(function () {
                $('#myModal').hide();
              });
              $('.close').click(function () {
                $('#myModal').hide();
              });
            };

            this.finaRes = data['result']['finaRes'];
            for (let i = 0; i < this.finaRes.length; i++) {
              events.push(
                {
                  id: 1,
                  start: this.finaRes[i].date + 'T' + moment(this.finaRes[i].start, 'hh:mm A').format('HH:mm'),
                  end: this.finaRes[i].date + 'T' + moment(this.finaRes[i].end, 'hh:mm A').format('HH:mm'),
                  color: 'gray',
                  rendering: 'inverse-background'
                },
              );
            }

            const calObj = {
              defaultView: 'settimana',
              defaultDate: this.cldDate,
              editable: true,
              selectable: true,
              eventLimit: true,
              allDaySlot: false,
              minTime: '07:00',
              maxTime: '22:00',
              weekends: true,
              eventOverlap: true,
              slotDuration: '00:' + (JSON.parse(this.booking)) + ':00',
              slotLabelInterval: '00:' + (JSON.parse(this.booking)) + ':00',
              header: {
                left: '',
                center: '',
                right: '',
              },
              slotLabelFormat: [
                'h(:mm) a'
              ],
              viewRender: function (view, element) {
                const s = '<div class="appnt-pro-name"><h6>TIME</h6> </div>';
                element.find('.fc-axis:eq(1)').html(s);
              },
              views: {
                settimana: {
                  type: 'agendaWeek',
                  duration: {
                    months: 1
                  },
                  title: 'agendaWeek',
                  groupByResource: true,
                  columnFormat: 'ddd M/D',
                },
              },
              resources: resources,
              events: events,
              select: select,
              eventDrop: function (event, delta, revertFunc) {
                const todayMoment = moment();
                const dayDelta = delta.days();
                const minuteDelta = delta.hours() * 60 + delta.minutes();
                const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                const todayDate = todayMoment.year() * 10000 + (todayMoment.month() + 1) * 100 + todayMoment.date();
                const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                if (event.status === 'Canceled' || event.status === 'Complete') {
                  swal({
                    text: 'The App is cancelled or completed stage',
                    timer: 2000,
                    buttons: false,
                  });
                  revertFunc();
                  return;
                } else if (eventStartDate < todayDate) {
                  swal({
                    text: 'Appointment cannot be moved. Either the appointment is in the past or is being moved into the past.',
                    icon: 'warning',
                    button: 'ok',
                  });
                  revertFunc();
                  return;
                } else if (eventStartDate > todayDate) {
                  const times = (delta['_data'].days * 24 * 60) + (delta['_data'].hours * 60) + delta['_data'].minutes;
                  $.ajax({
                    type: 'POST',
                    url: (apiEndPoint + '/api/calendarEventsUpdatesWeek'),
                    beforeSend: function (request) {
                      request.setRequestHeader('token', localStorage.getItem('token'));
                    },
                    data: {
                      'apptId': event.apptId,
                      'AppTtimes': times,
                    },
                    success: function (dataString, textStatus, request) {
                      // $('#centerDiv').load(location.href + '#centerDiv');
                      swal({
                        text: 'Appointment Updated Successfully',
                        timer: 2000,
                        buttons: false
                      });
                      var el = document.getElementById('ajaxRefreshweekday');
                      if (el) {
                        const evObj = document.createEvent('Events');
                        evObj.initEvent('click', true, false);
                        el.dispatchEvent(evObj);
                      }

                      localStorage.setItem('token', request.getResponseHeader('token'));
                    }
                  });
                } else if (event.start._f === '' || event.start._f === undefined) {
                  const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                  const eventEndTime = moment(eventDate + event.end._i[3] + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                  const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                  const duration = startAndEnd.asMinutes();
                  $.ajax({
                    type: 'POST',
                    url: (apiEndPoint + '/api/calendarEventsUpdates'),
                    beforeSend: function (request) {
                      request.setRequestHeader('token', localStorage.getItem('token'));
                    },
                    data: {
                      'apptId': event.apptId,
                      'resourceId': event.resourceId,
                      'ticket_service_id': event.ticket_service_id,
                      'eventStartTime': eventStartTime,
                      'duration': duration
                    },
                    success: function (dataString, textStatus, request) {
                      swal({
                        text: 'Appointment Updated Successfully',
                        timer: 2000,
                        buttons: false
                      });

                      var el = document.getElementById('ajaxRefreshweekday');
                      if (el) {
                        const evObj = document.createEvent('Events');
                        evObj.initEvent('click', true, false);
                        el.dispatchEvent(evObj);
                      }
                      localStorage.setItem('token', request.getResponseHeader('token'));
                    }
                  });
                } else {
                  swal({
                    text: 'Unable to move Appt ,refresh page and try again',
                    timer: 2000,
                    buttons: false
                  });
                  revertFunc();
                  return;
                }
              },

              eventResize: function (event, delta, revertFunc) {
                const eventStartDate = event.start.year() * 10000 + (event.start.month() + 1) * 100 + event.start.date();
                const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                const eventEndTime = moment(eventDate + event.end._i[3] + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                const duration = startAndEnd.asMinutes();
                $.ajax({
                  type: 'POST',
                  url: (apiEndPoint + '/api/calendarEventsUpdates'),
                  beforeSend: function (request) {
                    request.setRequestHeader('token', localStorage.getItem('token'));
                  },
                  data: {
                    'apptId': event.apptId,
                    'resourceId': event.resourceId,
                    'ticket_service_id': event.ticket_service_id,
                    'eventStartTime': eventStartTime,
                    'duration': duration
                  },
                  success: function (dataString, textStatus, request) {
                    swal({
                      text: 'Appointment Updated Successfully',
                      timer: 2000,
                      buttons: false
                    });
                    localStorage.setItem('token', request.getResponseHeader('token'));
                  }
                });
              },
              hiddenDays: hiddenDaysObj,
              schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
            };
            $('#calendar').fullCalendar('destroy');
            this.loadCalender(calObj);
            this.getAppointments(this.listDate, this.workerId, this.selWeek);
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

      } else if (this.selWorker !== 'all' && this.selWeek === 'One Day') {
        this.fetchWorkerCalendar([]);
        this.viewBy = value;
      } else if ((this.selWorker === 'all' && this.selWeek === 'One Week') || (this.selWorker === 'all' && this.selWeek === 'One Weekday')) {
        this.toastr.warning('One Week or One Weekday view requires selection of a Worker', null, { timeOut: 6000 });
      }

      if (this.selWorker === 'all' && this.selWeek === 'One Week') {
        const calObj = {
          defaultView: 'settimana',
          defaultDate: this.cldDate,
          editable: true,
          selectable: true,
          eventLimit: true,
          allDaySlot: false,
          minTime: '07:00',
          maxTime: '17:00',
          slotLabelInterval: '00:10:00',
          slotDuration: '00:10:00',
          weekends: true,
          header: {
            left: '',
            center: '',
            right: ''
          },
          slotLabelFormat: [
            'h(:mm) a'
          ],
          viewRender: function (view, element) {
            var title = this.dateCatch;
            const s = '<div class="appnt-pro-name"><h6>TIME</h6> </div>';
            element.find('.fc-axis:first').html(s);
          },
          views: {
            settimana: {
              type: 'agendaWeek',
              duration: {
                days: 7,
              },
              title: 'Apertura',
              columnFormat: 'ddd M/D',
            }
          },
          //  resources: resources,
          schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
        };
        this.loadCalender(calObj);
      } else if (this.selWorker === 'all' && this.selWeek === 'One Weekday') {
        const calObj = {
          defaultView: 'settimana',
          defaultDate: this.datePickerDate.date.year + '-' + this.datePickerDate.date.month + '-' + this.datePickerDate.date.day,
          //  defaultDate: this.cldDate,
          editable: true,
          selectable: true,
          eventLimit: true,
          allDaySlot: false,
          minTime: '08:00',
          maxTime: '17:00',
          slotDuration: '00:15:00',
          slotLabelInterval: '00:15:00',
          // weekends: true,
          header: {
            left: '',
            center: '',
            right: '',
          },
          slotLabelFormat: [
            'h(:mm) a'
          ],
          hiddenDays: [0, 1, 2, 3, 5, 6],
          viewRender: function (view, element) {
            var title = this.dateCatch;
            const s = '<div class="appnt-pro-name"><h6>TIME</h6> </div>';
            element.find('.fc-axis:first').html(s);
          },
          views: {
            settimana: {
              type: 'agendaWeek',
              duration: {
                months: 1
              },
              title: 'settimana',
              columnFormat: 'ddd M/D',

            },
          },

          schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
        };
        this.loadCalender(calObj);
      }
    }
  }
  getpackagesListing() {
    const value = 'true';
    this.appointmentsServices.getAllServicePackageDetails(value).subscribe(data => {
      this.packagesList = data['result'];
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

  changeStatus(apptData) {
    const pckgObj = {};
    if (!apptData.Booked_Package__c && apptData.Booked_Package__c === null) {
      const tempServIds = apptData.serviceIds.split(',');
      const tempTcktSerIds = apptData.ticketServiceIds.split(',');
      this.nonPckgSrvcs = [];
      for (let i = 0; i < tempServIds.length; i++) {
        this.nonPckgSrvcs.push({
          'serId': tempServIds[i], 'ticketServiceId': tempTcktSerIds[i], 'apptId': apptData.apptid, 'clientId': apptData.clientId, 'isclientPackage': 1
        });
      }
    }
    if (apptData.Booked_Package__c && apptData.Booked_Package__c !== '' && apptData.Booked_Package__c !== null &&
      apptData.Booked_Package__c !== 'undefined' && apptData.apstatus !== 'Checked In') {
      const reqDate = this.commonService.getDBDatStr(new Date());
      this.apptDetailService.getApptServices(apptData.clientId, apptData.apptid, reqDate).subscribe(data => {
        const resData = data['result'];
        const result = this.commonService.getCheckInPrepaidPackage(this.packagesList, apptData, resData.srvcresult);
        this.checkIn(result.apptDataResult, result.packageResult);
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
    } else if (this.isCheckedInStatus(apptData.apstatus)) {
      apptData.apstatus = 'Checked In';
      const apptDataObj = {
        'apstatus': 'Checked In',
        'clientCurBal': apptData.Current_Balance__c,
        'serviceSales': apptData.Service_Sales__c,
        'apptId': apptData.apptid,
        'netprice': apptData.netprice

      };
      this.checkIn(apptDataObj, pckgObj);
    } else if (apptData.apstatus === 'Checked In') {
      this.router.navigate(['/checkout/' + apptData.apptid]).then(() => {
      });
    }
  }
  checkIn(apptDataObj, pckgObj) {
    apptDataObj.nonPckgSrvcs = this.nonPckgSrvcs;
    apptDataObj['Status_Date_Time_c'] = this.commonService.getDBDatTmStr(new Date());
    this.appointmentsServices.changeApptStatus(apptDataObj, pckgObj)
      .subscribe(data => {
        this.getAppointments(this.listDate, this.workerId, this.selWeek);
        // this.router.navigate(['/client']).then(() => {
        this.toastermessage = this.translateService.get('Appointment Status Changed to ' + apptDataObj.apstatus);
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        // });
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
              } if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                  localStorage.setItem('page', this.router.url);
                  this.router.navigate(['/']).then(() => { });
                }
              } break;
          }
        });
  }
  // express booking popup
  newClient() {
    this.listClientFields();
    const wkId = <HTMLSelectElement>document.getElementById('workerIds');
    this.expressService(wkId.value, 0);
    // const amountDuration = <HTMLSelectElement>document.getElementById('amountDuration');
    // this.listServices(amountDuration.value, 0);
    $('#myModal').hide();
    const apptDateTime = localStorage.getItem('apptDateSlot');
    if (apptDateTime && apptDateTime !== '') {
      const calDateEle = <HTMLInputElement>document.getElementById('CalendarDate');
      calDateEle.value = apptDateTime.split(' ')[0];

      const ole = JSON.parse(this.booking);
      let datIndex = 0;
      const crDate = new Date();
      const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
      const endDate = new Date(0, 0, 0, 23, 59, 0, 0);
      this.TimeData = [];
      do {
        let elem = '';
        if (startDate.getHours() < 12) {
          if (startDate.getHours() === 0) {
            elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
          } else {
            elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
          }
        } else {
          if ((startDate.getHours() - 12) === 0) {
            elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
          } else {
            elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
          }
        }
        this.TimeData.push(elem);

        if (crDate.getHours() < startDate.getHours()) {
          datIndex++;
        }
        startDate.setMinutes(startDate.getMinutes() + ole);
      }
      while (startDate < endDate);
      const selectBox = <HTMLSelectElement>document.getElementById('times');
      selectBox.options.length = 0;
      for (let i = 0; i < this.TimeData.length; i++) {
        const optionVal = this.TimeData[i];
        const opt = new Option(optionVal, optionVal);
        opt.className = 'select-bg-option';
        selectBox.options.add(opt);
      }
      const timeset = apptDateTime.split(' ')[1];
      const selTime = moment(timeset, 'HH:mm:ss').format('hh:mm A');
      // const tempSelTimAr = selTime.slice(0, -2).split(':');
      // if (tempSelTimAr[1] === undefined) {
      //   tempSelTimAr[1] = '00';
      // }
      // if (tempSelTimAr[0].length === 1) {
      //   tempSelTimAr[0] = '0' + tempSelTimAr[0];
      // }
      selectBox.value = selTime;
      setTimeout(() => {
        localStorage.removeItem('apptDateSlot');
      }, 300);
    }
    $('#expressModel').show();
    $('#cancelExpress2').click(function () {
      $('#expressModel').hide();
    });
    $('.close').click(function () {
      $('#expressModel').hide();
    });
  }

  // mobileCarriersList() {
  //   this.appointmentsServices.mobileCarriers().subscribe(
  //     data => {
  //       this.mobileCarriers = data['result'];
  //       this.mobileCarrierslist = [];
  //       for (let j = 0; j < this.mobileCarriers.length; j++) {
  //         if (this.mobileCarriers[j].active === true) {
  //           this.mobileCarrierslist.push(this.mobileCarriers[j].mobileCarrierName);
  //         }
  //       }
  //     },
  //     error => {
  //       const errStatus = JSON.parse(error['_body'])['status'];
  //       if (errStatus === '2085' || errStatus === '2071') {
  //         if (this.router.url !== '/') {
  //           localStorage.setItem('page', this.router.url);
  //           this.router.navigate(['/']).then(() => { });
  //         }
  //       }
  //     });
  // }

  expressService(value, i) {
    this.appointmentsServices.expressBookingServices(value).subscribe(
      data => {
        this.bookingExpress[i] = data['result'];
        if (this.bookingExpress[i][0]) {
          this.inputs[i]['service'] = this.bookingExpress[i].length > 0 ? this.bookingExpress[i][0] : {};
          this.inputs[i]['serviceId'] = this.bookingExpress[i].length > 0 ? this.bookingExpress[i][0]['serviceId'] : '';
          this.inputs[i]['worker'] = value;
          this.calculateServiceDurations();
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


  addInput() {
    this.inputs.push({});
  }

  deleteFieldValue(index) {
    this.inputs.splice(index, 1);
    this.calculateServiceDurations();
  }

  listServices(value, i) {
    const obj = this.bookingExpress[i].filter((data) => data.serviceId === value);
    this.inputs[i]['service'] = obj[0];
    this.inputs[i]['serviceId'] = obj[0]['serviceId'];
    this.calculateServiceDurations();
  }

  calculateServiceDurations() {
    this.servicePrice = 0;
    this.serviceDurations = 0;
    if (this.inputs && this.inputs.length > 0) {
      for (let j = 0; j < this.inputs.length; j++) {
        const serviceVal = this.inputs[j].service;
        if (serviceVal.Price__c !== null) {
          this.servicePrice += parseInt(serviceVal.Price__c, 10);
        } else {
          this.servicePrice += parseInt(serviceVal.pcsergrp, 10);
        }
        if (serviceVal.sumDurationBuffer !== null) {
          this.serviceDurations += parseInt(serviceVal.sumDurationBuffer, 10);
        } else {
          this.serviceDurations += parseInt(serviceVal.dursergrp, 10);
        }
      }
    }
  }

  getVisitTypes() {
    this.appointmentsServices.getVisitTypes().subscribe(
      data => {
        this.visitTypes = data['result'];
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
  saveExpressBooking() {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let bookAny;
    let bookRoomAnyWay;
    bookAny = $('#anyway').val();
    bookRoomAnyWay = $('#bookRoomAnyWay').val();
    let bookingDate;
    bookingDate = $('#startDateTime').val().split('T')[0];
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const CalendarDate = $('#CalendarDate').val();

    if (this.mobileNumber === undefined || this.mobileNumber === '') {
      this.NotificationReminderMobile = 0;
    } else {
      this.NotificationReminderMobile = 1;
    }

    if (this.primaryEmail === undefined || this.primaryEmail === '') {
      this.NotificationReminderEmail = 0;
    } else {
      this.NotificationReminderEmail = 1;
    }
    const currDate = moment().format('MM/DD/YYYY');
    const clickDate = moment(CalendarDate, 'MM/DD/YYYY').format('MM/DD/YYYY');
    const isoU = moment(currDate).isSameOrBefore(clickDate);

    if ((this.firstName === undefined || this.firstName === '') ||
      (this.lastName === '' || this.lastName === undefined) ||
      (isoU === false) ||
      (this.clientfieldPrimaryEmail === true && this.primaryEmail === undefined || this.primaryEmail === '') ||
      (this.clientfieldMobilePhone === true && (this.mobileNumber === undefined || this.mobileNumber === '') ||
        (this.primaryEmail !== undefined || this.primaryEmail !== '') && !EMAIL_REGEXP.test(this.primaryEmail)) ||
      ((this.countrycode === undefined || this.countrycode === '') && (this.mobileNumber !== undefined || this.mobileNumber !== '')) ||
      ((this.mobileNumber === undefined || this.mobileNumber === '') && (this.countrycode !== undefined || this.countrycode !== ''))) {

      if (this.firstName === '' || this.firstName === undefined) {
        this.errorFirstName = 'APPOINTMENTS_MAIN_PAGE.ERROR_FIRST_NAME';
      }
      if (this.lastName === '' || this.lastName === undefined) {
        this.errorLastName = 'APPOINTMENTS_MAIN_PAGE.ERROR_LAST_NAME';
      }

      if (this.clientfieldMobilePhone === true && (this.mobileNumber === undefined || this.mobileNumber === '')) {
        this.errormobilephone = 'APPOINTMENTS_MAIN_PAGE.ERROR_MOBILEPHONE';
        this.countrycodeError = '';
      }

      if (this.clientfieldMobilePhone === true && (this.countrycode === undefined || this.countrycode === '')) {
        this.countrycodeError = 'APPOINTMENTS_MAIN_PAGE.ERROR_COUNTRY_CODE';
        this.errormobilephone = '';
      }


      if (this.clientfieldPrimaryEmail === true && (this.primaryEmail === undefined || this.primaryEmail === '')) {
        this.errorEmail = 'APPOINTMENTS_MAIN_PAGE.ERROR_EMAIL';
        this.validationEmailError = '';
      }

      if (isoU === false) {
        this.toastr.warning('Express Booking Appointment date / time can not be in the past', null, { timeOut: 2500 });
      }


      if (this.mobileNumber || this.countrycode) {
        if (this.mobileNumber && (!this.countrycode)) {
          this.countrycodeError = 'APPOINTMENTS_MAIN_PAGE.ERROR_COUNTRY_CODE';
        } else {
          this.errormobilephone = 'APPOINTMENTS_MAIN_PAGE.ERROR_MOBILEPHONE';
        }
      }

      if (this.primaryEmail && !EMAIL_REGEXP.test(this.primaryEmail)) {
        this.validationEmailError = 'SETUPCOMPANY.INVALID_EMAIL_ID';
      }

      window.scrollTo(0, 0);
    } else {

      const servicePrice = $('#servicePrice').val();
      const expressSumDuration = $('#expressSumDuration').val();
      this.bookingDate = $('#startDateTime').val();
      this.workername = $('#workername').val();
      this.workerId = $('#workerId').val();
      const dbTime = $('#times').val().split(' ');
      const dbTime2 = dbTime[0].split(':');
      let dbHrs: any = parseInt(dbTime2[0], 10);
      if (dbTime[1] === 'PM' && dbHrs !== 12) {
        dbHrs += 12;
      } else if (dbTime[1] === 'AM' && dbHrs === 12) {
        dbHrs = 0;
      }
      dbHrs = ('0' + dbHrs).slice(-2);
      dbHrs = ('0' + dbHrs).slice(-2);
      const modifyData = this.apptCalculateServiceTax(this.inputs);
      let appDate;
      if (this.bookingDate !== '') {
        appDate = this.bookingDate.split('T')[0] + ' ' + dbHrs + ':' + dbTime2[1];
      } else {
        appDate = this.cldDate + ' ' + dbHrs + ':' + dbTime2[1];
      }
      let countryCode: any;
      if (this.countrycode === undefined) {
        countryCode = '';
      } else {
        countryCode = this.countrycode;
      }
      this.dataObjects = {
        'bookingDate': appDate,
        'workerId': this.workerId,
        'workername': this.workername,
        'firstName': this.firstName,
        'lastName': this.lastName,
        'mobileNumber': countryCode + '-' + this.mobileNumber,
        'primaryEmail': this.primaryEmail,
        'textArea': this.textArea,
        'visitType': this.expressVisitType,
        'sumDuration': expressSumDuration,
        'service': this.inputs,
        'price': servicePrice,
        'totalServiceTax': modifyData.serviceTax,
        'totalPrice': modifyData.sales,
        'Reminder_Mobile_Phone__c': this.NotificationReminderMobile,
        'Notification_Mobile_Phone__c': this.NotificationReminderMobile,
        'Reminder_Primary_Email__c': this.NotificationReminderEmail,
        'Notification_Primary_Email__c': this.NotificationReminderEmail,
        'bookAny': bookAny,
        'bookRoomAnyWay': bookRoomAnyWay
      };
      if (this.submitParam) {
        this.submitParam = false;
        $('#loader1').show();
        this.appointmentsServices.saveExpressClient(this.dataObjects).subscribe(
          data => {
            this.submitParam = true;
            // const t = data['result'].affectedRows;
            if (data['result'].length > 0) {
              this.appointmentsServices.sendApptNotifs([data['result']]).subscribe(data2 => { }, error => { });
              $('#expressModel').hide(500);
              $('#loader1').hide();
              this.router.navigate(['/appointments']).then(() => {
                this.toastr.success('Successfully created appointment', null, { timeOut: 1500 });
              });
              if (this.bookingDate === '') {
                const timesss1 = new Date(moment(CalendarDate + ' ' + '00:00:00').format('ddd MMMM DD YYYY h:mm:ss').toString());
                this.goToDate(timesss1, 0);
                this.closePopup();
              } else {
                const timesss = new Date(moment(this.bookingDate.split('T')[0]).format('ddd MMMM DD YYYY h:mm:ss').toString());
                this.goToDate(timesss, 0);
                this.closePopup();
              }
            }
          },
          error => {
            this.submitParam = true;
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (status) {
              case 500:
                break;
              case 400:
                if (statuscode === '2082') {
                  this.errResources = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                  this.bookAnyWay = 'Book Anyway';
                  window.scrollTo(0, 0);
                } if (statuscode === '2090') {
                  this.errResources = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                  this.bookRoomAnyWay = 'Book RoomAnyWay';
                  window.scrollTo(0, 0);
                } if (statuscode === '2033') {
                  this.toastr.warning('Record with the same name already exists', null, { timeOut: 2500 });
                  this.closePopup();
                  window.scrollTo(0, 0);
                } if (statuscode === '2085' || statuscode === '2071') {
                  if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                  }
                } break;
            }
          });
      }
    }
  }
  hyphen_generate_mobile(value) {
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('mobileNumber')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('mobileNumber')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('mobileNumber')).value = value.concat('-');
    }
  }
  hyphen_mobile(event) {
    let value = event.target.value;
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('mobileNumber1')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('mobileNumber1')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('mobileNumber1')).value = value.concat('-');
    }
  }
  // keyPress(event: any) {
  //   const pattern = /([0-9\+\-\ ])/;
  //   const inputChar = String.fromCharCode(event.charCode);
  //   if (event.keyCode !== 8 && !pattern.test(inputChar)) {
  //     event.preventDefault();
  //   }
  // }
  // searchClient(value) {
  //   if (value && value !== '') {
  //     this.appointmentsServices.getClientAutoSearch(value).subscribe(
  //       data => {
  //         this.autoList = [];
  //         const search = data['result'];
  //         if (search && search.length > 0) {
  //           for (let i = 0; i < search.length; i++) {
  //             // this.autoList.push(search[i].first + ' ' + search[i].last + '|' + search[i].mobile + '|' + search[i].phone);
  //             this.autoList.push(search[i].first + ' ' + search[i].last);
  //           }
  //         }
  //       },
  //       error => {
  //         const errStatus = JSON.parse(error['_body'])['status'];
  //         if (errStatus === '2085' || errStatus === '2071') {
  //           this.router.navigate(['/']).then(() => { });
  //         }
  //       }
  //     );
  //   }
  // }

  clearErrorMsg() {
    this.errorFirstName = '';
    this.errorLastName = '';
    this.errormobilephone = '';
    this.errorEmail = '';
    this.validationEmailError = '';
    this.existingValidationError = '';
    this.existingCountrycodeError = '';
    this.countrycodeError = '';
  }
  openNav() {
    document.getElementById('mySidenav').style.width = '350px';
    document.getElementById('mySidenav').style.paddingLeft = '25px';
  }
  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('mySidenav').style.paddingLeft = '0px';
  }
  admMenuShow() {
    this.activeClass = !this.activeClass;
  }
  admMenuShowForInventory() {
    this.activeClass1 = !this.activeClass1;
  }
  admMenuShowForMarketing() {
    this.marketingActiveClass = !this.marketingActiveClass;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  expressBookingGetUserData(DataObj) {
    const wkId2 = <HTMLSelectElement>document.getElementById('ExpworkerIds');
    this.expressService(wkId2.value, 0);
    // const amountDuration = <HTMLSelectElement>document.getElementById('amountDuration2');
    // this.listServices(amountDuration.value, 0);
    $('#myModal').hide();

    const apptDateTime = localStorage.getItem('apptDateSlot');
    if (apptDateTime && apptDateTime !== '') {
      const calDateEle = <HTMLInputElement>document.getElementById('CalendarDate2');
      calDateEle.value = apptDateTime.split(' ')[0];
      const ole = JSON.parse(this.booking);
      let datIndex = 0;
      const crDate = new Date();
      const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
      const endDate = new Date(0, 0, 0, 23, 59, 0, 0);
      this.TimeData = [];
      do {
        let elem = '';
        if (startDate.getHours() < 12) {
          if (startDate.getHours() === 0) {
            elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
          } else {
            elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
          }
        } else {
          if ((startDate.getHours() - 12) === 0) {
            elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
          } else {
            elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
          }
        }
        this.TimeData.push(elem);

        if (crDate.getHours() < startDate.getHours()) {
          datIndex++;
        }
        startDate.setMinutes(startDate.getMinutes() + ole);
      }
      while (startDate < endDate);
      const selectBox = <HTMLSelectElement>document.getElementById('expresstimes');
      selectBox.options.length = 0;
      for (let i = 0; i < this.TimeData.length; i++) {
        const optionVal = this.TimeData[i];
        const opt = new Option(optionVal, optionVal);
        opt.className = 'select-bg-option';
        selectBox.options.add(opt);
      }
      const timeset = apptDateTime.split(' ')[1];
      const selTime = moment(timeset, 'HH:mm:ss').format('hh:mm A');
      // const tempSelTimAr = selTime.slice(0, -2).split(':');
      // if (tempSelTimAr[1] === undefined) {
      //   tempSelTimAr[1] = '00';
      // }
      // if (tempSelTimAr[0].length === 1) {
      //   tempSelTimAr[0] = '0' + tempSelTimAr[0];
      // }
      selectBox.value = selTime;
      setTimeout(() => {
        localStorage.removeItem('apptDateSlot');
      }, 300);
    }
    if (DataObj.Booking_Restriction_Type__c === 'Do Not Book') {
      this.fullName = DataObj.FirstName + ' ' + DataObj.LastName;
      this.expressClientIds = DataObj.Id;
      this.serviceNotesModal.show();
    } else {
      $('#existingExpressModel').show();
    }


    $('#expressCancelExpress2').click(function () {
      $('#existingExpressModel').hide();
    });
    $('#expressClose').click(function () {
      $('#existingExpressModel').hide();
    });
    this.firstName = DataObj.FirstName;
    this.lastName = DataObj.LastName;
    this.fullName = DataObj.FirstName + ' ' + DataObj.LastName;
    this.mobileNumber = DataObj.MobilePhone;
    // this.mobileCarrier = DataObj.Mobile_Carrier__c;
    this.primaryEmail = DataObj.Email;
    this.expressClientIds = DataObj.Id;
  }

  existingExpressBooking() {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let bookAny;
    let bookRoomAnyWay;
    bookAny = $('#anyway').val();
    bookRoomAnyWay = $('#bookRoomAnyWay').val();
    let bookingDate;
    bookingDate = $('#expressstartDateTime').val().split('T')[0];
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const CalendarDate2 = $('#CalendarDate2').val();
    const currDate = moment().format('MM/DD/YYYY');
    const clickDate = moment(CalendarDate2, 'MM/DD/YYYY').format('MM/DD/YYYY');
    const isoU = moment(currDate).isSameOrBefore(clickDate);

    if ((this.firstName === undefined || this.firstName === '') || (this.lastName === '' || this.lastName === undefined)
      //  || (this.mobileNumber === '' || this.mobileNumber === undefined)
      // || (this.primaryEmail === undefined || this.primaryEmail === '')
      || (isoU === false) ||
      (this.primaryEmail !== undefined || this.primaryEmail !== '') && !EMAIL_REGEXP.test(this.primaryEmail)) {

      if (this.firstName === '' || this.firstName === undefined) {
        this.errorFirstName = 'APPOINTMENTS_MAIN_PAGE.ERROR_FIRST_NAME';
      }
      if (this.lastName === '' || this.lastName === undefined) {
        this.errorLastName = 'APPOINTMENTS_MAIN_PAGE.ERROR_LAST_NAME';
      }
      // if (this.countrycode === undefined || this.countrycode === '') {
      //   this.existingCountrycodeError = 'APPOINTMENTS_MAIN_PAGE.ERROR_COUNTRY_CODE';
      // }
      if ((this.primaryEmail !== undefined || this.primaryEmail !== '') && !EMAIL_REGEXP.test(this.primaryEmail)) {
        this.existingValidationError = 'SETUPCOMPANY.INVALID_EMAIL_ID';
        this.errorEmail = '';
      }
      if (isoU === false) {
        this.toastr.warning('Express Booking Appointment date / time can not be in the past', null, { timeOut: 2500 });
      }
      // if ((this.mobileNumber === '' || this.mobileNumber === undefined) && this.clientfieldMobilePhone === true) {
      //   this.errormobilephone = 'APPOINTMENTS_MAIN_PAGE.ERROR_MOBILEPHONE';
      // }
      // if ((this.primaryEmail === '' || this.primaryEmail === undefined) && this.clientfieldPrimaryEmail === true) {
      //   this.errorEmail = 'APPOINTMENTS_MAIN_PAGE.ERROR_EMAIL';
      // }


    } else {
      const servicePrice2 = $('#servicePrice2').val();
      this.sumDuration = $('#sumDuration2').val();
      this.expressVisitType = $('#expressVisitType').val();
      this.bookingDate = $('#expressstartDateTime').val();
      this.workername = $('#expressworkername').val();
      const expressWorkerId = $('#expressworkerId').val();
      const dbTime = $('#expresstimes').val().split(' ');

      let edbHrs: any;
      let edbTime2: any;
      edbTime2 = dbTime[0].split(':');
      edbHrs = parseInt(edbTime2[0], 10);
      if (dbTime[1] === 'PM' && edbHrs !== 12) {
        edbHrs += 12;
      } else if (dbTime[1] === 'AM' && edbHrs === 12) {
        edbHrs = 0;
      }
      edbHrs = ('0' + edbHrs).slice(-2);

      const modifyData = this.apptCalculateServiceTax(this.inputs);
      let appDat;
      if (this.bookingDate !== '') {
        appDat = this.bookingDate.split('T')[0] + ' ' + edbHrs + ':' + edbTime2[1];
      } else {
        appDat = this.cldDate + ' ' + edbHrs + ':' + edbTime2[1];
      }
      let countryCode: any;
      if (this.countrycode === undefined) {
        countryCode = '';
      } else {
        countryCode = this.countrycode;
      }
      this.dataObjects = {
        'bookingDate': appDat,
        'workerId': expressWorkerId,
        'workername': this.workername,
        'client_person_id': this.expressClientIds,
        'firstName': this.firstName,
        'lastName': this.lastName,
        'mobileNumber': this.mobileNumber,
        'primaryEmail': this.primaryEmail,
        'textArea': this.textArea,
        'visitType': this.expressVisitType,
        'sumDuration': this.sumDuration,
        'service': modifyData.bookingData,
        'price': servicePrice2,
        'totalServiceTax': modifyData.serviceTax,
        'totalPrice': modifyData.sales,
        'bookAny': bookAny,
        'bookRoomAnyWay': bookRoomAnyWay
      };
      if (this.submitParam) {
        this.submitParam = false;
        this.appointmentsServices.existingExpressBooking(this.dataObjects).subscribe(
          data => {
            this.submitParam = true;
            // const t = data['result'].affectedRows;
            if (data['result'].length > 0) {
              this.appointmentsServices.sendApptNotifs([data['result']]).subscribe(data2 => { }, error => { });
              $('#existingExpressModel').hide(500);
              this.router.navigate(['/appointments']).then(() => {
                this.toastr.success('Successfully created appointment', null, { timeOut: 1500 });
              });
              if (this.bookingDate === '') {
                const callBackTimes1 = new Date(moment(CalendarDate2 + ' ' + '00:00:00').format('ddd MMMM DD YYYY h:mm:ss').toString());
                this.goToDate(callBackTimes1, 0);
                this.closePopup();
              } else {
                const callBackTimes = new Date(moment(this.bookingDate.split('T')[0]).format('ddd MMMM DD YYYY h:mm:ss').toString());
                this.goToDate(callBackTimes, 0);
                this.closePopup();
              }
            }
          },
          error => {
            this.submitParam = true;
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (status) {
              case 500:
                break;
              case 400:
                if (statuscode === '2082') {
                  this.errResources = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                  this.bookAnyWay = 'Book Anyway';
                  window.scrollTo(0, 0);
                } if (statuscode === '2090') {
                  this.errResources = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                  this.bookRoomAnyWay = 'Book RoomAnyWay';
                  window.scrollTo(0, 0);
                } if (statuscode === '2085' || statuscode === '2071') {
                  if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                  }
                } break;
            }
          });
      }
    }
  }

  closePopup() {
    const dsfp = $('#searchKeys').val('');
    $('#loader1').hide();
    const clearData = $('#firstLastClearData').val('');
    this.autoList = [];
    this.inputs = [];
    this.bookingExpress = [];
    this.addInput();
    this.skipVisitType = [];
    this.expressVisitType = [];
    this.errorFirstName = '';
    this.errorLastName = '';
    this.errormobilephone = '';
    this.errorEmail = '';
    this.validationEmailError = '';
    this.existingValidationError = '';
    this.countrycodeError = '';
    this.firstName = '';
    this.lastName = '';
    this.mobileNumber = '';
    this.primaryEmail = '';
    this.textArea = '';
    this.expressVisitType = '';
    this.expressVisitType = [];
    this.textArea = '';
    this.skiptextArea = '';
    this.errResources = '';
    this.bookAnyWay = '';
    this.bookRoomAnyWay = '';

    $('#myModal').hide();
    $('#existingExpressModel').hide();
    $('#expressModel').hide();
    $('#skipModel').hide();
    // console.clear();
  }

  // calculate servcie tax for appointments
  apptCalculateServiceTax(apptBookingData: Array<any>): { bookingData: Array<any>, serviceTax: number, sales: number } {
    let totalTax = 0;
    let totalPrice = 0;
    const data = apptBookingData.map((bookedData) => {
      bookedData.service['Service_Tax__c'] = 0;
      if (!isNullOrUndefined(bookedData.service['serviceTax'])) {
        const serviceTax = +JSON.parse(bookedData.service['serviceTax']).serviceTax;
        bookedData.service['Service_Tax__c'] = this.commonService.calculatePercentage(serviceTax, bookedData.service['Price__c'], 1);
      }
      totalPrice += +bookedData.service['Price__c'];
      totalTax += +bookedData.service['Service_Tax__c'];
      return bookedData;
    });
    return {
      bookingData: data,
      serviceTax: totalTax,
      sales: totalPrice
    };
  }

  skip() {
    const worSel3 = <HTMLSelectElement>document.getElementById('skipworkerIds');          // worker id
    this.expressService(worSel3.value, 0);
    $('#myModal').hide();
    const apptDateTime = localStorage.getItem('apptDateSlot');
    if (apptDateTime && apptDateTime !== '') {
      const calDateEle = <HTMLInputElement>document.getElementById('skipCalendarDate');
      calDateEle.value = apptDateTime.split(' ')[0];
      const ole = JSON.parse(this.booking);
      let datIndex = 0;
      const crDate = new Date();
      const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
      const endDate = new Date(0, 0, 0, 23, 59, 0, 0);
      this.TimeData = [];
      do {
        let elem = '';
        if (startDate.getHours() < 12) {
          if (startDate.getHours() === 0) {
            elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
          } else {
            elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
          }
        } else {
          if ((startDate.getHours() - 12) === 0) {
            elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
          } else {
            elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
          }
        }
        this.TimeData.push(elem);
        if (crDate.getHours() < startDate.getHours()) {
          datIndex++;
        }
        startDate.setMinutes(startDate.getMinutes() + ole);
      }
      while (startDate < endDate);
      const selectBox = <HTMLSelectElement>document.getElementById('skiptimes');
      selectBox.options.length = 0;
      for (let i = 0; i < this.TimeData.length; i++) {
        const optionVal = this.TimeData[i];
        const opt = new Option(optionVal, optionVal);
        opt.className = 'select-bg-option';
        selectBox.options.add(opt);
      }
      const timeset = apptDateTime.split(' ')[1];
      const selTime = moment(timeset, 'HH:mm:ss').format('hh:mm A');
      // const tempSelTimAr = selTime.slice(0, -2).split(':');
      // if (tempSelTimAr[1] === undefined) {
      //   tempSelTimAr[1] = '00';
      // }
      // if (tempSelTimAr[0].length === 1) {
      //   tempSelTimAr[0] = '0' + tempSelTimAr[0];
      // }
      selectBox.value = selTime;
      setTimeout(() => {
        localStorage.removeItem('apptDateSlot');
      }, 300);
    }
    $('#expressModel').hide();
    $('#skipModel').show();
    $('#skipcancel').click(function () {
      $('#skipModel').hide();
    });
    $('.close').click(function () {
      $('#skipModel').hide();
    });
  }

  saveSkipExpBooking() {
    let bookingDate;
    bookingDate = moment($('#skipCalendarDate').val().split('T')[0], 'YYYY-MM-DD').format('YYYY-MM-DD');
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    const skipCalendarDate = $('#skipCalendarDate').val();
    const currDate = moment().format('MM/DD/YYYY');

    const clickDate = moment(skipCalendarDate, 'MM/DD/YYYY').format('MM/DD/YYYY');
    const isoU = moment(currDate).isSameOrBefore(clickDate);

    if (isoU === false) {
      this.toastr.warning('Express Booking Appointment date / time can not be in the past', null, { timeOut: 2500 });
    } else {
      this.bookingDate = $('#skipdateAndTime').val();
      this.workername = $('#skipworkername').val();
      this.workerId = $('#skipexpressworkerId').val();
      const servicePrice = $('#skipPrice').val();
      const expressSumDuration = $('#skipDuration').val();
      const dbTime = $('#skiptimes').val().split(' ');
      const dbTime2 = dbTime[0].split(':');
      let dbHrs: any = parseInt(dbTime2[0], 10);
      if (dbTime[1] === 'PM' && dbHrs !== 12) {
        dbHrs += 12;
      } else if (dbTime[1] === 'AM' && dbHrs === 12) {
        dbHrs = 0;
      }
      dbHrs = ('0' + dbHrs).slice(-2);
      const startHrs = dbHrs;
      const endHrs = dbTime2[1];
      const modifyData = this.apptCalculateServiceTax(this.inputs);
      if (this.bookingDate !== '') {
        this.skipBookingDates = this.bookingDate.split('T')[0] + ' ' + dbHrs + ':' + dbTime2[1];
      } else {
        this.skipBookingDates = this.cldDate + ' ' + dbHrs + ':' + dbTime2[1];
      }
      this.dataObjects = {
        'bookingDate': this.skipBookingDates,
        'workerId': this.workerId,
        'workername': this.workername,
        'price': servicePrice,
        'duration': expressSumDuration,
        'textArea': this.skiptextArea,
        'visitType': this.skipVisitType,
        'service': this.inputs,
        'totalServiceTax': modifyData.serviceTax,
        'totalPrice': modifyData.sales
      };
      if (this.submitParam) {
        this.submitParam = false;
        this.appointmentsServices.skipBooking(this.dataObjects).subscribe(
          data => {
            this.submitParam = true;
            // const t = data['result'].affectedRows;
            if (data['result'].length > 0) {
              $('#skipModel').hide(500);
              this.router.navigate(['/appointments']).then(() => {
                this.toastr.success('Successfully created appointment', null, { timeOut: 1500 });
              });
              if (this.bookingDate === '') {
                const callBack = new Date(moment(skipCalendarDate + ' ' + '00:00:00').format('ddd MMMM DD YYYY h:mm:ss').toString());
                this.goToDate(callBack, 0);
                this.closePopup();
              } else {
                const callBack1 = new Date(moment(this.bookingDate.split('T')[0]).format('ddd MMMM DD YYYY h:mm:ss').toString());
                this.goToDate(callBack1, 0);
                this.closePopup();
              }

            }
          },
          error => {
            this.submitParam = true;
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                if (this.router.url !== '/') {
                  localStorage.setItem('page', this.router.url);
                  this.router.navigate(['/']).then(() => { });
                }
              }
            }
          });
      }
    }
  }

  /*--- This Method lists Client Fields ---*/
  listClientFields() {
    this.appointmentsServices.getClientFields().subscribe(
      data => {
        const clientFeilds = JSON.parse(data['result'][1].JSON__c);
        this.allowQuickAddAccess = clientFeilds.allowQuickAdd;
        if (this.allowQuickAddAccess === true) {
          this.clientfieldMobilePhone = clientFeilds.mobilePhone;
          this.clientfieldPrimaryEmail = clientFeilds.primaryEmail;
        }
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

  apptWeekCalculate(workerTimings) {
    const resultObj = [];
    const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    weekDays.map((day, i) => {
      const obj: any = {};
      obj['dow'] = [i];
      if (workerTimings[day + 'Start']) {
        obj['start'] = moment(workerTimings[day + 'Start'], 'hh:mm A').format('HH:mm');
        obj['end'] = moment(workerTimings[day + 'End'], 'hh:mm A').format('HH:mm');
      } else {
        obj['start'] = '23:59';
        obj['end'] = '24:00';
      }
      resultObj.push(obj);
    });
    return resultObj;
  }
  // days[0] = moment(startOfWeek, 'YYYY-MM-DD').add('days', 0).format('YYYY-MM-DD');
  // for (let i = 0; i < individualWorkerWeek.length; i++) {
  //   MonStart = moment(day1 + ' ' + individualWorkerWeek[i].MonStart, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DDTHH:mm');
  //   MonEnd = moment(day1 + ' ' + individualWorkerWeek[i].MonEnd, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DDTHH:mm');
  // }
  getHideClientContactInfo() {
    this.appointmentsServices.getHideCliContactInfo(this.decodeUserToken.data.id).subscribe(data => {
      if (data['result'] && data['result'].length > 0) {
        this.hideClientInfo = data['result'][0].Hide_Client_Contact_Info__c;
      }
    }, error => {
      const errStatus = JSON.parse(error['_body'])['status'];
      if (errStatus === '2085' || errStatus === '2071') {
        if (this.router.url !== '/') {
          localStorage.setItem('page', this.router.url);
          this.router.navigate(['/']).then(() => { });
        }
      }
    });
  }


  pasteNumPhone(value) {
    let temp = '';
    if (value.indexOf('(') !== 0) {
      for (let i = 0; i < value.length; i++) {
        if (i === 0) {
          temp += '(' + value[i];
        } else if (i === 2) {
          temp += value[i] + ')';
        } else if (i === 5) {
          temp += value[i] + '-';
        } else {
          temp += value[i];
        }
        this.mobileNumber = temp.substr(0, 13);
      }
    }
  }

}
