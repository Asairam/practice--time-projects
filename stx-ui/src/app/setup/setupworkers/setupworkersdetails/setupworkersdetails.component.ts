import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SetupWorkersDetailsService } from './setupworkersdetails.service';
// import { environment } from '../../../environments/environment';
import * as config from '../../../app.config';
import { CommonService } from '../../../common/common.service';
import { JwtHelper } from 'angular2-jwt';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-setupworkersdetails-popup',
  templateUrl: './setupworkersdetails.html',
  providers: [SetupWorkersDetailsService, CommonService],
  styleUrls: ['./setupworkersdetails.css']
})
export class SetupWorkersDetailsComponent implements OnInit {
  decodedToken: any;
  bsValue: any = new Date();
  inactive = false;
  // maxDate = new Date(2018, 9, 15);
  isClass: any;
  disableDiv = true;
  addDiv = false;
  hideTable = true;
  editDiv = false;
  serviceTab = false;
  showInactiveData: any;
  userList: any;
  updateId: any = '';
  activeStatus: any = false;
  workerDataAdd = false;
  firstName: any;
  middleName: any;
  lastName: any;
  email: any;
  startDate: any;
  workerPin: any;
  userName: any;
  displayOrder: any;
  password1 = '';
  password2 = '';
  glyphiconClass1 = 'glyphicon-eye-open';
  passwordType1 = 'password';
  glyphiconClass2 = 'glyphicon-eye-open';
  passwordType2 = 'password';
  legalFirstName: any;
  legalMiddleName: any;
  legalLastName: any;
  street: any;
  country: any;
  zipCode: any;
  city: any;
  state: any;
  primaryPhone: any;
  mobilePhone: any;
  mobileCarrier: any;
  isSendNotificationForBookAppointment: any;
  isSendNotificationForCancelAppointment: any;
  birthMonth: any;
  birthDay: any;
  workerNotes: any;
  emergencyName: any;
  emergencyPrimaryPhone: any;
  emergencySecondaryPhone: any;
  monthsArray: any;
  daysArray: any;
  countries: any;
  selectedCountry: any;
  errorMessage: any;
  states: any;
  userData: any;
  userListData: any;
  profileData: any;
  carrierData: any;
  onlineValues: any;
  onlineValue: any;
  appointmentsBookEveryValue: any;
  onlineBookingHoursValue: any;
  appointmentsValue: any;
  serviceGroupList: any;
  serviceDetailsList = [];
  selectedServiceGroup: any;
  addServiceGroupName: any;
  showInactive: any;
  serviceName: any;
  serviceLevel: any;
  serviceavailable_1: any;
  serviceavailable_2: any;
  serviceavailable_3: any;
  serviceDuration_1: any;
  serviceDuration_2: any;
  serviceDuration_3: any;
  serviceData1: any;
  servicePrice: any;
  servicePriceValue: any;
  serviceBufferAfter: any;
  serviceFeePercentage: any;
  serviceFeeAmount: any;
  bookingDataList: any;
  bookingIntervalMinutes: any;
  bookingIntervalMinutesForDurations: any;
  usesTimeClockValue: any = false;
  retailOnlyValue: any = false;
  permissioneMethodValue: any;
  workerRole = '';
  workerRoledData: any = [];
  hourlyWageValue: any;
  salaryValue: any;
  compensationMethodValue: any;
  viewOnlyMyApptsValues: any;
  canViewApptValues: any;
  paymentGateWay: any;
  merchantTerminalId: any;
  merchantAccountTest: any;
  merchantAccountKey: any;
  intervalValues = [];
  workerServiceData: any = [];
  methodsListing: any;
  permissioneListing: any;
  goalsList: any;
  workerServicesData: any = [];
  priceValue: any;
  levelValues: any;
  serviceId: any;
  performs = [];
  online: any;
  test: any;
  test1: any;
  test2: any;
  error: any;
  error1: any;
  error2: any;
  error3: any;
  error4: any;
  error5: any;
  error6: any;
  error7: any;
  error8: any;
  error9: any;
  error10: any;
  goalError: any;
  pcodeErr: any;
  mcodeErr: any;
  primaryCountryCode = '';
  mobileCountryCode = '';
  emrgencyCountryCode2 = '';
  emrgencyCountryCode1 = '';
  goalListError: any;
  workerServiceError: any;
  // goals
  goalsRows = [];
  goalsObj: any;
  goalList: any;   // new Date();
  currentDate = new Date();
  goalStartDate: any;
  goalEndDate: any;
  addrows = false;
  previousGoals: any;
  goalListRows = false;
  goals: any;
  updateGoalId: any;
  updateWorkerId: any;
  lineCount: any;
  calculation: any;
  calculatedGoal = [];
  percentOfGoal = [];
  target = [];
  deleteWorkerGoalId: any;
  // other
  otherError: any;
  otherErr1: any;
  otherErr2: any;
  calculationList: any;
  toastermessage: any;
  toasterAction = '';
  prevUserName: any;
  // FOR DATE
  datePickerConfig: any;
  workerImage: any = {};
  image: any = '';
  serviceIndex: any;
  serviceErrorName = '';
  goallineerror = [];
  hideClientContactInfo: any;
  // newClient = false;
  constructor(private toastr: ToastrService,
    private translateService: TranslateService,
    private setupWorkersDetailsService: SetupWorkersDetailsService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private commonService: CommonService, private http: HttpClient,
    @Inject('defaultActive') public defaultActive: string,
    @Inject('defaultInActive') public defaultInActive: string,
    @Inject('apiEndPoint') private apiEndPoint: string) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
    this.getUserList();
    this.getCountries();
    this.getMobileCarriersData();
    this.getServiceLevels();
    this.hoursForOnlineData();
    this.getGoals();
    this.getBookingData();
    this.getworkerRole();
    this.getSecurityPermissionemethods();
    // this.getPreviousGoals();
    this.getCountryStates();
    this.getCountries();
    // this.mobileCarriersComponent.getMobileCarriersData();
    this.isClass = config.environment.booleanFalse;
    this.compensationMethodValue = '--None--';
    // ---Start of code for Permissions Implementation--- //
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('rights'));
    } catch (error) {
      this.decodedToken = {};
    }
    if (this.decodedToken.data && this.decodedToken.data.permissions) {
      this.decodedToken = JSON.parse(this.decodedToken.data.permissions);
    } else {
      this.decodedToken = {};
    }
    // ---End of code for permissions Implementation--- //
  }
  cancel() {
    this.disableDiv = true;
    this.addDiv = false;
    this.hideTable = true;
    this.addrows = false;
    this.goalListRows = false;
    this.goalList = [];
    this.goalsRows = [];
    this.workerDataAdd = false;
    this.previousGoals = '';
    this.clearErrMsg();
    this.clear();
    this.workerImage = {};
  }
  /*Method to clear all fields */
  clear() {
    this.activeStatus = '';
    this.firstName = '';
    this.lastName = '';
    this.middleName = '';
    this.email = '';
    this.bsValue = '';
    this.workerPin = '';
    this.userName = '';
    this.displayOrder = '';
    this.legalFirstName = '';
    this.legalMiddleName = '';
    this.legalLastName = '';
    this.street = '';
    this.country = '';
    this.zipCode = '';
    this.city = '';
    this.state = '';
    this.primaryPhone = '';
    this.mobilePhone = '';
    this.mobileCarrier = '';
    this.isSendNotificationForBookAppointment = '';
    this.isSendNotificationForCancelAppointment = '';
    this.birthDay = '';
    this.birthMonth = '';
    this.workerNotes = '';
    this.emergencyName = '';
    this.emergencyPrimaryPhone = '';
    this.emergencySecondaryPhone = '';
    this.onlineBookingHoursValue = '';
    this.appointmentsValue = '';
    this.serviceLevel = this.levelValues.length > 0 ? this.levelValues[0].level : undefined;
    this.usesTimeClockValue = '';
    this.retailOnlyValue = '';
    this.hourlyWageValue = '';
    this.salaryValue = '';
    this.viewOnlyMyApptsValues = '';
    this.permissioneMethodValue = '';
    this.workerRole = '';
    this.compensationMethodValue = '';
    this.canViewApptValues = '';
    this.paymentGateWay = '';
    this.merchantTerminalId = '';
    this.merchantAccountTest = '';
    this.merchantAccountKey = '';
    this.appointmentsBookEveryValue = '';
    this.password1 = '';
    this.password2 = '';
    this.serviceDetailsList = [];
    this.goals = [];
  }
  getUserList() {
    this.setupWorkersDetailsService.getUserList()
      .subscribe(data => {
        this.userListData = data['result'];
        this.userList = this.userListData.filter(
          filterList => filterList.IsActive === 1);

        // .filter(
        //   filterList => filterList.IsActive === 1);
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
  showInActive() {
    if (this.inactive === false) {
      this.userList = this.userListData;
    } else if (this.inactive === true) {
      this.userList = this.userListData.filter(
        filterList => filterList.IsActive === 1);
    }
  }
  getCountriesList(value) {
    this.country = value;
    this.getCountryStates();
  }
  getStatesOnChange(value) {
    this.state = value;
  }
  getMobileCarriersOnChange(value) {
    this.mobileCarrier = value;
  }
  compensationMethodOnChange(value) {
    this.compensationMethodValue = value;
  }
  onChangePermissioneSet(value) {
    this.permissioneMethodValue = value;
  }
  onChangeWorkerRole(value) {
    this.workerRole = value;
  }
  getworkerRole() {
    this.setupWorkersDetailsService.getWorekrRoleData().subscribe(
      data => {
        this.workerRoledData = data['workerRole'];
        this.workerRole = this.workerRoledData[0].value;
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
  getCountryStates() {
    this.state = '';
    this.setupWorkersDetailsService.getStates(this.country)
      .subscribe(statesValues => {
        this.states = statesValues['result'];
        if (this.states.length > 0) {
          this.state = this.states[0].STATE;
        }
      },
        error => {
          this.errorMessage = <any>error;
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
  }
  getCountries() {
    this.setupWorkersDetailsService.getLookupsList('COUNTRIES').subscribe(
      data => {
        this.countries = data['result'];
        this.country = this.countries[0].NAME;
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '9961') {
            } break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      }
    );
  }

  imageUpload(event) {
    if (this.workerImage.hasOwnProperty('error')) {
      delete this.workerImage.error;
    }
    const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    const target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.workerImage.file = files[0];
      this.workerImage.fileName = files[0].name;
      const fSize = this.workerImage.file.size;
      if (!this.workerImage.fileName.match(/.(jpg|jpeg|png|gif|svg|bmp)$/i)) {
        this.workerImage.error = 'COMMON_STATUS_CODES.2058';
        delete this.workerImage.file;
      } else if (fSize > 1000000) {
        this.workerImage.allowableSize = false;
        this.workerImage.error = 'SETUPCOMPANY.VALID_IMAGE_FILENAME';
        delete this.workerImage.file;
      } else {
        this.workerImage.srcURL = this.apiEndPoint + '/' + this.image;
        this.workerImage.allowableSize = true;
        this.workerImage.srcURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.workerImage.file));
      }
    }
  }

  showData(workerData) {
    // this.newClient = false;
    this.clearData();
    this.serviceTab = false;
    this.workerImage = {};
    this.disableDiv = false;
    this.addDiv = true;
    this.hideTable = false;
    this.getServiceGroupsList();
    this.birthDateAndDays();
    this.getCompansationMethods();
    if (workerData === true) {
      this.workerDataAdd = true;
      this.appointmentsBookEveryValue = this.bookingIntervalMinutesForDurations;
    } else {
      this.appointmentsBookEveryValue = workerData.Book_Every__c;
      this.updateId = workerData.Id;
      this.activeStatus = workerData.IsActive;
      this.firstName = workerData.FirstName;
      this.lastName = workerData.LastName;
      this.middleName = workerData.MiddleName;
      this.image = workerData.image;
      if (workerData.image) {
        this.workerImage.srcURL = this.apiEndPoint + '/' + workerData.image + '?time=' + new Date().getTime();
      }
      if (this.middleName === 'null' || this.middleName === null) {
        this.middleName = '';
      }
      this.email = workerData.Email;
      this.bsValue = this.commonService.getDateFrmDBDateStr(workerData.StartDay);
      this.userName = workerData.Username;
      this.prevUserName = workerData.Username;
      this.displayOrder = workerData.Display_Order__c;
      if (this.displayOrder === null || this.displayOrder === 0) {
        this.displayOrder = '';
      }
      this.password1 = '';
      this.password2 = '';
      this.legalFirstName = workerData.Legal_First_Name__c;
      if (this.legalFirstName === 'null' || this.legalFirstName === null) {
        this.legalFirstName = '';
      }
      this.legalMiddleName = workerData.Legal_Middle_Name__c;
      if (this.legalMiddleName === 'null' || this.legalMiddleName === null) {
        this.legalMiddleName = '';
      }
      this.legalLastName = workerData.Legal_Last_Name__c;
      if (this.legalLastName === 'null' || this.legalLastName === null) {
        this.legalLastName = '';
      }
      this.street = workerData.Street;
      if (this.street === 'null' || this.street === null) {
        this.street = '';
      }
      this.country = workerData.Country;
      this.zipCode = workerData.PostalCode;
      this.city = workerData.City;
      this.state = workerData.State;
      if (workerData.Phone) {
        this.primaryCountryCode = workerData.Phone.split('-')[0];
        this.primaryPhone = workerData.Phone.split('-')[1] + '-' + workerData.Phone.split('-')[2];
      }
      if (workerData.MobilePhone) {
        this.mobileCountryCode = workerData.MobilePhone.split('-')[0];
        this.mobilePhone = workerData.MobilePhone.split('-')[1] + '-' + workerData.MobilePhone.split('-')[2];
      }
      this.mobileCarrier = workerData.Mobile_Carrier__c;
      this.isSendNotificationForBookAppointment = workerData.Send_Notification_for_Booked_Appointment__c;
      this.isSendNotificationForCancelAppointment = workerData.Send_Notification_for_Canceled_Appt__c;
      this.birthDay = workerData.Birth_Date__c;
      this.birthMonth = workerData.Birth_Month__c;
      this.workerNotes = workerData.Worker_Notes__c;
      this.emergencyName = workerData.Emergency_Name__c;
      // this.emergencyPrimaryPhone = workerData.Emergency_Primary_Phone__c;
      if (workerData.Emergency_Primary_Phone__c) {
        this.emrgencyCountryCode1 = workerData.Emergency_Primary_Phone__c.split('-')[0];
        this.emergencyPrimaryPhone = workerData.Emergency_Primary_Phone__c.split('-')[1] + '-' + workerData.Emergency_Primary_Phone__c.split('-')[2];
      }
      // this.emergencySecondaryPhone = workerData.Emergency_Secondary_Phone__c;
      if (workerData.Emergency_Secondary_Phone__c) {
        this.emrgencyCountryCode2 = workerData.Emergency_Secondary_Phone__c.split('-')[0];
        this.emergencySecondaryPhone = workerData.Emergency_Secondary_Phone__c.split('-')[1] + '-' + workerData.Emergency_Secondary_Phone__c.split('-')[2];
      }
      this.permissioneMethodValue = workerData.Permission_Set__c;
      /* prasent we r storing user type column in db not confirmed till now */
      if (workerData.UserType === '' || workerData.UserType === null || workerData.UserType === undefined) {
        this.workerRole = '';
      } else {
        this.workerRole = workerData.UserType;
      }
      this.compensationMethodValue = workerData.Compensation__c;
      this.hourlyWageValue = workerData.Hourly_Wage__c;
      this.merchantTerminalId = workerData.Merchant_Account_ID__c;
      this.merchantAccountKey = workerData.Merchant_Account_Key__c;
      this.onlineBookingHoursValue = workerData.Online_Hours__c ? workerData.Online_Hours__c : '';
      this.appointmentsValue = workerData.Appointment_Hours__c ? workerData.Appointment_Hours__c : '';
      this.salaryValue = workerData.Salary__c;
      this.serviceLevel = workerData.Service_Level__c ? workerData.Service_Level__c : (this.levelValues.length > 0 ? this.levelValues[0].level : undefined);
      this.retailOnlyValue = workerData.Retail_Only__c;
      this.usesTimeClockValue = workerData.Uses_Time_Clock__c;
      this.viewOnlyMyApptsValues = workerData.View_Only_My_Appointments__c;
      this.canViewApptValues = workerData.Can_View_Appt_Values_Totals__c;
      this.workerPin = workerData.Worker_Pin__c;
      this.paymentGateWay = workerData.Payment_Gateway__c;
      this.hideClientContactInfo = workerData.Hide_Client_Contact_Info__c;
      // this.getCountryStates();
      // this.getServiceGroupsList();
      // this.birthDateAndDays();
      // this.getCompansationMethods();
      this.getWorkerServices();
      // goals
      this.getGoals();
      this.addRows();
      this.previousGoals = false;
      this.setupWorkersDetailsService.previousGoals(this.previousGoals, this.updateId, this.commonService.getDBDatStr(new Date()))
        .subscribe(data1 => {
          this.goalList = data1['result'];
          this.goalList = this.updateDateFields(this.goalList);
          this.goalsRows = [];
          if (this.goalList.length === 0) {
            this.goalsRows = [];
            this.addRows();
          }
        },
          error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              this.router.navigate(['/']).then(() => { });
            }
          });
      this.goalListRows = false;
    }
  }
  checkServiceDurations(serviceData) {
    const durationKeys = ['Duration_1__c', 'Duration_2__c', 'Duration_3__c', 'Buffer_After__c'];
    const isDurationExsists = durationKeys.map((key) => serviceData[key] ? serviceData[key] : 0).findIndex((val) => (val !== 0 && val)) !== -1 ? true : false;
    if (isDurationExsists) {
      let totalDuration = 0;
      totalDuration += serviceData['Duration_1__c'] ? +serviceData['Duration_1__c'] : 0;
      totalDuration += serviceData['Duration_2__c'] ? +serviceData['Duration_2__c'] : 0;
      totalDuration += serviceData['Duration_3__c'] ? +serviceData['Duration_3__c'] : 0;
      totalDuration += serviceData['Buffer_After__c'] ? +serviceData['Buffer_After__c'] : 0;
      return (totalDuration % this.bookingIntervalMinutesForDurations !== 0) ? true : false;
    } else {
      return false;
    }
  }
  commonSave() {
    this.workerServiceError = '';
    /*services */
    // this.workerServiceData = this.workerServiceData.filter(function () { return true; });
    //  this.updateWorkerServiceValues();

    // removed for calculations of service durations
    // if (+workerData[i].Duration_1__c % this.appointmentsBookEveryValue !== 0) {
    //   this.serviceErrorName = workerData[i]['Name'];
    //   this.workerServiceError = 'SETUP_WORKERS_DETAILS.VALID_MULTIPLE_OF_INTERVAL_MINUTES';
    //   window.scrollTo(0, 0);
    // } if (+workerData[i].Duration_2__c % this.appointmentsBookEveryValue !== 0) {
    //   this.serviceErrorName = workerData[i]['Name'];
    //   this.workerServiceError = 'SETUP_WORKERS_DETAILS.VALID_MULTIPLE_OF_INTERVAL_MINUTES';
    //   window.scrollTo(0, 0);
    // } if (+workerData[i].Duration_3__c % this.appointmentsBookEveryValue !== 0) {
    //   this.serviceErrorName = workerData[i]['Name'];
    //   this.workerServiceError = 'SETUP_WORKERS_DETAILS.VALID_MULTIPLE_OF_INTERVAL_MINUTES';
    //   window.scrollTo(0, 0);
    // }
    let workerData = [];
    workerData = this.workerServicesData.filter((data) => data['Removed'] === false && data['isTouched']);
    for (let i = 0; i < workerData.length; i++) {
      if (workerData[i].Service_Fee_Amount__c && workerData[i].Price__c) {
        if (+workerData[i].Service_Fee_Amount__c > +workerData[i].Price__c) {
          this.serviceErrorName = workerData[i]['Name'];
          this.workerServiceError = 'SETUP_WORKERS_DETAILS.VALID_SERVICE_FEE_AMOUNT_NOT_GREATERTHAN_SERVICE_PRICE';
          window.scrollTo(0, 0);
          break;
        }
      }
      if ((workerData[i].Service_Fee_Amount__c && workerData[i].Service_Fee_Percent__c)) {
        this.serviceErrorName = workerData[i]['Name'];
        this.workerServiceError = 'SETUP_WORKERS_DETAILS.VALID_ALLOW_EITHER_SERVICE_FEE_AMOUNT_OR_SERVICE_FEE_PERCENTAGE';
        window.scrollTo(0, 0);
        break;
      } if (+workerData[i].Service_Fee_Percent__c < 0 || +workerData[i].Service_Fee_Percent__c > 99) {
        this.serviceErrorName = workerData[i]['Name'];
        this.workerServiceError = 'SETUP_WORKERS_DETAILS.VALID_SERVICE_FEE_PERCENTAGE_LIMIT';
        window.scrollTo(0, 0);
        break;
      } if (this.checkServiceDurations(workerData[i])) {
        this.serviceErrorName = workerData[i]['Name'];
        this.workerServiceError = `service total duration must be a multiple of the appointment booking ${this.bookingIntervalMinutesForDurations} minute interval`;
        window.scrollTo(0, 0);
        break;
      }
    }
    /*services end here */
    /*create goals() */
    if (this.goalList && this.goalList.length > 0) {
      for (let j = 0; j < this.goalList.length; j++) {
        if (this.goalList[j].goalsId !== '') {
          if (!this.goalList[j].hasOwnProperty('delete')) {
            if ((this.goalList[j].goalsId !== undefined || this.goalList[j].goalsId !== 'undefined' || this.goalList[j].goalsId !== '')
              && (this.goalList[j].startDate === undefined || this.goalList[j].startDate === 'undefined'
                || this.goalList[j].startDate === '' || this.goalList[j].startDate === null || this.goalList[j].startDate === 'null')
              && (this.goalList[j].endDate === undefined || this.goalList[j].endDate === 'undefined' || this.goalList[j].endDate === ''
                || this.goalList[j].endDate === null || this.goalList[j].endDate === 'null'
              )) {
              this.goalError = 'SETUP_WORKERS_DETAILS.VALID_NO_BLANK_START_AND_END_DATE';
              window.scrollTo(0, 0);
              break;
            } else if (this.goalList[j].startDate > this.goalList[j].endDate) {
              this.lineCount = j;
              this.goalListError = 'Line-' + this.lineCount + ': SETUP_WORKERS_DETAILS.VALID_STARTDATE_MUST_EARLIER_THAN_ENDDATE';
              window.scrollTo(0, 0);
              break;
            }
          }
        } else {
          this.goalList = [];
        }
      }
    }
    if (this.goalsRows && this.goalsRows.length > 0) {
      for (let i = 0; i < this.goalsRows.length; i++) {
        if (this.goalsRows[i].goalsId !== '') {
          if ((this.goalsRows[i].goalsId !== undefined || this.goalsRows[i].goalsId !== 'undefined' || this.goalsRows[i].goalsId !== '')
            && (this.goalsRows[i].startDate === undefined || this.goalsRows[i].startDate === 'undefined'
              || this.goalsRows[i].startDate === '' || this.goalsRows[i].startDate === null || this.goalsRows[i].startDate === 'null' || this.goalsRows[i].startDate === 'Invalid Date')
            && (this.goalsRows[i].endDate === undefined || this.goalsRows[i].endDate === 'undefined' || this.goalsRows[i].endDate === ''
              || this.goalsRows[i].endDate === null || this.goalsRows[i].endDate === 'null'
              || this.goalsRows[i].endDate === 'Invalid Date')) {
            this.goalError = 'SETUP_WORKERS_DETAILS.VALID_NO_BLANK_START_AND_END_DATE';
            window.scrollTo(0, 0);
            break;
          } else if (this.goalsRows[i].startDate > this.goalsRows[i].endDate) {
            this.goalError = 'SETUP_WORKERS_DETAILS.VALID_STARTDATE_MUST_EARLIER_THAN_ENDDATE';
            window.scrollTo(0, 0);
            break;
          }
        } else {
          this.goalsRows = [];
        }
      }
    } /*creategoals end here */
    // WorkerProfile  AND other tab validations
    // tslint:disable-next-line:max-line-length
    //   const NUM_REGEXP = /^^(0|[1-9][0-9]*)$/;
    const NUM_REGEXP = /^[0-9]$/;
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.firstName === '' || this.firstName === undefined) {
      this.error = 'SETUP_WORKERS_DETAILS.VALID_NOBLANK_FIRST_NAME_FIELD';
      window.scrollTo(0, 0);
    } else if (this.lastName === '' || this.lastName === undefined) {
      this.error1 = 'SETUP_WORKERS_DETAILS.VALID_NOBLANK_LAST_NAME_FIELD';
      window.scrollTo(0, 0);
    } else if (this.userName === '' || this.userName === undefined) {
      this.error2 = 'SETUP_WORKERS_DETAILS.VALID_NOBLANK_USER_NAME_FIELD';
      window.scrollTo(0, 0);
    } else if (this.userName !== '' && !EMAIL_REGEXP.test(this.userName)) {
      this.error2 = 'SETUP_WORKERS_DETAILS.VALID_WORK_USERNAME_FEILD';
      window.scrollTo(0, 0);
    } else if (this.email === '' || this.email === undefined) {
      this.error3 = 'SETUP_WORKERS_DETAILS.VALID_NOBLANK_EMAIL_FIELD';
      window.scrollTo(0, 0);
    } else if (this.email !== '' && !EMAIL_REGEXP.test(this.email)) {
      this.error3 = 'COMMON.VALID_EMAIL_ID_FORMAT';
      window.scrollTo(0, 0);
    } else if (this.workerPin.toString().length !== 4) {
      this.error4 = 'SETUP_WORKERS_DETAILS.VALID_WORK_PIN_LIMIT';
      window.scrollTo(0, 0);
    } else if (this.password1.length > 0 && this.password2.length === 0) {
      this.error8 = 'COMMON.RETYPE_PASSWORD_VALID';
      window.scrollTo(0, 0);
    } else if (this.password1.length > 0 && this.password2.length > 0 && this.password1 !== this.password2) {
      this.error8 = 'COMMON.PASSWORD_MISMATCH';
      window.scrollTo(0, 0);
    } else if (this.bsValue === '' || this.bsValue === undefined || this.bsValue === null) {
      this.error6 = 'SETUP_WORKERS_DETAILS.VALID_NOBLANK_START_DATE_FIELD';
      window.scrollTo(0, 0);
    } else if (this.primaryPhone !== '' && this.primaryPhone !== undefined && this.primaryCountryCode === '') {
      this.pcodeErr = 'Country code is required for Primary phone';
      window.scrollTo(0, 0);
    } else if (this.mobilePhone !== '' && this.mobilePhone !== undefined && this.mobileCountryCode === '') {
      this.mcodeErr = 'Country code is required for Mobile phone';
      window.scrollTo(0, 0);
    } else if (this.birthMonth === '' && this.birthDay !== '') {
      this.error10 = 'SETUP_WORKERS_DETAILS.INVALID_BIRTH_MONTH';
      window.scrollTo(0, 0);
    } else if (this.birthDay === '' && this.birthMonth !== '') {
      this.error10 = 'SETUP_WORKERS_DETAILS.INVALID_BIRTH_DAY';
      window.scrollTo(0, 0);
    } else if (this.emergencyPrimaryPhone !== '' && this.emergencyPrimaryPhone !== undefined && this.emrgencyCountryCode1 === '') {
      this.pcodeErr = 'Country code is required for  Emergency primary phone';
      window.scrollTo(0, 0);
    } else if (this.emergencySecondaryPhone !== '' && this.emergencySecondaryPhone !== undefined && this.emrgencyCountryCode2 === '') {
      this.mcodeErr = 'Country code is required for  Emergency Secondary phone';
      window.scrollTo(0, 0);
      // } else if ((this.serviceLevel === '' || this.serviceLevel === '0' || this.serviceLevel === 0
      //   || this.serviceLevel === undefined || this.serviceLevel === 'None') && this.workerServiceData && this.workerServiceData.length > 0) {
    } else if (this.hourlyWageValue < 0 || this.salaryValue < 0) {
      this.otherError = 'SETUP_WORKERS_DETAILS.VALID_HOURLY_WAGE_AND_SALARY_FIELDS_ZERO_OR_POSITIVE';
    } else if (this.hourlyWageValue > 9999.999 || this.salaryValue > 9999999.999) {
      this.otherError = 'SETUP_WORKERS_DETAILS.VALID_HOURLY_WAGE_AND_SALARY_FIELDS_LIMIT';
    } else if ((this.merchantTerminalId !== '' && this.merchantTerminalId !== null) && (this.merchantAccountKey === '' || this.merchantAccountKey === null)) {
      this.otherErr1 = 'VALIDATION_MSG.INVALID_MERCHANT_KEY';
      window.scrollTo(0, 0);
    } else if (this.merchantAccountKey !== '' && (this.merchantTerminalId === '' || this.merchantTerminalId === null)) {
      this.otherErr2 = 'VALIDATION_MSG.INVALID_MERCHANT_TERMINAL_ID';
      window.scrollTo(0, 0);
    } else {
      if (this.activeStatus === undefined || this.activeStatus === false) {
        this.activeStatus = this.defaultInActive;
      }
      if (this.activeStatus === true) {
        this.activeStatus = this.defaultActive;
      }
      if (this.isSendNotificationForBookAppointment === undefined || this.isSendNotificationForBookAppointment === false) {
        this.isSendNotificationForBookAppointment = this.defaultInActive;
      }
      if (this.isSendNotificationForBookAppointment === true) {
        this.isSendNotificationForBookAppointment = this.defaultActive;
      }
      if (this.isSendNotificationForCancelAppointment === undefined || this.isSendNotificationForCancelAppointment === false) {
        this.isSendNotificationForCancelAppointment = this.defaultInActive;
      }
      if (this.isSendNotificationForCancelAppointment === true) {
        this.isSendNotificationForCancelAppointment = this.defaultActive;
      }
      if (this.usesTimeClockValue === undefined || this.usesTimeClockValue === false) {
        this.usesTimeClockValue = this.defaultInActive;
      }
      if (this.usesTimeClockValue === true) {
        this.usesTimeClockValue = this.defaultActive;
      }
      if (this.retailOnlyValue === undefined || this.retailOnlyValue === false) {
        this.retailOnlyValue = this.defaultInActive;
      }
      if (this.retailOnlyValue === true) {
        this.retailOnlyValue = this.defaultActive;
      }
      if (this.canViewApptValues === undefined || this.canViewApptValues === false) {
        this.canViewApptValues = this.defaultInActive;
      }
      if (this.canViewApptValues === true) {
        this.canViewApptValues = this.defaultActive;
      }
      if (this.viewOnlyMyApptsValues === undefined || this.viewOnlyMyApptsValues === false) {
        this.viewOnlyMyApptsValues = this.defaultInActive;
      }
      if (this.viewOnlyMyApptsValues === true) {
        this.viewOnlyMyApptsValues = this.defaultActive;
      }
      if (this.merchantAccountTest === undefined || this.merchantAccountTest === false) {
        this.merchantAccountTest = this.defaultInActive;
      }
      if (this.merchantAccountTest === true) {
        this.merchantAccountTest = this.defaultActive;
      } else if ((this.workerServiceError === '' || this.workerServiceError === 'undefined' || this.workerServiceError === undefined)
        && (this.goalListError === '' || this.goalListError === 'undefined' || this.goalListError === undefined)
        && (this.goalError === '' || this.goalError === 'undefined' || this.goalError === undefined)
        && (this.error === undefined || this.error === 'undefined' || this.error === '') &&
        (this.otherError === undefined || this.otherError === '' || this.otherError === 'undefined')) {
        if (this.displayOrder === null || this.displayOrder === 0) {
          this.displayOrder = '';
        }
        this.userData = {
          'activeStatus': this.activeStatus,
          'firstName': this.firstName,
          'lastName': this.lastName,
          'middleName': this.middleName,
          'email': this.email,
          'startDate': this.commonService.getDBDatStr(this.bsValue),
          'workerPin': this.workerPin,
          'userName': this.userName,
          'displayOrder': this.displayOrder,
          'legalFirstName': this.legalFirstName,
          'legalMiddleName': this.legalMiddleName,
          'legalLastName': this.legalLastName,
          'street': this.street,
          'country': this.country,
          'zipCode': this.zipCode,
          'city': this.city,
          'state': this.state,
          'primaryPhone': this.primaryPhone !== '' && this.primaryPhone ? this.primaryCountryCode + '-' + this.primaryPhone : '',
          'mobilePhone': this.mobilePhone !== '' && this.mobilePhone ? this.mobileCountryCode + '-' + this.mobilePhone : '',
          'mobileCarrier': this.mobileCarrier,
          'isSendNotificationForBookAppointment': this.isSendNotificationForBookAppointment,
          'isSendNotificationForCancelAppointment': this.isSendNotificationForCancelAppointment,
          'birthDay': this.birthDay,
          'birthMonth': this.birthMonth,
          'workerNotes': this.workerNotes,
          'emergencyName': this.emergencyName,
          'emergencyPrimaryPhone': this.emergencyPrimaryPhone !== '' && this.emergencyPrimaryPhone ? this.emrgencyCountryCode1 + '-' + this.emergencyPrimaryPhone : '',
          'emergencySecondaryPhone': this.emergencySecondaryPhone !== '' && this.emergencySecondaryPhone ? this.emrgencyCountryCode2 + '-' + this.emergencySecondaryPhone : '',
          'onlineBookingHoursValue': this.onlineBookingHoursValue,
          'appointmentsValue': this.appointmentsValue,
          'serviceLevel': this.serviceLevel,
          'usesTimeClockValue': this.usesTimeClockValue,
          'retailOnlyValue': this.retailOnlyValue,
          'hourlyWageValue': this.hourlyWageValue,
          'salaryValue': this.salaryValue,
          'viewOnlyMyApptsValues': this.viewOnlyMyApptsValues,
          'permissioneMethodValue': this.permissioneMethodValue,
          'workerRole': this.workerRole,
          'compensationMethodValue': this.compensationMethodValue,
          'canViewApptValues': this.canViewApptValues,
          'paymentGateWay': this.paymentGateWay,
          'merchantTerminalId': this.merchantTerminalId,
          'merchantAccountTest': this.merchantAccountTest,
          'merchantAccountKey': this.merchantAccountKey,
          'appointmentsBookEveryValue': this.appointmentsBookEveryValue,
          'password': this.password1,
          'image': this.image,
          'hideClientContactInfo': this.hideClientContactInfo === false || this.hideClientContactInfo === 0 ? 0 : 1
        };

        // goals starts here
        let goalsUpdateList;
        goalsUpdateList = this.goalList;
        if (goalsUpdateList) {
          this.goals = goalsUpdateList.concat(this.goalsRows);
        }
        if (this.prevUserName !== this.userData.userName) {
          this.userData['namechanged'] = true;
          this.userData['prevUserName'] = this.prevUserName;
        }
        const workerservices = this.workerServicesData.filter((data) => ((data['Edit'] === false && data['Removed'] === false && data['seleitem'] === 'performs')) ||
          (data['Edit'] === true && data['isTouched']));
        this.goals.forEach(element => {
          element.startDBDate = this.commonService.getDBDatStr(element.startDate);
          element.endDBDate = this.commonService.getDBDatStr(element.endDate);
        });
        const dataObj = {
          'workerServiceData': workerservices,
          'workerData': this.userData,
          'goalsData': this.goals
        };
        //  return;
        if (this.goalTargetError()) {
          this.setupWorkersDetailsService.saveUser(this.updateId, dataObj, this.workerImage.file).subscribe(
            data => {
              this.profileData = data['result'];
              this.disableDiv = true;
              this.addDiv = false;
              this.hideTable = true;
              this.clear();
              this.clearErrMsg();
              this.inactive = false;
              this.getUserList();
              if (this.workerDataAdd === true) {
                this.toasterAction = 'Created';
              } else if (this.workerDataAdd === false) {
                this.toasterAction = 'Edited';
                if (data['result'] && data['result'].rights.length > 0) {
                  localStorage.setItem('rights', data['result'].rights);
                }
              }
              this.password1 = '';
              this.password2 = '';
              this.toastermessage = this.translateService.get('Record   ' + this.toasterAction + '   Successfully');
              this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            },
            error => {
              const status = JSON.parse(error['_body']).result;
              const statuscode = JSON.parse(error['_body'])['status'];
              if (status.workerDetailError && status.workerDetailError.sqlMessage.indexOf('USER_ACCOUNT') > -1) {
                this.error = 'Username already exists';
              } else if (status.workerDetailError && status.workerDetailError.errno === 1062) {
                this.error = 'User PIN is already exists, Enter a different PIN';
              }
              if (statuscode === '2085' || statuscode === '2071') {
                this.router.navigate(['/']).then(() => { });
              }
            }
          );
        }

        // this.setupWorkersDetailsService.saveWorkerServices(this.workerServiceData).subscribe(
        //   data => {
        //     this.profileData = data['result'];
        //     // this.disableDiv = true;
        //     // this.addDiv = false;
        //     // this.hideTable = true;
        //     // this.getUserList();
        //     this.workerServiceData = [];
        //     this.serviceTab = false;
        //     // this. clear();
        //   },
        //   error => {
        //     const status = JSON.parse(error['status']);
        //     const statuscode = JSON.parse(error['_body']).status;
        //     switch (status) {
        //       case 500:
        //         break;
        //       case 400:
        //         if (statuscode === '9961') {
        //         } break;
        //     }
        //   }
        // );



        // this.setupWorkersDetailsService.createGoals(this.goalsData)
        //   .subscribe(data => {
        //     this.goalsData = data['result'];
        // this.disableDiv = true;
        // this.addDiv = false;
        // this.hideTable = true;
        // this.previousGoals = false;
        // this.setupWorkersDetailsService.previousGoals(this.previousGoals, this.updateId)
        //   .subscribe(data1 => {
        //     this.goalList = data['result'];
        //     this.goalsRows = [];
        //     if (this.goalList.length === 0) {
        //       this.goalsRows = [];
        //       this.addRows();
        //     }
        //   });
        // this.getUserList();
        // },
        //   error => {
        //     const status = JSON.parse(error['status']);
        //     const statuscode = JSON.parse(error['_body']).status;
        //     switch (JSON.parse(error['_body']).status) {
        //       case '2033':
        //         this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
        //         break;
        //       case '2043':
        //         this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
        //         break;
        //     }
        //   });

        // if (this.password1 && this.password1.length > 0) {
        //   this.error8 = '';
        //   this.setupWorkersDetailsService.updatePassword(this.updateId, this.password1)
        //     .subscribe(data => { },
        //       error => {
        //         const status = JSON.parse(error['status']);
        //         const statuscode = JSON.parse(error['_body']).status;
        //         switch (JSON.parse(error['_body']).status) {
        //           case '2033':
        //             this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
        //             break;
        //           case '2043':
        //             this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
        //             break;
        //         }
        //       });
        // }

        // }
      }/*2 else end here */
    } /*1 else  end here */
  }/*commonSave end here */
  goalTargetError() {
    let res = true;
    this.goallineerror = [];
    if (this.goals.length > 0) {
      this.goals.forEach((element, index) => {
        if (parseInt(element.target, 10) > 99999) {
          this.changeTabs(undefined, 'goals', 'goalsnav');
          this.goallineerror.push({ error: 'Goals Line ' + (index + 1) + ' must be less than 99,999.99' });
          return res = false;
        }
      });
    }
    return res;
  }
  /*Adding New Worker Method starts here */
  addNewWorker() {
    this.updateId = undefined;
    const workerData = true;
    this.clear();
    this.showData(workerData);
    this.addRows();
    this.workerServicesData = [];
    this.activeStatus = true;
  }
  /*new Worker Method End */
  /*methods */
  getMobileCarriersData() {
    this.setupWorkersDetailsService.getMobileData().subscribe(
      data => {
        this.carrierData = data['result'];
        this.mobileCarrier = this.carrierData[0].mobileCarrierName;
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
  changeMonths(value) {
    this.birthMonth = value;
    this.birthDateAndDays();
  }
  birthDateAndDays() {
    const d = new Date();
    const n = d.getFullYear();
    const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
      '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    this.monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];
    // this.birthDay = '1';
    if (this.birthMonth === undefined) {
      this.birthMonth = this.monthsArray[0];
      this.daysArray = days;
    } else if (n % 4 === 0 && this.birthMonth === this.monthsArray[1]) {
      this.daysArray = days.slice(0, days.length - 2);
    } else if (this.birthMonth === this.monthsArray[0] || this.birthMonth === this.monthsArray[2] ||
      this.birthMonth === this.monthsArray[4] || this.birthMonth === this.monthsArray[6] ||
      this.birthMonth === this.monthsArray[7] || this.birthMonth === this.monthsArray[9] ||
      this.birthMonth === this.monthsArray[11]) {
      this.daysArray = days;
    } else if (this.birthMonth === this.monthsArray[3] || this.birthMonth === this.monthsArray[5] ||
      this.birthMonth === this.monthsArray[8] || this.birthMonth === this.monthsArray[10]) {
      this.daysArray = days.slice(0, days.length - 1);
    } else if (this.birthMonth === this.monthsArray[1]) {
      this.daysArray = days.slice(0, days.length - 2); // length - 2 means displaying 29 days in february for every year as an option//
    }
  }
  getSecurityPermissionemethods() {
    this.setupWorkersDetailsService.getpermissioneList()
      .subscribe(data => {
        this.permissioneListing = data['result'];
        this.permissioneMethodValue = this.permissioneListing[0].Id;

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
  getCompansationMethods() {
    this.setupWorkersDetailsService.getMethods()
      .subscribe(data => {
        this.methodsListing = data['result']
          .filter(
            filterList => filterList.Active__c === 1);
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
  getGoals() {
    this.setupWorkersDetailsService.getGoals()
      .subscribe(data => {
        this.goalsList = data['result']
          .filter(
            filterList => filterList.Active__c === 1);
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
  changeTabs(evt, tab, tabnav) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    if (tab === 'services') {
      this.getWorkerServices();
      this.serviceGroupListOnChange(this.addServiceGroupName);
    }
    document.getElementById(tab).style.display = 'block';
    document.getElementById(tabnav).classList.add('active');
  }
  clearErrMsg() {
    this.goalListError = '';
    this.goalError = '';
    this.error = '';
    this.error1 = '';
    this.error2 = '';
    this.error3 = '';
    this.error4 = '';
    this.error5 = '';
    this.pcodeErr = '';
    this.mcodeErr = '';
    this.error6 = '';
    this.error7 = '';
    this.error8 = '';
    this.otherErr1 = '';
    this.otherErr2 = '';
    this.error9 = '';
    this.error10 = '';
    this.workerServiceError = '';
    this.otherError = '';
    this.calculatedGoal = [];
    this.percentOfGoal = [];
    this.serviceErrorName = '';
  }
  /* --------- worker services --------*/
  getOnlineBookingHoursOnChange(value) {
    this.onlineBookingHoursValue = value;
  }
  getAppointmentsOnChange(value) {
    this.appointmentsValue = value;
  }
  getAppointmentBookEveryOnChange(value) {
    this.appointmentsBookEveryValue = value;
  }

  hoursForOnlineData() {
    this.setupWorkersDetailsService.hoursForOnline().subscribe(
      data => {
        this.onlineValues = data['result'] .filter(filterList => filterList.isActive__c === 1);
        this.onlineBookingHoursValue = this.onlineValues[0].Id;
        this.appointmentsValue = this.onlineValues[0].Id;
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
  getWorkerServices() {
    this.setupWorkersDetailsService.getservicesByUser(this.updateId)
      .subscribe(data => {
        this.workerServicesData = data['result'];
        this.workerServicesData = this.workerServicesData.map((workerservice) => {
          workerservice['Removed'] = false;
          workerservice['Edit'] = true;
          workerservice['isTouched'] = false;
          return workerservice;
        });
        this.assaignWorkerServices();
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

  assaignWorkerServices() {
    if (this.serviceDetailsList.length > 0 && this.workerServicesData.length > 0) {
      for (let i = 0; i < this.serviceDetailsList.length; i++) {
        const index = this.getServiceIndex(this.serviceDetailsList[i]['Id']);
        if (index !== -1) {
          this.serviceDetailsList[i]['priceValue'] = this.workerServicesData[index]['Price__c'];
          if (this.workerServicesData[index]['Removed'] === false) {
            this.serviceDetailsList[i]['performs'] = true;
            // this.workerServicesData[index]['isTouched'] = false;
          }
          if (this.workerServicesData[index]['Self_Book__c'] === 1) {
            this.serviceDetailsList[i]['online'] = true;
          }
        }
      }
    }
  }
  getServiceGroupsList() {
    this.setupWorkersDetailsService.getSetupServicesData()
      .subscribe(serviceGroupResult => {
        this.serviceGroupList = [];
        const tempActive = config.environment.booleanTrue; // default Active records
        this.serviceGroupList = serviceGroupResult['result']
          .filter(filterList => filterList.active);
        if (this.serviceGroupList.length > 0) {
          this.selectedServiceGroup = this.serviceGroupList[0].serviceGroupName;
          this.addServiceGroupName = this.serviceGroupList[0].serviceGroupName;
          this.setupWorkersDetailsService.showInactiveServiceListByGroupName(tempActive, this.selectedServiceGroup)
            .subscribe(data => {
              this.serviceDetailsList = data['result'];
              this.serviceDetailsList = this.serviceDetailsList.map((service) => {
                service['performs'] = false;
                service['priceValue'] = null;
                return service;
              });
              this.assaignWorkerServices();
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
      });
  }
  serviceGroupListOnChange(value) {
    this.selectedServiceGroup = value;
    let tempActive;
    if (this.showInactive) {
      tempActive = config.environment.booleanFalse;
    } else {
      tempActive = config.environment.booleanTrue;
    }
    this.clearData();
    this.serviceTab = false;
    this.setupWorkersDetailsService.showInactiveServiceListByGroupName(tempActive, this.selectedServiceGroup)
      .subscribe(data => {
        this.serviceDetailsList = data['result'];
        this.serviceDetailsList = this.serviceDetailsList.map((service) => {
          service['performs'] = false;
          service['priceValue'] = null;
          return service;
        });
        this.workerServiceData = [];
        if (this.selectedServiceGroup === 'Class') {
          this.setupWorkersDetailsService.getClasses()
            .subscribe(classesData => {
              this.serviceDetailsList = [];
              this.serviceDetailsList = classesData['result'];
              this.serviceDetailsList = this.serviceDetailsList.map((service) => {
                service['performs'] = false;
                service['priceValue'] = null;
                return service;
              });
              this.assaignWorkerServices();
            },
              error1 => {
                const errStatus = JSON.parse(error1['_body'])['status'];
                if (errStatus === '2085' || errStatus === '2071') {
                  if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                  }
                }
              });
        }
        this.assaignWorkerServices();
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
  getBookingData() {
    this.setupWorkersDetailsService.getBookingData().subscribe(
      data => {
        this.bookingDataList = data['result'];
        this.bookingIntervalMinutes = this.bookingDataList.bookingIntervalMinutes;
        this.bookingIntervalMinutesForDurations = this.bookingIntervalMinutes;
        this.appointmentsBookEveryValue = this.bookingIntervalMinutes;
        for (let i = 0; i < 6; i++) {
          this.intervalValues.push({ 'IntValue': this.bookingIntervalMinutes });
          this.bookingIntervalMinutes = this.bookingIntervalMinutesForDurations + this.bookingIntervalMinutes;
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
  selectAll() {
    for (let i = 0; i < this.serviceDetailsList.length; i++) {
      this.selectedValues(true, 'performs', this.serviceDetailsList, i);
    }
  }
  unSelectAll() {
    for (let i = 0; i < this.serviceDetailsList.length; i++) {
      this.selectedValues(false, 'performs', this.serviceDetailsList, i);
      // this.workerServiceData[i]['Removed'] = true;
    }
    for (let i = 0; i < this.workerServiceData.length; i++) {
      this.workerServiceData[i]['Removed'] = true;
    }
  }
  selectAllOnline() {
    for (let i = 0; i < this.serviceDetailsList.length; i++) {
      this.serviceDetailsList[i]['online'] = true;
    }
  }
  unSelectAllOnline() {
    for (let i = 0; i < this.serviceDetailsList.length; i++) {
      this.serviceDetailsList[i]['online'] = false;
    }
  }
  getServiceLevels() {
    this.setupWorkersDetailsService.getLevels().subscribe(
      data => {
        this.levelValues = data['serviceLevels'];
        if (this.levelValues.length > 0) {
          this.serviceLevel = this.levelValues[0].level;
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
  applyPriceLevel() {
    let test = [];
    if (this.serviceLevel !== this.levelValues[0].level) {
      for (let i = 0; i < this.serviceDetailsList.length; i++) {
        if (this.selectedServiceGroup === 'Class') {
          test.push({ 'price': JSON.parse(this.serviceDetailsList[i].Price_per_Attendee__c) });
          this.priceValue = test[i];
        } else {
          if (this.serviceDetailsList[i].performs === true) {
            test = JSON.parse(this.serviceDetailsList[i].Levels__c);
            const levelIndex = test.findIndex((level) => +level.levelNumber === +this.serviceLevel);
            const serviceLevelValues = levelIndex !== -1 ? test[levelIndex] : test[0];
            this.serviceDetailsList[i]['priceValue'] = serviceLevelValues.price;
            const index = this.workerServicesData.findIndex(workerservice => workerservice['Service__c'] === this.serviceDetailsList[i]['Id']);
            if (index !== -1) {
              if (this.workerServicesData[index]['Removed'] === false) {
                this.workerServicesData[index]['isTouched'] = true;
                this.workerServicesData[index]['Name'] = this.serviceDetailsList[i]['Name'];
                this.workerServicesData[index]['Price__c'] = serviceLevelValues.price;
                this.workerServicesData[index]['Duration_1_Available_for_Other_Work__c'] = serviceLevelValues['duration1AvailableForOtherWork'] ? 1 : 0;
                this.workerServicesData[index]['Duration_2_Available_for_Other_Work__c'] = serviceLevelValues['duration2AvailableForOtherWork'] ? 1 : 0;
                this.workerServicesData[index]['Duration_3_Available_for_Other_Work__c'] = serviceLevelValues['duration3AvailableForOtherWork'] ? 1 : 0;
                this.workerServicesData[index]['Duration_1__c'] = serviceLevelValues['duration1'] ? +serviceLevelValues['duration1'] : 0;
                this.workerServicesData[index]['Duration_2__c'] = serviceLevelValues['duration2'] ? +serviceLevelValues['duration2'] : 0;
                this.workerServicesData[index]['Duration_3__c'] = serviceLevelValues['duration3'] ? +serviceLevelValues['duration3'] : 0;
                this.workerServicesData[index]['Buffer_After__c'] = serviceLevelValues['bufferAfter'] ? +serviceLevelValues['bufferAfter'] : 0;
                if (this.serviceId === this.serviceDetailsList[i]['Id']) {
                  this.assaignValuesForApplyServices(this.serviceDetailsList[i]['Id'], i);
                }
              }
            }
          }
        }
      }
    }
  }

  selectedValues(value, seleitem, serviceDetailsList, i) {
    const index = this.getServiceIndex(this.serviceDetailsList[i]['Id']);
    const name = this.serviceDetailsList[i]['Name'];
    if (value === true) {
      // this.serviceDetailsList[i]['performs'] = true;

      if (index === -1) {
        const workerService = {
          'Edit': false,
          'Price__c': null,
          'Service__c': this.serviceDetailsList[i]['Id'],
          'Duration_1_Available_for_Other_Work__c': null,
          'Duration_2_Available_for_Other_Work__c': null,
          'Duration_3_Available_for_Other_Work__c': null,
          'Duration_1__c': null,
          'Duration_2__c': null,
          'Duration_3__c': null,
          'Service_Fee_Percent__c': null,
          'Service_Fee_Amount__c': null,
          'Worker__c': this.updateId,
          'Removed': false,
          'isTouched': true,
          'Name': name,
          'seleitem': seleitem
        };
        this.workerServicesData.push(workerService);
      } else {
        this.workerServicesData[index]['Removed'] = false;
        this.workerServicesData[index]['isTouched'] = true;
        this.workerServicesData[index]['Name'] = name;
        this.workerServicesData[index]['online'] = value;
      }
    } else {
      if (seleitem === 'performs') {
        this.workerServicesData[index]['Removed'] = true;
        this.serviceDetailsList[i]['performs'] = false;
        this.workerServicesData[index]['isTouched'] = true;
        this.workerServicesData[index]['Name'] = name;
      } else {
        this.workerServicesData[index]['Removed'] = false;
        this.workerServicesData[index]['isTouched'] = true;
        this.workerServicesData[index]['Name'] = name;
        this.workerServicesData[index]['online'] = value;
      }
    }
  }

  getServiceIndex(serviceId): number {
    const index = this.workerServicesData.findIndex(workerservice => workerservice['Service__c'] === serviceId);
    return index;
  }
  showServiceData(serviceData, serviceDetailsList, i) {
    this.serviceName = serviceData.Name;
    this.serviceIndex = undefined;
    // this.updateWorkerServiceValues();
    this.serviceTab = true;
    if (this.serviceDetailsList[i]['performs'] === false) {
      this.clearData();
    }
    this.assaignValuesForApplyServices(serviceData['Id'], i);
    this.serviceId = serviceData['Id'];
    // const LevelC = JSON.parse(this.serviceData1.Levels__c);
    // this.servicePrice = LevelC[0].price;
    // this.serviceBufferAfter = LevelC[0].bufferAfter;
  }

  isNumeric(e): boolean {
    return this.commonService.IsNumeric(e);
  }
  assaignValuesForApplyServices(serviceId, index) {
    for (let k = 0; k < this.workerServicesData.length; k++) {
      if (serviceId === this.workerServicesData[k]['Service__c'] && this.serviceDetailsList[index]['performs'] === true) {
        this.serviceIndex = k;
        this.workerServicesData[k]['Name'] = this.serviceDetailsList[index]['Name'];
        this.workerServicesData[k]['isTouched'] = true;
        this.serviceId = this.workerServicesData[k]['Service__c'];
        this.servicePrice = this.workerServicesData[k]['Price__c'];
        this.serviceavailable_1 = this.workerServicesData[k]['Duration_1_Available_for_Other_Work__c'];
        this.serviceavailable_2 = this.workerServicesData[k]['Duration_2_Available_for_Other_Work__c'];
        this.serviceavailable_3 = this.workerServicesData[k]['Duration_3_Available_for_Other_Work__c'];
        this.serviceDuration_1 = this.workerServicesData[k]['Duration_1__c'];
        this.serviceDuration_2 = this.workerServicesData[k]['Duration_2__c'];
        this.serviceDuration_3 = this.workerServicesData[k]['Duration_3__c'];
        this.serviceBufferAfter = this.workerServicesData[k]['Buffer_After__c'];
        this.serviceFeeAmount = this.workerServicesData[k]['Service_Fee_Amount__c'];
        this.serviceFeePercentage = this.workerServicesData[k]['Service_Fee_Percent__c'];
      }
    }
  }
  updateWorkerServiceValues() {
    const index = this.serviceDetailsList.findIndex(service => service['Id'] === this.serviceId);
    if (this.serviceDetailsList[index]['performs'] === true) {
      this.serviceDetailsList[index]['priceValue'] = this.servicePrice;
      this.workerServicesData[this.serviceIndex]['Price__c'] = this.servicePrice;
      this.workerServicesData[this.serviceIndex]['Duration_1_Available_for_Other_Work__c'] = this.serviceavailable_1 ? 1 : 0;
      this.workerServicesData[this.serviceIndex]['Duration_2_Available_for_Other_Work__c'] = this.serviceavailable_2 ? 1 : 0;
      this.workerServicesData[this.serviceIndex]['Duration_3_Available_for_Other_Work__c'] = this.serviceavailable_3 ? 1 : 0;
      this.workerServicesData[this.serviceIndex]['Duration_1__c'] = this.serviceDuration_1;
      this.workerServicesData[this.serviceIndex]['Duration_2__c'] = this.serviceDuration_2;
      this.workerServicesData[this.serviceIndex]['Duration_3__c'] = this.serviceDuration_3;
      this.workerServicesData[this.serviceIndex]['Buffer_After__c'] = this.serviceBufferAfter;
      this.workerServicesData[this.serviceIndex]['Service_Fee_Amount__c'] = this.serviceFeeAmount;
      this.workerServicesData[this.serviceIndex]['Service_Fee_Percent__c'] = this.serviceFeePercentage;
    }
  }
  /* method to restrict specialcharecters  */
  keyPress(event: any) {
    const pattern = /[a-zA-Z0-9\+g]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  /*--- goals ---*/
  /*--- To add goal row ---*/
  addRows() {
    this.addrows = true;
    this.goalsRows.push({
      goalsId: '', startDate: '', endDate: '',
      target: '', Id: ''
    });
  }
  /*--- To delete row ---*/
  deleteFieldValue(goalsRows, index) {
    this.goalsRows.splice(index, 1);
    this.goalError = '';
  }
  deleteFieldValue1(goallist, index) {
    this.goalList[index].delete = true;
    this.clearErrMsg();
  }
  addPreviousGoals() {
    this.goalListRows = true;
    this.goalList.push({ updateWorkerId: this.updateWorkerId });
  }
  getPreviousGoals(value) {
    if (value.target.checked === true) {
      this.previousGoals = value.target.checked;
      this.setupWorkersDetailsService.previousGoals(this.previousGoals, this.updateId, this.commonService.getDBDatStr(new Date()))
        .subscribe(data => {
          this.goalList = data['result'];
          this.goalList = this.updateDateFields(this.goalList);
          this.goalsRows = [];
          this.calculatedGoal = [];
          this.percentOfGoal = [];
          if (this.goalList.length === 0) {
            this.goalsRows = [];
            this.addRows();
          }
        },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
              case '2033':
                this.goalError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2043':
                this.goalError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
            }
            if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });
    } else if (value.target.checked === false) {
      this.previousGoals = value.target.checked;
      this.setupWorkersDetailsService.previousGoals(this.previousGoals, this.updateId, this.commonService.getDBDatStr(new Date()))
        .subscribe(data1 => {
          this.goalList = data1['result'];
          this.goalList = this.updateDateFields(this.goalList);
          this.goalsRows = [];
          this.calculatedGoal = [];
          this.percentOfGoal = [];
          if (this.goalList.length === 0) {
            // this.goalsRows = [];
            this.addRows();
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
      // this.addRows();
    }
  }

  updateDateFields(dataArray: any) {
    if (dataArray && dataArray.length > 0) {
      for (let i = 0; i < dataArray.length; i++) {
        dataArray[i].startDate = this.commonService.getDateFrmDBDateStr(dataArray[i].startDate);
        dataArray[i].endDate = this.commonService.getDateFrmDBDateStr(dataArray[i].endDate);
      }
    }
    return dataArray;
  }
  updatePercentageOfGoal(goallist, index) {
    goallist.startDate2 = this.commonService.getDBDatStr(goallist.startDate);
    goallist.endDate2 = this.commonService.getDBDatStr(goallist.endDate);
    this.setupWorkersDetailsService.updateGoal(goallist, this.updateId).subscribe(data => {
      this.calculationList = data['result'];
      this.calculatedGoal[index] = this.calculationList.calculatedGoal;
      this.percentOfGoal[index] = this.calculationList.percentOfGoal;
      this.percentOfGoal[index] = Math.round(this.percentOfGoal[index] * 100) / 100;
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

  togglePassword(index) {
    if (index === 1) {
      if (this.glyphiconClass1 === 'glyphicon-eye-open') {
        this.glyphiconClass1 = 'glyphicon-eye-close';
        this.passwordType1 = 'text';
      } else {
        this.glyphiconClass1 = 'glyphicon-eye-open';
        this.passwordType1 = 'password';
      }
    } else if (index === 2) {
      if (this.glyphiconClass2 === 'glyphicon-eye-open') {
        this.glyphiconClass2 = 'glyphicon-eye-close';
        this.passwordType2 = 'text';
      } else {
        this.glyphiconClass2 = 'glyphicon-eye-open';
        this.passwordType2 = 'password';
      }
    }
  }
  hyphen_generate_mobile1(value) {
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('mobile_id1')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('mobile_id1')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('mobile_id1')).value = value.concat('-');
    }
  }
  hyphen_generate_mobile2(value) {
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('mobile_id2')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('mobile_id2')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('mobile_id2')).value = value.concat('-');
    }
  }
  hyphen_generate_mobile3(value) {
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('mobile_id3')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('mobile_id3')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('mobile_id3')).value = value.concat('-');
    }
  }
  hyphen_generate_mobile4(value) {
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('mobile_id4')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('mobile_id4')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('mobile_id4')).value = value.concat('-');
    }
  }

  imageErrorHandler(event) {
    event.target.src = '/assets/images/no-preview.png';
  }

  clearData() {
    this.servicePrice = '';
    this.serviceavailable_1 = '';
    this.serviceavailable_2 = '';
    this.serviceavailable_3 = '';
    this.serviceDuration_1 = '';
    this.serviceDuration_2 = '';
    this.serviceDuration_3 = '';
    this.serviceBufferAfter = '';
    this.serviceFeeAmount = '';
    this.serviceFeePercentage = '';
  }

  alphaOnly(e) {
    const specialKeys = new Array();
    specialKeys.push(8); // Backspace
    specialKeys.push(9); // Tab
    specialKeys.push(46); // Delete
    specialKeys.push(36); // Home
    specialKeys.push(35); // End
    specialKeys.push(37); // Left
    specialKeys.push(39); // Right
    const keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
    const ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) ||
      (specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode));
    return ret;
  }
  numberOnly(event: any) {
    const pattern = /[0-9.]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
   /* method to restrict specialcharecters  */
   numOnly(event: any) {
    const pattern = /[0-9a-zA_Z]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  getLocation() {
    if (this.zipCode.length > 4) {
      this.http.get('https://ziptasticapi.com/' + this.zipCode).subscribe(
        result => {
          if (result['error']) {
            const toastermessage: any = this.translateService.get('SETUPCOMPANY.ZIP_CODE_NOT_FOUND');
            this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
          } else {
            if (result['country'] === 'US') {
              this.country = 'United States';
              config.states.forEach(state => {
                if (state.abbrev === result['state']) {
                  this.state = state.name;
                }
              });

            }
            const cityArray = result['city'].split(' ');
            for (let i = 0; i < cityArray.length; i++) {
              if (i === 0) {
                this.city = cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
              } else {
                this.city += cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
              }
            }
          }
        },
        error => {
        }
      );
    }
  }
}
