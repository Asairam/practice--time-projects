import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { NewClientService } from './newclient.service';
import * as config from '../../app.config';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { CommonService } from '../../common/common.service';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { CheckOutEditTicketService } from '../../checkout/editticket/checkouteditticket.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-newclient',
  templateUrl: './newclient.component.html',
  styleUrls: ['./newclient.component.css'],
  providers: [NewClientService, CheckOutEditTicketService, CommonService]
})
export class NewClientComponent implements OnInit {
  @ViewChild('notesModal') serviceNotesModal: ModalDirective;
  @ViewChild('notesAppModal') appointmentNotesModal: ModalDirective;
  @ViewChild('fileInput') myInputVariable: ElementRef;
  @ViewChild('lookupModal') lookupModal: ModalDirective;
  @ViewChild('verifyNumberPopup') public verifyNumberPopup: ModalDirective;
  @ViewChild('myPin') myPin: ElementRef;
  decodedToken: any;
  activeClass: any;
  activeClass1: any;
  marketingActiveClass: any;
  activeTab2 = [false, false, false, false, false, false, false, false];
  activeTabClass = ['', 'active', '', '', '', '', '', ''];
  restrictions = [{ 'name': 'none', 'value': 'None', 'active': 'active' },
  { 'name': 'alert only', 'value': 'Alert Only', 'active': '' },
  { 'name': 'do not book', 'value': 'Do Not Book', 'active': '' }];
  config: any;
  getallclient: any = [];
  error: any;
  filterClient: any;
  imgPath = config.API_END_POINT;
  searchKeyValue: any;
  toastermessage: any;
  isEdit: any = false;
  clientEditObj: any;
  lookupSearchKey: any = '';
  lookUpSearchData: any = [];
  paymentTypeGateWay = config.ANYWHERECOMMERCE_PAYMENT_TYPE_GATEWAY;
  clientServicesList: any = [];
  clientCommunicationList: any = [];
  leftProfile = false;
  fileName = 'No file chosen';
  clientPictureFile: File;
  newClientPictureFile: File;
  clientPictureFileView: SafeUrl = '';
  newclientPictureFileView: SafeUrl = '';
  clientClassList: any = [];
  clientProductList: any = [];
  // senOtpStatus: any = false;
  clientReferedDataList: any = [];
  clientRewardData: any = [];
  allRwrdsData: any;
  filteredRwds: any;
  clientRewardData1: any = [];
  Reward__c: any;
  refRwds: any;
  clientMemberShipsData: any = [];
  clientPackagesData: any = [];
  ClientServiceData: any = [];
  clientAccountsData: any = [];
  clientFlags: any = [];
  occupationData: any = [];
  totalUnUsedValue: any = 0;
  noEmailAppt: any = false;
  accoutChargeBalance: any = false;
  depositRequired: any = false;
  persistanceNoShow: any = false;
  other: any = false;
  apptNotes: any;
  pin: any;
  lookUpType: any;
  serviceTotal: any;
  totalQtySold: any;
  proTotalPrice: any;
  classLogLength: any;
  mobileCarriersList: any;
  mobileCountryCode = '';
  primaryCountryCode = '';
  rewardCalErrorMsg = [];
  public searchField = new FormControl();
  public searchLookupField = new FormControl();
  clienProfile = { 'fName': '', 'lName': '', 'id': '', 'FullName': '', 'email': '', 'phone': '', 'name': '', 'pic': '', 'note': '', 'client_since': '', 'index': '' };
  AppointmentsTab = {
    'restrictionsType': '',
    'noEmailAppt': '',
    'accoutChargeBalance': '',
    'depositRequired': '',
    'persistanceNoShow': '',
    'apptNotes': '',
    'pin': '',
    'standingAppt': '',
    // 'hasStandingAppt': '',
    'Other': ''
  };
  resultAppointments = [];
  clientappoinmentData: any;
  clientServicesData = [];
  loadmore = 10;
  hideLoadMoreButt = false;
  // hasStandingAppt: any = false;
  AddNewClient = false;
  NewClient: any = {
    'firstname': '',
    // 'middlename': '',
    'lastname': '',
    'primaryPhone': '',
    'mobilePhone': '',
    'email': '',
    'gender': '',
    'isNewClient': true
  };
  getnextAppt: any;
  errorMessage: any;
  statesList: any;
  ClientProError: any = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  datePickerConfig: any;
  CommonSaveBut = false;
  serviceId: any;
  notesTestareaNote: any;
  getnextApptWorker = '';
  clientObj: any;
  clientPicture: any;
  noEmailBool = false;
  noProPic = false;
  avProPic = false;
  serviceLogLength: any;
  apptSerList = [];
  newClientId: any;
  redirectTokenPage = false;
  displayddl = 'inline';
  paramsId: any;
  bookingUrl: any;
  action: any;
  saveAndBookButt = false;
  dropdownList = [];
  selectedFlagItems = [];
  dropdownSettings = {};
  /* client fileds */
  allowQuickAddAccess: any;
  birthDate: any;
  gender: any;
  mailingAddress: any;
  mobilePhone: any;
  primaryEmail: any;
  primaryPhone: any;
  secondaryEmail: any;
  /* client fields end */
  /*clientcared fileds */
  clientCardPrimaryPhone: any;
  clientCardMobilePhone: any;
  clientCardBirthDate: any;
  clientCardMailingAddress: any;
  clientCardPrimaryEmail: any;
  clientCardSecondaryEmail: any;
  clientCardGender: any;
  StartingBalanceDisable = false;
  genderSeleUnselFemale: boolean;
  genderSeleUnselMale: boolean;
  actionmethod: any;
  /*clientcared fileds end */
  promotionName: any;
  searchLookupKeyValue: any;
  filterlookupClient = [];
  actionApptId: any;
  AvailableAppt = [];
  PreviousServiceNote = '';
  lastVisit: any;
  ApptExpires: any;
  decodeUserToken: any;
  hideClientInfo: any;
  noResult: any;
  mailingCountriesList = [{ 'NAME': 'Canada' }, { 'NAME': 'United States' }];
  constructor(private activatedRoute: ActivatedRoute,
    private newClientService: NewClientService,
    private sanitizer: DomSanitizer, private commonservice: CommonService, private http: HttpClient,
    private checkOutEditTicketService: CheckOutEditTicketService, private location: Location,
    private toastr: ToastrService, private translateService: TranslateService, private router: Router,
    @Inject('apiEndPoint') private apiEndPoint: string) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
    this.activatedRoute.queryParams.subscribe(params => {
      this.paramsId = activatedRoute.snapshot.params['Id'];
      this.actionmethod = params.actionMethod;
      this.actionApptId = params.apptId;
    });
  }

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

    this.search();
    this.lookupSearch();
    this.getRewards();
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params.has('action')) {
        this.action = params.get('action');
        if (this.action === 'bookstanding') {
          this.bookingUrl = '/appointment/bookstandingappt/' + this.paramsId;
        } else if (this.action === 'findappt') {
          this.bookingUrl = '/appointment/book/' + this.paramsId;
        } else if (this.action === 'modify') {
          this.bookingUrl = '/appointment/modifyappt/' + this.paramsId + '/' + params.get('apptid');
        }
      }
    });
    this.updateTabs(0); // tab redirect fun
    this.clientEditObjFun();
    // this.getAllClients();
    this.mobileCarriernamesData();
    this.getClientFlags();
    this.getOccupation();
    this.clientCardFeilds();
    this.getHideClientContactInfo();
    if (this.router.url === '/client/quick/add') {
      this.AddNewClient = true;
      this.searchKeyValue = '';
    } else if (this.router.url === '/client/add') {
      this.goToFullClientCard();
      this.searchKeyValue = undefined;
    } else if (this.router.url.match(/client\/edit/g)) {
      this.CliData(this.paramsId);
    } else if (this.router.url === '/client/quick/add?actionMethod=findAppt' || this.router.url === '/client/quick/add?actionMethod=bookStanding' ||
      this.router.url === '/client/quick/add?actionMethod=checkout') {
      // this.searchKeyValue = '';
      this.listClientFields();
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getCountry('United States');
  }

  CliData(id) {
    this.newClientService.getClient(id).subscribe(data => {
      const clientData = data['result']['results'][0];
      this.getClientProfile(clientData, null);
      this.searchKeyValue = undefined;
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
  getRewards() {
    this.checkOutEditTicketService.getRewardsData().subscribe(
      data => {
        this.allRwrdsData = data['result'];
        const tempRwdData = data['result'].filter((obj) => obj.Active__c === 1);
        let clientRwrdsData = [];
        if (tempRwdData && tempRwdData.length > 0) {
          for (let i = 0; i < tempRwdData.length; i++) {
            const temp = JSON.parse(tempRwdData[i].Award_Rules__c);
            let points = 0;
            for (let j = 0; j < temp.length; j++) {
              if (temp[j]['forEvery'] === 'Referred Client') {
                points = 0;
                points += temp[j]['awardPoints'];
                clientRwrdsData.push({
                  Reward__c: tempRwdData[i].Id,
                  rwdName: tempRwdData[i].Name,
                  adjustPoints: points,
                  item: temp[j].item,
                  stDate: temp[j].startDate,
                  endDate: temp[j].endDate,
                  forEvery: temp[j].forEvery,
                });
              }
            }
          }
        }
        clientRwrdsData = this.commonservice.getFilterRwdsByAwardRules(clientRwrdsData, null);
        if (clientRwrdsData && clientRwrdsData.length > 0) {
          const dataFilter = [];
          for (let i = 0; i < clientRwrdsData.length; i++) {
            if (i === 0) {
              dataFilter.push(clientRwrdsData[i]);
            } else {
              const index = dataFilter.findIndex((data1) => data1.rwdId === clientRwrdsData[i]['rwdId']);
              if (index !== -1) {
                dataFilter[index]['points'] = +dataFilter[index]['points'] + clientRwrdsData[i]['points'];
              } else {
                dataFilter.push(clientRwrdsData[i]);
              }
            }
          }
          this.refRwds = dataFilter;
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
      });
  }
  search() {
    this.searchField.valueChanges
      .debounceTime(400)
      .switchMap(term => this.newClientService.getClientAutoSearch(term)
      ).subscribe(
        data => {
          this.filterClient = data['result'];
          if (this.searchKeyValue) {
            if (this.searchKeyValue.length !== 0 && this.filterClient.length === 0) {
              this.noResult = 'No Results';
            } else {
              this.noResult = '';
            }
          } else {
            this.filterClient = [];
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
        });
  }
  lookupSearch() {
    this.searchLookupField.valueChanges
      .debounceTime(400)
      .switchMap(term => this.newClientService.getClientAutoSearch(term)
      ).subscribe(
        data => {
          if (this.lookUpType === 'responsible-party') {
            this.filterlookupClient = data['result'].filter(
              filterList => filterList.Id !== this.clientEditObj.Id);
          } else {

            if (this.clientReferedDataList.length > 0) {
              this.filterlookupClient = data['result'];
              for (let t = 0; t < this.clientReferedDataList.length; t++) {
                this.filterlookupClient = this.filterlookupClient.filter(
                  filterList => filterList.Id !== this.clientEditObj.Id && filterList.Id !== this.clientReferedDataList[t].id);
              }
            } else {
              this.filterlookupClient = data['result'].filter(
                filterList => filterList.Id !== this.clientEditObj.Id);
            }

          }
          if (this.searchLookupKeyValue) {
            if (this.searchLookupKeyValue.length !== 0 && this.filterlookupClient.length === 0) {
              this.noResult = 'No Results';
            } else {
              this.noResult = '';
            }
          } else {
            this.filterlookupClient = [];
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
        });
  }
  refreshFilterClient() {
    this.newClientService.getClientAutoSearch(this.searchKeyValue)
      .subscribe(
        data => {
          this.filterClient = data['result'];
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
        });
  }
  assaignReferalValues(obj, key): Array<string> {
    if (!isNullOrUndefined(obj[key]) && obj[key] !== '') {
      return obj[key].split(',');
    } else {
      return [];
    }
  }
  clientEditObjFun() {
    this.clientEditObj = {
      FirstName: '',
      LastName: '',
      MailingStreet: '',
      MailingCity: '',
      MailingState: '',
      MailingCountry: 'United States',
      Pin__c: '',
      Email: '',
      MobilePhone: '',
      HomePhone: '',
      Phone: '',
      Title: '',
      Birthdate: '',
      Emergency_Name__c: '',
      Relationship: '',
      Emergency_Primary_Phone__c: '',
      Emergency_Secondary_Phone__c: '',
      Gender__c: '',
      Active__c: 0,
      ReferredClient: '',
      BirthDateNumber__c: '',
      BirthMonthNumber__c: '',
      BirthYearNumber__c: '',
      Marketing_Mobile_Phone__c: '',
      Marketing_Primary_Email__c: '',
      Marketing_Opt_Out__c: '',
      Notification_Mobile_Phone__c: '',
      Notification_Opt_Out__c: '',
      Notification_Primary_Email__c: 1,
      Reminder_Mobile_Phone__c: '',
      Reminder_Opt_Out__c: '',
      Reminder_Primary_Email__c: 1,
      Active_Rewards__c: '1',
      Membership_ID__c: '',
      Starting_Balance__c: '',
      Payment_Type_Token__c: '',
      Token_Expiration_Date__c: '',
      Token_Present__c: '',
      Credit_Card_Token__c: '',
      Secondary_Email__c: '',
      MiddleName: '',
      MailingPostalCode: '',
      Responsible_Party__c: '',
      Client_Flag__c: '',
      Refer_A_Friend_Prospect__c: '',
      Referred_On_Date__c: '',
      No_Email__c: 0,
      Marketing_Secondary_Email__c: '',
      ReferredClientPic: '',
      ResponsibleClient: '',
      ResponsibleClientPic: '',
      Notification_Secondary_Email__c: '',
      Reminder_Secondary_Email__c: '',
      // Mobile_Carrier__c: '',
      Booking_Restriction_Note__c: '',
      Notes__c: '',
      Booking_Frequency__c: '',
      Allow_Online_Booking__c: 1,
      Referred_By__c: '',
      selectedFlags: [],
      Client_Pic__c: '',
      Id: '',
      CreatedDate: '',
      Current_Balance__c: ''
    };
  }
  getClientData(clientId) {
    this.newClientService.getClient(clientId)
      .subscribe(data => {
        this.isEdit = true;
        this.clientReferedDataList = [];
        let referalNames: any = [];
        let referalId: any = [];
        let referalClientPics: any = [];
        let referalClientDates: any = [];
        const clientData = data['result']['results'][0];
        Object.keys(clientData).map((Dkey) => {
          switch (Dkey) {
            case 'refName': {
              referalNames = this.assaignReferalValues(clientData, Dkey);
            }
              break;
            case 'refId': {
              referalId = this.assaignReferalValues(clientData, Dkey);
            }
              break;
            case 'refClientPics': {
              referalClientPics = this.assaignReferalValues(clientData, Dkey);
            }
              break;
            case 'refClientDates': {
              referalClientDates = this.assaignReferalValues(clientData, Dkey);
            }
              break;
          }
          Object.keys(this.clientEditObj).map((Mkey) => {
            if (Dkey === Mkey) {
              if (!isNullOrUndefined(clientData[Mkey])) {
                this.clientEditObj[Mkey] = clientData[Mkey];
                switch (Mkey) {
                  case 'MailingCountry': {
                    this.getCountry(this.clientEditObj.MailingCountry);
                  } break;
                  case 'Client_Flag__c': {
                    this.clientEditObj.selectedFlags = clientData[Mkey].split(';');
                  } break;
                }
              } else {
                this.clientEditObj[Mkey] = '';
              }
            }
          });
        });
        if (referalNames.length !== 0) {
          referalNames.forEach((name, i) => {
            const referalData: any = {};
            referalData['name'] = referalNames[i];
            referalData['id'] = referalId[i];
            referalData['clientImage'] = referalClientPics[i];
            referalData['referedDate'] = referalClientDates[i];
            this.clientReferedDataList.push(referalData);
          });
        }
        this.noEmailBool = this.clientEditObj.No_Email__c === 1 ? true : false;
        this.clientEditObj.Birthdate = new Date(this.clientEditObj.Birthdate).toString() === 'Invalid Date' ? '' : this.clientEditObj.Birthdate;
        // flag
        this.selectedFlagItems = [];
        if (this.clientEditObj.MobilePhone) {
          this.mobileCountryCode = this.clientEditObj.MobilePhone.split('-')[0];
          this.clientEditObj.MobilePhone = this.clientEditObj.MobilePhone.split('-')[1] + '-' + this.clientEditObj.MobilePhone.split('-')[2];
        }
        if (this.clientEditObj.Phone) {
          this.primaryCountryCode = this.clientEditObj.Phone.split('-')[0];
          this.clientEditObj.Phone = this.clientEditObj.Phone.split('-')[1] + '-' + this.clientEditObj.Phone.split('-')[2];
        }
        this.clientEditObj.selectedFlags.filter((obj) => {
          this.clientFlags.filter((obj1) => {
            if (obj === obj1.item_text) {
              this.selectedFlagItems.push(obj1);
            }
          });
        });
        if (this.clientEditObj.Starting_Balance__c === 0 || this.clientEditObj.Starting_Balance__c === '') {
          this.StartingBalanceDisable = false;
        } else {
          this.StartingBalanceDisable = true;
        }
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
  leftProfileUpdate(pro) {
    this.clienProfile = {
      'fName': pro.FirstName,
      'lName': pro.LastName,
      'name': pro.FirstName + ' ' + pro.LastName,
      'id': pro.Id,
      'FullName': pro.FullName,
      'email': pro.Email === 'null' ? '' : pro.Email,
      'phone': pro.MobilePhone === 'null' ? '' : pro.MobilePhone,
      'pic': pro.Client_Pic__c,
      'note': pro.Notes__c === 'null' ? '' : pro.Notes__c,
      'client_since': pro.CreatedDate,
      'index': null
    };
  }
  getOccupation() {
    this.newClientService.getOccupations().subscribe(
      data => {
        this.occupationData = data['result'].filter(
          filterList => filterList.active === true || filterList.active === 'true');
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

  openNav() {
    document.getElementById('mySidenav').style.width = '350px';
    document.getElementById('mySidenav').style.paddingLeft = '25px';
  }
  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('mySidenav').style.paddingLeft = '0px';
  }
  getServiceLog(clientId: string) {
    this.newClientService.getServiceLog(clientId).subscribe(
      data => {
        this.clientServicesList = data['result'];
        for (let i = 0; i < this.clientServicesList.length; i++) {
          this.clientServicesList[i].servdate = this.commonservice.getUsrDtStrFrmDBStr(this.clientServicesList[i].Service_Date_Time__c);
        }
        this.serviceLogLength = this.clientServicesList.length;
        this.serviceTotal = 0;
        this.clientServicesList.forEach(element => {
          if (element.Net_Price__c === '' || element.Net_Price__c === null || element.Net_Price__c === undefined) {
            element.Net_Price__c = 0;
          }
          if (element.Booked_Package__c !== null && element.Booked_Package__c !== '') {
            element.promotion = 'Prepaid Package';
          }
          this.serviceTotal += element.Net_Price__c;
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
      }
    );
  }

  getClientCommunicationList(clientId: string) {
    this.newClientService.getEmailOrTextLog(clientId).subscribe(
      data => {
        this.clientCommunicationList = data['result'];
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

  checkOrUnCheck(name) {
    let value = this.clientEditObj[name];
    if (!isNullOrUndefined(value)) {
      if (value === 1) {
        value = 0;
      } else {
        value = 1;
      }
    } else {
      value = 1;
    }
    this.clientEditObj[name] = value;
  }

  getClientRewards(clientId) {
    this.newClientService.getClientRewardsData(clientId).subscribe(
      data => {
        this.filteredRwds = [];
        this.clientRewardData1 = [];
        this.clientRewardData = data['result'];
        if (this.clientRewardData && this.clientRewardData.length > 0) {
          this.filteredRwds = this.allRwrdsData.filter((data1) => {
            return this.clientRewardData.findIndex((obj) => obj['Reward__c'] === data1['Id']) === -1;
          });
        } else {
          this.filteredRwds = this.allRwrdsData;
        }
        this.filteredRwds = this.filteredRwds.filter((obj) => obj.Active__c === 1);
        if (this.filteredRwds && this.filteredRwds.length > 0) {
          this.clientRewardData1.push({ Reward__c: this.filteredRwds[0].Id, Client__c: this.filteredRwds[0].Id, type: 'static' });
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

  getClientMemberships(clientId) {
    this.newClientService.getClientMembershipsData(clientId).subscribe(
      data => {
        this.clientMemberShipsData = data['result'];
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

  getClassLog(clientId: string) {
    this.newClientService.getClassLog(clientId).subscribe(
      data => {
        this.clientClassList = data['result'];
        this.classLogLength = this.clientClassList.length;
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
  // sendOtp(number) {
  //   this.senOtpStatus = false;
  //   const phone = { 'phone': number, 'action': 'sendOtp' };
  //   this.newClientService.sendOtp(phone).subscribe(
  //     data => {
  //       if (data['result']) {
  //         this.senOtpStatus = true;
  //       }
  //     }, error => { });
  // }
  // verifyOtp(otp) {
  //   const phone = { 'phone': this.clientEditObj.Phone, 'token': otp, 'action': 'verify' };
  //   this.newClientService.sendOtp(phone).subscribe(
  //     data => {
  //       this.senOtpStatus = data['result'];
  //       this.verifyNumberPopup.hide();
  //     }, error => {
  //       this.error = JSON.parse(error._body)['result'];
  //     });
  // }
  getProductLog(clientId: string) {
    this.newClientService.getProductLog(clientId).subscribe(
      data => {
        this.clientProductList = data['result'];
        for (let i = 0; i < this.clientProductList.length; i++) {
          this.clientProductList[i].displaydate = this.commonservice.getUsrDtStrFrmDBStr(this.clientProductList[i].Appt_Date_Time__c);
        }
        this.totalQtySold = 0;
        this.proTotalPrice = 0;
        this.clientProductList.forEach(element => {
          if (element.Qty_Sold__c || element.Net_Price__c) {
            element.totalNetPrice = element.Net_Price__c * element.Qty_Sold__c;
          }
          if (element.Qty_Sold__c !== '' || element.Qty_Sold__c !== null || element.Qty_Sold__c !== undefined) {
            this.totalQtySold += element.Qty_Sold__c;
          }
          // if (element.Price__c === '' || element.Price__c === null || element.Price__c === undefined) {
          //   element.Price__c = 0;
          // }
          this.proTotalPrice += element.totalNetPrice;
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
      }
    );
  }
  getClientAccounts(clientId) {
    this.newClientService.getClientAccountsData(clientId).subscribe(
      data => {
        this.clientAccountsData = data['result'];
        for (let i = 0; i < this.clientAccountsData.length; i++){
          this.clientAccountsData[i].disaplayDate = this.commonservice.getUsrDtStrFrmDBStr(this.clientAccountsData[i].dateTime);
        }
        // let resConcat = resArr[1].concat(resArr[0]);
        // resConcat = this.sortDatesDesc(resConcat, 'dateTime');
        // this.clientAccountsData = [];
        // const curBalArr = [];
        // for (let i = resConcat.length; i--;) {
        //   curBalArr.push(resConcat[i]);
        // }
        // for (let c = 0; c < curBalArr.length; c++) {
        //   if (c === 0) {
        //     curBalArr[c].currBal = curBalArr[c].Amount_Paid__c + this.clientEditObj.Starting_Balance__c;
        //   } else {
        //     curBalArr[c].currBal = curBalArr[c]['Amount_Paid__c'] + curBalArr[c - 1]['currBal'];
        //   }
        // }
        // for (let j = curBalArr.length; j--;) {
        //   this.clientAccountsData.push(curBalArr[j]);
        // }
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

  getClientFlags() {
    this.newClientService.getClientFlags().subscribe(
      data => {
        this.clientFlags = data['result'].filter(
          filterList => filterList.active === true);
        this.clientFlags.forEach((element, index) => {
          element.item_text = element.flagName;
          element.item_id = index + 1;
        });
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
  getClientPackages(clientId) {
    this.totalUnUsedValue = 0;
    this.newClientService.getClientPackagesData(clientId).subscribe(
      data => {
        const cpData = data['result'];
        let cpdata2 = [];
        this.clientPackagesData = [];
        if (data['result'] !== '') {
          cpdata2 = cpData.ClientPackageData;
          this.ClientServiceData = cpData.ServiceData;
          if (cpdata2) {
            for (let j = 0; j < cpdata2.length; j++) {
              for (let i = 0; i < JSON.parse(cpdata2[j]['Package_Details__c']).length; i++) {
                const unused1: any = JSON.parse(cpdata2[j]['Package_Details__c'])[i].reps - JSON.parse(cpdata2[j]['Package_Details__c'])[i].used;
                // const unusedVal = unused1 + ' of ' + (JSON.parse(cpdata2[j]['Package_Details__c'])[i].reps + JSON.parse(cpdata2[j]['Package_Details__c'])[i].used);
                this.clientPackagesData.push({
                  Name: cpdata2[j]['Name'],
                  // serviceName: this.ClientServiceData[i]['ServiceName'],
                  serviceId: JSON.parse(cpdata2[j]['Package_Details__c'])[i]['serviceId'],
                  reps: JSON.parse(cpdata2[j]['Package_Details__c'])[i].reps,
                  used: JSON.parse(cpdata2[j]['Package_Details__c'])[i].used,
                  Ticket__c: cpdata2[j].Ticket__c,
                  TicketName: cpdata2[j].TicketName,
                  CreatedDate: cpdata2[j].CreatedDate,
                  unusedValue: parseInt(unused1, 10) * parseInt(JSON.parse(cpdata2[j]['Package_Details__c'])[i]['discountPriceEach'], 10)
                });
              }
            }
            for (let i = 0; i < this.ClientServiceData.length; i++) {
              for (let j = 0; j < this.clientPackagesData.length; j++) {
                this.clientPackagesData[j].createDate = this.commonservice.getUsrDtStrFrmDBStr(this.clientPackagesData[j].CreatedDate);
                if (this.clientPackagesData[j]['serviceId'] === this.ClientServiceData[i]['Id']) {
                  this.clientPackagesData[j]['serviceName'] = this.ClientServiceData[i]['ServiceName'];
                  // this.clientPackagesData[i]['serviceId'] = this.ClientServiceData[i]['serviceId'];
                }
              }
            }
          }
          this.clientPackagesData.map((obj) => { this.totalUnUsedValue += obj['unusedValue']; });
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

  IsAlphaNumeric(e, feildName: string) {

    const value = e.target.value;
    let ret: boolean;

    const code = e.keyCode === 0 ? e.charCode : e.keyCode;

    let commonCondition: boolean = (code >= 48 && code <= 57) || (code === 8) || code >= 37 && code <= 40;
    if (feildName === 'startingbalance') {
      commonCondition = code === 46 || code === 45 || commonCondition;
    }
    if (commonCondition) { // check digits
      ret = true;
    } else {
      ret = false;
    }
    //  this.clearmessage();
    return ret;
  }
  /* method to restrict specialcharecters  */
  numOnly(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  /* method to restrict specialcharecters  */
  numOnly1(event: any) {
    const pattern = /[0-9-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
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
  updateTabs(order: number) {
    for (let i = 0; i < this.activeTab2.length; i++) {
      if (i === order) {
        this.activeTabClass[i] = 'active';
        this.activeTab2[i] = true;
        this.loadmore = 10;
        this.hideLoadMoreButt = false;
      } else {
        this.activeTabClass[i] = '';
        this.activeTab2[i] = false;
      }
    }
  }
  showNotesModal(note) {
    this.serviceId = note.id;
    this.notesTestareaNote = note.Notes__c;
    // this.indexTemp = index;
    this.serviceNotesModal.show();

    // start Previous Service Note
    const sameSer = [];
    this.clientServicesList.forEach(element => {
      if (element.serviceName === note.serviceName) {
        sameSer.push(element);
      }
    });
    for (let i = 0; i < sameSer.length; i++) {
      if (note.id === sameSer[i].id) {
        for (let j = 1; j < sameSer.length; j++) {
          if ((i + j) < sameSer.length) {
            if (sameSer[i + j].Notes__c) {
              return this.PreviousServiceNote = sameSer[i + j].Notes__c;
            }
          }
        }
      }
    }
    // end Previous Service Note
  }
  CopyPreviousNote() {
    this.notesTestareaNote = this.PreviousServiceNote + ' ' + this.notesTestareaNote;
  }
  showNotesModalApp() {
    this.appointmentNotesModal.show();
  }
  closeAppNotesModal() {
    this.appointmentNotesModal.hide();
  }
  closeServiceNotesModal() {
    this.serviceNotesModal.hide();
    this.PreviousServiceNote = '';
  }
  getAllClients() {
    this.newClientService.getClientData()
      .subscribe(data => {
        this.getallclient = data['result'];
        this.searchclient(this.searchKeyValue);
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
  imageErrorHandler(event, errorImg) {
    const name = errorImg.split('')[0].toLowerCase();
    event.target.src = 'assets/images/clients_img/' + name + '.png';
  }

  searchclient(searchKey) {
    this.clear();
    if (this.searchKeyValue === '' && !this.router.url.match(/client\/edit/g)) {
      this.filterClient = [];
      this.leftProfile = false;
      this.isEdit = false;
      this.noResult = '';
      this.clienProfile = { 'fName': '', 'lName': '', 'id': '', 'FullName': '', 'email': '', 'phone': '', 'name': '', 'pic': '', 'note': '', 'client_since': '', 'index': '' };
    } else {
      this.isEdit = false;
      this.AddNewClient = false;
      if (this.searchKeyValue === undefined && this.router.url === '/client/add') {
        this.displayddl = 'none';
        this.isEdit = true;
      } else {
        this.displayddl = 'inline';
      }
      if (this.leftProfile === true) {
        this.isEdit = true;
      }
      // this.filterClientBySearchValue(searchKey, 'clients');
    }
  }

  filterClientBySearchValue(searchKey, searchtype, lookupType?: string) {
    if (this.searchKeyValue !== undefined) {
      searchKey = searchKey.toLowerCase();
    }
    let searchFilterData = [];
    searchFilterData = this.getallclient.filter((obj1) => {
      const name = obj1.FirstName + ' ' + obj1.LastName;
      if (name.toLowerCase().indexOf(searchKey) !== -1) {
        return true;
      } else if (obj1.Email.toLowerCase().indexOf(searchKey) !== -1) {
        return true;
      } else if (obj1.MobilePhone.indexOf(searchKey) !== -1) {
        return true;
      } else {
        return false;
      }
    });
    if (searchtype === 'clients') {
      this.filterClient = searchFilterData;
    } else {
      this.lookupSearchKey = searchKey;
      this.lookUpSearchData = searchFilterData;
    }
  }

  // get next appointment data
  getNextAppointment(id) {
    this.newClientService.getNextAppt(id)
      .subscribe(data => {
        if (data['result'] !== undefined) {
          this.getnextAppt = data['result'].Appt_Date_Time__c;
          this.getnextApptWorker = data['result'].workerName;
        } else {
          this.getnextAppt = '';
          this.getnextApptWorker = '';
        }
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

  getClientProfile(pro, i) {
    this.location.replaceState('/client/edit/' + pro.Id);
    this.isEdit = false;
    this.clear();
    if (pro.Client_Pic__c === null || pro.Client_Pic__c === undefined || pro.Client_Pic__c === '') {
      this.noProPic = true;
      this.avProPic = false;
    } else {
      this.avProPic = true;
      this.noProPic = false;
      this.clientPictureFileView = config.API_END_POINT + '/' + pro.Client_Pic__c;
    }
    // get top left profile data
    this.clienProfile = {
      'fName': pro.FirstName,
      'lName': pro.LastName,
      'name': pro.FirstName + ' ' + pro.LastName,
      'id': pro.Id,
      'FullName': pro.FullName,
      'email': pro.Email === 'null' ? '' : pro.Email,
      'phone': pro.MobilePhone === 'null' ? '' : pro.MobilePhone,
      'pic': pro.Client_Pic__c,
      'note': pro.Notes__c === 'null' ? '' : pro.Notes__c,
      'client_since': pro.CreatedDate,
      'index': i
    };

    // get appointments data
    this.AppointmentsTab = {
      'restrictionsType': pro.Booking_Restriction_Type__c,
      'noEmailAppt': pro.BR_Reason_No_Email__c,
      'accoutChargeBalance': pro.BR_Reason_Account_Charge_Balance__c,
      'depositRequired': pro.BR_Reason_Deposit_Required__c,
      'persistanceNoShow': pro.BR_Reason_No_Show__c,
      'Other': pro.BR_Reason_Other__c,
      'apptNotes': pro.BR_Reason_Other_Note__c,
      'pin': pro.Pin__c,
      'standingAppt': ''
      // 'hasStandingAppt': pro.Has_Standing_Appts__c
    };
    this.other = this.AppointmentsTab.Other;
    this.pin = this.AppointmentsTab.pin;
    // this.hasStandingAppt = this.AppointmentsTab.hasStandingAppt;
    this.noEmailAppt = this.AppointmentsTab.noEmailAppt;
    this.accoutChargeBalance = this.AppointmentsTab.accoutChargeBalance;
    this.depositRequired = this.AppointmentsTab.depositRequired;
    this.persistanceNoShow = this.AppointmentsTab.persistanceNoShow;
    this.apptNotes = this.AppointmentsTab.apptNotes;
    this.getNextAppointment(this.clienProfile.id); // get next appointment data
    this.booking_restrictions(this.AppointmentsTab.restrictionsType); // this is for in Appointments tab (BOOKING RESTRICTIONS)
    this.leftProfile = true;
    this.getServiceLog(this.clienProfile.id);
    this.getClientCommunicationList(this.clienProfile.id);
    this.getClassLog(this.clienProfile.id);
    this.getProductLog(this.clienProfile.id);
    this.getClientData(this.clienProfile.id);
    this.getClientAppointmemts(this.clienProfile.id); // appointments tab get all appointment data
    this.getClientRewards(this.clienProfile.id);
    this.getClientMemberships(this.clienProfile.id);
    this.getClientPackages(this.clienProfile.id);
    this.getClientAccounts(this.clienProfile.id);
    this.getClientFlags();
    this.getOccupation();
    this.checkAvailableApptClient(this.clienProfile.id);
    this.getClientLastVist(this.clienProfile.id);
    this.getHideClientContactInfo();
    this.CommonSaveBut = true;
    window.scrollTo(0, 0);
  }
  getClientLastVist(id) {
    this.newClientService.getClientLastVistService(id, this.commonservice.getDBDatTmStr(new Date)).subscribe(data => {
      this.lastVisit = data['result'][0][0];
      this.ApptExpires = data['result'][1][0];
      if (this.lastVisit) {
        this.lastVisit = new Date(this.lastVisit['lastVisitDate']);
      }
      if (this.ApptExpires) {
        this.ApptExpires = new Date(this.ApptExpires['expire_date']);
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
  getHideClientContactInfo() {
    this.newClientService.getHideCliContactInfo(this.decodeUserToken.data.id).subscribe(data => {
      this.hideClientInfo = data['result'][0].Hide_Client_Contact_Info__c;
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
  checkAvailableApptClient(id) {
    this.newClientService.checkAvaAppt(id).subscribe(data => {
      this.AvailableAppt = data['result'];
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
  uploadProfilePic(fileEvent) {
    this.clientPictureFile = fileEvent.target.files[0];
    this.fileName = this.clientPictureFile.name;
    this.clientPictureFileView = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.clientPictureFile));
    this.newClientService.uploadPic(this.clienProfile.id, this.clientPictureFile, null, 'upload').subscribe(
      data => {
        const clientInfoDetails = data['result'];
        this.filterClient.forEach(element => {
          if (element.Id === this.clienProfile.id) {
            element.Client_Pic__c = clientInfoDetails + '?' + new Date().getTime();
          }
        });
        // this.filterClient[i]['Client_Pic__c'] = clientInfoDetails + '?' + new Date().getTime();
        // this.getAllClients();
        this.getClientData(this.clienProfile.id);
        this.avProPic = true;
        this.noProPic = false;
        this.myInputVariable.nativeElement.value = '';
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_PRIFILE_PIC_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
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
  removeProPic() {
    this.newClientService.uploadPic(this.clienProfile.id, null, this.clientEditObj.Client_Pic__c, 'remove').subscribe(
      data => {
        const clientInfoDetails = data['result'];
        this.getAllClients();
        this.avProPic = false;
        this.noProPic = true;
        this.filterClient.forEach(element => {
          if (element.Id === this.clienProfile.id) {
            element.Client_Pic__c = null;
          }
        });
        // this.myInputVariable.nativeElement.value = '';
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_PROFILE_PIC_REMOVED');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
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
  booking_restrictions(val) {
    this.restrictions.forEach(element => {
      if (element.value === val) {
        element.active = 'active';
      } else {
        element.active = '';
      }
      if (element.active === 'active') {
        this.AppointmentsTab.restrictionsType = element.value;
      }
    });
  }

  // Appointmemts tab listing
  getClientAppointmemts(id) {
    const client = {
      'clientId': id,
      'apptViewValue': 'All'
    };
    this.newClientService.getClientAppointmentsData(client).subscribe(
      data => {
        this.resultAppointments = [];
        const apptData = data['result'];
        this.clientappoinmentData = apptData.Appointments;
        this.clientServicesData = apptData.AppointmenServices;
        for (let i = 0; i < this.clientServicesData.length; i++) {
          this.clientServicesData[i].displayAptdate = this.commonservice.getUsrDtStrFrmDBStr(this.clientServicesData[i].Service_Date_Time__c);
        }
        for (let i = 0; i < this.clientappoinmentData.length; i++) {
          this.clientappoinmentData[i].Time = '';
          // this.clientappoinmentData[i].PrefDur = false;
          this.clientappoinmentData[i].Duration__c = undefined;
          this.resultAppointments.push(this.clientappoinmentData[i]);
          for (let j = 0; j < this.clientServicesData.length; j++) {
            if (this.clientappoinmentData[i].Id === this.clientServicesData[j].Appt_Ticket__c) {
              // this.clientServicesData[j]['type'] = 'Service';
              this.clientServicesData[j].Time = this.clientappoinmentData[i].Appt_Date_Time__c;
              // this.clientServicesData[j].PrefDur = true;
              this.resultAppointments.push(this.clientServicesData[j]);
              // if (this.clientServicesData[j].Duration__c < 60) {
              //   this.clientServicesData[j].Duration__c = this.clientServicesData[j].Duration__c + ' min';
              // } else {
              //   this.clientServicesData[j].Duration__c = '1 hr';
              // }
            }
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

  // load more
  showLoadMore(app) {
    this.loadmore += 10;
    if (this.loadmore > app.length || this.loadmore === app.length) {
      this.hideLoadMoreButt = true;
    }
  }

  addNewClient() {
    this.location.replaceState('/client');
    this.listClientFields();
    // this.AddNewClient = true;
    this.filterClient = [];
    this.selectedFlagItems = [];
    this.searchKeyValue = '';
    this.leftProfile = false;
    //  this.isEdit = false;
    this.clientEditObjFun();
    this.updateTabs(0);
    this.clear();
    this.StartingBalanceDisable = false;
    this.noEmailBool = false;
    this.primaryCountryCode = '';
    this.mobileCountryCode = '';
  }

  AddClient(bol) {
    this.clear();

    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.clientEditObj.FirstName.trim() === '') {
      this.ClientProError[0] = this.translateService.get('CLIENTS.NO_BLANK_FIRST_NAME');
    } else if (this.clientEditObj.FirstName === 'null') {
      this.ClientProError[0] = this.translateService.get('Enter Valid Name.');
    } else if (this.clientEditObj.LastName.trim() === '') {
      this.ClientProError[2] = this.translateService.get('CLIENTS.NO_BLANK_LAST_NAME');
    } else if (this.clientEditObj.LastName === 'null') {
      this.ClientProError[2] = this.translateService.get('Enter Valid Name.');
    } else if ((this.clientEditObj.No_Email__c === 0 || this.clientEditObj.No_Email__c === false) && (this.clientEditObj.Email === '' && this.primaryEmail === true)) {
      this.ClientProError[5] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_PRIMARY_EMAIL');
    } else if ((this.clientEditObj.No_Email__c === 0 || this.clientEditObj.No_Email__c === false) && (this.clientEditObj.Email !== '' && !EMAIL_REGEXP.test(this.clientEditObj.Email))) {
      this.ClientProError[5] = this.translateService.get('CLIENTS.INVALID_PRIMARY_EMAIL');
    } else if ((this.clientEditObj.No_Email__c === 0 || this.clientEditObj.No_Email__c === false) && (this.clientEditObj.Secondary_Email__c === '' && this.secondaryEmail === true)) {
      this.ClientProError[6] = this.translateService.get('CLIENTS.SEC_NOBLANK_EMAIL');
    } else if ((this.clientEditObj.No_Email__c === 0 || this.clientEditObj.No_Email__c === false)
      && (this.clientEditObj.Secondary_Email__c !== '' && !EMAIL_REGEXP.test(this.clientEditObj.Secondary_Email__c))) {
      this.ClientProError[6] = this.translateService.get('CLIENTS.INVALID_SEC_EMAIL');
    } else if (this.primaryPhone === true && this.clientEditObj.Phone === '') {
      this.ClientProError[3] = this.translateService.get('CLIENTS.NOBLANK_PRIMARY_PHONE');
    } else if (this.primaryPhone === true && (this.primaryCountryCode === '' || this.primaryCountryCode === undefined)) {
      this.ClientProError[3] = this.translateService.get('Primary phone country code cannot be blank.');
    } else if (this.clientEditObj.Phone === '' && this.primaryCountryCode !== '') {
      this.ClientProError[3] = this.translateService.get('Primary phone cannot be blank.');
    } else if (this.clientEditObj.Phone !== '' && this.primaryCountryCode === '') {
      this.ClientProError[3] = this.translateService.get('Primary phone Country code cannot be blank.');
    } else if (this.mobilePhone === true && this.clientEditObj.MobilePhone === '' && (this.clientEditObj.MobilePhone === '' && (this.mobileCountryCode === undefined ||
      this.mobileCountryCode === ''))) {
      this.ClientProError[4] = this.translateService.get('CLIENTS.NOBLANK_MOBILE_PHONE');
    } else if (this.mobilePhone === true && (this.clientEditObj.MobilePhone !== '' && (this.mobileCountryCode === undefined || this.mobileCountryCode === ''))) {
      this.ClientProError[4] = this.translateService.get('Mobile Phone country code cannot be blank.');
    } else if (this.mobilePhone === true && (this.mobileCountryCode !== '' && (this.clientEditObj.MobilePhone === undefined || this.clientEditObj.MobilePhone === ''))) {
      this.ClientProError[4] = this.translateService.get('Mobile Phone cannot be blank.');
    } else if (this.clientEditObj.MobilePhone === '' && this.mobileCountryCode !== '') {
      this.ClientProError[3] = this.translateService.get('Mobile phone cannot be blank.');
    } else if (this.clientEditObj.MobilePhone !== '' && this.mobileCountryCode === '') {
      this.ClientProError[3] = this.translateService.get('Mobile phone Country code cannot be blank.');
    } else if (this.gender === true && this.clientEditObj.Gender__c === '') {
      this.ClientProError[7] = this.translateService.get('CLIENTS.GENDER_REQ');
    } else if (this.birthDate === true && (this.clientEditObj.Birthdate === '' || this.clientEditObj.Birthdate === null)) {
      this.ClientProError[7] = this.translateService.get('CLIENTS.BIRTH_DATE_REQ');
    } else if (this.mailingAddress === true && this.clientEditObj.MailingStreet === '') {
      this.ClientProError[0] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_ADDRESS');
    } else if (this.mailingAddress === true && this.clientEditObj.MailingPostalCode === '') {
      this.ClientProError[0] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_ZIP');
    } else if (this.mailingAddress === true && this.clientEditObj.MailingCountry === '') {
      this.ClientProError[0] = this.translateService.get('SETUPCOMPANY.VALID_NOBLANK_SETUPCOMPANY_COUNTRY_CODE');
    } else if (this.mailingAddress === true && this.clientEditObj.MailingState === '') {
      this.ClientProError[0] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_STATE');
    } else if (this.mailingAddress === true && this.clientEditObj.MailingCity === '') {
      this.ClientProError[0] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_CITY');
    } else {
      this.NewClient = {
        'firstname': this.clientEditObj.FirstName,
        'lastname': this.clientEditObj.LastName,
        'primaryPhone': this.clientEditObj.Phone !== '' ? this.primaryCountryCode + '-' + this.clientEditObj.Phone : '',
        'mobilePhone': this.clientEditObj.MobilePhone !== '' ? this.mobileCountryCode + '-' + this.clientEditObj.MobilePhone : '',
        'email': this.clientEditObj.Email,
        'secondaryEmail': this.clientEditObj.Secondary_Email__c,
        'gender': this.clientEditObj.Gender__c,
        'isNewClient': true,
        'type': this.actionmethod,
        'birthDay': new Date(this.clientEditObj.Birthdate).getDate(),
        'birthMonth': new Date(this.clientEditObj.Birthdate).getMonth() + 1,
        'birthYear': new Date(this.clientEditObj.Birthdate).getFullYear(),
        'clientInfoMailingStreet': this.clientEditObj.MailingStreet,
        'clientInfoMailingCountry': this.clientEditObj.MailingCountry,
        'clientInfoPostalCode': this.clientEditObj.MailingPostalCode,
        'clientInfoMailingCity': this.clientEditObj.MailingCity,
        'clientInfoMailingState': this.clientEditObj.MailingState,
        'reminderPrimaryEmail': 1,
        'notificationPrimaryEmail': 1,
        'clientInfoNoEmail': this.clientEditObj.No_Email__c === true ? 1 : 0,
      };
      this.newClientService.clientQuickEdit('noClientid', this.NewClient).subscribe(data => {
        const addStatus = data['result'];
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CLIENT_CREATE_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        this.AddNewClient = false;
        this.getAllClients();
        this.clear();
        this.clientEditObjFun();
        if (this.saveAndBookButt === bol) {
          this.router.navigate(['/client/edit/' + data['result'].clientId]).then(() => {
            this.router.navigate(['/appointment/book/' + data['result'].clientId]);
          });
        }
        if (this.router.url === '/client/quick/add?actionMethod=findAppt') {
          this.router.navigate(['/appointment/book/' + data['result'].clientId]).then(() => {
          });
        } else if (this.router.url === '/client/quick/add?actionMethod=bookStanding') {
          this.router.navigate(['/appointment/bookstandingappt/' + data['result'].clientId]).then(() => {
          });
        } else if (this.router.url === '/client/quick/add?actionMethod=checkout') {
          this.router.navigate(['/checkout/' + data['result'].apptId]).then(() => {
          });
        }
      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (JSON.parse(error['_body']).status) {
            case '2033':
              break;
            case '2088':
              this.ClientProError[18] = this.translateService.get('CLIENTS.DUPLICATE_CLIENT');
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
  }
  hyphen_generate_mobile(value) {
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat('-');
    }
  }

  hyphen_generate_phone(value) {
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('phone_id')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('phone_id')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('phone_id')).value = value.concat('-');
    }
  }
  updateErrMsg(index: number) {
    this.ClientProError[index] = '';
    this.ClientProError[18] = '';
  }
  getCountry(coun) {
    this.newClientService.getStates(coun)
      .subscribe(statesValues => {
        this.statesList = statesValues['result'];
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
  hyphen_generate_mobile1(value) {
    if (value === undefined || value === null) {
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
  pasteNum(value) {
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
        this.clientEditObj.MobilePhone = temp.substr(0, 13);
      }
    }
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
        this.clientEditObj.Phone = temp.substr(0, 13);
      }
    }
  }
  hyphen_generate_home(value) {
    if (value === undefined || value === null) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('homePhone')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('homePhone')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('homePhone')).value = value.concat('-');
    }
  }
  hyphen_generate_Wphone(value) {
    if (value === undefined || value === null) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('workPhone')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('workPhone')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('workPhone')).value = value.concat('-');
    }
  }
  ApptNotesSave(note) {
    this.apptNotes = note;
    this.appointmentNotesModal.hide();
  }

  rewardCalError() {
    let res = false;
    this.rewardCalErrorMsg = [];
    this.clientRewardData.forEach(element => {
      if ((element.adjustPoints !== '') && ((element.Points_Balance__c + parseInt(element.adjustPoints, 10)) < 0)) {
        this.rewardCalErrorMsg.push({ 'value': element.Name + ' Adjust Points cannot adjust the point balance below zero.' });
        res = true;
      }
    });
    return res;
  }
  commonSave(bol) {
    if (this.myPin) {
      if (this.myPin.nativeElement.value !== '****') {
        this.pin = this.myPin.nativeElement.value;
      }
    }
    // Appointment tab start
    if (this.selectedFlagItems.length !== 0) {
      for (let i = 0; i < this.selectedFlagItems.length; i++) {
        this.clientEditObj.Client_Flag__c = this.selectedFlagItems.map(e => e.item_text).join(';');
      }
    } else {
      this.clientEditObj.Client_Flag__c = this.selectedFlagItems;
    }

    let restrictionsSeleVal = '';
    for (let i = 0; i < this.restrictions.length; i++) {
      if (this.restrictions[i].active === 'active') {
        restrictionsSeleVal = this.restrictions[i].value;
      }
    }

    if (this.noEmailAppt === true) {
      this.noEmailAppt = 1;
    } else if (this.noEmailAppt === false) {
      this.noEmailAppt = 0;
    }

    if (this.accoutChargeBalance === true) {
      this.accoutChargeBalance = 1;
    } else if (this.accoutChargeBalance === false) {
      this.accoutChargeBalance = 0;
    }

    if (this.depositRequired === true) {
      this.depositRequired = 1;
    } else if (this.depositRequired === false) {
      this.depositRequired = 0;
    }

    if (this.persistanceNoShow === true) {
      this.persistanceNoShow = 1;
    } else if (this.persistanceNoShow === false) {
      this.persistanceNoShow = 0;
    }

    if (this.other === true) {
      this.other = 1;
    } else if (this.other === false) {
      this.other = 0;
    }

    // if (this.hasStandingAppt === true) {
    //   this.hasStandingAppt = 1;
    // } else if (this.hasStandingAppt === false) {
    //   this.hasStandingAppt = 0;
    // }

    for (let a = 0; a < this.apptSerList.length; a++) {
      if (this.apptSerList[a].PrefDur === true) {
        this.apptSerList[a].PrefDur = 1;
      } else if (this.apptSerList[a].PrefDur === false) {
        this.apptSerList[a].PrefDur = 0;
      }
    }
    // Appointment tab end

    if (this.clientEditObj.Active__c === true) {
      this.clientEditObj.Active__c = 1;
    } else if (this.clientEditObj.Active__c === false) {
      this.clientEditObj.Active__c = 0;
    }

    if (this.clientEditObj.No_Email__c === true) {
      this.clientEditObj.No_Email__c = 1;
    } else if (this.clientEditObj.No_Email__c === false) {
      this.clientEditObj.No_Email__c = 0;
    }
    // Account tab start
    for (let y = 0; y < this.clientMemberShipsData.length; y++) {
      this.clientMemberShipsData[y].nextBillDate = this.commonservice.getUsrDtStrFrmDBStr(this.clientMemberShipsData[y].Next_Bill_Date__c);
      if (this.clientMemberShipsData[y].Auto_Bill__c === true) {
        this.clientMemberShipsData[y].Auto_Bill__c = 1;
      } else if (this.clientMemberShipsData[y].Auto_Bill__c === false) {
        this.clientMemberShipsData[y].Auto_Bill__c = 0;
      }
    }
    // Account tab end
    this.clear();
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.clientEditObj.FirstName.trim() === 'undefined' || this.clientEditObj.FirstName.trim() === undefined ||
      this.clientEditObj.FirstName.trim() === '') {
      this.updateTabs(0);
      this.ClientProError[6] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_FIRSTNAME');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.FirstName === 'null') {
      this.updateTabs(0);
      this.ClientProError[6] = this.translateService.get('Enter Valid Name.');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.LastName.trim() === 'undefined' || this.clientEditObj.LastName.trim() === undefined ||
      this.clientEditObj.LastName.trim() === '') {
      this.updateTabs(0);
      this.ClientProError[7] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_LASTNAME');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.LastName === 'null') {
      this.updateTabs(0);
      this.ClientProError[7] = this.translateService.get('Enter Valid Name.');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.Phone === '' && this.clientCardPrimaryPhone === true && this.hideClientInfo === 0 && this.primaryCountryCode === '') {
      this.ClientProError[13] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_PRIMARY_PHONE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.Phone !== '' && this.clientCardPrimaryPhone === true && this.hideClientInfo === 0 && this.primaryCountryCode === '') {
      this.ClientProError[13] = this.translateService.get('primary Phone country code cannot be blank.');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.MobilePhone === 'undefined' || this.clientEditObj.MobilePhone === undefined ||
      this.clientEditObj.MobilePhone === '' || this.clientEditObj.MobilePhone === null || this.clientEditObj.MobilePhone === 'null') && this.clientCardMobilePhone === true &&
      this.hideClientInfo === 0 && this.mobileCountryCode === '') {
      this.ClientProError[8] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_MOBILE_PHONE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.MobilePhone === 'undefined' || this.clientEditObj.MobilePhone === undefined ||
      this.clientEditObj.MobilePhone !== '' || this.clientEditObj.MobilePhone !== null || this.clientEditObj.MobilePhone !== 'null') && this.clientCardMobilePhone === true &&
      this.hideClientInfo === 0 && this.mobileCountryCode === '') {
      this.ClientProError[8] = this.translateService.get('Mobile phone country code cannot be blank.');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.Marketing_Mobile_Phone__c === 1 && this.hideClientInfo === 0 &&
      (this.clientEditObj.MobilePhone === '' || this.clientEditObj.MobilePhone === 'undefined' || this.clientEditObj.MobilePhone === undefined)) {
      this.ClientProError[8] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_MOBILE_PHONE_USED_PREFERENCE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.Notification_Mobile_Phone__c && this.hideClientInfo === 0 &&
      (this.clientEditObj.MobilePhone === '' || this.clientEditObj.MobilePhone === 'undefined' || this.clientEditObj.MobilePhone === undefined)) {
      this.ClientProError[8] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_MOBILE_PHONE_USED_PREFERENCE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.Reminder_Mobile_Phone__c && this.hideClientInfo === 0 &&
      (this.clientEditObj.MobilePhone === '' || this.clientEditObj.MobilePhone === 'undefined' || this.clientEditObj.MobilePhone === undefined)) {
      this.ClientProError[8] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_MOBILE_PHONE_USED_PREFERENCE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.clientEditObj.Email === '' && this.clientCardPrimaryEmail === true) && (this.hideClientInfo === 0)) {
      this.updateTabs(0);
      this.ClientProError[9] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_PRIMARY_EMAIL');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Email !== '' && !EMAIL_REGEXP.test(this.clientEditObj.Email))) {
      this.ClientProError[9] = this.translateService.get('CLIENTS.INVALID_PRIMARY_EMAIL');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Secondary_Email__c === '' && this.clientCardSecondaryEmail === true)) {
      this.updateTabs(0);
      this.ClientProError[11] = this.translateService.get('CLIENTS.SEC_NOBLANK_EMAIL');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Secondary_Email__c !== '' &&
      !EMAIL_REGEXP.test(this.clientEditObj.Secondary_Email__c))) {
      this.ClientProError[11] = this.translateService.get('CLIENTS.INVALID_SEC_EMAIL');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);

      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Reminder_Primary_Email__c === 1 && this.clientEditObj.Email === '')) {
      this.ClientProError[9] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_PRIMARY_EMAIL_USED_PREFERENCE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Notification_Primary_Email__c === 1 && this.clientEditObj.Email === '')) {
      this.updateTabs(0);
      this.ClientProError[9] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_PRIMARY_EMAIL_USED_PREFERENCE');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Marketing_Primary_Email__c === 1 && this.clientEditObj.Email === '')) {
      this.updateTabs(0);
      this.ClientProError[9] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_PRIMARY_EMAIL_USED_PREFERENCE');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Reminder_Secondary_Email__c === 1 &&
      this.clientEditObj.Secondary_Email__c === '')) {
      this.ClientProError[11] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_SECONDARY_EMAIL_USED_PREFERENCE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Marketing_Secondary_Email__c === 1 &&
      this.clientEditObj.Secondary_Email__c === '')) {
      this.ClientProError[11] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_SECONDARY_EMAIL_USED_PREFERENCE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Notification_Secondary_Email__c === 1 &&
      this.clientEditObj.Secondary_Email__c === '')) {
      this.ClientProError[11] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_SECONDARY_EMAIL_USED_PREFERENCE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.hideClientInfo === 0) && (this.clientEditObj.Secondary_Email__c !== '' &&
      !EMAIL_REGEXP.test(this.clientEditObj.Secondary_Email__c))) {
      this.ClientProError[11] = this.translateService.get('CLIENTS.INVALID_CLIENT_INFO_SECONDARY_EMAIL');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.MailingStreet === '' && this.clientCardMailingAddress === true && this.hideClientInfo === 0) {
      this.ClientProError[16] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_ADDRESS');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.MailingPostalCode === '' && this.clientCardMailingAddress === true && this.hideClientInfo === 0) {
      this.ClientProError[0] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_ZIP');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.MailingCountry === '' && this.clientCardMailingAddress === true && this.hideClientInfo === 0) {
      this.ClientProError[12] = this.translateService.get('SETUPCOMPANY.VALID_NOBLANK_SETUPCOMPANY_COUNTRY_CODE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.MailingState === '' && this.clientCardMailingAddress === true && this.hideClientInfo === 0) {
      this.ClientProError[1] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_STATE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.MailingCity === '' && this.clientCardMailingAddress === true && this.hideClientInfo === 0) {
      this.ClientProError[17] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_CITY');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.Gender__c === '' && this.clientCardGender === true) {
      this.ClientProError[15] = this.translateService.get('CLIENTS.SELECT_GENDER');
      this.updateTabs(1);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.Birthdate === '' || this.clientEditObj.Birthdate === null) && this.clientCardBirthDate === true) {
      this.ClientProError[15] = this.translateService.get('CLIENTS.SELECT_BIRTH_DATE');
      this.updateTabs(1);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientMemberShipsData && this.clientMemberShipsData.length > 0)
      && (this.clientEditObj.Membership_ID__c === '' || this.clientEditObj.Membership_ID__c === undefined || this.clientEditObj.Membership_ID__c === 'undefinded')) {
      this.ClientProError[10] = this.translateService.get('CLIENTS.INVALID_MEMEBERSHIP_ID');
      this.updateTabs(7);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.rewardCalError()) {
      this.rewardCalError();
    } else {
      this.clientObj = {
        // client profile data
        'clientInfoActive': this.clientEditObj.Active__c,
        'clientInfoFirstName': this.clientEditObj.FirstName,
        'clientInfoMiddleName': this.clientEditObj.MiddleName,
        'clientInfoLastName': this.clientEditObj.LastName,
        'clientInfoMailingStreet': this.clientEditObj.MailingStreet,
        'clientInfoMailingCountry': this.clientEditObj.MailingCountry,
        'clientInfoPostalCode': this.clientEditObj.MailingPostalCode,
        'clientInfoMailingCity': this.clientEditObj.MailingCity,
        'clientInfoMailingState': this.clientEditObj.MailingState,
        'clientInfoPrimaryPhone': this.clientEditObj.Phone !== '' ? this.primaryCountryCode + '-' + this.clientEditObj.Phone : '',
        'clientInfoMobilePhone': this.clientEditObj.MobilePhone !== '' ? this.mobileCountryCode + '-' + this.clientEditObj.MobilePhone : '',
        'homePhone': this.clientEditObj.HomePhone,
        'clientInfoPrimaryMail': this.clientEditObj.Email,
        'clientInfoSecondaryEmail': this.clientEditObj.Secondary_Email__c,
        'clientInfoEmergName': this.clientEditObj.Emergency_Name__c,
        'clientInfoEmergPrimaryPhone': this.clientEditObj.Emergency_Primary_Phone__c,
        'clientInfoEmergSecondaryPhone': this.clientEditObj.Emergency_Secondary_Phone__c,
        'clientInfoNoEmail': this.clientEditObj.No_Email__c,
        'responsibleParty': this.clientEditObj.Responsible_Party__c,
        'gender': this.clientEditObj.Gender__c,
        'birthDay': new Date(this.clientEditObj.Birthdate).getDate(),
        'birthMonth': new Date(this.clientEditObj.Birthdate).getMonth() + 1,
        'occupationvalue': this.clientEditObj.Title,
        'birthYear': new Date(this.clientEditObj.Birthdate).getFullYear(),
        'selectedFlags': this.clientEditObj.Client_Flag__c,
        'referredBy': this.clientEditObj.Referred_By__c,
        'clientPicture': this.clientPicture,
        'ReferedAFriendProspect': this.clienProfile.id === undefined ? 0 : this.clientEditObj.Refer_A_Friend_Prospect__c,
        'referedOnDate': this.commonservice.getDBDatTmStr(this.clientEditObj.referedDate),
        'marketingOptOut': this.clientEditObj.Marketing_Opt_Out__c,
        'marketingMobilePhone': this.clientEditObj.Marketing_Mobile_Phone__c,
        'marketingPrimaryEmail': this.clientEditObj.Marketing_Primary_Email__c,
        'marketingSecondaryEmail': this.clientEditObj.Marketing_Secondary_Email__c,
        'notificationMobilePhone': this.clientEditObj.Notification_Mobile_Phone__c,
        'notificationOptOut': this.clientEditObj.Notification_Opt_Out__c,
        'notificationPrimaryEmail': this.clientEditObj.Notification_Primary_Email__c,
        'notificationSecondaryEmail': this.clientEditObj.Notification_Secondary_Email__c,
        'reminderOptOut': this.clientEditObj.Reminder_Opt_Out__c,
        'reminderMobilePhone': this.clientEditObj.Reminder_Mobile_Phone__c,
        'reminderPrimaryEmail': this.clientEditObj.Reminder_Primary_Email__c,
        'reminderSecondaryEmail': this.clientEditObj.Reminder_Secondary_Email__c,
        // 'mobileCarrierName': this.clientEditObj.Mobile_Carrier__c,
        'notes': this.clientEditObj.Notes__c,

        // Appt data
        'noEmailAppt': this.noEmailAppt,
        'accoutChargeBalance': this.accoutChargeBalance,
        'depositRequired': this.depositRequired,
        'persistanceNoShow': this.persistanceNoShow,
        'other': this.other,
        'otherReason': this.clientEditObj.Booking_Restriction_Note__c,
        'apptNotes': this.apptNotes,
        'bookingFrequency': this.clientEditObj.Booking_Frequency__c,
        'allowOnlineBooking': this.clientEditObj.Allow_Online_Booking__c === true || this.clientEditObj.Allow_Online_Booking__c === 1 ? 1 : 0,
        // 'hasStandingAppt': this.hasStandingAppt,
        'pin': this.pin,
        'restrictionType': this.AppointmentsTab.restrictionsType,

        // Accounts
        'activeRewards': this.clientEditObj.Active_Rewards__c,
        'isNewClient': this.clienProfile.id === undefined ? true : false,
        'startingBalance': this.clientEditObj.Starting_Balance__c,
        'clientMemberShipId': this.clientEditObj.Membership_ID__c,
        'clientRewardsData': this.clientRewardData.concat(this.clientRewardData1),
        'creditCardToken': this.clientEditObj.Credit_Card_Token__c,
        'tokenExpirationDate': this.clientEditObj.Token_Expiration_Date__c,
        'PaymentType': this.clientEditObj.Payment_Type_Token__c,
        'tokenPresent': this.clientEditObj.Token_Present__c,
        'clientMemberShipsData': this.clientMemberShipsData,
        'ApptServiceData': this.apptSerList,
        'type': this.actionmethod,
        'CurrentBalance': this.clientEditObj.Current_Balance__c,
        'startingBalDis': this.StartingBalanceDisable === false ? this.clientEditObj.Starting_Balance__c : 0,
        // 'refRwds': this.refRwds
      };

      // check already a client record with that Email and PIN combination.
      if (this.AppointmentsTab.pin !== this.pin) {
        this.clientObj.checkPin = this.pin;
        this.clientObj.checkEmail = this.clientEditObj.Email;
      }
      if (this.clientEditObj.Email !== this.clienProfile.email) {
        this.clientObj.checkEmail = this.clientEditObj.Email;
        this.clientObj.checkPin = this.pin;
      }
      for (const key in this.clientObj) {
        if (this.clientObj[key] === 'null' || this.clientObj[key] === null || this.clientObj[key] === 'undefined'
          || this.clientObj[key] === undefined || this.clientObj[key] === 'null-null-null') {
          this.clientObj[key] = '';
        }
      }
      if (this.clienProfile.id === '') {
        this.clienProfile.id = undefined;
      }
      this.newClientService.saveClient(this.clienProfile.id, this.clientObj, this.newClientPictureFile).subscribe(
        data => {
          const clientInfoDetails = data['result'];
          this.newClientId = data['result'].id;
          this.leftProfileUpdate(this.clientEditObj);
          this.clear();
          this.getClientRewards(this.clienProfile.id);
          this.displayddl = 'inline';
          this.ClientProError[18] = '';
          this.AppointmentsTab.pin = this.pin;
          this.clienProfile.email = this.clientEditObj.Email;
          this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
          if (!isNullOrUndefined(this.bookingUrl)) {
            if (this.action = 'findappt' && this.AppointmentsTab.restrictionsType === 'Do Not Book') {
              this.bookingUrl = '/appointments';
            }
            this.router.navigate([this.bookingUrl]).then(() => {
              this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            });
          } else {
            if (this.clienProfile.id !== undefined) {
              this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            } else {
              this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CLIENT_CREATE_SUCCESS');
              this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            }
            // this.searchKeyValue = '';
            // this.getAllClients();
            this.searchclient(this.searchKeyValue);
            this.refreshFilterClient();
            this.updateTabs(0);
            if (this.newClientPictureFile) {
              this.removePic();
            }
            if (this.clientEditObj.Starting_Balance__c === 0 || this.clientEditObj.Starting_Balance__c === '') {
              this.StartingBalanceDisable = false;
            } else {
              this.StartingBalanceDisable = true;
            }
            // this.router.navigate(['/client']);
            if (this.redirectTokenPage === true && this.newClientId !== undefined) {
              this.router.navigate(['/client/edit/' + this.newClientId]).then(() => {
                this.router.navigate(['/client/createtoken/' + this.newClientId]);
              });
            }
            if (this.router.url === '/client/quick/add?actionMethod=findAppt') {
              this.router.navigate(['/appointment/book/' + this.newClientId]).then(() => {
              });
            } else if (this.router.url === '/client/quick/add?actionMethod=bookStanding') {
              this.router.navigate(['/appointment/bookstandingappt/' + this.newClientId]).then(() => {
              });
            } else if (this.router.url === '/client/quick/add?actionMethod=checkout') {
              this.router.navigate(['/checkout/' + data['result'].apptId]);  // new client case
            } else if (this.actionmethod === 'checkout') {
              this.router.navigate(['/checkout/' + this.actionApptId]); // edit client case
            } else if (this.actionmethod === 'checkoutList') {
              this.router.navigate(['/checkout']);
            } else if (this.actionmethod === 'appointmentdetail') {
              this.router.navigate(['/appointmentdetail/' + this.clienProfile.id + '/' + this.actionApptId]);
            }
            // if (this.searchKeyValue === undefined && this.router.url === '/client/add') {
            //   this.searchKeyValue = '';
            // }
            if (this.router.url.match(/client\/edit/g)) {
              this.leftProfile = true;
              this.isEdit = true;
            } else {
              this.leftProfile = false;
              this.isEdit = false;
            }
          }

          if (this.saveAndBookButt === bol) {
            if (this.newClientId === undefined) {
              this.router.navigate(['/appointment/book/' + this.clienProfile.id]);
            } else {
              this.router.navigate(['/client/edit/' + this.newClientId]).then(() => {
                this.router.navigate(['/appointment/book/' + this.newClientId]);
              });
            }
          }
        }, error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (JSON.parse(error['_body']).status) {
            case '2083':
              this.ClientProError[10] = this.translateService.get('CLIENTS.DUPLICATE_MEMBERSHIP_ID');
              this.updateTabs(7);
              window.scrollTo(0, 600);
              break;
            case '2088':
              this.ClientProError[18] = this.translateService.get('CLIENTS.DUPLICATE_CLIENT');
              this.updateTabs(0);
              break;
            case '2092':
              this.ClientProError[18] = this.translateService.get(JSON.parse(error['_body']).message);
              this.updateTabs(0);
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
  }

  saveNotesService() {
    this.newClientService.saveNotes(this.serviceId, this.notesTestareaNote).subscribe(
      data => {
        const saveNoteResult = data['result'];
        this.serviceNotesModal.hide();
        this.PreviousServiceNote = '';
        this.getServiceLog(this.clienProfile.id);
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_SERVICE_NOTES_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
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

  selectClient(user, lookupType) {
    this.lookupSearchKey = '';
    this.filterlookupClient = [];
    this.searchLookupKeyValue = '';
    this.lookupModal.hide();
    if (lookupType === 'merge') {
      this.router.navigate(['/client/merge/' + this.clienProfile.id + '/' + user.Id]).then(() => { });
    } else if (lookupType === 'responsible-party') {
      this.clientEditObj.ResponsibleClient = user.FirstName + ' ' + user.LastName;
      this.clientEditObj.ResponsibleClientPic = user.Client_Pic__c;
      this.clientEditObj.Responsible_Party__c = user.Id;
    } else {
      this.clientEditObj.ReferredClient = user.FirstName + ' ' + user.LastName;
      this.clientEditObj.ReferredClientPic = user.Client_Pic__c;
      this.clientEditObj.Referred_By__c = user.Id;
      this.clientEditObj.referedDate = new Date();
    }
    if (this.refRwds && this.refRwds.length > 0) {
      this.newClientService.getClientRewardsData(user.Id).subscribe(
        data => {
          const rwdData = data['result'];
          if (rwdData && rwdData.length > 0) {
            for (let i = 0; i < rwdData.length; i++) {
              for (let j = 0; j < this.refRwds.length; j++) {
                if (rwdData[i]['Reward__c'] === this.refRwds[j]['Reward__c']) {
                  // this.refRwds[j]['type'] = 'static';
                  this.refRwds[j]['Id'] = rwdData[i]['Id'];
                  this.refRwds[j]['type'] = 'updateRef';
                }
              }
            }
          }
          this.refRwds = this.refRwds.map((obj) => {
            obj.clientId = this.clienProfile.id; obj.refClient = user.Id; obj.action = 'ref';
            if (!obj.type) { obj.type = 'static'; }
            return obj;
          });
          this.clientRewardData = this.clientRewardData.concat(this.refRwds);
          this.refRwds = [];
        });
    }
  }

  openLookupModal(lookupType) {
    if (this.clienProfile.id) {
      this.lookUpType = lookupType;
      this.lookupModal.show();
      this.lookUpSearchData = [];
      this.noResult = '';
    } else {
      this.toastr.warning('Client Not Yet Created', null, { timeOut: 1500 });
    }
  }
  lookupCloseModal() {
    this.lookUpSearchData = [];
    this.lookupSearchKey = '';
    this.lookupModal.hide();
    this.filterlookupClient = [];
    this.searchLookupKeyValue = '';
  }
  clearLookUp(lookupType) {
    if (lookupType === 'responsible-party') {
      this.clientEditObj.ResponsibleClient = '';
      this.clientEditObj.ResponsibleClientPic = '';
      this.clientEditObj.Responsible_Party__c = '';

    } else {
      this.clientEditObj.ReferredClient = '';
      this.clientEditObj.ReferredClientPic = '';
      this.clientEditObj.Referred_By__c = '';
    }
  }

  Cli_No_Email(val) {
    this.noEmailBool = val;
    this.clear();
  }

  removeToken() {
    for (let a = 0; a < this.apptSerList.length; a++) {
      if (this.apptSerList[a].PrefDur === true) {
        this.apptSerList[a].PrefDur = 1;
      } else if (this.apptSerList[a].PrefDur === false) {
        this.apptSerList[a].PrefDur = 0;
      }
    }
    this.clientObj = {
      'creditCardToken': 'token deleted',
      'tokenExpirationDate': '',
      'PaymentType': '',
      'tokenPresent': 0,
    };

    for (const key in this.clientObj) {
      if (this.clientObj[key] === 'null' || this.clientObj[key] === null || this.clientObj[key] === 'undefined'
        || this.clientObj[key] === undefined || this.clientObj[key] === 'null-null-null') {
        this.clientObj[key] = '';
      }
    }
    this.newClientService.updatetokenClient(this.clienProfile.id, this.clientObj).subscribe(
      data => {
        const clientInfoDetails = data['result'];
        this.CliData(this.paramsId);
        this.updateTabs(0);
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

  updateApptServicelist(ind) {
    this.apptSerList = [];
    for (let a = 0; a < this.clientServicesData.length; a++) {
      if (ind === a) {
        this.clientServicesData[a].preDurChangeField = true;
      }
      if (this.clientServicesData[a].preDurChangeField === true) {
        this.apptSerList.push(this.clientServicesData[a]);
      }
    }
  }
  goToFullClientCard() {
    this.isEdit = true;
    this.clientEditObj.Active__c = 1;
    // this.clientEditObj.MailingState = '';
    this.getClientFlags();
    this.Cli_No_Email(false);
    this.noEmailAppt = 0;
    this.accoutChargeBalance = 0;
    this.depositRequired = 0;
    this.persistanceNoShow = 0;
    this.other = 0;
    this.booking_restrictions('None');
    // this.hasStandingAppt = 0;
    this.apptNotes = '';
    this.clientServicesData = [];
    this.clientCommunicationList = [];
    this.clientProductList = [];
    this.clientServicesList = [];
    this.clientClassList = [];
    this.clientRewardData = [];
    this.clientMemberShipsData = [];
    this.clientPackagesData = [];
    this.clientAccountsData = [];
    this.clientReferedDataList = [];
    this.clienProfile.id = undefined;
    this.AddNewClient = false;
    this.displayddl = 'none';
    window.scrollTo(0, 0);
  }

  createToken() {
    if (this.clienProfile.id === undefined) {
      this.commonSave(false);
      this.redirectTokenPage = true;
    } else {
      this.router.navigate(['/client/edit/' + this.clienProfile.id]).then(() => {
        this.router.navigate(['/client/createtoken/' + this.clienProfile.id]);
      });
    }
  }
  cancel() {
    if (!isNullOrUndefined(this.bookingUrl)) {
      if (this.action === 'modify') {
        this.router.navigate([this.bookingUrl]);
      } else {
        this.router.navigate(['/appointments']);
      }
    } else if (this.router.url === '/client/quick/add?actionMethod=findAppt' || this.router.url === '/client/quick/add?actionMethod=bookStanding') {
      this.router.navigate(['/appointments']);
    } else if (this.router.url === '/client/quick/add?actionMethod=checkout') {
      this.router.navigate(['/checkout/newticket']);
    } else if (this.actionmethod === 'checkout') {
      this.router.navigate(['/checkout/' + this.actionApptId]);
    } else if (this.actionmethod === 'checkoutList') {
      this.router.navigate(['/checkout']);
    } else if (this.actionmethod === 'appointmentdetail') {
      this.router.navigate(['/appointmentdetail/' + this.clienProfile.id + '/' + this.actionApptId]);
    } else {
      this.isEdit = false;
      this.AddNewClient = false;
      this.leftProfile = false;
      // this.searchKeyValue = '';
      // this.filterClient = [];
      this.router.navigate(['/client']);
    }
    this.clear();
    if (this.newclientPictureFileView) {
      this.removePic();
    }
    window.scrollTo(0, 0);
  }
  clear() {
    this.rewardCalErrorMsg = [];
    this.ClientProError[0] = '';
    this.ClientProError[1] = '';
    this.ClientProError[2] = '';
    this.ClientProError[3] = '';
    this.ClientProError[4] = '';
    this.ClientProError[5] = '';
    this.ClientProError[6] = '';
    this.ClientProError[7] = '';
    this.ClientProError[8] = '';
    this.ClientProError[9] = '';
    this.ClientProError[10] = '';
    this.ClientProError[11] = '';
    this.ClientProError[12] = '';
    this.ClientProError[13] = '';
    this.ClientProError[14] = '';
    this.ClientProError[15] = '';
    this.ClientProError[16] = '';

  }
  QuickAdd() {
    this.isEdit = false;
    this.AddNewClient = true;
    this.displayddl = 'inline';
  }
  saveAndBook() {
    this.saveAndBookButt = true;
    this.commonSave(true);
  }
  newClientSaveAndBook() {
    this.saveAndBookButt = true;
    this.AddClient(true);
  }
  selectFile(fileEvent) {
    this.newClientPictureFile = fileEvent.target.files[0];
    this.newclientPictureFileView = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.newClientPictureFile));
  }
  removePic() {
    this.newclientPictureFileView = '';
    this.myInputVariable.nativeElement.value = '';
  }
  /*--- This Method lists Client Fields ---*/
  listClientFields() {
    this.newClientService.getClientFields().subscribe(
      data => {
        const clientFeilds = JSON.parse(data['result'][1].JSON__c);
        const clientCardFeilds = JSON.parse(data['result'][0].JSON__c);
        this.allowQuickAddAccess = clientFeilds.allowQuickAdd;
        if (this.allowQuickAddAccess === true) {
          this.AddNewClient = true;
          this.isEdit = false;
          this.displayddl = 'inline';
        } else {
          this.isEdit = true;
          this.AddNewClient = false;
          this.displayddl = 'none';
          this.clienProfile.id = undefined;
        }
        this.birthDate = clientFeilds.birthDate;
        this.gender = clientFeilds.gender;
        this.mailingAddress = clientFeilds.mailingAddress;
        this.mobilePhone = clientFeilds.mobilePhone;
        this.primaryEmail = clientFeilds.primaryEmail;
        this.primaryPhone = clientFeilds.primaryPhone;
        this.secondaryEmail = clientFeilds.secondaryEmail;
        this.clientCardPrimaryPhone = clientCardFeilds.primaryPhone;
        this.clientCardMobilePhone = clientCardFeilds.mobilePhone;
        this.clientCardBirthDate = clientCardFeilds.birthDate;
        this.clientCardMailingAddress = clientCardFeilds.mailingAddress;
        this.clientCardPrimaryEmail = clientCardFeilds.primaryEmail;
        this.clientCardSecondaryEmail = clientCardFeilds.secondaryEmail;
        this.clientCardGender = clientCardFeilds.gender;
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

  /*Mobile carriers methods starts*/
  /* function lists Client mobile carrier*/
  mobileCarriernamesData() {
    this.newClientService.mobileCarriernames('MOBILE_CARRIERS').subscribe(
      data => {
        this.mobileCarriersList = data['result'];
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
  navigateTicketDetail(ser) {
    if (ser.Status__c.toLowerCase() === 'checked in') {
      this.router.navigate(['/checkout/' + ser.apptId]);
    } else {
      this.router.navigate(['/completedticketdetailsview/' + ser.apptId]);
    }
  }
  navigateTicketDetailInProduct(ser) {
    if (ser.Status__c.toLowerCase() === 'checked in') {
      this.router.navigate(['/checkout/' + ser.Appt_Ticket__c]);
    } else {
      this.router.navigate(['/completedticketdetailsview/' + ser.Appt_Ticket__c]);
    }
  }
  gotoApptDetail(details) {
    this.router.navigate(['/appointmentdetail/' + details.Client__c + '/' + details.Appt_Ticket__c], { queryParams: { actionMethod: 'AppointmentDetail' } });
  }
  clientCardFeilds() {
    this.newClientService.getClientFields().subscribe(
      data => {
        const clientFeilds = JSON.parse(data['result'][1].JSON__c);
        const clientCardFeilds = JSON.parse(data['result'][0].JSON__c);
        this.birthDate = clientFeilds.birthDate;
        this.gender = clientFeilds.gender;
        this.mailingAddress = clientFeilds.mailingAddress;
        this.mobilePhone = clientFeilds.mobilePhone;
        this.primaryEmail = clientFeilds.primaryEmail;
        this.primaryPhone = clientFeilds.primaryPhone;
        this.secondaryEmail = clientFeilds.secondaryEmail;
        this.clientCardPrimaryPhone = clientCardFeilds.primaryPhone;
        this.clientCardMobilePhone = clientCardFeilds.mobilePhone;
        this.clientCardBirthDate = clientCardFeilds.birthDate;
        this.clientCardMailingAddress = clientCardFeilds.mailingAddress;
        this.clientCardPrimaryEmail = clientCardFeilds.primaryEmail;
        this.clientCardSecondaryEmail = clientCardFeilds.secondaryEmail;
        this.clientCardGender = clientCardFeilds.gender;
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

  errorHandler(event, i) {
    this.filterClient[i]['Client_Pic__c'] = '';
    this.noProPic = true;
    this.avProPic = false;
  }
  errorHandlerLeftPro(event) {
    this.noProPic = true;
    this.avProPic = false;
  }
  // genderBtn(gender) {
  //   if (gender === 'Female') {
  //     this.genderSeleUnselFemale = !this.genderSeleUnselFemale;
  //     if (this.genderSeleUnselFemale) {
  //       this.clientEditObj.Gender__c = gender;
  //     } else {
  //       this.clientEditObj.Gender__c = 'Unspecified';
  //     }
  //     this.genderSeleUnselMale = false;
  //   } else {
  //     this.genderSeleUnselMale = !this.genderSeleUnselMale;
  //     if (this.genderSeleUnselMale) {
  //       this.clientEditObj.Gender__c = gender;
  //     } else {
  //       this.clientEditObj.Gender__c = 'Unspecified';
  //     }
  //     this.genderSeleUnselFemale = false;
  //   }
  // }

  searchLookupclient(eve) {
    if (eve === '') {
      this.filterlookupClient = [];
      this.noResult = '';
    }
  }
  deleteClient(id, name) {
    this.newClientService.deleteClient(id, name).subscribe(data => {
      const clientDelete = data['result'];
      this.toastr.success('Client Record Deleted Successfully', null, { timeOut: 1500 });
      this.router.navigate(['/client/add']).then(() => {
        this.router.navigate(['/client']);
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
  referedByNavigate(id) {
    this.location.replaceState('/client/edit/' + id);
    this.CliData(id);
    this.updateTabs(0);
    window.scrollTo(0, 0);
  }
  sortDatesDesc(JSONAry, JSONAttrb) {
    const leng = JSONAry.length;
    for (let i = 0; i < leng; i++) {
      for (let j = i + 1; j < leng; j++) {
        if (this.commonservice.getDateTmFrmDBDateStr(JSONAry[i][JSONAttrb]) <
          this.commonservice.getDateTmFrmDBDateStr(JSONAry[j][JSONAttrb])) {
          const tempObj = JSONAry[i];
          JSONAry[i] = JSONAry[j];
          JSONAry[j] = tempObj;
        }
      }
    }
    return JSONAry;
  }
  getLocation() {
    if (this.clientEditObj.MailingPostalCode.length > 4) {
      this.http.get('https://ziptasticapi.com/' + this.clientEditObj.MailingPostalCode).subscribe(
        result => {
          if (result['error']) {
            const toastermessage: any = this.translateService.get('SETUPCOMPANY.ZIP_CODE_NOT_FOUND');
            this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
          } else {
            if (result['country'] === 'US') {
              this.clientEditObj.MailingCountry = 'United States';
              this.getCountry(this.clientEditObj.MailingCountry);
              config.states.forEach(state => {
                if (state.abbrev === result['state']) {
                  this.clientEditObj.MailingState = state.name;
                }
              });
            }
            const cityArray = result['city'].split(' ');
            for (let i = 0; i < cityArray.length; i++) {
              if (i === 0) {
                this.clientEditObj.MailingCity = cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
              } else {
                this.clientEditObj.MailingCity += cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
              }
            }
          }
        },
        error => {
        }
      );
    }
  }
  verifyNumber() {
    this.verifyNumberPopup.show();
  }
}
