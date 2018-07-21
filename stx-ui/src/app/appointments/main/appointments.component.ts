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
import { JwtHelper } from 'angular2-jwt';
import { Alert } from 'selenium-webdriver';

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
  public getWorker: any;
  Users: any;
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
  mobileCarrier: any;
  primaryEmail: any;
  visitType: any;
  expressVisitType: any;
  textArea: any;
  workername: any;
  startDateTime: any;
  bookingDate: any;

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
  autoList = [];
  individualServiceColor: any = [];
  calendarUsersListing: any;
  individualcalendarUsersListing: any;
  serviceStartTime: any;
  serviceEndTime: any;
  selWorker = 'all';
  selWeek = 'One Day';
  individualWorkerWeek: any;
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
  /* client fileds */
  allowQuickAddAccess: any;
  clientfieldMobilePhone: any;
  clientfieldPrimaryEmail: any;
  /* client fields end */

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
    this.searchField.valueChanges
      .debounceTime(400)
      // .distinctUntilChanged()
      .switchMap(term => this.appointmentsServices.getClientAutoSearch(term)
      ).subscribe(
        data => {
          this.autoList = [];
          this.autoList = data['result'];
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
    this.appointmentsServices.getDftTmZn().subscribe(
      data => {
        const tmZnObj = data['result']
          .filter((obj) => obj.isDefault__c)[0]['TimeZoneSidKey__c']
          .split(')')[0]
          .replace('(GMT', '')
          .split(':');
        const hrs = parseInt(tmZnObj[0], 10);
        const min = parseInt(tmZnObj[1], 10);
        let timDiff = 0;
        if (tmZnObj[0][0] === '+') {
          timDiff = (hrs * 60) + min;
        } else {
          timDiff = (hrs * 60) - min;
        }
        const curDate = apptDate;
        // if (isNullOrUndefined(date)) {
        // curDate.setMinutes(curDate.getMinutes() + curDate.getTimezoneOffset() + timDiff);
        // curDate.setHours(0);
        // curDate.setMinutes(0);
        // curDate.setSeconds(0);
        //  }
        this.listDate = curDate;
        this.getWorkerList();
        this.getApptUserList();
        this.updateHeaderDate(this.listDate);
        this.updateDatepickerDate(this.listDate);
        this.getCommonData();
        this.onDateChanged(this.dateCatch);
        this.allWorkers();
        // this.getAppointments(this.listDate, this.workerId, this.selWeek);
        this.mobileCarriersList();
        this.getVisitTypes();
        this.addInput();
        this.fetchingBookingInterval();
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
    localStorage.setItem('wokersChkd', '');
    localStorage.setItem('apptDateSlot', '');
    localStorage.setItem('apptTimeSlot', '');
    // this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('token'));
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
    this.allWorkers();
    this.getAppointments(date, this.workerId, this.selWeek);
    this.fetchWeek(this.selWeek);
    this.fetchingBookingInterval();
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
    this.allWorkers();
    this.getAppointments(this.listDate, this.workerId, this.selWeek);
    this.fetchWeek(this.selWeek);
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

  getApptUserList() {
    this.appointmentsServices.getApptUserList().subscribe(
      data => {
        this.Users = data['result'];
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
          this.appointmentsList[i].apdate = this.appointmentsList[i].apdate;
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
  cancelModel() {
    this.bookStandingModal.hide();
    this.bookApptModal.hide();
    this.msgBoardModal.hide();
    this.searchKey = '';
    this.DataObj = [];
  }

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
      if (event.clientID === '') {
        window.open('#/appointment/bookoutdetail/' + event.apptId, '_self');
      } else {
        window.open('#/appointmentdetail/' + event.clientID + '/' + event.apptId, '_self');
      }
    };


    calObj.eventAfterAllRender = function (view) {

      const assdd = $('.fc-event-container');
      const color = document.getElementsByClassName('fc-time-grid-event fc-v-event fc-event fc-start fc-end fc-draggable fc-resizable');
      // console.log(color);
      // for (let l = 0; l < color.length; l++) {
      //   console.log(color[l]);
      // }



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
        const tempInnerHTMl = temp[i].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        temp[i].innerHTML = tempInnerHTMl;
      }
      // $('.fc-slats').html($('.fc-widget-content').html().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
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
            this.borderColor[i] = this.booking;
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
          } else if (this.calendarUsersListing[i].status === 'pending') {
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
          if (this.calendarUsersListing[i].Is_Booked_Out__c === 0 && this.calendarUsersListing[i].Notes__c !== '' && this.calendarUsersListing[i].Appt_Icon === 'asterix') {
            booked = ' ♪ * ' + userName + ' / ' + this.calendarUsersListing[i].serviceName;
          } else if (this.calendarUsersListing[i].Is_Booked_Out__c === 0 && this.calendarUsersListing[i].Notes__c !== '' && this.calendarUsersListing[i].Appt_Icon !== 'asterix') {
            booked = ' ♪ ' + userName + ' / ' + this.calendarUsersListing[i].serviceName;
          } else if (this.calendarUsersListing[i].Is_Booked_Out__c === 0 && this.calendarUsersListing[i].Notes__c === '' && this.calendarUsersListing[i].Appt_Icon === 'asterix') {
            booked = ' * ' + userName + ' / ' + this.calendarUsersListing[i].serviceName;
          } else {
            booked = userName + ' / ' + this.calendarUsersListing[i].serviceName;
          } if (this.calendarUsersListing[i].Is_Booked_Out__c === 1 && this.calendarUsersListing[i].Notes__c !== '') {
            booked = ' ♪ ' + 'Book Out Time';
          } else if (this.calendarUsersListing[i].Is_Booked_Out__c === 1 && this.calendarUsersListing[i].Notes__c === '') {
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
              'status': this.calendarUsersListing[i].status
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
              let calendarDate: any = [];
              calendarDate = [];
              if (this.apptdate !== '') {
                const date1 = moment(this.apptdate).format('L');
                calendarDate = date1;
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
                const mobileCarrier = $('#mobileCarrier').val('');
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
                const dateAndTime = $('#startDateTime').val(this.startDateTime);  // in this date with time
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
                  titleFormat: 'dddd, MMMM D, YYYY',
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
   * @param individual  works only
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
      for (let p = 0; p < this.startbooking.length; p++) {
        if (this.statusColor[p] === 'Checked In') {
          this.borderColor[0] = this.checkedIn;
        } else if (this.statusColor[p] === 'Booked') {
          this.borderColor[0] = this.booked;
        } else if (this.statusColor[p] === 'Confirmed') {
          this.borderColor[0] = this.confirmed;
        } else if (this.statusColor[p] === 'No Show') {
          this.borderColor[0] = this.noShow;
        } else if (this.statusColor[p] === 'Pending Deposit') {
          this.borderColor[0] = this.pendingDeposit;
        } else if (this.statusColor[p] === 'Reminder') {
          this.borderColor[0] = this.reminderSent;
        } else if (this.statusColor[p] === 'Sent') {
          this.borderColor[0] = 'gray';
        } else if (this.statusColor[p] === 'Complete') {
          this.borderColor[0] = this.complete;
        } else if (this.statusColor[p] === 'Canceled') {
          this.borderColor[0] = this.canceled;
        }
      }
      this.appointmentsServices.getAppontmentList(this.cldDate).subscribe(
        data => {
          this.individualcalendarUsersListing = data['result'];
          for (let i = 0; i < this.individualcalendarUsersListing.length; i++) {
            this.serviceStartTime = moment(this.individualcalendarUsersListing[i].Service_Date_Time__c).format().split(' ')[0];
            const durationInMinutes = this.individualcalendarUsersListing[i].Duration__c;   // duration
            this.serviceEndTime = moment(this.serviceStartTime).add(durationInMinutes, 'minutes').format().split('+')[0];
            this.finalArry1.push(
              {
                'resourceId': this.individualcalendarUsersListing[i].Worker__c,
                'apptId': this.individualcalendarUsersListing[i].Appt_Ticket__c,
                'ticket_service_id': this.individualcalendarUsersListing[i].tsid,
                'title': this.individualcalendarUsersListing[i].Name + ' / ' + this.individualcalendarUsersListing[i].serviceName,
                'start': this.serviceStartTime.split('+')[0],
                'end': this.serviceEndTime,
                'textColor': 'black',
                'borderColor': this.borderColor,
                'color': this.individualcalendarUsersListing[i].serviceGroupColor,
                'clientID': this.individualcalendarUsersListing[i].clientID
              });
          }
          this.individualWorkerId = (value + '').split('$')[0];
          this.name = (value + '').split('$')[1];
          if (this.individualWorkerId === '') {
            this.individualWorkerId = this.selWorker.split('$')[0];

          }
          if (this.individualWorkerId !== '') {
            this.appointmentsServices.postWorkerName(this.individualWorkerId, this.dateCatch, this.cldDate).subscribe(
              data1 => {
                this.calendarList = data1['result'];
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
                  const durationInMinutes1 = '-60';
                  const durationInMinutes2 = '60';
                  let MinTime: any;
                  let MaxTime: any;

                  if (this.calendarList[0].min !== undefined && this.calendarList[0].max !== undefined) {

                    MinTime = moment(this.calendarList[0].min, 'h:mm:ss A').add(durationInMinutes1, 'minutes').format('HH:mm:ss');
                    MaxTime = moment(this.calendarList[0].max, 'h:mm:ss A').add(durationInMinutes2, 'minutes').format('HH:mm:ss');
                  } else {
                    MinTime = undefined;
                    MaxTime = undefined;
                  }

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
                    const mobileCarrier = $('#mobileCarrier').val('');
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
                    minTime: MinTime,
                    maxTime: MaxTime,
                    // weekends: false,
                    slotLabelInterval: '00:' + (JSON.parse(this.booking)) + ':00',
                    slotDuration: '00:' + (JSON.parse(this.booking)) + ':00',
                    header: {
                      left: '',
                      center: '',
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
                      agendaWeek: {
                        type: 'agendaDay',
                        groupByResource: true,
                        titleFormat: 'dddd, MMMM D, YYYY',
                      }
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
                this.borderColor[i] = this.booking;
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
              } else if (this.calendarUsersListing[i].status === 'pending') {
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
              if (this.calendarUsersListing[i].Is_Booked_Out__c === 0 && this.calendarUsersListing[i].Notes__c !== 'null'
                && this.calendarUsersListing[i].Notes__c !== '' && this.calendarUsersListing[i].Appt_Icon === 'asterix' && this.calendarUsersListing[i].standing !== 1) {
                if (this.calendarUsersListing[i].New_Client__c === 1) {
                  booked = ' ♪ * ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + this.calendarUsersListing[i].serviceName;
                } else if (this.calendarUsersListing[i].New_Client__c === 0) {
                  booked = ' ♪ * ' + userName + ' / ' + this.calendarUsersListing[i].serviceName;
                }
              } else if (this.calendarUsersListing[i].Is_Booked_Out__c === 0 && this.calendarUsersListing[i].Notes__c !== 'null'
                && this.calendarUsersListing[i].Notes__c !== '' && this.calendarUsersListing[i].Appt_Icon !== 'asterix' && this.calendarUsersListing[i].standing !== 1) {
                if (this.calendarUsersListing[i].New_Client__c === 1) {
                  booked = ' ♪ ' + '<span style="color:red;font-weight:bold;">' + userName + ' </span> / ' + this.calendarUsersListing[i].serviceName;
                } else if (this.calendarUsersListing[i].New_Client__c === 0) {
                  booked = ' ♪ ' + userName + ' / ' + this.calendarUsersListing[i].serviceName;
                }
              } else if (this.calendarUsersListing[i].Is_Booked_Out__c === 0 && this.calendarUsersListing[i].Notes__c === '' && this.calendarUsersListing[i].Appt_Icon === 'asterix'
                && this.calendarUsersListing[i].standing !== 1) {
                booked = ' * ' + userName + ' / ' + this.calendarUsersListing[i].serviceName;
              } else if (this.calendarUsersListing[i].standing === 1 && this.calendarUsersListing[i].Is_Booked_Out__c === 0 && this.calendarUsersListing[i].Notes__c === ''
                || this.calendarUsersListing[i].Notes__c === null && this.calendarUsersListing[i].Appt_Icon !== 'asterix') {
                booked = '♯' + userName + ' / ' + this.calendarUsersListing[i].serviceName;
              } else if (this.calendarUsersListing[i].standing === 1 && this.calendarUsersListing[i].Is_Booked_Out__c === 0 && this.calendarUsersListing[i].Notes__c === ''
                || this.calendarUsersListing[i].Notes__c === null && this.calendarUsersListing[i].Appt_Icon === 'asterix') {
                booked = '* ♯' + userName + ' / ' + this.calendarUsersListing[i].serviceName;
              } else if (this.calendarUsersListing[i].standing === 1 && this.calendarUsersListing[i].Is_Booked_Out__c === 0 && this.calendarUsersListing[i].Notes__c !== ''
                || this.calendarUsersListing[i].Notes__c !== null && this.calendarUsersListing[i].Appt_Icon === 'asterix') {
                booked = '♪ * ♯' + userName + ' / ' + this.calendarUsersListing[i].serviceName;
              } else {
                booked = userName + ' / ' + this.calendarUsersListing[i].serviceName;
              }

              if (this.calendarUsersListing[i].Is_Booked_Out__c === 1 && this.calendarUsersListing[i].Notes__c !== '') {
                booked = ' ♪ ' + 'Book Out Time';
              } else if (this.calendarUsersListing[i].Is_Booked_Out__c === 1 && this.calendarUsersListing[i].Notes__c === '') {
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
                  'status': this.calendarUsersListing[i].status
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
                this.toastr.warning('Present no worker in active ', null, { timeOut: 4000 });
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

                  let calendarDate: any = [];
                  calendarDate = [];
                  if (this.apptdate !== '') {
                    const date1 = moment(this.cldDate).format('L');
                    calendarDate = date1;
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
                    const mobileCarrier = $('#mobileCarrier').val('');
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
                MaxStartTime = moment(this.eventCalendar[0].min, 'HH').add(durationInMinutes1, 'minutes').format('HH:mm');
                MaxEndTime = moment(this.eventCalendar[0].max, 'HH').add(durationInMinutes2, 'minutes').format('HH:mm');
              } else {
                MaxStartTime = moment(this.finalMin, 'h:mm:ss A').add(durationInMinutes1, 'minutes').format('HH:mm');
                MaxEndTime = moment(this.finalMax, 'h:mm:ss A').add(durationInMinutes2, 'minutes').format('HH:mm');
              }
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
                  var title = this.dateCatch;
                  const chked = localStorage.getItem('wokersChkd');
                  const s = '<div  id="myId"><input id="workerCheckerd" ' + chked + ' type="checkbox"/> '
                    + '<label for="workerCheckerd">Show All Workers</label></div><div class="appnt-pro-name"><h6>TIME</h6> </div>';
                  element.find('.fc-axis:first').html(s);
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
                      const eventStartTime = moment(eventDate + event.start._i[3] + event.start._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
                      const eventEndTime = moment(eventDate + event.end._i[3] + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
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
                      }
                    } else {
                      swal({
                        text: 'Unable to move Appt ,refresh page and try again',
                        timer: 2000,
                        buttons: false
                      });
                      revertFunc();
                      // return;
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
                  const eventEndTime = moment(eventDate + event.end._i[3] + ':' + event.end._i[4], 'YYYY-MM-DD hh:mm').format('YYYY-MM-DD HH:mm');
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
      // if (value === 'weekday') {
      //   this.selWeek = 'One Weekday';
      // } else if (value === 'One Week') {
      //   this.selWeek = 'One Week';
      // } else if (value === 'day') {
      //   this.selWeek = 'One Day';
      // } else if (value === 'month') {
      //   this.selWeek = 'month';
      // }
      var apiEndPoint = this.apiEndPoint;
      let calendarDate: any = [];
      calendarDate = [];
      if (this.apptdate !== '') {
        const date1 = moment(this.apptdate).format('L');
        calendarDate = date1;
      }
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
            const events = [];
            const resources = [];
            const bussinessHrs = [];
            for (let i = 0; i < this.individualWorkerWeek.length; i++) {
              this.serviceStartTime = moment(this.individualWorkerWeek[i].Service_Date_Time__c).format().split('+')[0];
              const durationInMinutes = this.individualWorkerWeek[i].Duration__c;   // duration
              this.serviceEndTime = moment(this.serviceStartTime).add(durationInMinutes, 'minutes').format().split('+')[0];
              events.push(
                {
                  'resourceId': this.individualWorkerWeek[i].Worker__c,
                  'apptId': this.individualWorkerWeek[i].Appt_Ticket__c,
                  'ticket_service_id': this.individualWorkerWeek[i].tsid,
                  'title': this.individualWorkerWeek[i].Name + ' / ' + this.individualWorkerWeek[i].serviceName,
                  'start': this.serviceStartTime,
                  'end': this.serviceEndTime,
                  'textColor': 'black',
                  'borderColor': this.borderColor,
                  'color': this.individualWorkerWeek[i].serviceGroupColor,
                  'clientID': this.individualWorkerWeek[i].clientID
                });
            }
            // var resourceRender = function (resourceObj, labelTds, bodyTds) {
            //   const date = '<div class="appnt-pro-name"><h4>' + resourceObj.date + ' </h4></div>';
            //   labelTds.prepend(date);
            // };
            const MaxStartTime = moment(this.finalMin, 'h:mm:ss', ).format('LTS').split(' ')[0];
            const MaxEndTime = moment(this.finalMax, 'h:mm:ss A').format('HH:mm:ss').split(' ')[0];
            if (this.individualWorkerWeek && this.individualWorkerWeek.length > 0) {
              resources.push(
                {
                  id: this.individualWorkerWeek[0].Worker__c,
                  //  title: this.individualWorkerWeek[0].Name,
                  //    date: startOfWeek1,
                  businessHours: {
                    start: '07:00:00',
                    end: '18:00:00',
                    dow: [0, 1, 2, 3, 4, 5, 6],
                  },
                });
            }

            const ole = JSON.parse(this.booking);
            const MinTimesInMinutes = '-60';
            const MaxTimesInMinutes = '60';
            const MinTimes = moment(this.serviceStartTime, 'h:mm:ss', ).add(MinTimesInMinutes, 'minutes').format('LTS').split(' ')[0];
            const MaxTimes = moment(this.serviceEndTime, 'h:mm:ss A').add(MaxTimesInMinutes, 'minutes').format('HH:mm:ss').split(' ')[0];
            const startOfWeek12 = moment(startOfWeek1).startOf('week').format('LL');
            const endOfWeek12 = moment(startOfWeek1).endOf('week').format('LL');
            this.mainApptDate = '';
            this.mainApptDate = startOfWeek12 + ' - ' + endOfWeek12;

            var select = function (start, end, jsEvent, view, selectresource) {
              let datIndex = 0;
              const crDate = new Date();
              const startDate = new Date(0, 0, 0, parseInt(MinTimes.split(':')[0], 10), 0, 0, 0);
              const endDate = new Date(0, 0, 0, parseInt(MaxTimes.split(':')[0], 10), 0, 0, 0);
              this.TimeData = [];
              const firstName = $('#firstName').val('');
              const LastName = $('#lastName').val('');
              const mobileNumber = $('#mobileNumber').val('');
              const mobileCarrier = $('#mobileCarrier').val('');
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
              const date = this.startDateTime.split('T')[0];
              const formatDate = moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
              this.end = end.format();
              $('#myModal').show();
              const appoitmentdate = $('#CalendarDate').val(calendarDate);    // date of appointments
              const dateAndTime = $('#startDateTime').val(this.startDateTime);  // in this date with time

              const dateAndTime2 = $('#expressstartDateTime').val(this.startDateTime);
              const appoitmentdate2 = $('#CalendarDate2').val(formatDate);

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
                const optionVals = this.TimeData[i];
                const opt3 = new Option(optionVals, optionVals);
                opt3.className = 'select-bg-option';
                selectBox.options.add(opt3);
              }
              selectBox.value = selTimOpt;


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
              this.expressBookinWorkerName = $('#expressworkerId').val(selectresource.title);
              const worSel = <HTMLSelectElement>document.getElementById('workerIds');
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
              defaultView: 'agendaWeek',
              defaultDate: startOfWeek1,
              editable: true,
              selectable: true,
              eventLimit: true,
              allDaySlot: false,
              allDayDefault: false,
              minTime: '05:00:00',
              maxTime: '20:00:00',
              slotLabelInterval: '00:' + (JSON.parse(this.booking)) + ':00',
              slotDuration: '00:' + (JSON.parse(this.booking)) + ':00',
              weekends: true,
              header: {
                left: '',
                center: '',
                right: ''
              },
              slotLabelFormat: [
                'h(:mm) a'
              ],
              // viewRender: function (view, element) {
              //   const s = '<div class="appnt-pro-name"><h6>TIME</h6> </div>';
              //   element.find('.fc-axis:first').html(s);
              // },
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
              //   resourceRender: resourceRender,
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
                  //  const eventDate = moment(eventStartDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                  // const start_time = event.start._i[3] + ':' + event.start._i[4].toString();
                  // const end_time = event.end._i[3] + ':' + event.end._i[4].toString();
                  // const eventStartTime = moment(eventDate + ' ' + start_time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
                  // const eventEndTime = moment(eventDate + ' ' + end_time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
                  // const startAndEnd = moment.duration(moment(eventStartTime).diff(eventEndTime));
                  // const duration = startAndEnd.asMinutes();
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
                    localStorage.setItem('token', request.getResponseHeader('token'));
                  }
                });
              },
              schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
            };
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
        this.individualWorkerWeek = [];
        this.appointmentsServices.getWorkerWeek(this.selWorker.split('$')[0], this.cldDate, this.selWeek).subscribe(
          data => {
            this.individualWorkerWeek = data['result'];
            const events = [];
            const resources = [];
            for (let i = 0; i < this.individualWorkerWeek.length; i++) {
              this.serviceStartTime = moment(this.individualWorkerWeek[i].Service_Date_Time__c).format().split('+')[0];
              const durationInMinutes = this.individualWorkerWeek[i].Duration__c;   // duration
              this.serviceEndTime = moment(this.serviceStartTime).add(durationInMinutes, 'minutes').format().split('+')[0];
              events.push(
                {
                  'resourceId': this.individualWorkerWeek[i].Worker__c,
                  'apptId': this.individualWorkerWeek[i].Appt_Ticket__c,
                  'ticket_service_id': this.individualWorkerWeek[i].tsid,
                  'title': this.individualWorkerWeek[i].Name + ' / ' + this.individualWorkerWeek[i].serviceName,
                  'start': this.serviceStartTime,
                  'end': this.serviceEndTime,
                  'textColor': 'black',
                  'borderColor': this.borderColor,
                  'color': this.individualWorkerWeek[i].serviceGroupColor,
                  'clientID': this.individualWorkerWeek[i].clientID
                });
            }
            this.viewBy = value;
            const hiddenDaysObj = [0, 1, 2, 3, 4, 5, 6];
            let wkIndex = 0;
            switch (this.dateCatch) {
              case 'Monday':
                wkIndex = 1;
                break;
              case 'Tuesday':
                wkIndex = 2;
                break;
              case 'Wednesday':
                wkIndex = 3;
                break;
              case 'Thursday':
                wkIndex = 4;
                break;
              case 'Friday':
                wkIndex = 5;
                break;
              case 'Saturday':
                wkIndex = 6;
                break;
            }
            hiddenDaysObj.splice(wkIndex, 1);
            resources.push(
              {
                id: this.individualWorkerWeek[0].Worker__c,
                businessHours: {
                  start: '07:00:00',
                  end: '18:00:00',
                  dow: [0, 1, 2, 3, 4, 5, 6],
                },
              });
            this.mainApptDate = moment(this.cldDate).format('MMMM YYYY dddd');
            const MinTimesInMinutes = '-60';
            const MaxTimesInMinutes = '60';
            const MinTimes = moment(this.individualWorkerWeek[0].min, 'h:mm:ss', ).add(MinTimesInMinutes, 'minutes').format('LTS').split(' ')[0];
            const MaxTimes = moment(this.individualWorkerWeek[0].max, 'h:mm:ss A').add(MaxTimesInMinutes, 'minutes').format('HH:mm:ss').split(' ')[0];

            const ole = JSON.parse(this.booking);
            var select = function (start, end, jsEvent, view, selectresource) {
              let datIndex = 0;
              const crDate = new Date();
              const startDate = new Date(0, 0, 0, parseInt(MinTimes.split(':')[0], 10), 0, 0, 0);
              const endDate = new Date(0, 0, 0, parseInt(MaxTimes.split(':')[0], 10), 0, 0, 0);
              this.TimeData = [];
              const firstName = $('#firstName').val('');
              const LastName = $('#lastName').val('');
              const mobileNumber = $('#mobileNumber').val('');
              const mobileCarrier = $('#mobileCarrier').val('');
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
              const formatDate = moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
              this.end = end.format();
              $('#myModal').show();
              const appoitmentdate = $('#CalendarDate').val(calendarDate);
              const apptDate2 = $('#CalendarDate2').val(formatDate);

              const dateAndTime = $('#startDateTime').val(this.startDateTime);
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
              selectBox.value = selTimOpt;

              const selectBox1 = <HTMLSelectElement>document.getElementById('expresstimes');
              selectBox1.options.length = 0;
              for (let i = 0; i < this.TimeData.length; i++) {
                const optionVal = this.TimeData[i];
                const opt = new Option(optionVal, optionVal);
                opt.className = 'select-bg-option';
                selectBox1.options.add(opt);
              }
              selectBox1.value = selTimOpt;


              this.expressBookinWorkerName = $('#workername').val(selectresource.title);
              this.expressBookinWorkerName = $('#expressworkername').val(selectresource.title);

              const worSel = <HTMLSelectElement>document.getElementById('workerIds');
              worSel.value = selectresource.id;

              const worSel1 = <HTMLSelectElement>document.getElementById('expressworkerId');
              worSel1.value = selectresource.id;

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
              defaultView: 'settimana',
              // defaultDate: this.datePickerDate.date.year + '-' + this.datePickerDate.date.month + '-' + this.datePickerDate.date.day,
              defaultDate: this.cldDate,
              editable: true,
              selectable: true,
              eventLimit: true,
              allDaySlot: false,
              minTime: '05:00:00',
              maxTime: '22:00:00',
              slotDuration: '00:' + (JSON.parse(this.booking)) + ':00',
              slotLabelInterval: '00:' + (JSON.parse(this.booking)) + ':00',
              weekends: true,
              header: {
                left: '',
                center: '',
                right: '',
              },
              slotLabelFormat: [
                'h(:mm) a'
              ],
              // viewRender: function (view, element) {
              //   var title = this.dateCatch;
              //   const s = '<div class="appnt-pro-name"><h6>TIME</h6> </div>';
              //   element.find('.fc-axis:first').html(s);
              // },
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
          //    resources: resources,
          schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
        };
        this.loadCalender(calObj);
      } else if (this.selWorker === 'all' && this.selWeek === 'One Weekday') {
        const calObj = {
          defaultView: 'settimana',
          // defaultDate: this.datePickerDate.date.year + '-' + this.datePickerDate.date.month + '-' + this.datePickerDate.date.day,
          defaultDate: this.cldDate,
          editable: true,
          selectable: true,
          eventLimit: true,
          allDaySlot: false,
          minTime: '08:00',
          maxTime: '17:00',
          slotDuration: '00:15:00',
          slotLabelInterval: '00:15:00',
          weekends: true,
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
    let pckData = [];
    const pckArray = [];
    let sumOfDiscountedPrice = 0;
    let discountedPackageTotal = 0;
    let discountedPackage = 0;
    let rows = [];
    let pckgObj = {};
    let pckId = '';
    const ticketServiceData = [];
    if (apptData.Booked_Package__c && apptData.Booked_Package__c !== '' && apptData.Booked_Package__c !== ',' &&
      apptData.Booked_Package__c !== 'undefined' && apptData.apstatus !== 'Checked In') {
      this.apptDetailService.getApptServices(apptData.clientId, apptData.apptid).subscribe(data => {
        const resData = data['result'];
        rows = resData.srvcresult;
        const bookedPckgVal = apptData.Booked_Package__c.split(',');
        for (let i = 0; i < bookedPckgVal.length; i++) {
          pckData = pckData.concat(this.packagesList.filter((obj) => obj.Id === bookedPckgVal[i]));
          if (pckData && pckData[i] && pckData[i].Discounted_Package__c) {
            pckId = pckData[i].Id;
            discountedPackage += parseFloat(pckData[i].Discounted_Package__c);
            discountedPackageTotal += parseFloat(pckData[i].Discounted_Package__c);
            for (let j = 0; j < JSON.parse(pckData[i].JSON__c).length; j++) {
              sumOfDiscountedPrice += parseFloat(JSON.parse(pckData[i].JSON__c)[j].discountPriceEach);
              if ((rows[i].Id === JSON.parse(pckData[i].JSON__c)[j].serviceId) && (bookedPckgVal[i] === pckData[i].Id)) {
                ticketServiceData.push({
                  'pckId': pckId,
                  'serviceId': rows[i].Id,
                  'netPrice': JSON.parse(pckData[i].JSON__c)[j].discountPriceEach
                });
              }
            }

          }
          pckArray.push({
            'pckId': pckId,
            'sumOfDiscountedPrice': sumOfDiscountedPrice,
            'discountedPackage': discountedPackage,
            // 'discountPriceEach':
          });
          sumOfDiscountedPrice = 0;
          discountedPackage = 0;
        }
        pckgObj = {
          'pckArray': this.commonService.removeDuplicates(pckArray, 'pckId'),
          'discountedPackageTotal': discountedPackageTotal,
          // 'discountedPackage': discountedPackage
          'ticketServiceData': ticketServiceData
        };
        if (this.isCheckedInStatus(apptData.apstatus)) {
          apptData.apstatus = 'Checked In';
          const apptDataObj = {
            'apstatus': 'Checked In',
            'clientCurBal': apptData.Current_Balance__c,
            'apptId': apptData.apptid,
            'netprice': apptData.netprice

          };
          this.checkIn(apptDataObj, pckgObj);
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
    } else if (this.isCheckedInStatus(apptData.apstatus)) {
      apptData.apstatus = 'Checked In';
      const apptDataObj = {
        'apstatus': 'Checked In',
        'clientCurBal': apptData.Current_Balance__c,
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

  mobileCarriersList() {
    this.appointmentsServices.mobileCarriers().subscribe(
      data => {
        this.mobileCarriers = data['result'];
        this.mobileCarrierslist = [];
        for (let j = 0; j < this.mobileCarriers.length; j++) {
          if (this.mobileCarriers[j].active === true) {
            this.mobileCarrierslist.push(this.mobileCarriers[j].mobileCarrierName);
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
      });
  }

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
  selectExpBookService() {

  }
  addInput() {
    this.inputs.push({});
  }

  deleteFieldValue(index) {
    this.inputs.splice(index, 1);
    this.calculateServiceDurations();
  }

  listServices(value, i) {
    // this.servicePrice = value.split('$')[0];
    // const duration = value.split('$')[1];
    // const serviceGroupName = value.split('$')[4];
    // this.calculateServiceDurations();
    const obj = this.bookingExpress[i].filter((data) => data.serviceId === value);

    this.inputs[i]['service'] = obj[0];
    this.inputs[i]['serviceId'] = obj['serviceId'];
    this.calculateServiceDurations();
  }

  calculateServiceDurations() {
    this.servicePrice = 0;
    this.serviceDurations = 0;
    if (this.inputs && this.inputs.length > 0) {
      for (let j = 0; j < this.inputs.length; j++) {
        const serviceVal = this.inputs[j].service;
        if (serviceVal.Price__c) {
          this.servicePrice += parseInt(serviceVal.Price__c, 10);
        } else {
          this.servicePrice += parseInt(serviceVal.pcsergrp, 10);
        }
        if (serviceVal.sumDurationBuffer !== '') {
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
    const bookingDate = $('#startDateTime').val().split('T')[0];
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const CalendarDate = $('#CalendarDate').val();
    if ((this.firstName === undefined || this.firstName === '') || (this.lastName === '' || this.lastName === undefined) ||
      (CalendarDate < moment().format('MM/DD/YYYY')) || (this.clientfieldPrimaryEmail === true && this.primaryEmail === undefined) ||
      (this.clientfieldMobilePhone === true && this.mobileNumber === undefined)) {
      if (this.firstName === '' || this.firstName === undefined) {
        this.errorFirstName = 'APPOINTMENTS_MAIN_PAGE.ERROR_FIRST_NAME';
      }
      if (this.lastName === '' || this.lastName === undefined) {
        this.errorLastName = 'APPOINTMENTS_MAIN_PAGE.ERROR_LAST_NAME';
      }
      if (this.clientfieldMobilePhone === true && this.mobileNumber === undefined) {
        this.errormobilephone = 'APPOINTMENTS_MAIN_PAGE.ERROR_MOBILEPHONE';
      }
      if (this.clientfieldPrimaryEmail === true && (this.primaryEmail === undefined)) {
        this.errorEmail = 'APPOINTMENTS_MAIN_PAGE.ERROR_EMAIL';
      }
      if (CalendarDate < moment().format('MM/DD/YYYY')) {
        this.toastr.warning('Express Booking Appointment date / time can not be in the past', null, { timeOut: 2500 });
      }
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
      this.dataObjects = {
        'bookingDate': this.cldDate + ' ' + dbHrs + ':' + dbTime2[1],
        'workerId': this.workerId,
        'workername': this.workername,
        'firstName': this.firstName,
        'lastName': this.lastName,
        'mobileNumber': this.mobileNumber,
        'mobileCarrier': this.mobileCarrier,
        'primaryEmail': this.primaryEmail,
        'textArea': this.textArea,
        'visitType': this.expressVisitType,
        'sumDuration': expressSumDuration,
        'service': this.inputs,
        'price': servicePrice,
        // 'LastModifiedById': this.decodedToken.data.id
      };
      if (this.submitParam) {
        this.submitParam = false;
        // console.log(JSON.stringify(this.dataObjects));
        this.appointmentsServices.saveExpressClient(this.dataObjects).subscribe(
          data => {
            this.submitParam = true;
            const t = data['result'].affectedRows;
            if (t > 0) {
              $('#expressModel').hide(500);
              this.router.navigate(['/appointments']).then(() => {
                this.toastr.success('Successfully created appointment', null, { timeOut: 1500 });
              });
              const timesss = new Date(moment(this.bookingDate.split(' ')[0]).format('ddd MMMM DD YYYY h:mm:ss').toString());
              this.goToDate(timesss, 0);
              this.closePopup();
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
                  swal({
                    text: 'Duplicate record found',
                    timer: 2000,
                    buttons: false
                  });
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


    $('#existingExpressModel').show();
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
    this.mobileCarrier = DataObj.Mobile_Carrier__c;
    this.primaryEmail = DataObj.Email;
    this.expressClientIds = DataObj.Id;

  }
  existingExpressBooking() {
    const bookingDate = $('#expressstartDateTime').val().split('T')[0];
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const CalendarDate2 = $('#CalendarDate2').val();
    if ((this.firstName === undefined || this.firstName === '') || (this.lastName === '' || this.lastName === undefined)
      //  || (this.mobileNumber === '' || this.mobileNumber === undefined)
      // || (this.primaryEmail === undefined || this.primaryEmail === '')
      || (CalendarDate2 < moment().format('MM/DD/YYYY'))) {
      if (this.firstName === '' || this.firstName === undefined) {
        this.errorFirstName = 'APPOINTMENTS_MAIN_PAGE.ERROR_FIRST_NAME';
      }
      if (this.lastName === '' || this.lastName === undefined) {
        this.errorLastName = 'APPOINTMENTS_MAIN_PAGE.ERROR_LAST_NAME';
      }
      // if ((this.mobileNumber === '' || this.mobileNumber === undefined) && this.clientfieldMobilePhone === true) {
      //   this.errormobilephone = 'APPOINTMENTS_MAIN_PAGE.ERROR_MOBILEPHONE';
      // }
      // if ((this.primaryEmail === '' || this.primaryEmail === undefined) && this.clientfieldPrimaryEmail === true) {
      //   this.errorEmail = 'APPOINTMENTS_MAIN_PAGE.ERROR_EMAIL';
      // }
      if (CalendarDate2 < moment().format('MM/DD/YYYY')) {
        this.toastr.warning('Express Booking Appointment date / time can not be in the past', null, { timeOut: 2500 });
      }
    } else {
      const servicePrice2 = $('#servicePrice2').val();
      this.sumDuration = $('#sumDuration2').val();
      this.expressVisitType = $('#expressVisitType').val();
      this.bookingDate = $('#expressstartDateTime').val();
      this.workername = $('#expressworkername').val();
      const expressWorkerId = $('#expressworkerId').val();
      const dbTime = $('#expresstimes').val().split(' ');
      const dbTime2 = dbTime[0].split(':');
      let dbHrs: any = parseInt(dbTime2[0], 10);
      if (dbTime[1] === 'PM' && dbHrs !== 12) {
        dbHrs += 12;
      } else if (dbTime[1] === 'AM' && dbHrs === 12) {
        dbHrs = 0;
      }
      dbHrs = ('0' + dbHrs).slice(-2);
      this.dataObjects = {
        'bookingDate': this.cldDate + ' ' + dbHrs + ':' + dbTime2[1],
        'workerId': expressWorkerId,
        'workername': this.workername,
        'client_person_id': this.expressClientIds,
        'firstName': this.firstName,
        'lastName': this.lastName,
        'mobileNumber': this.mobileNumber,
        'mobileCarrier': this.mobileCarrier,
        'primaryEmail': this.primaryEmail,
        'textArea': this.textArea,
        'visitType': this.expressVisitType,
        'sumDuration': this.sumDuration,
        'service': this.inputs,
        'price': servicePrice2
      };
      if (this.submitParam) {
        this.submitParam = false;
        this.appointmentsServices.existingExpressBooking(this.dataObjects).subscribe(
          data => {
            this.submitParam = true;
            const t = data['result'].affectedRows;
            if (t > 0) {
              $('#existingExpressModel').hide(500);
              this.router.navigate(['/appointments']).then(() => {
                this.toastr.success('Successfully created appointment', null, { timeOut: 1500 });
              });
              const timesss = new Date(moment(this.bookingDate.split(' ')[0]).format('ddd MMMM DD YYYY h:mm:ss').toString());
              this.goToDate(timesss, 0);
              this.closePopup();
            }
          },
          error => {
            this.submitParam = true;
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });
      }
    }
  }
  closePopup() {
    const dsfp = $('#searchKeys').val('');
    const clearData = $('#firstLastClearData').val('');
    const worSel = <HTMLSelectElement>document.getElementById('workerIds');          // worker id
    worSel.value = '';
    this.autoList = [];

    // this.searchField.reset();
    $('#myModal').hide();
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
    const bookingDate = $('#skipCalendarDate').val().split('T')[0];
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const skipCalendarDate = $('#skipCalendarDate').val();
    if (skipCalendarDate < moment().format('MM/DD/YYYY')) {
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
      dbHrs = ('0' + dbHrs).slice(-2);
      this.dataObjects = {
        'bookingDate': this.cldDate + ' ' + dbHrs + ':' + dbTime2[1],
        'workerId': this.workerId,
        'workername': this.workername,
        'price': servicePrice,
        'duration': expressSumDuration,
        'textArea': this.skiptextArea,
        'visitType': this.skipVisitType,
        'service': this.inputs
      };
      if (this.submitParam) {
        this.submitParam = false;
        this.appointmentsServices.skipBooking(this.dataObjects).subscribe(
          data => {
            this.submitParam = true;
            const t = data['result'].affectedRows;
            if (t > 0) {
              $('#skipModel').hide(500);
              this.router.navigate(['/appointments']).then(() => {
                this.toastr.success('Successfully created appointment', null, { timeOut: 1500 });
              });
              const timesss = new Date(moment(this.bookingDate.split(' ')[0]).format('ddd MMMM DD YYYY h:mm:ss').toString());
              this.goToDate(timesss, 0);
              this.closePopup();
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

}
