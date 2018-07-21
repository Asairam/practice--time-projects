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
  activeClass: any;
  activeClass1: any;
  marketingActiveClass: any;
  activeTab2 = [false, false, false, false, false, false, false, false];
  activeTabClass = ['', 'active', '', '', '', '', '', ''];
  restrictions = [{ 'name': 'none', 'value': 'None', 'active': 'active' },
  { 'name': 'alert only', 'value': 'Alert Only', 'active': '' },
  { 'name': 'do not book', 'value': 'Do Not Book', 'active': '' },
  { 'name': 'no online booking', 'value': 'no online booking', 'active': '' }];
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
  clientReferedDataList: any = [];
  clientRewardData: any = [];
  allRwrdsData: any;
  filteredRwds: any;
  clientRewardData1: any = [];
  Reward__c: any;
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
    'hasStandingAppt': '',
    'Other': ''
  };
  resultAppointments = [];
  clientappoinmentData: any;
  clientServicesData = [];
  loadmore = 10;
  hideLoadMoreButt = false;
  hasStandingAppt: any = false;
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
  ClientProError: any = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
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
  StartingBalanceDisable: any;
  genderSeleUnselFemale: boolean;
  genderSeleUnselMale: boolean;
  actionmethod: any;
  /*clientcared fileds end */
  promotionName: any;
  searchLookupKeyValue: any;
  filterlookupClient = [];
  mailingCountriesList = [{ 'NAME': 'Canada' }, { 'NAME': 'United States' }];
  constructor(private activatedRoute: ActivatedRoute,
    private newClientService: NewClientService,
    private sanitizer: DomSanitizer, private commonservice: CommonService,
    private checkOutEditTicketService: CheckOutEditTicketService,
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
    });
  }

  ngOnInit() {
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
    if (this.router.url === '/client/quick/add') {
      this.AddNewClient = true;
      this.searchKeyValue = '';
    } else if (this.router.url === '/client/add') {
      this.goToFullClientCard();
      this.searchKeyValue = undefined;
    } else if (this.router.url.match(/client\/edit/g)) {
      this.newClientService.getClient(this.paramsId).subscribe(data => {
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
  }
  getRewards() {
    this.checkOutEditTicketService.getRewardsData().subscribe(
      data => {
        this.allRwrdsData = data['result'];
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
          this.filterlookupClient = data['result'];
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
      MailingCountry: '',
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
      Notification_Primary_Email__c: '',
      Reminder_Mobile_Phone__c: '',
      Reminder_Opt_Out__c: '',
      Reminder_Primary_Email__c: '',
      Active_Rewards__c: '',
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
      Mobile_Carrier__c: '',
      Booking_Restriction_Note__c: '',
      Notes__c: '',
      Booking_Frequency__c: '',
      Allow_Online_Booking__c: '',
      Referred_By__c: '',
      selectedFlags: [],
      Client_Pic__c: '',
      Id: '',
      CreatedDate: ''
    };
  }
  getClientData(clientId) {
    this.newClientService.getClient(clientId)
      .subscribe(data => {
        this.isEdit = true;
        this.clientReferedDataList = [];
        let referalNames: any = [];
        let referalClientPics: any = [];
        let referalClientDates: any = [];
        const clientData = data['result']['results'][0];
        Object.keys(clientData).map((Dkey) => {
          switch (Dkey) {
            case 'refName': {
              referalNames = this.assaignReferalValues(clientData, Dkey);
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
            referalData['clientImage'] = referalClientPics[i];
            referalData['referedDate'] = referalClientDates[i];
            this.clientReferedDataList.push(referalData);
          });
        }
        this.noEmailBool = this.clientEditObj.No_Email__c === 1 ? true : false;
        this.clientEditObj.Birthdate = new Date(this.clientEditObj.Birthdate).toString() === 'Invalid Date' ? '' : this.clientEditObj.Birthdate;
        // flag
        this.selectedFlagItems = [];
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
          filterList => filterList.active === true);
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
        this.serviceLogLength = this.clientServicesList.length;
        this.serviceTotal = 0;
        this.clientServicesList.forEach(element => {
          if (element.Net_Price__c === '' || element.Net_Price__c === null || element.Net_Price__c === undefined) {
            element.Net_Price__c = 0;
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

  getProductLog(clientId: string) {
    this.newClientService.getProductLog(clientId).subscribe(
      data => {
        this.clientProductList = data['result'];
        this.totalQtySold = 0;
        this.proTotalPrice = 0;
        this.clientProductList.forEach(element => {
          if (element.Qty_Sold__c !== '' || element.Qty_Sold__c !== null || element.Qty_Sold__c !== undefined) {
            this.totalQtySold += element.Qty_Sold__c;
          }
          if (element.Price__c === '' || element.Price__c === null || element.Price__c === undefined) {
            element.Price__c = 0;
          }
          this.proTotalPrice += element.Price__c;
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
    this.newClientService.getClientPackagesData(clientId).subscribe(
      data => {
        const cpData = data['result'];
        if (data['result'] !== '') {
          this.clientPackagesData = cpData.ClientPackageData;
          this.ClientServiceData = cpData.ServiceData;
          if (this.clientPackagesData) {
            for (let j = 0; j < this.clientPackagesData.length; j++) {
              const packageDetails = JSON.parse(this.clientPackagesData[j].Package_Details__c);
              for (let k = 0; k < this.ClientServiceData.length; k++) {
                if (packageDetails.serviceId === this.ClientServiceData[k].Id) {
                  this.clientPackagesData[j]['serviceName'] = this.ClientServiceData[k]['ServiceName'];
                  this.clientPackagesData[j]['serviceId'] = this.ClientServiceData[k]['Id'];
                }
              }
              const unused1: any = packageDetails.reps - packageDetails.used;
              const unused = unused1 + ' of ' + packageDetails.reps;
              this.clientPackagesData[j]['unused'] = unused;
              this.clientPackagesData[j]['unusedValue'] = parseInt(unused1, 10) * parseInt(packageDetails['discountPriceEach'], 10);
              this.totalUnUsedValue += this.clientPackagesData[j]['unusedValue'];
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
  }
  showNotesModalApp() {
    this.appointmentNotesModal.show();
  }
  closeAppNotesModal() {
    this.appointmentNotesModal.hide();
  }
  closeServiceNotesModal() {
    this.serviceNotesModal.hide();
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
    if (this.searchKeyValue === '') {
      this.filterClient = [];
      this.leftProfile = false;
      this.isEdit = false;
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
      'standingAppt': '',
      'hasStandingAppt': pro.Has_Standing_Appts__c
    };
    this.other = this.AppointmentsTab.Other;
    this.pin = this.AppointmentsTab.pin;
    this.hasStandingAppt = this.AppointmentsTab.hasStandingAppt;
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
    this.CommonSaveBut = true;
    window.scrollTo(0, 0);
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
              if (this.clientServicesData[j].Duration__c < 60) {
                this.clientServicesData[j].Duration__c = this.clientServicesData[j].Duration__c + ' min';
              } else {
                this.clientServicesData[j].Duration__c = '1 hr';
              }
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
  }

  AddClient() {
    this.clear();
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.clientEditObj.FirstName === '') {
      this.ClientProError[0] = this.translateService.get('CLIENTS.NO_BLANK_FIRST_NAME');
    } else if (this.clientEditObj.LastName === '') {
      this.ClientProError[2] = this.translateService.get('CLIENTS.NO_BLANK_LAST_NAME');
      // } else if (this.clientEditObj.Email === '') {
    } else if (this.primaryEmail === true && this.clientEditObj.Email === '') {
      this.ClientProError[5] = this.translateService.get('CLIENTS.NOBLANK_EMAIL');
    } else if (this.clientEditObj.Email !== 'undefined' && this.clientEditObj.Email !== undefined && this.clientEditObj.Email !== '' && !EMAIL_REGEXP.test(this.clientEditObj.Email)) {
      this.ClientProError[5] = this.translateService.get('CLIENTS.INVALID_PRIMARY_EMAIL');
      // } else if (this.clientEditObj.Phone === '') {
    } else if (this.primaryPhone === true && this.clientEditObj.Phone === '') {
      this.ClientProError[3] = this.translateService.get('CLIENTS.NOBLANK_PRIMARY_PHONE');
      // } else if (this.clientEditObj.MobilePhone === '') {
    } else if (this.mobilePhone === true && this.clientEditObj.MobilePhone === '') {
      this.ClientProError[4] = this.translateService.get('CLIENTS.NOBLANK_MOBILE_PHONE');
    } else {
      this.NewClient = {
        'firstname': this.clientEditObj.FirstName,
        // 'middlename': '',
        'lastname': this.clientEditObj.LastName,
        'primaryPhone': this.clientEditObj.Phone,
        'mobilePhone': this.clientEditObj.MobilePhone,
        'email': this.clientEditObj.Email,
        'gender': this.clientEditObj.Gender__c === '' ? 'Unspecified' : this.clientEditObj.Gender__c,
        'isNewClient': true,
        'type': this.actionmethod
      };
      this.newClientService.clientQuickEdit('noClientid', this.NewClient).subscribe(data => {
        const addStatus = data['result'];
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CLIENT_CREATE_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        this.AddNewClient = false;
        this.getAllClients();
        this.clear();
        this.clientEditObjFun();
        if (this.saveAndBookButt) {
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

  commonSave() {
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

    if (this.hasStandingAppt === true) {
      this.hasStandingAppt = 1;
    } else if (this.hasStandingAppt === false) {
      this.hasStandingAppt = 0;
    }

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
      if (this.clientMemberShipsData[y].Auto_Bill__c === true) {
        this.clientMemberShipsData[y].Auto_Bill__c = 1;
      } else if (this.clientMemberShipsData[y].Auto_Bill__c === false) {
        this.clientMemberShipsData[y].Auto_Bill__c = 0;
      }
    }
    // Account tab end
    this.clear();
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.clientEditObj.FirstName === 'undefined' || this.clientEditObj.FirstName === undefined ||
      this.clientEditObj.FirstName === '') {
      this.updateTabs(0);
      this.ClientProError[6] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_FIRSTNAME');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.LastName === 'undefined' || this.clientEditObj.LastName === undefined ||
      this.clientEditObj.LastName === '') {
      this.updateTabs(0);
      this.ClientProError[7] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_LASTNAME');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }

    } else if (this.clientEditObj.MailingStreet === '' && this.clientCardMailingAddress === true) {
      this.ClientProError[16] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_ADDRESS');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.clientEditObj.Email === '' && this.clientCardPrimaryEmail === true)) {
      this.updateTabs(0);
      this.ClientProError[9] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_PRIMARY_EMAIL');
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.clientEditObj.Email !== '' && !EMAIL_REGEXP.test(this.clientEditObj.Email))) {
      this.ClientProError[9] = this.translateService.get('CLIENTS.INVALID_CLIENT_INFO_PRIMARY_EMAIL');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.Phone === '' && this.clientCardPrimaryPhone === true) {
      this.ClientProError[13] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_PRIMARY_PHONE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.MobilePhone === 'undefined' || this.clientEditObj.MobilePhone === undefined ||
      this.clientEditObj.MobilePhone === '' || this.clientEditObj.MobilePhone === null || this.clientEditObj.MobilePhone === 'null') && this.clientCardMobilePhone === true) {
      this.ClientProError[8] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_MOBILE_PHONE');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.clientEditObj.Reminder_Secondary_Email__c === 1 && this.clientEditObj.Secondary_Email__c === '')
      && (this.clientEditObj.Secondary_Email__c === '' && this.clientCardSecondaryEmail === true)) {
      this.ClientProError[11] = this.translateService.get('CLIENTS.NOBLANK_CLIENT_INFO_SECONDARY_EMAIL');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if ((this.clientEditObj.No_Email__c === 0) && (this.clientEditObj.Secondary_Email__c !== '' && !EMAIL_REGEXP.test(this.clientEditObj.Secondary_Email__c))) {
      this.ClientProError[11] = this.translateService.get('CLIENTS.INVALID_CLIENT_INFO_SECONDARY_EMAIL');
      this.updateTabs(0);
      if (this.clienProfile.id === undefined) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 600);
      }
    } else if (this.clientEditObj.Birthdate === '' && this.clientCardBirthDate === true) {
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
        'clientInfoPrimaryPhone': this.clientEditObj.Phone,
        'clientInfoMobilePhone': this.clientEditObj.MobilePhone,
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
        'mobileCarrierName': this.clientEditObj.Mobile_Carrier__c,
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
        'allowOnlineBooking': this.clientEditObj.Allow_Online_Booking__c,
        'hasStandingAppt': this.hasStandingAppt,
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
        'type': this.actionmethod
      };
      this.leftProfileUpdate(this.clientEditObj);
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
          this.clear();
          this.displayddl = 'inline';
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
              this.router.navigate(['/checkout/' + data['result'].apptId]).then(() => {
              });
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

          if (this.saveAndBookButt) {
            if (this.newClientId === undefined) {
              this.router.navigate(['/client/edit/' + this.clienProfile.id]).then(() => {
                this.router.navigate(['/appointment/book/' + this.clienProfile.id]);
              });
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
    if (lookupType === 'responsible-party') {
      this.clientEditObj.ResponsibleClient = user.FirstName + ' ' + user.LastName;
      this.clientEditObj.ResponsibleClientPic = user.Client_Pic__c;
      this.clientEditObj.Responsible_Party__c = user.Id;
    } else {
      this.clientEditObj.ReferredClient = user.FirstName + ' ' + user.LastName;
      this.clientEditObj.ReferredClientPic = user.Client_Pic__c;
      this.clientEditObj.Referred_By__c = user.Id;
      this.clientEditObj.referedDate = new Date();
    }


  }

  openLookupModal(lookupType) {
    this.lookUpType = lookupType;
    this.lookupModal.show();
    this.lookUpSearchData = [];
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
      'clientInfoPrimaryPhone': this.clientEditObj.Phone,
      'clientInfoMobilePhone': this.clientEditObj.MobilePhone,
      'clientInfoPrimaryMail': this.clientEditObj.Email,
      'clientInfoSecondaryEmail': this.clientEditObj.Secondary_Email__c,
      'clientInfoEmergName': this.clientEditObj.Emergency_Name__c,
      'clientInfoEmergPrimaryPhone': this.clientEditObj.Emergency_Primary_Phone__c,
      'clientInfoEmergSecondaryPhone': this.clientEditObj.Emergency_Secondary_Phone__c,
      'homePhone': this.clientEditObj.HomePhone,
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
      'ReferedAFriendProspect': this.clientEditObj.Refer_A_Friend_Prospect__c,
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
      'mobileCarrierName': this.clientEditObj.Mobile_Carrier__c,
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
      'allowOnlineBooking': this.clientEditObj.Allow_Online_Booking__c,
      'hasStandingAppt': this.hasStandingAppt,
      'pin': this.pin,
      'restrictionType': this.AppointmentsTab.restrictionsType,

      // Accounts
      'activeRewards': this.clientEditObj.Active_Rewards__c,
      'isNewClient': false,
      'startingBalance': this.clientEditObj.Starting_Balance__c,
      'clientMemberShipId': this.clientEditObj.Membership_ID__c,
      'clientRewardsData': this.clientRewardData,
      'creditCardToken': 'token deleted',
      'tokenExpirationDate': '',
      'PaymentType': '',
      'tokenPresent': 0,
      'clientMemberShipsData': this.clientMemberShipsData,
      'ApptServiceData': this.apptSerList
    };

    for (const key in this.clientObj) {
      if (this.clientObj[key] === 'null' || this.clientObj[key] === null || this.clientObj[key] === 'undefined'
        || this.clientObj[key] === undefined || this.clientObj[key] === 'null-null-null') {
        this.clientObj[key] = '';
      }
    }
    this.newClientService.saveClient(this.clienProfile.id, this.clientObj, this.clientPictureFile).subscribe(
      data => {
        const clientInfoDetails = data['result'];
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
    this.clientEditObj.MailingCountry = 'United States';
    this.getCountry('United States');
    this.clientEditObj.MailingState = '';
    this.getClientFlags();
    this.Cli_No_Email(false);
    this.noEmailAppt = 0;
    this.accoutChargeBalance = 0;
    this.depositRequired = 0;
    this.persistanceNoShow = 0;
    this.other = 0;
    this.booking_restrictions('None');
    this.hasStandingAppt = 0;
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
      this.commonSave();
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
    } else {
      this.isEdit = false;
      this.AddNewClient = false;
      this.leftProfile = false;
      this.searchKeyValue = '';
      this.filterClient = [];
      this.router.navigate(['/client']);
    }
    this.clear();
    this.removePic();
  }
  clear() {
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
    this.commonSave();
  }
  newClientSaveAndBook() {
    this.saveAndBookButt = true;
    this.AddClient();
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
  navigateTicketDetail(cId) {
    this.router.navigate(['/client']).then(() => {
      this.router.navigate(['/client/edit/' + this.clienProfile.id]).then(() => {
        this.router.navigate(['/completedticketdetailsview/' + cId]);
      });
    });
  }
  gotoApptDetail(details) {
    this.router.navigate(['/client']).then(() => {
      this.router.navigate(['/client/edit/' + this.clienProfile.id]).then(() => {
        this.router.navigate(['/appointmentdetail/' + details.Client__c + '/' + details.Appt_Ticket__c], { queryParams: { actionMethod: 'AppointmentDetail' } });
      });
    });
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
  genderBtn(gender) {
    if (gender === 'Female') {
      this.genderSeleUnselFemale = !this.genderSeleUnselFemale;
      if (this.genderSeleUnselFemale) {
        this.clientEditObj.Gender__c = gender;
      } else {
        this.clientEditObj.Gender__c = 'Unspecified';
      }
      this.genderSeleUnselMale = false;
    } else {
      this.genderSeleUnselMale = !this.genderSeleUnselMale;
      if (this.genderSeleUnselMale) {
        this.clientEditObj.Gender__c = gender;
      } else {
        this.clientEditObj.Gender__c = 'Unspecified';
      }
      this.genderSeleUnselFemale = false;
    }
  }

  searchLookupclient(eve) {
    if (eve === '') {
      this.filterlookupClient = [];
    }
  }
}
