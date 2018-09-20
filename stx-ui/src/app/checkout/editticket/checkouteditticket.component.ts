interface AmountDetails {
  ProductAmount?: number;
  ServiceAmount?: number;
  ProductTaxAmount?: number;
  ServiceTaxAmount?: number;
  OthersAmount?: number;
  TipsAmount?: number;
  deleteProductAmount?: number;
  deleteServiceAmount?: number;
  deleteProductTaxAmount?: number;
  deleteServiceTaxAmount?: number;
  deleteOthersAmount?: number;
  deleteTipsAmount?: number;
}
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, FormControl } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { CheckOutEditTicketService } from './checkouteditticket.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonService } from '../../common/common.service';
import { NewClientService } from '../../clients/newclient/newclient.service';
import { isNullOrUndefined } from 'util';
import { DecimalPipe } from '@angular/common';
import * as config from '../../app.config';
import { Md5 } from 'ts-md5/dist/md5';
import { JwtHelper } from 'angular2-jwt';
import * as clover from 'remote-pay-cloud';
import { element } from 'protractor';
// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
// import { WebcamImage } from '../../../assets/webcammodules/webcam/domain/webcam-image';
@Component({
  selector: 'app-checkouteditticket',
  templateUrl: './checkouteditticket.html',
  providers: [CheckOutEditTicketService, NewClientService, CommonService],
  styleUrls: ['./checkouteditticket.component.css']
})
export class CheckOutEditTicketComponent implements OnInit, OnDestroy {
  activeClass: any;
  activeClass1: any;
  marketingActiveClass: any;
  clientImgPath = '';
  clientId: any;
  clientRewardsDatabyApptId = [];
  giftCurrentBal = 0;
  bookedPackage: any;
  isBookedPackage = false;
  prePaidPckgAmt = 0;
  bookedpackageSerPrice = 0;
  giftError: any;
  toastermessage: any;
  serviceTax: any;
  servicesCharge: any = 0;
  productsCharge: any = 0;
  othersCharge: any = 0;
  tipsCharge: any = 0;
  totalTax = 0;
  totalCharge = 0;
  paymentCharge = 0;
  balanceDue = 0;
  productPromotionPrice: any;
  serviceAction = '';
  paymentAction = '';
  productAction = 'Add';
  retailTax: any;
  serTax = 0.00;
  prodTax = 0.00;
  servRetTaxsList: any;
  apptId: any;
  error: any;
  searchKey: any = '';
  noclientLabel: any = '';
  DataObj: any;
  ticketPaymentId: any;
  prePaidPckgPmntId: any;
  allPromData: any = [];
  serviceGroupList: any;
  servicesData: any = [];
  servicesArray: any = [];
  updateSerWorkerId: any;
  updateServicePromotionId: any;
  favouritesData: any = [];
  finalRewardsList: any = [];
  rtnRwds: any;
  serviceRewards = [];
  productRewards = [];
  action = '';
  favTab = false;
  srvsTab = false;
  prdtTab = false;
  otherTab = false;
  tipTab = false;
  vbylvlTab = false;
  vbysgTab = false;
  activeTab = [false, false, false, false, false, false, false];
  activeTabClass = ['active', '', '', '', '', '', ''];
  workerList: any;
  popUpServiceName: any;
  apptData: any;
  TicketServiceData: any;
  packagesData: any;
  prePaidPackageCost = 0;
  packagesPrice = 0;
  notes: any;
  price: any = 0.00;
  servicePromotionsList: any = [];
  refPrice: any = 0;
  proRefPrice: any = 0;
  updateRefPrice = 0;
  clientName = '';
  visitType = '';
  accountBal = 0.00;
  ticketRate = '';
  styleOnClickPoor: any = 'active';
  styleOnClickFair: any = 'active';
  styleOnClickGood: any = 'active';
  visitTypesList: any;
  servicesList = [];
  ServiceGroupName: any = '';
  actualPrice: any = 0;
  clientPckgArray = [];
  clientRwdArray = [];
  clientRewardIds: any;
  serviceError: any;
  // service list
  updateServiceWorkerId: any;
  updateServicePrice: any;
  updatePromotionId: any;
  updateServiceNotes: any;
  updateTicketSerivceId: any;
  serviceId: any;
  rewardId = '';
  rewardName = '';
  redeemName = '';
  // products
  promotion__c: any;
  productsList: any = [];
  prodSku: any;
  productListData: any;
  productsData: any;
  ticketProductsList: any = [];
  popupProductName: any;
  productWorkersList: any = [];
  productPrice: any;
  productCost: any;
  productObj: any;
  productQuantity = 1;
  productId: any;
  productTaxable: any;
  productWorkerId = '** None **';
  productClientId: any;
  productProRePrice: any = 0;
  promotionId = '';
  productError: any;
  productPromotionsList: any = [];
  // updateWorkerName: any;
  updatePrice: any;
  updateQuantity: any;
  ticketProductId: any;
  updateProdPromotionId: any;
  // favorites
  tabType: any = '';
  promotionVals: any;
  // payments
  paymentsData = [];
  refPaymentId = '';
  amountPaid = 0.00;
  chargeButton = true;
  balanceDuePopUp = 0;
  listCharge = 0;
  changeBack: any;
  showRedAmount: any;
  popUpPaymentName: any;
  enterManuallyButton = false;
  enterManually: any = false;
  paymentNotes: any = '';
  merchantWorkerList: any = [];
  selectedPaymentId: any;
  merchantAccntName: any = '';
  paymentGateWay: any = '';
  ticketPaymentList: any = [];
  charge = 0.00;
  rewardsList: any;
  clientRwrdsData = [];
  allRwdsList: any = [];
  cardHolderName: any;
  cardNumber: any;
  zipCode: any;
  cvv: any;
  monthList = ['01 - January', '02 - February', '03 - March', '04 - April', '05 - May', '06 - June',
    '07 - July', '08 - August', '09 - September', '10 - October', '11 - November', '12 - December'];
  yearList = [];
  expYear = 0;
  expMonth = 1;
  // misc
  misc = '';
  miscCalList = [];
  calTransactionType = [];
  calAmount: any;
  miscId: any;
  miscScale = 'Misc Sale';
  miscError: any;
  // others start
  clientPckgObj = {};
  deposit: any = '';
  prePayment: any = '';
  recievedOnAccount: any = '';
  packageId: any = '';
  isActive: any = true;
  packagesList: any = [];
  packageAmount: any = '';
  giftNumber: any = '';
  giftAmount: any = '';
  workersList: any = [];
  workerId: any = '';
  datePickerConfig: any;
  minDate: Date;
  issueDate: Date;
  expireDate: Date;
  recepient: any;
  ticketOthersList: any = [];
  otherError: any;
  updateOthersInfo: any = {};
  // others end
  // Tips
  workerTips: any = {};
  workerTipsList: any = [];
  // Client Rewards
  clientRewards: any = [];
  isClientRewardsAllowed: any;
  clientRewardList = [];
  rowsPerPage: any;
  filterClient: any;
  profileList = true;
  searchData = false;
  clientPackageData: any = [];
  includedTicketAmount = 0;
  /* creditcard device details */
  obj: any;
  addCreditCardDevice: any;
  ticketNumber: any;
  disable = 'disabled';
  decodedToken: any;
  packageTax: any = 0;
  decodeUserToken: any;
  hideClientInfo: any;
  public searchField = new FormControl();
  public cashDrawer: any;
  //
  apptAmountDetails: AmountDetails = {
    ProductAmount: 0,
    ServiceAmount: 0,
    ServiceTaxAmount: 0,
    ProductTaxAmount: 0,
    TipsAmount: 0,
    OthersAmount: 0,
    deleteProductAmount: 0,
    deleteServiceAmount: 0,
    deleteServiceTaxAmount: 0,
    deleteProductTaxAmount: 0,
    deleteTipsAmount: 0,
    deleteOthersAmount: 0,
  };
  swipePwd = '';
  cloverConnector: any;
  cloverConnectorListener: any;
  cloverPopup = false;
  cloverChk = false;
  cloverDevice = '';
  cloverDeviceList = '';
  cloverTip = 0;

  /* creditcard device details end */
  /**
   * camara related declartions
   */
  // toggle webcam on/off
  // public showWebcam = true;

  // latest snapshot
  // public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  // private trigger: Subject<void> = new Subject<void>();
  @ViewChild('serviceModal') public serviceModal: ModalDirective;
  @ViewChild('productModal') public productModal: ModalDirective;
  @ViewChild('paymentsModal') public paymentsModal: ModalDirective;
  // @ViewChild('productModal') public productModal: ModalDirective;
  // @ViewChild('servicesListModal') public servicesListModal: ModalDirective;
  @ViewChild('promotionsModal') public promotionsModal: ModalDirective;
  @ViewChild('miscModal') public miscModal: ModalDirective;
  @ViewChild('othersModal') public othersModal: ModalDirective;
  @ViewChild('clientSearchModal') public clientSearchModal: ModalDirective;
  @ViewChild('tipsModal') public tipsModal: ModalDirective;
  @ViewChild('cloverModal') public cloverModal: ModalDirective;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private checkOutEditTicketService: CheckOutEditTicketService,
    private newClientService: NewClientService,
    private http: HttpClient,
    private commonService: CommonService,
    @Inject('apiEndPoint') private apiEndPoint: string) {
    this.route.queryParams.subscribe(params => {
      this.apptId = route.snapshot.params['TicketId'];
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
    this.getFavouritesData();
    this.minDate = new Date();
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
    if (!this.apptId) {
      this.action = 'New';
    } else {
      this.action = 'Edit';
    }
    // this.getApptDetails(this.apptId);
    this.getServiceGroups();
    this.getServicesData();
    this.updateTabs(0);
    // products
    this.getProductsList();
    this.getWorkersList();
    this.getWorkerMerchants();
    // misc
    this.getCalList();
    // others
    this.getpackagesListing();
    this.getAllActiveWorkers();
    this.getOthersTicketDetails();
    // payments
    this.createYearsList();
    this.getServRetTaxs();
    // this.searchClients(this.searchKey);
    this.getPaymentTypes();
    this.getHideClientContactInfo();
    const cashDrawrInfo = localStorage.getItem('browserObject');
    if (cashDrawrInfo) {
      this.cashDrawer = JSON.parse(cashDrawrInfo).CashDrawer ? JSON.parse(cashDrawrInfo).CashDrawer : null;
    }
    if (!this.apptId) {
      this.getPromotions();
      // this.getClientRewardData();
      this.getPaymentTypes();
    }
  }

  ngOnDestroy() {
    if (this.cloverConnector) {
      this.cloverConnector.dispose();
    }
  }

  search() {
    this.searchField.valueChanges
      .debounceTime(400)
      .switchMap(term => this.newClientService.getClientAutoSearch(term)
      ).subscribe(
        data => {
          this.filterClient = data['result'];
          if (this.filterClient.length > 0) {
            this.searchData = true;
          } else {
            this.searchData = false;
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
  /**
   * Camera features
   */
  //  public triggerSnapshot(): void {
  //    this.trigger.next();
  //  }

  //  public toggleWebcam(): void {
  //    this.showWebcam = !this.showWebcam;
  //  }

  //  public handleImage(webcamImage: WebcamImage): void {
  //    this.webcamImage = webcamImage;
  //  }

  //  public get triggerObservable(): Observable<void> {
  //    return this.trigger.asObservable();
  //  }
  /**
   * Method to get list of visit types
   */
  listVisitTypes() {
    this.checkOutEditTicketService.getVisitTypes().subscribe(
      data => {
        this.visitTypesList = data['result'];
        this.visitType = this.apptData.visttype;
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
      }
    );
  }
  /**
   * Method to get client search popup
   */
  searchClient(val) {
    if (val === '') {
      this.profileList = true;
      this.searchData = false;
      this.filterClient = [];
    } else {
      this.profileList = false;
      // this.filterClientBySearchValue(val);
    }
  }
  /**
   * Navigation to add new client
   */
  addNewClient() {
    this.router.navigate(['/client/quick/add']);
  }
  /**
   * get cashDrawers
   */
  getCashDrawers() {
    const creditCardDevice = localStorage.getItem('browserObject');
  }
  /**
   * add Ticket Rating
   */
  addTicketRating(value) {
    this.ticketRate = value;
    this.styleOnClickPoor = '';
    this.styleOnClickFair = '';
    this.styleOnClickGood = '';
    if (this.ticketRate === 'Poor') {
      this.styleOnClickPoor = 'active';
    } else if (this.ticketRate === 'Fair') {
      this.styleOnClickFair = 'active';
    } else if (this.ticketRate === 'Good') {
      this.styleOnClickGood = 'active';
    } else {
      this.styleOnClickPoor = 'active';
      this.styleOnClickFair = 'active';
      this.styleOnClickGood = 'active';
    }
    this.checkOutEditTicketService.getRateToTicket(value, this.apptId)
      .subscribe(data => {
        const dataStatus = data['result'];
        this.getApptDetails(this.apptId);
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
  /**
   * Method to add client to appointment
   */
  addClientToAppt(clientData) {
    const apptDate = this.commonService.getDBDatTmStr(new Date());
    this.checkOutEditTicketService.addClient(clientData.Id, this.apptId, apptDate)
      .subscribe(data => {
        const dataStatus = data['result'];
        if (dataStatus && dataStatus.apptId) {
          this.router.navigate(['/checkout/' + dataStatus.apptId]).then(() => {
            this.getApptDetails(dataStatus.apptId);
            this.searchData = false;
            this.profileList = true;
          });
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
  /**
   * On change visit type method
   */
  visitTypeOnchange(value) {
    this.checkOutEditTicketService.editVisitType(this.apptId, value).subscribe(data => {
      const dataStatus = data['result'];
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
  /**
   * Method to get service tax  and retail tax calculation
   */
  getServRetTaxs() {
    this.checkOutEditTicketService.getServProdTax().subscribe(
      data => {
        this.servRetTaxsList = data['result'];
        const taxs = this.servRetTaxsList[3];
        const taxData = JSON.parse(taxs.JSON__c);
        this.serviceTax = taxData.serviceTax;
        this.retailTax = taxData.retailTax;
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
   * Method to get rewards data
   */
  getClientRewardData(clientId) {
    this.checkOutEditTicketService.clientRewardData(clientId).subscribe(
      data => {
        if (data['result'] && data['result'].length > 0) {
          this.clientRewardList = data['result'];
          const rwdData = this.filterRewards(data['result']);
          if (this.isClientRewardsAllowed === 1 || this.isClientRewardsAllowed === '1') {
            this.serviceRewards = this.commonService.removeDuplicates(rwdData.srvcRwds, 'Name');
            this.productRewards = this.commonService.removeDuplicates(rwdData.prodRwds, 'Name');
            this.finalRewardsList = this.serviceRewards.concat(this.productRewards);
          }
          // this.finalRewardsList = this.removeDuplicates(this.finalRewardsList, 'Name');
          if (this.clientRwrdsData && this.clientRwrdsData.length > 0) {
            for (let i = 0; i < this.finalRewardsList.length; i++) {
              for (let j = 0; j < this.clientRwrdsData.length; j++) {
                if (this.clientRwrdsData[j].rwdId === this.finalRewardsList[i].Id) {
                  this.clientRwrdsData[j]['crId'] = this.finalRewardsList[i]['crId'];
                  this.clientRwrdsData[j]['crdId'] = this.finalRewardsList[i]['crdId'];
                  // this.clientRwrdsData[j]['isNew'] = false;
                }
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
      });
  }
  /**
   * Method to get promotions data
   */
  getPromotions() {
    this.checkOutEditTicketService.getPromotionsData().subscribe(data => {
      const refPromList = data['result'].filter(
        filterList => filterList.Active__c === 1);
      if (this.servicePromotionsList && this.servicePromotionsList.length > 0) {
        this.updatePromotionId = this.servicePromotionsList[0]['Promotion__c'];
      }
      let serviceDate;
      if (this.apptData && this.apptData.apdate) {
        serviceDate = this.apptData.apdate.split(' ')[0];
      } else {
        const date = (new Date().getMonth() + 1) + '/' + new Date().getDate() + '/' + new Date().getFullYear();
        serviceDate = date.split(' ')[0];
      }
      // for Services
      this.servicePromotionsList = [];
      this.allPromData = [];
      for (let i = 0; i < refPromList.length; i++) {
        if ((refPromList[i].Start_Date__c !== null && refPromList[i].End_Date__c !== null) &&
          (new Date(refPromList[i].Start_Date__c) <= new Date(serviceDate)
            && new Date(refPromList[i].End_Date__c) >= new Date(serviceDate))) {
          this.allPromData.push(refPromList[i]);
        } else if (((refPromList[i].Start_Date__c === null && refPromList[i].End_Date__c === null))) {
          this.allPromData.push(refPromList[i]);
        }
      }
      this.productPromotionsList = this.allPromData.filter((obj) => obj.Product_Discount__c === 1);
      this.servicePromotionsList = this.allPromData.filter((obj) => obj.Service_Discount__c === 1);
      this.promotionId = 'None';
      this.rewardId = 'None';
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
  /**
   * Method to get appointments data
   */
  getApptDetails(apptid) {
    this.checkOutEditTicketService.getApptDetails(apptid).subscribe(data => {
      this.apptData = data['result'][0];
      this.ticketNumber = this.apptData.Name; // displaying at header //
      if (this.apptData && this.apptData.Status__c === 'Complete') {
        this.router.navigate(['/completedticketdetailsview/' + apptid]).then(() => { });
      }
      // else if (!this.apptData) {
      //   this.router.navigate(['/checkout/newticket']).then(() => { });
      // } else
      if (this.apptData) {
        this.clientName = this.apptData.clientName;
        if (this.apptData && this.apptData.clientpic !== null) {
          this.clientImgPath = this.apiEndPoint + '/' + this.apptData.clientpic;
        } else {
          this.clientImgPath = '';
        }
        // if (this.clientImgPath.split('.jpg'))
        this.visitType = this.apptData.visttype;
        this.productClientId = this.apptData.clientId;
        this.clientId = this.apptData.clientId;
        this.accountBal = this.apptData.Current_Balance__c;
        this.ticketRate = this.apptData.Ticket_Rating__c;
        this.includedTicketAmount = this.apptData.Included_Ticket_Amount__c;
        this.isClientRewardsAllowed = this.apptData.Active_Rewards__c;
        this.styleOnClickPoor = '';
        this.styleOnClickFair = '';
        this.styleOnClickGood = '';
        if (this.ticketRate === 'Poor') {
          this.styleOnClickPoor = 'active';
        } else if (this.ticketRate === 'Fair') {
          this.styleOnClickFair = 'active';
        } else if (this.ticketRate === 'Good') {
          this.styleOnClickGood = 'active';
        } else {
          this.styleOnClickPoor = 'active';
          this.styleOnClickFair = 'active';
          this.styleOnClickGood = 'active';
        }
        this.getPromotions();
        // this.getClientRewardData(this.clientId);
        this.listVisitTypes();
        this.getRewards();
        this.getPaymentTypes();
        // Tips
        this.getWorkerTips();
        if (this.apptId && !this.clientName || this.clientName === '' || this.clientName === null) {
          this.noclientLabel = 'NO CLIENT';
          this.accountBal = 0;
        }
        // this.getClientRewardDatabyApptId(this.apptId);
        if (this.clientId) {
          this.getClientPackages(this.clientId);
        }
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
  resourceImageErrorHandler(event) {
    event.target.src = '/assets/images/user-icon.png';
  }
  /**
  * payments code starts here
  */
  getPaymentTypes() {
    this.checkOutEditTicketService.getPaymentTypesData().subscribe(data => {
      this.paymentsData = data.result.paymentResult.filter(
        filterList => filterList.Active__c === 1 && filterList.Name !== 'Prepaid Package');
      this.refPaymentId = data.result.Id;
      for (let i = 0; i < this.paymentsData.length; i++) {
        if (this.paymentsData[i].Icon_Document_Name__c !== 'undefined') {
          this.paymentsData[i].Icon_Name = this.apiEndPoint + '/' + this.paymentsData[i].Icon_Document_Name__c;
        }
        if (!this.clientId || this.clientId === '' || this.clientId === null || this.clientId === 'null') {
          if (this.paymentsData[i].Name.toLowerCase().trim() === 'account charge' || this.paymentsData[i].Name.toLowerCase().trim() === 'card on file') {
            this.paymentsData[i]['isShow'] = false;
          }
        }
        if (this.apptData && this.apptData.Token_Present__c && this.apptData.Token_Present__c === 1) {
          if (this.paymentsData[i].Name.toLowerCase().trim() === 'card on file') {
            this.paymentsData[i]['isShow'] = false;
          }
        }
        this.paymentsData[i].color = '#DDFFDD';
      }
      this.paymentsData = this.paymentsData.filter((obj) => obj.isShow !== false);
      const length = 25 - this.paymentsData.length;
      for (let i = 0; i < length; i++) {
        this.paymentsData.push({ 'Name': '', 'color': '#AAAAAA' });
      }
      if (this.apptId) {
        this.getTicketPayment(this.apptId);
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
  createYearsList() {
    const curtYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.yearList.push(curtYear + i);
    }
    this.expYear = this.yearList[0];
  }
  imageErrorHandler(name, i) {
    if (this.paymentsData && this.paymentsData.length > 0) {
      this.paymentsData[i]['Icon_Name'] = undefined;
    }
    if (this.favouritesData && this.favouritesData.length > 0) {
      this.favouritesData[i]['pic'] = undefined;
    }
    if (this.productsList && this.productsList.length > 0) {
      this.productsList[i]['pic'] = undefined;
    }
  }
  showListPayModal(list) {
    this.paymentAction = 'Update';
    this.popUpPaymentName = list.paymentTypeName;
    if (this.enterManuallyButton === false && this.enterManually === false) {
      // this.charge = list.Amount_Paid__c;
      this.showRedAmount = true;
      this.ticketPaymentId = list.Id;
      this.giftNumber = list.Gift_Number__c;
      this.amountPaid = list.Amount_Paid__c;
      this.paymentNotes = list.Notes__c;
      this.paymentsModal.show();
      this.changeBack = '';
    }
  }
  getFilterRwdsByAwardRules(clientRwdArray) {
    for (let i = 0; i < clientRwdArray.length; i++) {
      let serviceDate = new Date();
      if (this.apptData && this.apptData.apdate) {
        const tempDtStr = this.apptData.apdate.split(' ')[0].split('-');
        serviceDate = new Date(tempDtStr[0], (parseInt(tempDtStr[1], 10) - 1), tempDtStr[2]);
      }
      if (clientRwdArray[i]['stDate'] && clientRwdArray[i]['endDate']) {
        const stDtAry = clientRwdArray[i]['stDate'].split(' ')[0].split('-');
        const stDt = new Date(stDtAry[0], (parseInt(stDtAry[1], 10) - 1), stDtAry[2]);
        const endDtAry = clientRwdArray[i]['endDate'].split(' ')[0].split('-');
        const endDt = new Date(endDtAry[0], (parseInt(endDtAry[1], 10) - 1), endDtAry[2]);
        if (stDt <= serviceDate && endDt >= serviceDate) {
          clientRwdArray[i]['isInsert'] = true;
        }
      } else {
        clientRwdArray[i]['isInsert'] = true;
      }
    }
    clientRwdArray = clientRwdArray.filter((obj) => obj.isInsert);
    return clientRwdArray;
  }
  getClientPackages(clientId) {
    this.newClientService.getClientPackagesData(clientId).subscribe(
      data => {
        this.clientPackageData = data['result'];
      }, error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  showPaymentModalByCharge() {
    this.paymentsData = this.paymentsData.filter((obj) => obj.Active__c === 1 && obj.Process_Electronically_Online__c);
    this.popUpPaymentName = this.paymentsData[0].Name;
    this.selectedPaymentId = this.paymentsData[0].Id;
    this.enterManuallyButton = true;
    const temp = this.charge.toFixed(2);
    this.charge = Number(temp);
    this.paymentAction = 'Add';
    this.showRedAmount = false;
    this.changeBack = '';
    this.updateClvParms();
    if (this.cloverChk) {
      this.cloverImpl();
    } else {
      this.paymentsModal.show();
      this.autofocusSwipe();
      this.getPaymentTypes();
    }
  }
  showPaymentsModal(paymentType) {
    this.showRedAmount = false;
    this.obj = localStorage.getItem('browserObject');
    if (this.obj === null) {
      this.addCreditCardDevice = '';
    } else if (this.obj !== undefined || this.obj !== '') {
      this.obj = JSON.parse(this.obj);
      this.addCreditCardDevice = this.obj.CreditCardDevice;
    }
    this.clientPackagesCalc();
    this.clientRewardsCalc();
    if (paymentType.Name === 'Gift Redeem') {
      this.paymentAction = 'Add';
      this.showRedAmount = true;
      const temp = this.charge.toFixed(2);
      this.amountPaid = Number(temp);
      this.popUpPaymentName = paymentType.Name;
      this.selectedPaymentId = paymentType.Id;
      this.paymentsModal.show();
      this.changeBack = '';
    } else if (paymentType.Name === 'Clover') {
      this.cloverImpl();
    } else {
      const temp = this.charge.toFixed(2);
      this.charge = Number(temp);
      this.paymentAction = 'Add';
      this.showRedAmount = false;
      this.changeBack = '';
      if (paymentType.Id && paymentType.Name) {
        this.popUpPaymentName = paymentType.Name;
        this.selectedPaymentId = paymentType.Id;
        if (paymentType.Process_Electronically__c === 1) {
          this.enterManuallyButton = true;
        } else {
          this.enterManuallyButton = false;
        }
        this.paymentsModal.show();
      }
    }
    this.autofocusSwipe();
  }
  clientRewardsCalc() {
    this.clientRwdArray = [];
    let tempOtherList;
    let giftCharge = 0;
    let prodQuantity = 1;
    let tempOtherPckgList = [];
    let packagePrice = 0;
    let packSerReps = 0;
    let bookedSerPckgPrice = 0;
    let ticketSerDataLen = 0;
    let packSerPrice = 0;
    let tempOtherNonRwdsData: any = [];
    let tempOtherForRwdsData: any = [];
    let tmpLen = 0;
    let pckgSer = [];
    let nonPckgSer = [];
    if (this.ticketProductsList && this.ticketProductsList.length > 0) {
      prodQuantity = 0;
      prodQuantity += this.ticketProductsList.map((obj) => +obj.quantity).reduce(this.calculateSum);
    }
    tempOtherNonRwdsData = this.ticketOthersList.filter((obj) => (obj.Transaction_Type__c === 'Misc Sale' || obj.Transaction_Type__c ===
      'Pre Payment' || obj.Transaction_Type__c === 'Received on Account' || obj.Transaction_Type__c === 'Deposit'));
    tempOtherForRwdsData = this.ticketOthersList.filter((obj) => (obj.Transaction_Type__c === 'Package' || obj.Transaction_Type__c ===
      'Gift'));

    /**
     * comment 1
     * here the ticketservice list is getting split based on booked package services and non booked package services
     */
    if (this.isClientRewardsAllowed === 1 || this.isClientRewardsAllowed === '1') {
      if (this.TicketServiceData && this.TicketServiceData.length > 0) {
        pckgSer = this.TicketServiceData.filter((obj) => obj.Booked_Package__c && obj.Booked_Package__c !== '' && obj.Booked_Package__c !== null);
        nonPckgSer = this.TicketServiceData.filter((obj) => !obj.Booked_Package__c || obj.Booked_Package__c === '' || obj.Booked_Package__c === null);
        tmpLen = pckgSer.length;
        ticketSerDataLen = +(this.TicketServiceData.length - tmpLen);
        if (nonPckgSer && nonPckgSer.length > 0) {
          packSerPrice += nonPckgSer.map((obj) => +obj.netPrice).reduce(this.calculateSum);
        }
        const rwdServArr = this.TicketServiceData.filter((obj) => obj.reward__c && obj.reward__c !== '');
        // if ((rwdServArr && rwdServArr.length > 0) && (this.clientRwrdsData && this.clientRwrdsData.length > 0)) {
        if (rwdServArr && rwdServArr.length > 0) {
          for (let i = 0; i < rwdServArr.length; i++) {
            const temp = this.allRwdsList.filter((obj) => obj.Id === rwdServArr[i]['reward__c']);
            let tempArray = [];
            if (temp && temp.length > 0) {
              tempArray = JSON.parse(temp[0]['Redeem_Rules__c']);
            }
            for (let j = 0; j < tempArray.length; j++) {
              if ((rwdServArr[i]['Redeem_Rule_Name__c'].trim() === tempArray[j]['redeemName'].trim()) && (tempArray[j]['onOneItem'] === 'Services')) {
                const tempRdmPnts = tempArray.filter((obj) => obj.redeemName === rwdServArr[i]['Redeem_Rule_Name__c'].trim())[0]['redeemPoints'];
                for (let k = 0; k < this.serviceRewards.length; k++) {
                  if (this.serviceRewards[k]['Id'] === rwdServArr[i]['reward__c']) {
                    this.clientRwrdsData.push({
                      rwdId: temp[0]['Id'],
                      crId: this.serviceRewards[k]['crId'],
                      used: parseInt(tempRdmPnts, 10),
                      item: 'Services',
                      redeemJson: tempArray,
                      points: 0,
                      isOnlyUsed: true
                    });
                  }
                }
              }
            }
          }
        }
      }
      /**
       * comment 1 ends
       */
      if (this.ticketProductsList && this.ticketProductsList.length > 0) {
        const rwdProArr = this.ticketProductsList.filter((obj) => obj.Reward__c && obj.Reward__c !== '');
        // if ((rwdProArr && rwdProArr.length > 0) || (this.clientRwrdsData && this.clientRwrdsData.length > 0)) {
        if (rwdProArr && rwdProArr.length > 0) {
          for (let i = 0; i < rwdProArr.length; i++) {
            const temp = this.allRwdsList.filter((obj) => obj.Id === rwdProArr[i]['Reward__c']);
            const tempArray = JSON.parse(temp[0]['Redeem_Rules__c']);
            for (let j = 0; j < tempArray.length; j++) {
              if ((rwdProArr[i]['Redeem_Rule_Name__c'].trim() === tempArray[j]['redeemName'].trim()) && (tempArray[j]['onOneItem'] === 'Products')) {
                const tempRdmPnts = tempArray.filter((obj) => obj.redeemName === rwdProArr[i]['Redeem_Rule_Name__c'].trim())[0]['redeemPoints'];
                for (let k = 0; k < this.productRewards.length; k++) {
                  if (this.productRewards[k]['Id'] === rwdProArr[i]['Reward__c']) {
                    this.clientRwrdsData.push({
                      rwdId: temp[0]['Id'],
                      crId: this.productRewards[k]['crId'],
                      used: parseInt(tempRdmPnts, 10),
                      item: 'Products',
                      redeemJson: tempArray,
                      points: 0,
                      isOnlyUsed: true
                    });
                  }
                }
              }
            }
          }
        }
      }
      if (tempOtherForRwdsData && tempOtherForRwdsData.length > 0) {
        tempOtherList = this.ticketOthersList.filter((obj) => obj.Transaction_Type__c === 'Gift');
        if (tempOtherList && tempOtherList.length > 0) {
          giftCharge += tempOtherList.map((obj) => +obj.Amount__c).reduce(this.calculateSum);
        }
        tempOtherPckgList = this.ticketOthersList.filter((obj) => obj.Transaction_Type__c === 'Package');
        if (tempOtherPckgList && tempOtherPckgList.length > 0) {
          packagePrice += tempOtherPckgList.map((obj) => +obj.Package_Price__c).reduce(this.calculateSum);
          let tempPckgList;
          for (let i = 0; i < tempOtherPckgList.length; i++) {
            tempPckgList = this.packagesList.filter((obj) => obj.Id === tempOtherPckgList[i]['Package__c']);
            for (let j = 0; j < tempPckgList.length; j++) {
              const tempJson = JSON.parse(tempPckgList[j]['JSON__c']);
              packSerReps += tempJson.map((obj) => +obj.reps).reduce(this.calculateSum);
            }
          }
          packSerReps = (packSerReps + (ticketSerDataLen > 0 ? ticketSerDataLen : this.TicketServiceData.length)) - tmpLen;
        }
      } else if ((tempOtherNonRwdsData && tempOtherNonRwdsData.length > 0) && (tempOtherForRwdsData && tempOtherForRwdsData.length <= 0)) {
        // if (nonPckgSer && nonPckgSer.length > 0) {
        //   packSerPrice += nonPckgSer.map((obj) => +obj.netPrice).reduce(this.calculateSum);
        // }
      } else {
        // const nonPckgSer = this.TicketServiceData.filter((obj) => !obj.Booked_Package__c || obj.Booked_Package__c === '' || obj.Booked_Package__c === null);
        // if (nonPckgSer && nonPckgSer.length > 0) {
        //   packSerPrice += nonPckgSer.map((obj) => +obj.netPrice).reduce(this.calculateSum);
        // }
      }
      // bookedSerPckgPrice = (packagePrice + packSerPrice) - bookedSerPckgPrice;
      bookedSerPckgPrice = +(packagePrice + packSerPrice);
      if (this.TicketServiceData.length > 0 && this.ticketProductsList.length > 0 && tempOtherPckgList.length > 0) {
        this.clientRwdArray = this.clientRwrdsData;
      } else if (this.TicketServiceData.length > 0 && this.ticketProductsList.length <= 0 && tempOtherPckgList.length > 0) {
        this.clientRwdArray = this.clientRwrdsData.filter((obj) => obj.item === 'Services');
      } else if (this.TicketServiceData.length <= 0 && this.ticketProductsList.length > 0 && tempOtherPckgList.length > 0) {
        this.clientRwdArray = this.clientRwrdsData.filter((obj) => obj.item === 'Services' || obj.item === 'Products');
      } else if (this.TicketServiceData.length > 0 && this.ticketProductsList.length <= 0 && tempOtherPckgList.length <= 0) {
        this.clientRwdArray = this.clientRwrdsData.filter((obj) => obj.item === 'Services');
      } else if (this.TicketServiceData.length > 0 && this.ticketProductsList.length > 0 && tempOtherPckgList.length <= 0) {
        this.clientRwdArray = this.clientRwrdsData.filter((obj) => obj.item === 'Services' || obj.item === 'Products');
      } else if (this.TicketServiceData.length <= 0 && this.ticketProductsList.length > 0 && tempOtherPckgList.length <= 0) {
        this.clientRwdArray = this.clientRwrdsData.filter((obj) => obj.item === 'Products');
      } else if (this.TicketServiceData.length <= 0 && this.ticketProductsList.length <= 0 && tempOtherPckgList.length > 0) {
        this.clientRwdArray = this.clientRwrdsData.filter((obj) => obj.item === 'Services');
      }
      if (tempOtherList && tempOtherList.length > 0) {
        // if (this.clientRwdArray && this.clientRwdArray.length > 0) {
        const temp = this.clientRwdArray.concat(this.clientRwrdsData.filter((obj) => obj.item === 'Gifts'));
        this.clientRwdArray = temp;
        // }
      }
      const dataFilter = [];
      if (this.clientRwdArray && this.clientRwdArray.length > 0) {
        // This is 'Referred Client' will be applicable in refer client in client card, so we will ignore those values while calculate
        this.clientRwdArray = this.clientRwdArray.filter((obj) => obj.forEvery !== 'Referred Client');
        //
        for (let i = 0; i < this.clientRwdArray.length; i++) {
          if (this.clientRwdArray[i]['item'] === 'Services') {
            if (this.clientRwdArray[i]['forEvery'] === 'Amount Spent On') {
              this.clientRwdArray[i]['points'] = +(parseFloat(this.clientRwdArray[i]['points']) * (+bookedSerPckgPrice));
            } else if (this.clientRwdArray[i]['forEvery'] === 'Individual') {
              this.clientRwdArray[i]['points'] = (nonPckgSer.length) * parseFloat(this.clientRwdArray[i]['points']);
            } else if (this.clientRwdArray[i]['forEvery'] === 'Completed Ticket') {
              this.clientRwdArray[i]['points'] = parseFloat(this.clientRwdArray[i]['points']);
            }
          }
          if (this.clientRwdArray[i]['item'] === 'Products') {
            if (this.clientRwdArray[i]['forEvery'] === 'Amount Spent On') {
              this.clientRwdArray[i]['points'] = parseFloat(this.clientRwdArray[i]['points']) * (parseFloat(this.productsCharge));
            } else if (this.clientRwdArray[i]['forEvery'] === 'Individual') {
              this.clientRwdArray[i]['points'] = +prodQuantity * parseFloat(this.clientRwdArray[i]['points']);
            } else if (this.clientRwdArray[i]['forEvery'] === 'Completed Ticket') {
              this.clientRwdArray[i]['points'] = parseFloat(this.clientRwdArray[i]['points']);
            }
          }
          if (this.clientRwdArray[i]['item'] === 'Gifts') {
            this.clientRwdArray[i]['points'] = parseFloat(this.clientRwdArray[i]['points']) * (giftCharge);
          }
          // this.clientRwdArray[i]['used'] = 0;
          if (i === 0) {
            dataFilter.push(this.clientRwdArray[i]);
          } else {
            const index = dataFilter.findIndex((data) => data.rwdId === this.clientRwdArray[i]['rwdId']);
            if (index !== -1) {
              dataFilter[index]['points'] = +dataFilter[index]['points'] + this.clientRwdArray[i]['points'];
            } else {
              dataFilter.push(this.clientRwdArray[i]);
            }
          }

        }
        this.clientRwdArray = dataFilter;
        if (this.TicketServiceData && this.TicketServiceData.length > 0) {
          let redeempoints = 0;
          for (let i = 0; i < this.TicketServiceData.length; i++) {
            if (this.TicketServiceData[i].reward__c && this.TicketServiceData[i].reward__c !== '' && this.TicketServiceData[i].reward__c !== null
              && this.TicketServiceData[i].reward__c !== 'None') {
              for (let j = 0; j < this.clientRwdArray.length; j++) {
                for (let k = 0; k < this.clientRwdArray[j].redeemJson.length; k++) {
                  if ((this.TicketServiceData[i].reward__c === this.clientRwdArray[j].rwdId) &&
                    (this.clientRwdArray[j].redeemJson[k]['onOneItem'] === 'Services') &&
                    (this.clientRwdArray[j]['isOnlyUsed'] === false) &&
                    (this.TicketServiceData[i]['Redeem_Rule_Name__c'] &&
                      this.TicketServiceData[i]['Redeem_Rule_Name__c'].trim() === this.clientRwdArray[j].redeemJson[k]['redeemName'].trim())) {
                    redeempoints += this.clientRwdArray[j].redeemJson[k]['redeemPoints'];
                    // this.clientRwdArray[j]['points'] = this.clientRwdArray[j]['points'] - redeempoints;
                    this.clientRwdArray[j]['used'] += redeempoints;
                  }
                }
                redeempoints = 0;
              }
            }
          }
        }
        if (this.ticketProductsList && this.ticketProductsList.length > 0) {
          let redeempoints = 0;
          for (let i = 0; i < this.ticketProductsList.length; i++) {
            if (this.ticketProductsList[i].Reward__c && this.ticketProductsList[i].Reward__c !== '' && this.ticketProductsList[i].Reward__c !== null
              && this.ticketProductsList[i].Reward__c !== 'None') {
              for (let j = 0; j < this.clientRwdArray.length; j++) {
                for (let k = 0; k < this.clientRwdArray[j].redeemJson.length; k++) {
                  if ((this.ticketProductsList[i].Reward__c === this.clientRwdArray[j].rwdId) &&
                    (this.clientRwdArray[j]['isOnlyUsed'] === false) &&
                    (this.clientRwdArray[j].redeemJson[k]['onOneItem'] === 'Products') &&
                    (this.ticketProductsList[i]['Redeem_Rule_Name__c'].trim() === this.clientRwdArray[j].redeemJson[k]['redeemName'].trim())) {
                    redeempoints += this.clientRwdArray[j].redeemJson[k]['redeemPoints'];
                    // this.clientRwdArray[j]['points'] = this.clientRwdArray[j]['points'] - redeempoints;
                    this.clientRwdArray[j]['used'] += redeempoints;
                  }
                }
                redeempoints = 0;
              }
            }
          }
        }
        if ((this.clientRewardList && this.clientRewardList.length > 0) && (this.clientRwdArray && this.clientRwdArray.length > 0)) {
          for (let i = 0; i < this.clientRewardList.length; i++) {
            for (let j = 0; j < this.clientRwdArray.length; j++) {
              if (this.clientRewardList[i]['Id'] === this.clientRwdArray[j]['rwdId']) {
                this.clientRwdArray[j]['isNew'] = false;
              }
            }
          }
        }
        if (this.clientRwdArray && this.clientRwdArray.length > 0) {
          for (let i = 0; i < this.clientRwdArray.length; i++) {
            if (this.clientRwdArray[i]['isNew'] === undefined) {
              this.clientRwdArray[i]['isNew'] = true;
            }
          }
        }
      }
    }
  }
  clientPackagesCalc() {
    this.clientPckgArray = [];
    // if (this.TicketServiceData && this.TicketServiceData.length > 0) {
    //   const bookedtemp = this.TicketServiceData.filter((obj) => obj.Booked_Package__c && obj.Booked_Package__c !== '' && obj.Booked_Package__c !== null);
    //   const bookedPckgArr = this.commonService.removeDuplicates(bookedtemp, 'Booked_Package__c');
    //   let pckData = { JSON__c: undefined };
    //   if (bookedPckgArr && bookedPckgArr.length > 0) {
    //     for (let i = 0; i < bookedPckgArr.length; i++) {
    //       pckData = this.packagesList.filter((obj) => obj.Id === bookedPckgArr[i]['Booked_Package__c'])[0];
    //       if (pckData && pckData.JSON__c) {
    //         const tempArry = [];
    //         for (let j = 0; j < JSON.parse(pckData.JSON__c).length; j++) {
    //           const tempObj = JSON.parse(pckData.JSON__c)[j];
    //           for (let k = 0; k < bookedtemp.length; k++) {
    //             if ((bookedtemp[k].ServiceId === JSON.parse(pckData.JSON__c)[j].serviceId)) {
    //               if (tempObj['reps'] > 0) {
    //                 // tempObj['reps'] = tempObj['reps'] - 1;
    //                 tempObj['used'] = tempObj['used'] + 1;
    //               }
    //             }
    //           }
    //           tempArry.push(tempObj);
    //         }
    //         pckData.JSON__c = JSON.stringify(tempArry);
    //         this.clientPckgArray.push({
    //           'pckgId': bookedPckgArr[i].Booked_Package__c,
    //           'clientId': this.clientId,
    //           'apptId': this.apptId,
    //           'pckgDetails': pckData.JSON__c,
    //           'isDependedPackage': true
    //         });
    //       }
    //     }
    //   }
    // } else {
      if ((this.ticketOthersList && this.ticketOthersList.length > 0) && (this.clientId)) {
        for (let i = 0; i < this.ticketOthersList.length; i++) {
          for (let j = 0; j < this.packagesList.length; j++) {
            if (this.ticketOthersList[i]['Package__c'] === this.packagesList[j]['Id']) {
              const tempPkgListJSON = JSON.parse(this.packagesList[j].JSON__c);
              this.clientPckgArray.push({
                'pckgId': this.packagesList[j]['Id'],
                'clientId': this.clientId,
                'apptId': this.apptId,
                'pckgDetails': tempPkgListJSON,
                'isDependedPackage': false,
              });
            }
          }
        }
      }
      this.clientPckgArray = this.commonService.removeDuplicates(this.clientPckgArray, 'pckgId');
    // }

  }
  calculateChangeback() {
    if (this.showRedAmount === false) {
      if (this.charge > this.balanceDuePopUp) {
        this.changeBack = this.charge - this.balanceDuePopUp;
      } else {
        this.changeBack = '';
      }
    } else if (this.showRedAmount === true) {
      if (this.amountPaid > this.balanceDue) {
        this.changeBack = this.amountPaid - this.balanceDue;
      } else {
        this.changeBack = '';
      }
    }
  }
  getWorkerMerchants() {
    this.checkOutEditTicketService.getWorkerMerchantsData()
      .subscribe(data => {
        this.merchantWorkerList.push({
          Payment_Gateway__c: 'AnywhereCommerce', FirstName: 'STX',
          LastName: 'QA 2017', Id: 'default_stx'
        });
        if (data['result'] && data['result'].length > 0) {
          this.merchantWorkerList = this.merchantWorkerList.concat(data['result']);
        }
        // for default values
        this.paymentGateWay = this.merchantWorkerList[0]['Payment_Gateway__c'];
        this.merchantAccntName = this.merchantWorkerList[0]['FirstName'] + ' ' + this.merchantWorkerList[0]['LastName'];
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
  showManualOptions() {
    this.enterManually = true;
  }
  /**
   * need to ask client for payment url
   */
  proceedToPayment(param) {
    if (param) {
      let paymentData;
      const d = new Date();
      const dateTime = ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2) + '-' +
        (d.getFullYear() + '').slice(-2) + ':' +
        ('00' + d.getHours()).slice(-2) + ':' +
        ('00' + d.getMinutes()).slice(-2) + ':' +
        ('00' + d.getSeconds()).slice(-2) + ':000';
      // calculate the MD5 hash format - TERMINALID+MERCHANTREF+DATETIME+CARDNUMBER+CARDEXPIRY+CARDTYPE+CARDHOLDERNAME+secret
      const hash = Md5.hashStr(config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID + this.refPaymentId + this.charge + dateTime + config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_KEY);
      const clientData = {
        ticketPaymntId: this.refPaymentId,
        terminalid: config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID,
        dateTime: dateTime,
        cardNum: this.cardNumber,
        cardType: this.commonService.getCardType(this.cardNumber),
        currency: 'USD',
        terminalType: '1',
        transactionType: '4',
        hash: hash,
        amountDue: this.charge,
        cardExp: ('0' + this.expMonth).slice(-2) + this.expYear.toString().slice(-2)
      };
      const tokenbody = this.commonService.createPaymentToken(clientData);
      const url = 'https://testpayments.anywherecommerce.com/merchant/xmlpayment';
      if ((this.expYear <= d.getFullYear()) && ((this.expMonth < d.getMonth() + 1))) {
        this.error = 'Invalid Expiry Date.';
      } else {
        const reqObj = {
          'url': url,
          'xml': tokenbody
        };
        this.checkOutEditTicketService.xmlPayment(reqObj).subscribe(
          data => {
            const parseString = require('xml2js').parseString;
            parseString(data['result'], function (err, result) {
              paymentData = result;
            });
            if (paymentData && paymentData.PAYMENTRESPONSE) {
              this.savePaymentsData(paymentData);
            } else {
              this.error = 'Error Occured, Invalid Details';
            }
            this.swipePwd = '';
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
            this.swipePwd = '';
          });
      }
    } else {
      const paymentData = null;
      this.savePaymentsData(paymentData);
    }
  }
  savePaymentsData(paymentData) {
    const priceVal: number = (this.giftNumber && this.showRedAmount) ? this.amountPaid : this.charge;
    if (priceVal < 0) {
      this.error = 'Amount: Only zero or a positive number is allowed';
    } else if (this.popUpPaymentName === 'Gift Redeem' && (this.giftNumber === '' || this.giftNumber === undefined)) {
      this.error = 'Gift number is required';
    } else {
      let approvalCode = '';
      let refCode = '';
      if (paymentData === null) {
        approvalCode = '';
        refCode = '';
      } else {
        approvalCode = paymentData.PAYMENTRESPONSE.APPROVALCODE[0];
        refCode = paymentData.PAYMENTRESPONSE.UNIQUEREF[0];
      }
      if (this.paymentAction === 'Add') {
        let apptStatus;
        if (this.charge >= this.listCharge) {
          apptStatus = 'Complete';
        } else {
          apptStatus = 'Checked In';
        }
        const paymentObj = {
          'Id': this.refPaymentId,
          'amountToPay': ((this.giftNumber && this.showRedAmount) ? this.amountPaid : this.charge) + this.cloverTip,
          'apptId': this.apptId,
          'merchantAccnt': this.merchantAccntName,
          'paymentGateWay': this.paymentGateWay,
          'notes': this.paymentNotes,
          'paymentType': this.selectedPaymentId,
          'cardHolderName': this.clientName,
          'cardNumber': this.cardNumber,
          'zipCode': this.zipCode,
          'expMonth': this.expMonth,
          'expYear': this.expYear,
          'cvv': this.cvv,
          'approvalCode': approvalCode,
          'refCode': refCode,
          'paymentName': this.popUpPaymentName,
          'giftNumber': this.giftNumber,
          'status': apptStatus,
          'serviceAmount': this.servicesCharge,
          'productAmount': this.productsCharge,
          'otherCharge': this.othersCharge,
          'productsTax': this.prodTax,
          'servicesTax': this.serTax,
          'tipsCharge': this.tipsCharge,
          'listCharge': this.listCharge,
          'clientId': this.clientId,
          'clientPckgData': this.clientPckgArray,
          'clientRwdData': this.clientRwdArray,
          'clientRwrdIds': this.clientRewardIds,
          'ticketProductsList': this.ticketProductsList,
          'ticketOthersList': this.ticketOthersList,
          'Online__c': 0,
          'cashDrawer': this.cashDrawer
        };
        this.checkOutEditTicketService.addToPaymentsTicket(paymentObj)
          .subscribe(data1 => {
            const dataObj = data1['result'];
            this.calCharge();
            this.getTicketPayment(this.apptId);
            this.paymentsModal.hide();
            this.getPaymentTypes();
            this.error = '';
            this.zipCode = '';
            this.cardNumber = '';
            this.cvv = '';
            this.expMonth = 1;
            this.expYear = 0;
            this.enterManuallyButton = false;
            this.paymentGateWay = '';
            this.merchantAccntName = '';
            this.checkOutEditTicketService.getTicketPaymentData(this.apptId)
              .subscribe(data => {
                this.ticketPaymentList = data['result'].paymentList;
                this.calCharge();
                this.giftNumber = '';
                this.listCharge = Math.floor(this.listCharge);
                this.enterManually = false;
                this.enterManuallyButton = false;
                if (this.listCharge <= 0) {
                  this.router.navigate(['/completedticketdetailsview/' + this.apptId]);
                }
              }, error => { });
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
                  } else if (statuscode === '2081' || statuscode === '2071') {
                    this.error = 'Gift Number for redemption could not be found';
                  } else if (statuscode === '2086') {
                    this.error = 'Gift Redeem code has expired';
                  } else if (statuscode === '2087') {
                    this.error = 'Gift Number has no remaining balance';
                  } break;
              }
            });
      } else if (this.paymentAction === 'Update') {
        const paymentObj = {
          'amountToPay': this.amountPaid,
          'apptId': this.apptId,
          'notes': this.paymentNotes,
          'paymentName': this.popUpPaymentName,
          'giftNumber': this.giftNumber ? this.giftNumber : null
        };
        this.checkOutEditTicketService.updateTicketPayment(this.ticketPaymentId, paymentObj)
          .subscribe(data1 => {
            const dataObj = data1['result'];
            this.paymentsModal.hide();
            this.getTicketPayment(this.apptId);
            this.calCharge();
            this.error = '';
            this.paymentNotes = '';
            this.zipCode = '';
            this.cardNumber = '';
            this.cvv = '';
            this.expMonth = 1;
            this.expYear = 0;
            this.enterManuallyButton = false;
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
                  } else if (statuscode === '2081') {
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
      this.getPaymentTypes();
    }
  }
  deleteTicketPayment() {
    this.checkOutEditTicketService.deleteTicketPayment(this.ticketPaymentId)
      .subscribe(data => {
        this.getTicketPayment(this.apptId);
        this.commonCancelModal();
        this.calCharge();
        this.getPaymentTypes();
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
    this.productModal.hide();
  }
  merchantOnChange(value) {
    const temp = this.merchantWorkerList.filter((obj) => obj.Id === value)[0];
    this.merchantAccntName = temp.FirstName + ' ' + temp.LastName;
    this.paymentGateWay = temp.Payment_Gateway__c;
  }
  getTicketPayment(apptId) {
    this.checkOutEditTicketService.getTicketPaymentData(this.apptId)
      .subscribe(data => {
        this.ticketPaymentList = data['result'].paymentList;
        // this.router.navigate(['/checkout/' + apptId]);
        this.calCharge();
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
  /**
   * payments code ends here
   */
  /**
   * Ticket Service methods starts
   */
  getTicketServices(apptid) {
    this.checkOutEditTicketService.getTicketServicesByApptId(apptid).subscribe(data => {
      this.TicketServiceData = data['result'].ticetServices;
      this.calServRetTax();
      this.calCharge();
      if (this.TicketServiceData && this.TicketServiceData.length > 0) {
        this.updateServiceWorkerId = this.TicketServiceData[0]['workerId'];
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
  // Method for service groups
  getServiceGroups() {
    this.checkOutEditTicketService.getServiceGroups('Service').subscribe(data => {
      this.serviceGroupList = data['result']
        .filter(filterList => filterList.active && !filterList.isSystem);
      this.ServiceGroupName = this.serviceGroupList[0].serviceGroupName;
      this.getServicesData();
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
  serviceGroupOnChange(value) {
    if (this.activeTab[1]) {
      this.servicesData = [];
      this.servicesData = this.servicesList.filter(filterList => filterList.Service_Group__c === value);
      for (let i = 0; i < this.servicesData.length; i++) {
        for (let j = 0; j < this.serviceGroupList.length; j++) {
          if (this.servicesData[i].Service_Group__c === this.serviceGroupList[j].serviceGroupName) {
            this.servicesData[i]['Service_Group_Color__c'] = this.serviceGroupList[j].serviceGroupColor;
          }
        }
      }
      if (this.servicesData && this.servicesData.length <= 25) {
        const length = 25 - this.servicesData.length;
        for (let i = 0; i < length; i++) {
          this.servicesData.push({ 'name': '', 'Service_Group_Color__c': '' });
        }
      }
    }
  }
  promotionOnChange(value, discountType, ticketType) {
    switch (ticketType) {
      case 'service': {
        if (discountType === 'promotion') {
          this.servicesArray[0].promotionId = value.split('$')[2];
          this.servicesArray[0].rewardId = '';
          if (parseInt(value.split('$')[0], 10) && parseInt(value.split('$')[0], 10) > 0) {
            this.servicesArray[0].Net_Price__c = parseInt(this.refPrice, 10) - parseInt(this.refPrice, 10) * parseInt(value.split('$')[0], 10) / 100;
          } else if (parseInt(value.split('$')[1], 10) && parseInt(value.split('$')[1], 10) > 0) {
            if (parseInt(this.refPrice, 10) < parseInt(value.split('$')[1], 10)) {
              this.servicesArray[0].Net_Price__c = 0.00;
              this.price = 0.00;
            } else {
              this.servicesArray[0].Net_Price__c = parseInt(this.refPrice, 10) - parseInt(value.split('$')[1], 10);
            }
          } else if (value === '') {
            this.servicesArray[0].Net_Price__c = this.refPrice;
          }
          this.price = this.servicesArray[0].Net_Price__c;
          if (this.workerId === '') {
            this.price = 0.00;
          }
          if (value === 'None') {
            this.servicesArray[0].Net_Price__c = this.refPrice;
            this.price = this.refPrice;
            this.servicesArray[0].promotionId = '';
            this.servicesArray[0].rewardId = '';
            this.promotionId = 'None';
            this.rewardId = 'None';
          }
        } else if (discountType === 'reward') {
          if (value && value !== 'None') {
            this.redeemName = value.split('$')[1].split(':')[1].trim();
          }
          this.servicesArray[0].Net_Price__c = 0;
          const tempJson = this.finalRewardsList.filter((obj) => obj.Name === value.split('$')[1]);
          if (tempJson && tempJson.length > 0 && tempJson[0].discountType === 'Percent' && tempJson[0].onOneItem === 'Services') {
            this.servicesArray[0].Net_Price__c = parseFloat(this.refPrice) - (parseFloat(this.refPrice) * (parseFloat(tempJson[0].discount) / 100));
          } else if (tempJson && tempJson.length > 0 && tempJson[0].discountType === 'Amount' && tempJson[0].onOneItem === 'Services') {
            this.servicesArray[0].Net_Price__c = parseFloat(this.refPrice) - parseFloat(tempJson[0].discount);
          } else {
            this.servicesArray[0].Net_Price__c = 0;
          }
          this.servicesArray[0].rewardId = value.split('$')[0];
          this.servicesArray[0].promotionId = '';
          if (this.servicesArray[0].Net_Price__c <= 0) {
            this.servicesArray[0].Net_Price__c = 0;
          }
          this.price = this.servicesArray[0].Net_Price__c.toFixed(2);
          if (this.workerId === '') {
            this.price = 0.00;
          }
          if (value === 'None') {
            this.servicesArray[0].Net_Price__c = this.refPrice;
            this.price = this.refPrice;
            this.servicesArray[0].promotionId = '';
            this.servicesArray[0].rewardId = '';
            this.promotionId = 'None';
            this.rewardId = 'None';
          }
        }
      } break;
      case 'product': {
        this.promotionId = '';
        this.rewardId = '';
        if (discountType === 'promotion') {
          this.promotionId = value;
          this.rewardId = 'None';
          let proPrice: any;
          proPrice = parseFloat(this.productPrice).toFixed(2);
          if (parseInt(this.proRefPrice, 10) < parseInt(value.split('$')[1], 10)) {
            proPrice = 0.00;
          } else if (parseInt(value.split('$')[0], 10) && parseInt(value.split('$')[0], 10) > 0) {
            proPrice = parseInt(this.proRefPrice, 10) - parseInt(this.proRefPrice, 10) * parseInt(value.split('$')[0], 10) / 100;
            proPrice = parseFloat(proPrice).toFixed(2);
          } else if (parseInt(value.split('$')[1], 10) && parseInt(value.split('$')[1], 10) > 0) {
            proPrice = parseInt(this.proRefPrice, 10) - parseInt(value.split('$')[1], 10);
            proPrice = parseFloat(proPrice).toFixed(2);
          } else if (value === '') {
            proPrice = this.productPrice.toFixed(2);
          }
          if (this.productWorkerId) {
            this.productProRePrice = proPrice;
          } else {
            this.productProRePrice = 0.00;
          }
          if (value === 'None') {
            this.promotionId = 'None';
            this.rewardId = 'None';
            this.productProRePrice = parseFloat(this.productPrice).toFixed(2);
          }
        } else if (discountType === 'reward') {
          this.promotionId = 'None';
          const tempJson = this.productRewards.filter((obj) => obj.Name === value);
          if (tempJson && tempJson.length > 0 && value !== 'None') {
            this.redeemName = value.split(':')[1].trim();
            this.rewardName = tempJson[0].Name;
            this.rewardId = tempJson[0].Id;
          } else {
            this.rewardName = 'None';
            this.rewardId = 'None';
          }
          let proPrice: any;
          if (tempJson && tempJson.length > 0 && tempJson[0].discountType === 'Percent' && tempJson[0].onOneItem === 'Products') {
            proPrice = parseInt(this.proRefPrice, 10) - parseInt(this.proRefPrice, 10) * parseInt(tempJson[0].discount, 10) / 100;
            proPrice = parseFloat(proPrice).toFixed(2);
          } else if (tempJson && tempJson.length > 0 && tempJson[0].discountType === 'Amount' && tempJson[0].onOneItem === 'Products') {
            proPrice = parseInt(this.proRefPrice, 10) - parseInt(tempJson[0].discount, 10);
            proPrice = parseFloat(proPrice).toFixed(2);
          } else {
            proPrice = this.proRefPrice;
          }
          if (this.productWorkerId) {
            this.productProRePrice = proPrice;
          } else {
            this.productProRePrice = 0.00;
          }
          if (!this.rewardId || this.rewardId === '' || this.rewardId === 'None') {
            this.promotionId = 'None';
            this.rewardId = 'None';
            this.productProRePrice = this.productPrice;
          }
        }
      }
        break;
    }

  }
  servicePriceOnClick() {
    this.servicesArray[0].Net_Price__c = this.price;
  }
  getServicesData() {
    this.checkOutEditTicketService.getServices()
      .subscribe(data => {
        if (this.apptId) {
          this.getApptDetails(this.apptId);
          this.getTicketServices(this.apptId);
          this.getTicketProducts(this.apptId);
          this.getTicketPayment(this.apptId);
        }
        this.noclientLabel = 'NO CLIENT';
        this.servicesList = data['result'];
        this.servicesData = this.servicesList.filter(filterList => filterList.Service_Group__c === this.ServiceGroupName);
        for (let i = 0; i < this.servicesData.length; i++) {
          for (let j = 0; j < this.serviceGroupList.length; j++) {
            if (this.servicesData[i].Service_Group__c === this.serviceGroupList[j].serviceGroupName) {
              this.servicesData[i]['Service_Group_Color__c'] = this.serviceGroupList[j].serviceGroupColor;
            }
            const tempData: any = this.servicesList.filter((obj) => obj.Service_Group__c === this.serviceGroupList[j].serviceGroupName);
            if (tempData && tempData.length > 0) {
              this.serviceGroupList[j]['isShow'] = true;
            }
          }
        }
        if (this.serviceGroupList && this.serviceGroupList.length > 0) {
          this.serviceGroupList = this.serviceGroupList.filter((obj) => obj.isShow && obj.isShow === true);
        }
        if (this.servicesData && this.servicesData.length <= 25) {
          const length = 25 - this.servicesData.length;
          for (let i = 0; i < length; i++) {
            this.servicesData.push({ 'name': '', 'Service_Group_Color__c': '' });
          }
        }
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
  workerOnChange(value, ticketType: string) {
    switch (ticketType) {
      case 'service': {
        if (this.isBookedPackage !== true) {
          const price = value.split('$')[0];
          this.price = parseFloat(price).toFixed(2);
          this.refPrice = this.price;
          this.servicesArray[0].Price__c = value.split('$')[0];
          this.servicesArray[0].workerId = value;
          this.servicesArray[0].Net_Price__c = this.price;
          if (this.apptData) {
            this.servicesArray[0].Client__c = this.apptData.clientId;
            this.servicesArray[0].Client_Type__c = this.apptData.visttype;
            this.servicesArray[0].Appt_Ticket__c = this.apptId;
            this.servicesArray[0].Appt_Date_Time__c = this.apptData.apdate;
          }
        } else {
          this.servicesArray[0].Price__c = this.price;
          this.servicesArray[0].workerId = value;
          this.servicesArray[0].Net_Price__c = this.price;

        }
      }
        break;
      case 'product': {
        this.productProRePrice = this.productPrice;
        this.productWorkerId = value;
      }
        break;
    }
    this.promotionId = 'None';
    this.rewardId = 'None';
  }

  showServiceListModal(listData) {
    this.isBookedPackage = false;
    if ((this.serviceRewards && this.serviceRewards.length > 0) && listData.reward__c) {
      const temprwd = this.serviceRewards.filter((obj) => obj.Id === listData.reward__c);
      if (temprwd.length > 0) {
        this.rewardId = listData.reward__c + '$' + temprwd[0]['Name'].split(':')[0] + ': ' + listData.Redeem_Rule_Name__c;
      }
    }
    this.servicesArray = [];
    this.serviceAction = 'Update';
    this.serviceModal.show();
    this.setAmountWithoutCurrentTicket('service', listData.Net_Price__c, listData.Service_Tax__c);
    if (listData.Booked_Package__c && listData.Booked_Package__c !== '' && listData.Booked_Package__c !== null) {
      if (this.ticketPaymentList && this.ticketPaymentList.length > 0) {
        const tempList = this.ticketPaymentList.filter((obj) => obj.paymentTypeName = 'Prepaid Package');
        if (tempList && tempList.length > 0) {
          this.ticketPaymentId = tempList[0]['Payment_Type__c'];
          this.prePaidPckgPmntId = tempList[0]['Id'];
          this.prePaidPckgAmt = tempList[0]['Amount_Paid__c'];
        }
      }
      this.popUpServiceName = listData.ServiceName;
      this.bookedPackage = listData.Booked_Package__c;
      this.bookedpackageSerPrice = listData.Net_Price__c;
      this.isBookedPackage = true;
    } else {
      this.popUpServiceName = listData.ServiceName;
    }
    this.updateTicketSerivceId = listData.TicketServiceId;
    this.serviceId = listData.ServiceId;
    this.workerId = listData.Net_Price__c + '$' + listData.workerId;
    this.price = listData.netPrice.toFixed(2);
    this.refPrice = listData.Price__c;
    this.promotionId = listData.Promotion__c;
    this.notes = listData.Notes__c;
    if (this.promotionId === '' || this.promotionId === 'null' || this.promotionId === null) {
      this.promotionId = 'None';
    }
    if (this.rewardId === '' || this.promotionId === 'null' || this.promotionId === null) {
      this.rewardId = 'None';
    }
    this.servicesArray.push({
      'workerId': listData.Price__c + '$' + listData.workerId,
      'price': listData.netPrice,
      'promotionId': listData.Promotion__c,
      'rewardId': listData.reward__c,
      'notes': listData.Notes__c,
      'Taxable__c': listData.Taxable__c,
      'Service_Tax__c': listData.Service_Tax__c
    });
    this.servicesArray[0]['pckgObj'] = this.getPrepaidPackage(this.servicesArray[0]['id']);
    this.checkOutEditTicketService.isWorkerAssociated(listData.ServiceId)
      .subscribe(data => {
        this.workerList = data['result'];
        for (let i = 0; i < this.workerList.length; i++) {
          if (listData.workerId === this.workerList[i].Id) {
            this.workerId = this.workerList[i].Price + '$' + this.workerList[i].Id;
          }
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
    this.workerId = listData.Price__c + '$' + listData.workerId;
    if (this.servicePromotionsList && this.servicePromotionsList.length > 0) {
      for (let i = 0; i < this.servicePromotionsList.length; i++) {
        if (listData.Promotion__c === this.servicePromotionsList[i].Id) {
          this.promotionId = this.servicePromotionsList[i].discountPers + '$' + this.servicePromotionsList[i].discountAmount + '$' + this.servicePromotionsList[i].Id;
        }
      }
    }
  }
  getPrepaidPackage(serviceId) {
    let discountedPackage = 0;
    let discountedPackageTotal = 0;
    let sumOfDiscountedPrice = 0;
    const ticketServiceData = [];
    const pckArray = [];
    let packObj: any = { pckArray: [], discountedPackageTotal: 0, ticketServiceData: [], isOnlyClientPackage: 1, isclientPackage: 0 };
    let taxPer = 1;
    // const filteredPackage = this.ticketOthersList.filter((obj) => obj.Package__c === this.packageId);
    if (this.ticketOthersList && this.ticketOthersList.length > 0) {
      for (let i = 0; i < this.packagesList.length; i++) {
        const tempSerData = this.TicketServiceData.filter((obj) => obj['ServiceId'] === serviceId);
        const temp = this.ticketOthersList.filter((obj) => obj.Package__c === this.packagesList[i]['Id']);
        if (temp && temp.length > 0) {
          const filteredPackage = this.packagesList.filter((obj) => obj.Id === temp[0]['Package__c']);
          taxPer = parseInt(filteredPackage[0]['Tax_Percent__c'], 10);
          if (filteredPackage && filteredPackage.length > 0) {
            discountedPackage += parseFloat(filteredPackage[0].Discounted_Package__c);
            discountedPackageTotal += parseFloat(filteredPackage[0].Discounted_Package__c);
            for (let j = 0; j < JSON.parse(filteredPackage[0].JSON__c).length; j++) {
              sumOfDiscountedPrice += parseFloat(JSON.parse(filteredPackage[0].JSON__c)[j].discountPriceEach);
              const reps = JSON.parse(filteredPackage[0].JSON__c)[j]['reps'];
              if ((serviceId === JSON.parse(filteredPackage[0].JSON__c)[j]['serviceId']) && (reps > tempSerData.length)) {
                this.isBookedPackage = true;
                const isTaxable = JSON.parse(filteredPackage[0].JSON__c)[j].taxable;
                const price = JSON.parse(filteredPackage[0].JSON__c)[j]['discountPriceEach'];
                this.price = price;
                let taxPrice = 0;
                if (isTaxable === 1 || isTaxable === '1' || isTaxable === true) {
                  taxPrice = price * (this.serviceTax / 100);
                } else {
                  taxPrice = 0;
                }
                this.popUpServiceName = this.popUpServiceName;
                ticketServiceData.push({
                  'pckId': filteredPackage[0]['Id'],
                  'serviceId': serviceId,
                  'netPrice': price,
                  'serTax': taxPrice
                });
                pckArray.push({
                  'pckId': filteredPackage[0]['Id'],
                  'sumOfDiscountedPrice': discountedPackage + filteredPackage[0]['Tax__c'],
                  'discountedPackage': discountedPackage,
                  'pckgtax': filteredPackage[0]['Tax__c']
                });
              }
            }
            sumOfDiscountedPrice = 0;
            discountedPackage = 0;
          }
        }
      }
      packObj = {
        'pckArray': this.commonService.removeDuplicates(pckArray, 'pckId'),
        'discountedPackageTotal': discountedPackageTotal,
        // 'discountedPackage': discountedPackage
        'ticketServiceData': ticketServiceData,
        'isOnlyClientPackage': 1
      };
    }
    if (packObj && packObj.pckArray && packObj.pckArray.length <= 0) {
      const data = this.clientPackageData['ClientPackageData'];
      if (data && data.length > 0) {
        Loop1:
        for (let i = 0; i < data.length; i++) {
          const packageServices = JSON.parse(data[i]['Package_Details__c']);
          const selectedPackageService = packageServices.filter((service) => service.serviceId === serviceId && +service.used < +service.reps);
          if (selectedPackageService.length > 0) {
            this.isBookedPackage = true;
            this.price = selectedPackageService[0]['discountPriceEach'];
            packObj = {
              // 'pckArray': [data[i]],
              // 'packageId': data[i]['Package__c'],
              // // 'discountedPackage': discountedPackage
              // 'serviceId': selectedPackageService[0]['serviceId'],
              'isclientPackage': 1,
              // 'clientId': this.clientId,
              // 'discountedPrice': selectedPackageService[0]['discountPriceEach'],
              // 'serviceTax': this.price * (this.serviceTax / 100)
            };

            break Loop1;
          }
        }
      }

    }
    return packObj;
  }
  addToTicketService() {
    if (this.promotionId === 'None') {
      this.promotionId = '';
    }
    if (this.rewardId === 'None' || this.rewardId === 'null') {
      this.rewardId = '';
    }
    this.servicesArray[0].Notes__c = this.notes;
    this.servicesArray[0].isNoService__c = 0;
    this.servicesArray[0].Net_Price__c = this.price;
    this.servicesArray[0].redeemName = this.redeemName;
    this.servicesArray[0]['Appt_Ticket__c'] = this.apptId;
    this.servicesArray[0]['Appt_Date_Time__c'] = this.commonService.getDBDatTmStr(new Date());
    if (this.servicesArray[0].Taxable__c && this.servicesArray[0].Taxable__c === 1) {
      this.servicesArray[0].Service_Tax__c = this.servicesArray[0].Net_Price__c * (this.serviceTax / 100);
    }
    if (this.serviceAction === 'Add') {
      this.setAmountDetails();
      this.apptAmountDetails.ServiceAmount += +this.servicesArray[0].Net_Price__c;
      this.apptAmountDetails.ServiceTaxAmount += this.servicesArray[0].Service_Tax__c;
      const type = this.action;
      if (this.servicesArray[0].workerId === '' || this.servicesArray[0].workerId === null ||
        this.servicesArray[0].workerId === 'null') {
        this.serviceError = 'Worker is required';
      } else {
        let serviceObj = this.servicesArray[0];
        serviceObj = Object.assign(serviceObj, this.apptAmountDetails);
        const serviceArray = [];
        serviceArray.push(serviceObj);
        this.checkOutEditTicketService.addToTicketService(serviceArray, type)
          .subscribe(data => {
            const ticketAddStatus = data['result'];
            this.getTicketPayment(this.apptId);
            this.getOthersTicketDetails();
            if (ticketAddStatus && ticketAddStatus.apptId) {
              this.router.navigate(['/checkout/' + ticketAddStatus.apptId]);
            }
            this.popUpServiceName = '';
            this.getTicketServices(this.apptId);
            this.getTicketProducts(this.apptId);
            this.getClientPackages(this.clientId);
            // this.getTicketPayment(this.apptId);
            this.commonCancelModal();
            this.price = 0.00;
            this.notes = '';
            this.workerId = '';
            this.promotionId = 'None';
            this.rewardId = 'None';
            this.servicesArray = [];
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
    } else {
      if (this.servicesArray[0].workerId === '' || this.servicesArray[0].workerId === null ||
        this.servicesArray[0].workerId === 'null') {
        this.serviceError = 'Worker is required';
      } else {
        const serviceData = [];
        this.apptAmountDetails.ServiceAmount = this.apptAmountDetails.deleteServiceAmount + +this.servicesArray[0].Net_Price__c;
        this.apptAmountDetails.ServiceTaxAmount = this.apptAmountDetails.deleteServiceTaxAmount + +this.servicesArray[0].Service_Tax__c;
        serviceData.push(Object.assign({}, this.servicesArray[0], this.apptAmountDetails));
        const updateServicesObj = {
          'updateServiceData': serviceData
        };
        this.checkOutEditTicketService.updateServicesListTicket(this.updateTicketSerivceId, updateServicesObj).subscribe(data => {
          const updateServicesList = data['result'];
          this.serviceModal.hide();
          this.getTicketServices(this.apptId);
          this.price = 0;
          this.workerId = '';
          this.notes = '';
          this.rewardId = 'None';
          this.promotionId = 'None';
          this.servicesArray = [];
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
    }
  }
  addValues(serviceData: any) {
    if (serviceData.Id) {
      const priceLevels = JSON.parse(serviceData.pricelevels);
    }
  }
  removeTicketSerices() {
    this.apptAmountDetails.ServiceAmount = this.apptAmountDetails.deleteServiceAmount;
    this.apptAmountDetails.ServiceTaxAmount = this.apptAmountDetails.deleteServiceTaxAmount;
    const amountdetails = Object.assign({}, this.apptAmountDetails, {
      'Appt_Ticket__c': this.apptId,
      'bookedPackage': this.bookedPackage, 'price': this.bookedpackageSerPrice, 'ticketPaymentId': this.ticketPaymentId,
      'apptId': this.apptId,
      'listLength': this.TicketServiceData.filter((obj) => obj.Booked_Package__c && obj.Booked_Package__c !== '').length,
      'prePaidPckgPmntId': this.prePaidPckgPmntId,
      'serviceId': this.serviceId,
      'clientId': this.clientId
    });
    this.checkOutEditTicketService.removeTicketSerices(this.updateTicketSerivceId, amountdetails)
      .subscribe(data => {
        const removeTicketServicesList = data['result'];
        this.ticketPaymentId = undefined;
        this.getTicketServices(this.apptId);
        this.getTicketPayment(this.apptId);
        this.commonCancelModal();
        this.calServRetTax();
        this.calCharge();
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
    this.productModal.hide();
  }
  /**
   * Ticket Service methods ends
   */
  /**
   * Favourites modal starts
   */
  getFavouritesData() {
    this.checkOutEditTicketService.getFavourites()
      .subscribe(data => {
        const dataObj = data['result'];
        this.favouritesData = this.commonService.removeDuplicates(dataObj, 'name');
        this.favouritesData = this.favouritesData.filter((obj) => obj.id !== '');
        for (let i = 0; i < this.favouritesData.length; i++) {
          if (this.favouritesData[i].type === 'Product' &&
            this.favouritesData[i].Product_Pic__c !== '' && this.favouritesData[i].Product_Pic__c !== null && this.favouritesData[i].Product_Pic__c !== undefined) {
            this.favouritesData[i].pic = this.apiEndPoint + '/' + this.favouritesData[i].Product_Pic__c;
          }
          if (!this.favouritesData[i].id || this.favouritesData[i].id === '') {
            this.favouritesData[i]['color'] = '';
          }
        }
        const length = 25 - this.favouritesData.length;
        for (let i = 0; i < length; i++) {
          this.favouritesData.push({ 'name': '', 'color': '' });
        }
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
  showFavoriteModal(favoriteslist, i, type) {
    if (!favoriteslist.id) {
      favoriteslist.id = favoriteslist.Id;
    } if (!favoriteslist.price) {
      favoriteslist.price = favoriteslist.Price__c;
    }
    if (!favoriteslist.name) {
      favoriteslist.name = favoriteslist.Name;
    }
    this.productId = favoriteslist.id;
    this.servicesArray = [];
    this.productWorkerId = '';
    if (type === 'Product') {
      this.productAction = 'Add';
      this.productQuantity = 1;
      // this.promotionId = '';
      this.popupProductName = favoriteslist.name;
      if (favoriteslist.price) {
        this.productProRePrice = favoriteslist.price.toFixed(2);
      }
      this.productPrice = this.productProRePrice;
      this.productCost = this.productPrice;
      this.proRefPrice = this.productPrice;
      this.productTaxable = favoriteslist.Taxable__c;
      this.tabType = 'favourites';
      let showPopup = true;
      if (this.ticketProductsList && this.ticketProductsList.length > 0) {
        for (let j = 0; j < this.ticketProductsList.length; j++) {
          if (favoriteslist.id === this.ticketProductsList[j].Product__c) {
            this.productWorkerId = 'No Worker';
            this.addToTicketProduct();
            this.productWorkerId = '';
            showPopup = false;
          }
        }
      }
      if (showPopup !== false && favoriteslist.id) {
        this.productModal.show();
      }
    } else if (type === 'Service') {
      this.popUpServiceName = favoriteslist.name;
      // this.getPrepaidPackage(favoriteslist.id);
      this.servicesArray = [];
      this.price = parseFloat(this.price).toFixed(2);
      this.serviceAction = 'Add';
      this.servicesArray.push(favoriteslist);
      if (favoriteslist.price) {
        this.servicesArray[0].Price__c = favoriteslist.price;
        this.servicesArray[0].Net_Price__c = favoriteslist.price;
      } else {
        this.servicesArray[0].Price__c = 0;
        this.servicesArray[0].Net_Price__c = 0;
      } if (this.apptData && this.apptData.workerId) {
        this.servicesArray[0].workerId = this.apptData.workerId;
      } else {
        this.servicesArray[0].workerId = '';
      }
      if (this.apptData && this.apptData.clientId) {
        this.servicesArray[0].Client__c = this.apptData.clientId;
      } else {
        this.servicesArray[0].Client__c = '';
      }
      if (this.apptData && this.apptData.visttype) {
        this.servicesArray[0].Client_Type__c = this.apptData.visttype;
      } else {
        this.servicesArray[0].Client_Type__c = '';
      }
      if (this.apptData && this.apptId) {
        this.servicesArray[0].Appt_Ticket__c = this.apptId;
      } else {
        this.servicesArray[0].Appt_Ticket__c = '';
      }
      if (this.apptData && this.apptData.apdate) {
        this.servicesArray[0].Appt_Date_Time__c = this.apptData.apdate;
      } else {
        this.servicesArray[0].Appt_Date_Time__c = '';
      }
      if (favoriteslist.Guest_Charge__c) {
        this.servicesArray[0].Guest_Charge__c = favoriteslist.Guest_Charge__c;
      } else {
        this.servicesArray[0].Guest_Charge__c = 0;
      }
      this.servicesArray[0].Rebooked__c = 0;
      this.servicesArray[0].Non_Standard_Duration__c = 0;
      this.notes = '';

      let tempArr = [];
      let tempArr2 = [];
      // this.servicesArray[0]['isPrepaidPackage'] = false;
      if (this.TicketServiceData && this.TicketServiceData.length > 0) {
        tempArr = this.TicketServiceData.filter((obj) => obj.ServiceId === favoriteslist.id);
      }
      if ((this.ticketOthersList && this.ticketOthersList.length > 0) && (tempArr && tempArr.length > 0)) {
        tempArr2 = this.ticketOthersList.filter((obj) => obj.Package__c === tempArr[0]['Booked_Package__c']);
      }
      if (tempArr2 && tempArr2.length > 0) {
        this.servicesArray[0]['isPrepaidPackage'] = false;
      } else {
        this.servicesArray[0]['isPrepaidPackage'] = true;
      }
      this.servicesArray[0]['pckgObj'] = this.getPrepaidPackage(this.servicesArray[0]['id']);
      this.checkOutEditTicketService.isWorkerAssociated(favoriteslist.id)
        .subscribe(data => {
          this.workerList = data['result'];
          if (this.workerList.length > 1) {
            this.serviceModal.show();
            this.servicesArray[0].workerId = '';
          } else if (this.workerList.length === 1) {
            this.servicesArray[0].workerId = this.workerList[0].Price + '$' + this.workerList[0].Id;
            this.price = this.workerList[0].Price;
            this.servicesArray[0].Price__c = this.price;
            this.servicesArray[0].Net_Price__c = this.price;
            if ((this.serviceTax !== '' || this.serviceTax !== null) && this.servicesArray[0].Taxable__c === 1) {
              this.servicesArray[0].Service_Tax__c = (this.price * this.serviceTax) / 100;
            } else {
              this.servicesArray[0].Service_Tax__c = 0;
            }
            this.addToTicketService();
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
    } else if (favoriteslist.type === 'Promotion' && favoriteslist.Active__c === 1) {
      this.applyPromotion(favoriteslist);
    }
    this.getPromotions();
  }
  /**
   * Favourites modal ends
   */
  /**
     * Products code starts
     */
  /*-- This method is used to get products list --*/
  getProductsList() {
    this.checkOutEditTicketService.getProductsList()
      .subscribe(data => {
        this.productsList = data['result'];
        if (this.productsList.length <= 25) {
          for (let i = 0; i < this.productsList.length; i++) {
            this.productsList[i]['Name'] = this.productsList[i].Name + '-' + this.productsList[i].Size__c + ' ' + this.productsList[i].Unit_of_Measure__c;
          }
          const length = 25 - this.productsList.length;
          for (let i = 0; i < length; i++) {
            this.productsList.push({ 'Name': '', 'Color__c': '' });
          }
        }
        for (let i = 0; i < this.productsList.length; i++) {
          if (this.productsList[i].Product_Pic__c !== '' && this.productsList[i].Product_Pic__c !== null && this.productsList[i].Product_Pic__c !== undefined) {
            this.productsList[i].pic = this.apiEndPoint + '/' + this.productsList[i].Product_Pic__c;
          }
        }
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
  searchProduct() {
    if (this.prodSku === '' || this.prodSku === undefined || this.prodSku === 'undefined') {
      // this.disableSelect = true;
      // this.productsList = [];
    } else {
      this.checkOutEditTicketService.getProductsBySKU(this.prodSku).subscribe(
        data => {
          this.productsData = data['result'];
          this.productListData = {
            'Name': this.productsData[0].Name,
            'Size__c': this.productsData[0].Size__c,
            'Unit_of_Measure__c': this.productsData[0].Unit_of_Measure__c,
            'Price__c': parseInt(this.productsData[0].price, 10),
            'Id': this.productsData[0].Id,
            'Taxable__c': parseInt(this.productsData[0].Taxable__c, 10)
          };
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
  productsDataOnChage(value) {
    this.productListData = {
      'Name': value.split('$')[1],
      'Size__c': value.split('$')[2],
      'Unit_of_Measure__c': value.split('$')[3],
      'Price__c': parseInt(value.split('$')[4], 10),
      'Id': value.split('$')[0],
      'Taxable__c': parseInt(value.split('$')[5], 10)
    };
    // this.productProRePrice = parseInt(value.split('$')[4], 10);
  }
  dropdownSelectProduct() {
    this.showFavoriteModal(this.productListData, '', 'Product');
  }
  /*-- This method is used to get workers list --*/
  getWorkersList() {
    this.checkOutEditTicketService.getWorkersList()
      .subscribe(data => {
        this.productWorkersList = data['result'];
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

  setAmountWithoutCurrentTicket(type: string, ticketAmount: number, taxAmount?: number, quantity?: number) {
    this.setAmountDetails();
    taxAmount = taxAmount ? taxAmount : 0;
    switch (type) {
      case 'product': {
        this.apptAmountDetails.deleteProductAmount = this.apptAmountDetails.ProductAmount - (ticketAmount * quantity);
        this.apptAmountDetails.deleteProductTaxAmount = this.apptAmountDetails.ProductTaxAmount - taxAmount;
      } break;
      case 'service': {
        this.apptAmountDetails.deleteServiceAmount = this.apptAmountDetails.ServiceAmount - ticketAmount;
        this.apptAmountDetails.deleteServiceTaxAmount = this.apptAmountDetails.ServiceTaxAmount - taxAmount;
      } break;
      case 'others': {
        this.apptAmountDetails.deleteOthersAmount = this.apptAmountDetails.OthersAmount - ticketAmount;
      } break;
      case 'tips': {
        this.apptAmountDetails.deleteTipsAmount = this.apptAmountDetails.TipsAmount - ticketAmount;
      } break;
    }
  }
  /**
   * To show The product data To Edit with popUp
   * @param ticketproductlist
   */
  showListModal(ticketproductlist) {
    if ((this.productRewards && this.productRewards.length > 0) && ticketproductlist.Reward__c) {
      const temp = this.productRewards.filter((obj) => obj.Id === ticketproductlist.Reward__c);
      if (temp && temp.length > 0) {
        this.rewardName = temp[0]['Name'].split(':')[0] + ': ' + ticketproductlist.Redeem_Rule_Name__c;
        this.rewardId = ticketproductlist.Reward__c;
      }
    }
    this.setAmountWithoutCurrentTicket('product', ticketproductlist.Net_Price__c, ticketproductlist.Product_Tax__c, ticketproductlist.quantity);
    this.productModal.show();
    this.productAction = 'Update';
    this.ticketProductId = ticketproductlist.Id;
    this.popupProductName = ticketproductlist.Name;
    this.productWorkerId = ticketproductlist.workerId;
    this.productProRePrice = ticketproductlist.Net_Price__c.toFixed(2);
    this.proRefPrice = ticketproductlist.Price__c;
    this.productPrice = ticketproductlist.Price__c; // added by ravi
    // this.productProRePrice = this.productPrice;
    this.productQuantity = ticketproductlist.quantity;
    this.productTaxable = ticketproductlist.Taxable__c;
    if ((ticketproductlist.Promotion__c && ticketproductlist.Promotion__c !== 'None') || (ticketproductlist.Reward__c && ticketproductlist.Reward__c !== 'None')) {
    } else {
      this.promotionId = 'None';
      this.rewardId = 'None';
    }
    if (this.productPromotionsList && this.productPromotionsList.length > 0) {
      for (let i = 0; i < this.productPromotionsList.length; i++) {
        if (ticketproductlist.Promotion__c === this.productPromotionsList[i].Id) {
          this.promotionId = this.productPromotionsList[i].discountPers + '$' + this.productPromotionsList[i].discountAmount + '$' + this.productPromotionsList[i].Id;
        }
      }
    }
  }
  getTicketProducts(apptid) {
    this.checkOutEditTicketService.getTicketProducts(apptid).subscribe(data => {
      this.ticketProductsList = data['result'];
      if (this.ticketProductsList && this.ticketProductsList.length > 0) {
        this.productWorkerId = this.ticketProductsList[0]['workerId'];
      }
      this.calServRetTax();
      this.calCharge();
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
  prodPriceOnClick() {
    this.productProRePrice = (this.productProRePrice || this.productProRePrice === 0) ? this.productProRePrice.toFixed(2) : undefined;
    this.productPrice = this.productProRePrice;
  }
  addToTicketProduct() {
    if (!this.promotionId || this.promotionId === 'None') {
      this.promotion__c = '';
    } else if (this.promotionId) {
      this.promotion__c = this.promotionId.split('$')[2];
    }
    if (this.rewardId === 'None') {
      this.rewardId = '';
    }
    if (this.productWorkerId === 'undefined' || this.productWorkerId === undefined ||
      this.productWorkerId === '' || this.productWorkerId === null || this.productWorkerId === 'null') {
      this.productError = 'Worker is required';
    } else if (isNaN(this.productProRePrice) ? true : (!(/^(?!0)\d{1,9}(\.\d{1,2})?$/g).test(this.productProRePrice) && +this.productProRePrice !== 0)) {
      this.productError = 'Price: Only a positive, whole number may be entered and must be less than 999,999,999.99';
    } else if (isNaN(this.productQuantity) ? true : (!(/^(?!0)\d{1,3}$/).test(this.productQuantity.toString()) || this.productQuantity > 999)) {
      this.productError = 'Qty Sold: Only a positive, whole number may be entered and must be less than 1000';
    } else {
      let productTax: any;
      if (this.productTaxable && this.productTaxable === 1) {
        productTax = (+this.productProRePrice * +this.retailTax) / 100;
      } else {
        productTax = 0;
      }
      if (this.productAction === 'Add') {
        this.setAmountDetails();
        //  this.productProRePrice = this.productProRePrice;
        this.apptAmountDetails.ProductAmount += +this.productProRePrice * +this.productQuantity;
        this.apptAmountDetails.ProductTaxAmount += +productTax * +this.productQuantity;
        this.productObj = {
          'Appt_Ticket__c': this.apptId,
          'Client__c': this.productClientId,
          'Product__c': this.productId,
          'Worker__c': this.productWorkerId,
          'price': this.productCost,
          'netPrice': this.productProRePrice,
          'Qty_Sold__c': this.productQuantity,
          'Taxable__c': this.productTaxable,
          'Promotion__c': this.promotion__c,
          'Reward__c': this.rewardId,
          'Product_Tax__c': productTax * this.productQuantity,
          'isNoService__c': 1,
          'Appt_Date_Time__c': this.commonService.getDBDatTmStr(new Date()),
          'redeemName': this.redeemName
        };
        this.productObj = Object.assign(this.productObj, this.apptAmountDetails);
        this.checkOutEditTicketService.productAddToTicket(this.productObj, this.action)
          .subscribe(data => {
            const productAddToTicketList = data['result'];
            this.productWorkersList = [];
            this.servicePromotionsList = [];
            this.promotionId = 'None';
            this.rewardId = 'None';
            this.productProRePrice = 0.00;
            this.getWorkersList();
            this.getTicketProducts(this.apptId);
            this.productQuantity = 1;
            if (productAddToTicketList && productAddToTicketList.apptId) {
              this.router.navigate(['/checkout/' + productAddToTicketList.apptId]);
              this.getTicketServices(productAddToTicketList.apptId);
              this.getApptDetails(productAddToTicketList.apptId);
              this.getTicketProducts(this.apptId);
            }
            this.productModal.hide();
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
      } else if (this.productAction === 'Update') {
        if (this.productWorkerId === 'undefined' || this.productWorkerId === undefined ||
          this.productWorkerId === '' || this.productWorkerId === null || this.productWorkerId === 'null') {
          this.productError = 'Worker is required';
        } else {
          this.apptAmountDetails.ProductAmount = this.apptAmountDetails.deleteProductAmount + (+this.productProRePrice * +this.productQuantity);
          this.apptAmountDetails.ProductTaxAmount = this.apptAmountDetails.deleteProductTaxAmount + (+productTax * +this.productQuantity);
          this.productObj = {
            'Worker__c': this.productWorkerId,
            'Price__c': this.productProRePrice,
            'Qty_Sold__c': this.productQuantity,
            'Promotion__c': this.promotionId,
            'Reward__c': this.rewardId,
            'Product_Tax__c': productTax * this.productQuantity,
            'isNoService__c': 1,
            'redeemName': this.redeemName,
            'Appt_Ticket__c': this.apptId
          };
          this.productObj = Object.assign(this.productObj, this.apptAmountDetails);
          this.checkOutEditTicketService.updateTicket(this.ticketProductId, this.productObj)
            .subscribe(data => {
              const productAddToTicketList = data['result'];
              this.productWorkersList = [];
              this.servicePromotionsList = [];
              this.getWorkersList();
              this.getPromotions();
              this.getTicketProducts(this.apptId);
              // this.getClientRewardData();
              this.promotionId = 'None';
              this.rewardId = 'None';
              this.productProRePrice = 0.00;
              this.productQuantity = 1;
              if (productAddToTicketList && productAddToTicketList.apptId) {
                this.router.navigate(['/checkout/' + productAddToTicketList.apptId]);
                this.getTicketServices(productAddToTicketList.apptId);
                this.getApptDetails(productAddToTicketList.apptId);
                this.getTicketProducts(this.apptId);
              }
              this.productModal.hide();
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
      }
    }
  }
  clearErrorMsg() {
    this.productError = '';
    this.serviceError = '';
  }
  /**
  * Products list modal starts
  */
  onChangeWorker(value) {
    this.productWorkerId = value;
  }
  updateTicket() {
    const updateTicketObj = {
      'Worker__c': this.productWorkerId,
      'Price__c': this.productProRePrice,
      'Qty_Sold__c': this.updateQuantity,
      'Promotion__c': this.promotionId,
      'Reward__c': this.rewardId
    };
    this.checkOutEditTicketService.updateTicket(this.ticketProductId, updateTicketObj)
      .subscribe(data => {
        const updateTicketList = data['result'];
        this.productWorkersList = [];
        //  this.servicePromotionsList = [];
        this.getWorkersList();
        //   this.productQuantity = 1;
        this.getTicketProducts(this.apptId);
        // this.productModal.hide();
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
  removeTicketProduct() {
    this.apptAmountDetails.ProductAmount = this.apptAmountDetails.deleteProductAmount;
    this.apptAmountDetails.ProductTaxAmount = this.apptAmountDetails.deleteProductTaxAmount;
    const amountdetails = Object.assign({}, this.apptAmountDetails, { 'Appt_Ticket__c': this.apptId });
    this.checkOutEditTicketService.removeTicketProduct(this.ticketProductId, amountdetails)
      .subscribe(data => {
        const removeTicketProduct = data['result'];
        this.productWorkersList = [];
        this.finalRewardsList = [];
        //  this.servicePromotionsList = [];
        this.getWorkersList();
        this.productQuantity = 1;
        this.getTicketProducts(this.apptId);
        // this.productModal.hide();
        this.calCharge();
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
    this.productModal.hide();
  }

  /**
   * Products list modal ends
   */
  /**
  /**
   * Products code ends
   */
  isPromApplicable(favoriteslist) {
    for (let j = 0; j < this.TicketServiceData.length; j++) {
      if ((this.TicketServiceData && this.TicketServiceData.length > 0) && (
        this.TicketServiceData[j].Promotion__c === null || this.TicketServiceData[j].Promotion__c === '') && favoriteslist.Service_Discount__c === 1) {
        if (parseInt(favoriteslist.Discount_Percentage__c, 10) !== 0 && parseInt(favoriteslist.Discount_Percentage__c, 10) !== null) {
          if (this.TicketServiceData[j].netPrice < this.TicketServiceData[j].netPrice - (this.TicketServiceData[j].netPrice * parseInt(favoriteslist.Discount_Percentage__c, 10) / 100)) {
            this.TicketServiceData[j].Net_Price__c = 0;
          } else {
            this.TicketServiceData[j].Net_Price__c = this.TicketServiceData[j].netPrice - (this.TicketServiceData[j].netPrice * parseInt(favoriteslist.Discount_Percentage__c, 10) / 100);
          }
          this.TicketServiceData[j].Promotion__c = favoriteslist.id;
        } else {
          if (this.TicketServiceData[j].netPrice < parseInt(favoriteslist.Discount_Amount__c, 10)) {
            this.TicketServiceData[j].Net_Price__c = 0;
          } else {
            this.TicketServiceData[j].Net_Price__c = this.TicketServiceData[j].netPrice - parseInt(favoriteslist.Discount_Amount__c, 10);
          }
          this.TicketServiceData[j].Promotion__c = favoriteslist.id;
        }
      }
      this.TicketServiceData[j].Service_Tax__c = (this.TicketServiceData[j].Net_Price__c * +this.serviceTax) / 100;
    }
    for (let j = 0; j < this.ticketProductsList.length; j++) {
      if (this.ticketProductsList && this.ticketProductsList.length > 0 && (this.ticketProductsList[j].Promotion__c === null ||
        this.ticketProductsList[j].Promotion__c === '') && favoriteslist.Product_Discount__c === 1) {
        if (parseInt(favoriteslist.Discount_Percentage__c, 10) !== 0 && parseInt(favoriteslist.Discount_Percentage__c, 10) !== null) {
          if (this.ticketProductsList[j].Price__c < this.ticketProductsList[j].Price__c - (this.ticketProductsList[j].Price__c * parseInt(favoriteslist.Discount_Percentage__c, 10) / 100)) {
            this.ticketProductsList[j].Net_Price__c = 0;
          } else {
            this.ticketProductsList[j].Net_Price__c = this.ticketProductsList[j].Price__c - (this.ticketProductsList[j].Price__c * parseInt(favoriteslist.Discount_Percentage__c, 10) / 100);
          }
          this.ticketProductsList[j].Promotion__c = favoriteslist.id;
        } else {
          if (this.ticketProductsList[j].Price__c < parseInt(favoriteslist.Discount_Amount__c, 10)) {
            this.ticketProductsList[j].Net_Price__c = 0;
          } else {
            this.ticketProductsList[j].Net_Price__c = this.ticketProductsList[j].Price__c - parseInt(favoriteslist.Discount_Amount__c, 10);
          }
          this.ticketProductsList[j].Promotion__c = favoriteslist.id;
          this.ticketProductsList[j].Product_Tax__c = (this.ticketProductsList[j].Net_Price__c * +this.retailTax) / 100;
        }
      }
    }
    const resObj = {
      'TicketServiceData': this.TicketServiceData,
      'ticketProductsList': this.ticketProductsList
    };
    return resObj;
  }
  /**
     * promotionsModal code starts
     */
  applyPromotion(favoriteslist) {
    let dataObj = {
      'TicketServiceData': [],
      'ticketProductsList': []
    };
    const serviceDate = this.apptData.apdate.split(' ')[0];
    if ((favoriteslist.Start_Date__c !== null && favoriteslist.End_Date__c !== null) &&
      (new Date(favoriteslist.Start_Date__c) <= new Date(serviceDate)
        && new Date(favoriteslist.End_Date__c) >= new Date(serviceDate)) && (favoriteslist.Service_Discount__c === 1 || favoriteslist.Product_Discount__c === 1)) {
      const resData = this.isPromApplicable(favoriteslist);
      dataObj = {
        'TicketServiceData': resData.TicketServiceData,
        'ticketProductsList': resData.ticketProductsList
      };
    } else if (favoriteslist.Start_Date__c === null && favoriteslist.End_Date__c === null && favoriteslist.type === 'Promotion') {
      const resData = this.isPromApplicable(favoriteslist);
      dataObj = {
        'TicketServiceData': resData.TicketServiceData,
        'ticketProductsList': resData.ticketProductsList
      };
    } else if ((favoriteslist.Start_Date__c === null && favoriteslist.End_Date__c === null) || (favoriteslist.Start_Date__c === '' && favoriteslist.End_Date__c === '')) {
      const resData = this.isPromApplicable(favoriteslist);
      dataObj = {
        'TicketServiceData': resData.TicketServiceData,
        'ticketProductsList': resData.ticketProductsList
      };
    }
    if ((dataObj.TicketServiceData && dataObj.TicketServiceData.length > 0) || (dataObj.ticketProductsList && dataObj.ticketProductsList.length > 0)) {
      this.checkOutEditTicketService.addPromotion(dataObj)
        .subscribe(data => {
          const addPromStatus = data['result'];
          this.promotionsModal.hide();
          this.getTicketProducts(this.apptId);
          this.getTicketServices(this.apptId);
          this.calCharge();
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
  }
  showPromotionsModal() {
    this.productPromotionsList = [];
    this.servicePromotionsList = [];
    this.allPromData = this.commonService.removeDuplicates(this.allPromData, 'Id');
    this.promotionsModal.show();
  }
  PromotionOnChange(value) {
    this.promotionVals = {
      'id': value.split('$')[0],
      'End_Date__c': value.split('$')[1],
      'Start_Date__c': value.split('$')[2],
      'Service_Discount__c': parseInt(value.split('$')[3], 10),
      'Discount_Amount__c': value.split('$')[4],
      'Discount_Percentage__c': value.split('$')[5],
      'Product_Discount__c': parseInt(value.split('$')[6], 10)
    };
  }
  promotionAdd() {
    this.applyPromotion(this.promotionVals);
  }
  /**
  * promotionsModal code ends
  */
  /**
   * Misc tab code starts
   */
  saveMisc() {
    if (this.misc === '.') {
      this.miscError = 'Only a number may be entered';
    } else {
      this.setAmountDetails();
      this.apptAmountDetails.OthersAmount += +this.misc;
      let calObj = {
        'Ticket__c': this.apptId,
        'Amount__c': this.misc,
        'Transaction_Type__c': this.miscScale,
        'isNoService__c': 1,
        'Appt_Date_Time__c': this.commonService.getDBDatTmStr(new Date()),
        'Appt_Ticket__c': this.apptId
      };
      calObj = Object.assign(calObj, this.apptAmountDetails);
      this.checkOutEditTicketService.saveMisc(calObj, this.action).subscribe(data => {
        const calData = data['result'];
        if (calData && calData.apptId) {
          this.router.navigate(['/checkout/' + calData.apptId]);
        }
        this.getCalList();
        this.getOthersTicketDetails();
        this.misc = '';
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
  }
  getCalList() {
    // this.checkOutEditTicketService.getCalList(this.miscScale, this.apptId).subscribe(data => {
    //   this.miscCalList = data['result'];
    //   if (this.miscCalList && this.miscCalList.length > 0) {
    //     this.calCharge();
    //     this.getOthersTicketDetails();
    //   }
    // },
    //   error => {
    //     const errStatus = JSON.parse(error['_body'])['status'];
    //     if (errStatus === '2085' || errStatus === '2071') {
    //       if (this.router.url !== '/') {
    //         localStorage.setItem('page', this.router.url);
    //         this.router.navigate(['/']).then(() => { });
    //       }
    //     }
    //   }
    // );
  }
  showMiscModal(misccallist) {
    this.miscModal.show();
    this.miscId = misccallist.Id;
    this.setAmountWithoutCurrentTicket('others', +misccallist.Amount__c);
    this.calAmount = misccallist.Amount__c;
  }
  updateMiscTicket() {
    this.apptAmountDetails.OthersAmount = this.apptAmountDetails.deleteOthersAmount + this.calAmount;
    let calObj = {
      'Amount__c': this.calAmount,
      'Appt_Ticket__c': this.apptId
    };
    calObj = Object.assign(calObj, this.apptAmountDetails);
    this.checkOutEditTicketService.updateMiscTicket(this.miscId, calObj).subscribe(data => {
      const updateMiscList = data['result'];
      this.getCalList();
      this.miscModal.hide();
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
  deleteMiscTicket() {
    this.apptAmountDetails.OthersAmount = this.apptAmountDetails.deleteOthersAmount;
    const amountdetails = Object.assign({}, this.apptAmountDetails, { 'Appt_Ticket__c': this.apptId });
    this.checkOutEditTicketService.deleteMiscTicket(this.miscId, amountdetails).subscribe(data => {
      const updateMiscList = data['result'];
      this.getCalList();
      this.miscModal.hide();
      this.calCharge();
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
  updateMisc(value: string) {
    this.miscError = '';
    if (value === 'del' && this.misc.length > 0) {
      this.misc = this.misc.slice(0, this.misc.length - 1);
    } else if ((value === '.' && this.misc.indexOf('.') === -1) || (value !== '.' && value !== 'del')) {
      this.misc = this.misc + value;
    }
  }
  /**
   * misc tab code ends
   */

  /**
   *  others code start
   */
  getpackagesListing() {
    this.checkOutEditTicketService.getAllServiceDetails(this.isActive).subscribe(data => {
      this.packagesList = data['result'].filter((obj) => obj.Active__c === 1 && obj.IsDeleted === 0);
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
  getOthersTicketDetails() {
    this.checkOutEditTicketService.getOthersTicketList(this.apptId).subscribe(data => {
      this.ticketOthersList = data['result'];
      this.calServRetTax();
      this.calCharge();
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
  onPackageChange() {
    const ticketServiceData = [];
    const pckArray = [];
    let sumOfDiscountedPrice = 0;
    let discountedPackage = 0;
    let discountedPackageTotal = 0;
    this.clientPckgObj = {};
    const filteredPackage = this.packagesList.filter((obj) => obj.Id === this.packageId);
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      for (let i = 0; i < this.TicketServiceData.length; i++) {
        if (!(this.TicketServiceData[i]['Booked_Package__c'] && this.TicketServiceData[i]['Booked_Package__c'] === filteredPackage[0]['Id'])) {
          discountedPackage += parseFloat(filteredPackage[0].Discounted_Package__c);
          discountedPackageTotal += parseFloat(filteredPackage[0].Discounted_Package__c);
          for (let j = 0; j < JSON.parse(filteredPackage[0].JSON__c).length; j++) {
            sumOfDiscountedPrice += parseFloat(JSON.parse(filteredPackage[0].JSON__c)[j].discountPriceEach);
            if (this.TicketServiceData[i]['ServiceId'] === JSON.parse(filteredPackage[0].JSON__c)[j].serviceId) {
              const isTaxable = JSON.parse(filteredPackage[0].JSON__c)[j].taxable;
              const price = JSON.parse(filteredPackage[0].JSON__c)[j].discountPriceEach;
              let taxPrice = 0;
              if (isTaxable === 1 || isTaxable === '1' || isTaxable === true) {
                taxPrice = price * (this.serviceTax / 100);
              } else {
                taxPrice = 0;
              }
              ticketServiceData.push({
                'pckId': filteredPackage[0]['Id'],
                'serviceId': this.TicketServiceData[i]['ServiceId'],
                'netPrice': price,
                'serTax': taxPrice
              });
            }
          }
          pckArray.push({
            'pckId': filteredPackage[0]['Id'],
            'sumOfDiscountedPrice': sumOfDiscountedPrice,
            'discountedPackage': discountedPackage,
            // 'discountPriceEach':
          });
          sumOfDiscountedPrice = 0;
          discountedPackage = 0;
        }
      }
      this.clientPckgObj = {
        'pckArray': this.commonService.removeDuplicates(pckArray, 'pckId'),
        'discountedPackageTotal': discountedPackageTotal,
        // 'discountedPackage': discountedPackage
        'ticketServiceData': ticketServiceData,
      };
    }
    if (filteredPackage.length !== 0) {
      this.packageAmount = filteredPackage[0]['Discounted_Package__c'];
    } else {
      this.packageAmount = '';
    }
  }
  addToTicketInOthers(type: string) {
    let obj: any = {};
    this.setAmountDetails();
    switch (type) {
      case 'deposit': {
        if (this.deposit !== '' && this.validateAmount(this.deposit)) {
          obj = {
            'Amount__c': +this.deposit,
            'Transaction_Type__c': 'Deposit'
          };
        } else {
          this.otherError = 'CHECK_OUTS.OTHERS.DEPOSIT_ERR';
          return;
        }
      }
        break;
      case 'prepayment': {
        if (this.prePayment !== '' && this.validateAmount(this.prePayment)) {
          obj = {
            'Amount__c': +this.prePayment,
            'Transaction_Type__c': 'Pre Payment'
          };
        } else {
          this.otherError = 'CHECK_OUTS.OTHERS.PRE_PAYMANT_ERR';
          return;
        }
      }
        break;
      case 'receivedOnAccount': {
        if (this.recievedOnAccount !== '' && this.validateAmount(this.recievedOnAccount)) {

          obj = {
            'Amount__c': +this.recievedOnAccount,
            'Transaction_Type__c': 'Received on Account'
          };
        } else {
          this.otherError = 'CHECK_OUTS.OTHERS.RECEIVED_ON_ACCOUNT_ERR';
          return;
        }
      }
        break;
      case 'package': {
        if (this.packageId !== '') {
          const filteredPackage = this.packagesList.filter((pkg) => pkg.Id === this.packageId);
          obj = {
            'Package__c': this.packageId,
            'Package_Price__c': +this.packageAmount,
            'Amount__c': +this.packageAmount + (filteredPackage.length > 0 ? (filteredPackage[0]['Tax__c'] ? filteredPackage[0]['Tax__c'] : 0) : 0),
            'Transaction_Type__c': 'Package',
            'Service_Tax__c': filteredPackage.length > 0 ? (filteredPackage[0]['Tax__c'] ? filteredPackage[0]['Tax__c'] : 0) : 0
          };
        } else {
          this.otherError = 'CHECK_OUTS.OTHERS.PACKAGE_ERR';
          return;
        }
      }
        break;
      case 'gift': {
        let isNotValidDate = false;
        this.issueDate = new Date();
        if (!isNullOrUndefined(this.expireDate)) {
          if (!isNaN(this.expireDate.getTime())) {
            const giftIssueDate = this.commonService.getDateTmFrmDBDateStr(this.commonService.getDBDatStr(this.issueDate));
            const giftExpireDate = this.commonService.getDateTmFrmDBDateStr(this.commonService.getDBDatStr(this.expireDate));
            isNotValidDate = giftIssueDate.getTime() > giftExpireDate.getTime();
          }
        }
        if (this.giftNumber && this.giftNumber === '' && !this.validateAmount(this.giftAmount)) {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_ERR';
          window.scrollTo(0, 0);
          return;
        } else if (this.giftNumber.trim() === '') {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_NUMBER_ERR';
          window.scrollTo(0, 0);
          return;
        } else if (this.giftNumber && this.giftNumber.trim().length < 3) {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_NUMBER_MIN_ERR';
          window.scrollTo(0, 0);
          return;
        } else if (!this.validateAmount(this.giftAmount)) {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_AMOUNT_ERR';
          window.scrollTo(0, 0);
          return;
        } else if (this.expireDate ? isNaN(this.expireDate.getTime()) : false) {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_EXPIRED_DATE_VALIDATION';
          window.scrollTo(0, 0);
          return;
        } else if (isNotValidDate) {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_DATE_ERR';
          window.scrollTo(0, 0);
          return;
        } else {
          obj = {
            'Gift_Number__c': this.giftNumber,
            'Amount__c': +this.giftAmount,
            'Transaction_Type__c': 'Gift',
            'Expires__c': this.expireDate ? this.commonService.getDBDatTmStr(this.expireDate).split(' ')[0] : null,
            'Recipient__c': this.recepient,
            'Issued__c': this.commonService.getDBDatTmStr(this.issueDate).split(' ')[0],
            'Worker__c': this.workerId
          };
        }

      }
    }
    this.apptAmountDetails.OthersAmount = this.apptAmountDetails.OthersAmount + obj['Amount__c'];
    obj = Object.assign(obj, {
      'Ticket__c': this.apptId,
      'Appt_Date_Time__c': this.commonService.getDBDatTmStr(new Date()),
      'pckgObj': this.clientPckgObj,
      'Appt_Ticket__c': this.apptId
    }, this.apptAmountDetails);
    this.checkOutEditTicketService.addToTicket(obj, this.action).subscribe(data => {
      const dataStatus = data['result'];
      if (dataStatus && dataStatus.apptId) {
        this.router.navigate(['/checkout/' + dataStatus.apptId]);
      }
      this.clear(type);
      this.getOthersTicketDetails();
      this.getTicketPayment(this.apptId);
      this.getTicketServices(this.apptId);
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2040':
            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
            window.scrollTo(0, 0);
            break;
          case '9996':
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
  validateAmount(value: string): boolean {
    const isAcceptedAmount: boolean = (/^[\d]{1,9}(\.[\d]{1,2})?$/).test(value) && +value !== 0;
    return isAcceptedAmount;
  }
  IsAlphaNumeric(e) {

    const value = e.target.value;
    let ret: boolean;

    const code = e.keyCode === 0 ? e.charCode : e.keyCode;
    if ((code >= 48 && code <= 57) || code === 46 || (code === 8) || code >= 37 && code <= 40) { // check digits
      ret = true;
    } else {
      ret = false;
    }
    return ret;
  }
  getAllActiveWorkers() {
    this.checkOutEditTicketService.getAllWorkers().subscribe(data => {
      this.workersList = [];
      this.workersList = data['result']
        .filter(filterList => filterList.IsActive);
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
  clearOtherError() {
    this.otherError = '';
    this.error = '';
  }
  clear(type: string) {
    this.otherError = '';
    switch (type) {
      case 'deposit': {
        this.deposit = 0.00;
      }
        break;
      case 'prepayment': {
        this.prePayment = 0.00;
      }
        break;
      case 'receivedOnAccount': {
        this.recievedOnAccount = 0.00;
      }
        break;
      case 'package': {
        this.packageAmount = '';
        this.packageId = '';
      }
        break;
      case 'gift': {
        this.issueDate = undefined;
        this.expireDate = undefined;
        this.workerId = '';
        this.giftAmount = 0.00;
        this.giftNumber = '';
        this.recepient = '';
      }
    }
  }
  updateTicketPackageChange() {
    const filteredPackage = this.packagesList.filter((obj) => obj.Id === this.updateOthersInfo.Package__c);
    if (filteredPackage.length !== 0) {
      this.updateOthersInfo.Package_Price__c = filteredPackage[0]['Discounted_Package__c'];
      this.updateOthersInfo.Amount__c = filteredPackage[0]['Discounted_Package__c'];
      this.updateOthersInfo.Service_Tax__c = filteredPackage[0]['Tax__c'];
    }
  }
  updateOthersTicket() {
    if (this.updateOthersInfo.Transaction_Type__c !== 'Package') {
      this.updateOthersInfo.Package__c = '';
      if (!(/^[\d]{1,9}(\.[\d]{1,2})?$/).test(this.updateOthersInfo.Amount__c)) {
        this.updateOthersInfo.error = 'CHECK_OUTS.OTHERS.UPDATE_ERR';
        return;
      }
    }
    delete this.updateOthersInfo.error;
    this.apptAmountDetails.OthersAmount = +this.apptAmountDetails.deleteOthersAmount + +this.updateOthersInfo.Amount__c;
    const othersObj = Object.assign({}, this.updateOthersInfo, this.apptAmountDetails, { 'Appt_Ticket__c': this.apptId });
    this.checkOutEditTicketService.updateOthersTicket(this.updateOthersInfo.Id, othersObj).subscribe(data => {
      this.othersModal.hide();
      this.getOthersTicketDetails();
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
  deleteOthersTicket() {
    this.apptAmountDetails.OthersAmount = this.apptAmountDetails.deleteOthersAmount;
    const amountdetails = Object.assign({}, this.apptAmountDetails, { 'Appt_Ticket__c': this.apptId });
    this.checkOutEditTicketService.detleteOthersTicket(this.updateOthersInfo.Id, amountdetails).subscribe(data => {
      this.othersModal.hide();
      this.getOthersTicketDetails();
      this.calCharge();
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
  updateOthersModal(otherTicketData) {
    let tempArr;
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      tempArr = this.TicketServiceData.filter((obj) => (otherTicketData.Package__c && otherTicketData.Package__c !== '') && (obj.Booked_Package__c === otherTicketData.Package__c));
    }
    if (!tempArr || tempArr.length <= 0) {
      this.updateOthersInfo.error = '';
      this.updateOthersInfo = Object.assign(this.updateOthersInfo, otherTicketData);
      this.setAmountWithoutCurrentTicket('others', otherTicketData['Amount__c']);
      this.othersModal.show();
    } else {
      this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CANNOT_UPDATE');
      this.toastr.warning(this.toastermessage.value, null, { timeOut: 7000 });
    }
  }
  /*
   * * Others End
  */

  /*
  * * Tips Start
   */
  openTipsModal() {
    this.workerTips.status = 'save';
    this.workerTips.error = '';
    this.workerTips.Tip_Option__c = 'Tip Paid Out';
    this.workerTips.Tip_Amount__c = 0;
    this.workerTips.Worker__c = '';
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      this.tipsModal.show();
    }
  }
  isErrorsInTips(): boolean {
    if (this.workerTips.Worker__c === '') {
      this.workerTips.error = 'CHECK_OUTS.TIPS.WORKER_ERR';
      return true;
    } else if (!(/^[\d]{1,4}(\.[\d]{1,2})?$/).test(this.workerTips.Tip_Amount__c || this.workerTips.Tip_Amount__c <= 0)) {
      this.workerTips.error = 'CHECK_OUTS.TIPS.WORKER_AMOUNT_ERR';
      return true;
    } else {
      return false;
    }
  }
  clearTipsError() {
    this.workerTips.error = '';
  }
  calculateTipAmount(tipPercent) {
    let totalServiceCharge = 0;
    if (this.TicketServiceData.length > 0) {
      totalServiceCharge = this.TicketServiceData.map((obj) => +obj.netPrice).reduce(this.calculateSum);
    }
    this.workerTips.Tip_Amount__c = (totalServiceCharge * tipPercent) / 100;
    this.workerTips.Tip_Amount__c = new DecimalPipe('en-Us').transform(this.workerTips.Tip_Amount__c, '1.2-2');
  }
  calculateSum(total: number, value: number) {
    return total + value;
  }
  updateWorkerTips(workerTipData) {
    this.workerTips = Object.assign({}, workerTipData);
    this.setAmountWithoutCurrentTicket('tips', workerTipData['Tip_Amount__c']);
    this.workerTips.status = 'update';
    this.workerTips.error = '';
    this.tipsModal.show();
  }
  addTipToWorker() {
    // delete this.workerTips.status;
    this.setAmountDetails();
    let apptId = '';
    if (!isNullOrUndefined(this.apptId)) {
      apptId = this.apptId;
    }
    if (!this.isErrorsInTips()) {
      delete this.workerTips.error;
      if (this.workerTips.Tip_Option__c === 'Tip Left in Drawer') {
        if (!isNullOrUndefined(localStorage.getItem('browserObject'))) {
          const obj = JSON.parse(localStorage.getItem('browserObject'));
          if (obj.CashDrawer !== '') {
            this.workerTips = Object.assign(this.workerTips, { 'Drawer_Number__c': obj.CashDrawer.split(' ')[0] });
          }
        }
      }
      this.workerTips['Tip_Amount__c'] = +this.workerTips['Tip_Amount__c'];
      this.apptAmountDetails.TipsAmount += this.workerTips['Tip_Amount__c'];
      this.workerTips = Object.assign(this.workerTips, { 'Appt_Ticket__c': apptId, Appt_Date_Time__c: this.commonService.getDBDatTmStr(new Date()) }, this.apptAmountDetails);
      this.checkOutEditTicketService.addTipToTicket(this.workerTips, this.action).subscribe(data => {
        const dataStatus = data['result'];
        this.workerTips = {};
        this.tipsModal.hide();
        if (dataStatus && dataStatus.apptId && isNullOrUndefined(this.apptId)) {
          this.router.navigate(['/checkout/' + dataStatus.apptId]);
        } else {
          this.getWorkerTips();
        }

      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (status) {
            case 500:
              break;
            case 400:
              if (statuscode === '2040') {
                this.workerTips.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
              } else if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                  localStorage.setItem('page', this.router.url);
                  this.router.navigate(['/']).then(() => { });
                }
              } break;
          }
        });
    }

  }
  updateTipToWorker() {
    // delete this.workerTips.status;
    if (!this.isErrorsInTips()) {
      delete this.workerTips.error;
      if (this.workerTips.Tip_Option__c === 'Tip Left in Drawer') {
        if (!isNullOrUndefined(localStorage.getItem('browserObject'))) {
          const obj = JSON.parse(localStorage.getItem('browserObject'));
          if (obj.CashDrawer !== '') {
            this.workerTips = Object.assign(this.workerTips, { 'Drawer_Number__c': obj.CashDrawer.split(' ')[0] });
          }
        }
      }
      this.workerTips['Tip_Amount__c'] = +this.workerTips['Tip_Amount__c'];
      this.apptAmountDetails.TipsAmount = this.apptAmountDetails.deleteTipsAmount + this.workerTips['Tip_Amount__c'];
      this.workerTips = Object.assign(this.workerTips, { 'Appt_Ticket__c': this.apptId }, this.apptAmountDetails);
      this.checkOutEditTicketService.updateTipToTicket(this.workerTips.tipId, this.workerTips).subscribe(data => {
        this.workerTips = {};
        this.tipsModal.hide();
        this.getWorkerTips();
      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (status) {
            case 500:
              break;
            case 400:
              if (statuscode === '2040') {
                this.workerTips.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
              } else if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                  localStorage.setItem('page', this.router.url);
                  this.router.navigate(['/']).then(() => { });
                }
              } break;
          }
        });
    }
  }
  getWorkerTips() {
    this.checkOutEditTicketService.getTipsList(this.apptId).subscribe(data => {
      this.workerTipsList = data['result'];
      this.calCharge();
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
  removeWorkerTip() {
    this.apptAmountDetails.TipsAmount = this.apptAmountDetails.deleteTipsAmount;
    const amountdetails = Object.assign({}, this.apptAmountDetails, { 'Appt_Ticket__c': this.apptId });
    this.checkOutEditTicketService.deleteWorkerTip(this.workerTips.tipId, amountdetails).subscribe(data => {
      this.workerTips = {};
      this.tipsModal.hide();
      this.getWorkerTips();
      this.calCharge();
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
  /** Worker Tip Ends
  */
  calCharge() {
    this.charge = 0;
    this.totalCharge = 0;
    this.servicesCharge = 0;
    this.productsCharge = 0;
    this.othersCharge = 0;
    this.tipsCharge = 0;
    this.paymentCharge = 0;
    this.balanceDue = 0;
    this.packagesPrice = 0;
    this.prePaidPackageCost = 0;
    this.packageTax = 0;
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      for (let i = 0; i < this.TicketServiceData.length; i++) {
        this.totalCharge += parseFloat(this.TicketServiceData[i].netPrice);
        this.servicesCharge += parseFloat(this.TicketServiceData[i].netPrice);
      }
    }
    if (this.ticketProductsList && this.ticketProductsList.length > 0) {
      for (let i = 0; i < this.ticketProductsList.length; i++) {
        this.totalCharge += parseFloat(this.ticketProductsList[i].Net_Price__c) * parseInt(this.ticketProductsList[i].quantity, 10);
        this.productsCharge += parseFloat(this.ticketProductsList[i].Net_Price__c) * parseInt(this.ticketProductsList[i].quantity, 10);
      }
    }
    if (this.ticketOthersList && this.ticketOthersList.length > 0) {
      for (let i = 0; i < this.ticketOthersList.length; i++) {
        if (!this.ticketOthersList[i].Package__c || this.ticketOthersList[i].Package__c === '') {
          this.totalCharge += parseFloat(this.ticketOthersList[i].Amount__c);
          this.othersCharge += parseFloat(this.ticketOthersList[i].Amount__c);
        } else {
          this.totalCharge += parseFloat(this.ticketOthersList[i].Package_Price__c);
          this.othersCharge += parseFloat(this.ticketOthersList[i].Package_Price__c);
        }
      }

    }
    if (this.workerTipsList && this.workerTipsList.length > 0) {
      this.totalCharge += parseFloat(this.workerTipsList.map(obj => +obj['Tip_Amount__c']).reduce(this.calculateSum));
      this.tipsCharge += parseFloat(this.workerTipsList.map(obj => +obj['Tip_Amount__c']).reduce(this.calculateSum));
    }
    if (this.ticketPaymentList && this.ticketPaymentList.length > 0) {
      for (let i = 0; i < this.ticketPaymentList.length; i++) {
        // this.totalCharge -= parseFloat(this.ticketPaymentList[i].Amount_Paid__c);
        this.paymentCharge += parseFloat(this.ticketPaymentList[i].Amount_Paid__c);
      }

    }
    this.charge = this.totalCharge + this.totalTax + this.includedTicketAmount - this.paymentCharge;
    this.balanceDuePopUp = this.charge;
    this.listCharge = this.charge;
    this.balanceDue = this.servicesCharge + this.productsCharge + this.othersCharge + this.tipsCharge + this.totalTax;
    if (this.totalCharge + this.totalTax + this.includedTicketAmount <= this.paymentCharge) {
      this.chargeButton = false;
    } else {
      this.chargeButton = true;
    }
  }
  setAmountDetails() {
    this.apptAmountDetails.ProductAmount = this.productsCharge;
    this.apptAmountDetails.ServiceAmount = this.servicesCharge;
    this.apptAmountDetails.OthersAmount = this.othersCharge;
    this.apptAmountDetails.TipsAmount = this.tipsCharge;
    this.apptAmountDetails.ServiceTaxAmount = this.serTax;
    this.apptAmountDetails.ProductTaxAmount = this.prodTax;
    this.apptAmountDetails.deleteOthersAmount = 0;
    this.apptAmountDetails.deleteProductAmount = 0;
    this.apptAmountDetails.deleteProductTaxAmount = 0;
    this.apptAmountDetails.deleteServiceAmount = 0;
    this.apptAmountDetails.deleteServiceTaxAmount = 0;
    this.apptAmountDetails.deleteTipsAmount = 0;
  }
  calServRetTax() {
    this.serTax = 0;
    this.prodTax = 0;
    this.packageTax = 0;
    this.totalTax = 0;
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      for (let i = 0; i < this.TicketServiceData.length; i++) {
        if (this.TicketServiceData[i]['Taxable__c'] === 1) {
          this.serTax += this.TicketServiceData[i].Service_Tax__c;
        }
      }
    }
    if (this.ticketProductsList && this.ticketProductsList.length > 0) {
      for (let i = 0; i < this.ticketProductsList.length; i++) {
        if (this.ticketProductsList[i]['Taxable__c'] === 1) {
          this.prodTax += this.ticketProductsList[i].Product_Tax__c;
        }
      }
    }
    if (this.ticketOthersList && this.ticketOthersList.length > 0) {
      for (let i = 0; i < this.ticketOthersList.length; i++) {
        if (this.ticketOthersList[i].Package__c) {
          this.totalCharge += parseFloat(this.ticketOthersList[i].Package_Price__c);
          this.othersCharge += parseFloat(this.ticketOthersList[i].Package_Price__c);
          this.packageTax += this.ticketOthersList[i]['Service_Tax__c'];
        }
      }
    }
    this.totalTax = this.serTax + this.prodTax + this.packageTax;
  }
  // Rewards start

  getRewards() {
    this.checkOutEditTicketService.getRewardsData().subscribe(
      data => {
        const tempRwdData = data['result'].filter((obj) => obj.Active__c === 1);
        this.allRwdsList = data['result'];
        this.clientRwrdsData = [];
        if (tempRwdData && tempRwdData.length > 0) {
          for (let i = 0; i < tempRwdData.length; i++) {
            const temp = JSON.parse(tempRwdData[i].Award_Rules__c);
            const temp2 = JSON.parse(tempRwdData[i].Redeem_Rules__c);
            let points = 0;
            let redeemPoints = 0;
            for (let j = 0; j < temp.length; j++) {
              points = 0;
              redeemPoints = 0;
              points += temp[j]['awardPoints'];
              this.clientRwrdsData.push({
                rwdId: tempRwdData[i].Id,
                rwdName: tempRwdData[i].Name,
                points: points,
                item: temp[j].item,
                stDate: temp[j].startDate,
                endDate: temp[j].endDate,
                forEvery: temp[j].forEvery,
                redeemJson: temp2,
                isOnlyUsed: false,
                used: 0
              });
            }
          }
          // this.clientRwrdsData = this.getFilterRwdsByAwardRules(this.clientRwrdsData);
          this.clientRwrdsData = this.commonService.getFilterRwdsByAwardRules(this.clientRwrdsData, this.apptData);
        }
        this.getClientRewardData(this.clientId);
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
  filterRewards(rewardsForClient) {
    const rtnObj: any = { 'srvcRwds': [], 'prodRwds': [] };
    // const rList = rewardsForClient.filter((obj) => obj.Active__c);
    const rList = rewardsForClient;
    let serviceDate = new Date();
    if (this.apptData && this.apptData.apdate) {
      const tempDtStr = this.apptData.apdate.split(' ')[0].split('-');
      serviceDate = new Date(tempDtStr[0], (parseInt(tempDtStr[1], 10) - 1), tempDtStr[2]);
    }
    this.rtnRwds = [];
    const temp = [];
    for (let i = 0; i < rList.length; i++) {
      const tempJSONObj = JSON.parse(rList[i].Redeem_Rules__c);
      const awdJSONObj = JSON.parse(rList[i].Award_Rules__c);
      for (let j = 0; j < tempJSONObj.length; j++) {
        if (rList[i]['points'] > tempJSONObj[j]['redeemPoints']) {
          if (tempJSONObj[j]['startDate'] && tempJSONObj[j]['endDate']) {
            const stDtAry = tempJSONObj[j]['startDate'].split(' ')[0].split('-');
            const stDt = new Date(stDtAry[0], (parseInt(stDtAry[1], 10) - 1), stDtAry[2]);
            const endDtAry = tempJSONObj[j]['endDate'].split(' ')[0].split('-');
            const endDt = new Date(endDtAry[0], (parseInt(endDtAry[1], 10) - 1), endDtAry[2]);
            if (stDt <= serviceDate && endDt >= serviceDate) {
              this.rtnRwds = this.commonService.insrtRwds(tempJSONObj, rList, i, j);
            }
          } else {
            this.rtnRwds = this.commonService.insrtRwds(tempJSONObj, rList, i, j);
          }
          if (this.rtnRwds.srvcRwds) {
            rtnObj.srvcRwds.push(this.rtnRwds.srvcRwds);
          }
          if (this.rtnRwds.prodRwds) {
            rtnObj.prodRwds.push(this.rtnRwds.prodRwds);
          }
        }
      }
    }
    this.rtnRwds = [];
    return rtnObj;
  }
  /**
   * Clear sale code starts
   */
  Clear_Sale() {
    if (this.apptId !== undefined && this.apptId !== 'undefined' && this.apptId !== '') {
      const answer = confirm('Are you sure you want to clear all sales from this ticket?');
      if (answer) {
        this.checkOutEditTicketService.deleteClearSale(this.apptId).subscribe(data => {
          this.getTicketServices(this.apptId);
          this.getTicketProducts(this.apptId);
          this.getOthersTicketDetails();
          this.getCalList();
          this.getWorkerTips();
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
    } else {
      confirm('Are you sure you want to clear all sales from this ticket?');
    }
  }
  /**
   * clear sale code ends
   */
  // common cancel modal
  commonCancelModal() {
    this.serviceModal.hide();
    this.productModal.hide();
    this.getPromotions();
    this.productWorkersList = [];
    this.productPromotionsList = [];
    this.allPromData = [];
    this.getWorkersList();
    this.productModal.hide();
    this.paymentsModal.hide();
    this.promotionsModal.hide();
    this.miscModal.hide();
    this.othersModal.hide();
    this.updateOthersInfo = {};
    this.clientSearchModal.hide();
    this.tipsModal.hide();
    this.cloverModal.hide();
    this.workerTips = {};
    this.enterManuallyButton = false;
    this.error = '';
    this.giftError = '';
    this.zipCode = '';
    this.cardNumber = '';
    this.cvv = '';
    this.expMonth = 1;
    this.expYear = 0;
    this.workerId = '';
    this.price = 0.00;
    this.notes = '';
    this.clientName = '';
    this.paymentNotes = '';
    this.rewardId = 'None';
    this.promotionId = 'None';
    this.productQuantity = 1;
    this.rewardName = 'None';
    this.getPromotions();
    // this.getClientRewardData();
    this.enterManually = false;
    this.redeemName = '';
    this.isBookedPackage = false;
    this.clientRwdArray = [];
    this.getRewards();
    this.clearErrorMsg();
  }
  updateTabs(order: number) {
    this.giftNumber = '';
    for (let i = 0; i < this.activeTab.length; i++) {
      if (i === order) {
        this.activeTab[i] = true;
        this.activeTabClass[i] = 'active';
      } else {
        this.activeTab[i] = false;
        this.activeTabClass[i] = '';
      }
    }
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
  closeModal() {
    this.commonCancelModal();
  }
  /* method to restrict specialcharecters  */
  numOnly(event: any) {
    const pattern = /[1-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  getHideClientContactInfo() {
    this.newClientService.getHideCliContactInfo(this.decodeUserToken.data.id).subscribe(data => {
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

  autofocusSwipe() {
    setTimeout(() => {
      if (document.getElementById('swipeId')) {
        const swipeField = <HTMLInputElement>document.getElementById('swipeId');
        swipeField.focus();
      }
    }, 1000);
  }

  getCardDetails() {
    setTimeout(() => {
      const details1 = this.swipePwd.split('^');
      this.cardNumber = details1[0].substring(2);
      let details2 = details1[2].split(';');
      details2 = details2[1].split('=');
      const exp_date = details2[1];
      this.expMonth = parseInt(exp_date.substring(2, 4), 10);
      this.expYear = parseInt('20' + exp_date.substring(0, 2), 10);
      this.cvv = '123';
      // this.toastr.info('Please wait, submitting your card details', null, { timeOut: 5000 });
      this.proceedToPayment(true);
    }, 1000);
  }

  clearSwipe() {
    this.swipePwd = '';
    this.autofocusSwipe();
    this.toastr.info('Card data cleared', null, { timeOut: 3000 });
  }

  cloverImpl() {
    this.checkOutEditTicketService.getCloverDevices().subscribe(data => {
      this.cloverDeviceList = data['result'];
      if (this.cloverDeviceList.length === 0) {
        this.toastr.warning('No Clover Device found to connect', null, { timeOut: 4000 });
      } else if (this.cloverDeviceList.length === 1) {
        this.cloverDevice = this.cloverDeviceList[0]['id'];
        this.connectCloverDevice();
      } else {
        this.cloverDevice = this.cloverDeviceList[0]['id'];
        this.cloverModal.show();
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

  connectCloverDevice() {
    this.toastr.info('Please wait, connecting to Clover device', null, { timeOut: 5000 });
    const args = [this, config.cloverCfg.remoteAppId,
      clover.BrowserWebSocketImpl.createInstance,
      new clover.ImageUtil(),
      config.cloverCfg.server,
      config.cloverCfg.accessToken,
      new clover.HttpSupport(XMLHttpRequest),
      config.cloverCfg.merchantId,
      this.cloverDevice,
      'guestId'];
    const cloverConnectorFactoryConfiguration = {};
    cloverConnectorFactoryConfiguration[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
    const cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(cloverConnectorFactoryConfiguration);
    if (this.cloverConnector) {
      this.cloverConnector.dispose();
    }
    this.cloverConnector = cloverConnectorFactory.createICloverConnector(new (Function.prototype.bind.apply(clover.WebSocketCloudCloverDeviceConfiguration, args)));
    this.setCloverConnectorListener(this.cloverConnector);
    this.setDisposalHandler();
    this.cloverConnector.initializeConnection();
    this.commonCancelModal();
  }

  setCloverConnectorListener(cloverConnector) {
    const CloverConnectorListener = function (connector) {
      const clvObj = new clover.remotepay.ICloverConnectorListener();
      this.cloverConnector = connector;
    };
    CloverConnectorListener.prototype = Object.create(clover.remotepay.ICloverConnectorListener.prototype);
    CloverConnectorListener.prototype.constructor = CloverConnectorListener;
    CloverConnectorListener.prototype.onDeviceConnected = function () {
    };
    CloverConnectorListener.prototype.onDeviceReady = function (merchInfo) {
      const toastEle = <HTMLInputElement>document.getElementById('toastMsgId');
      toastEle.value = 'Connectd to device ' + merchInfo.deviceInfo.name + '---' + 'success';
      const evObj = document.createEvent('Events');
      evObj.initEvent('click', true, false);
      toastEle.dispatchEvent(evObj);
      window.localStorage.setItem('lastTransactionRequestAmount', document.getElementById('totalAmountId').innerHTML.replace(/\./g, '').replace(/,/g, ''));
      const saleRequest = new clover.remotepay.SaleRequest();
      // saleRequest.setCardEntryMethods(clover.CardEntryMethods.CARD_ENTRY_METHOD_MANUAL); // To set card enter manually
      saleRequest.setAmount(parseInt(document.getElementById('totalAmountId').innerHTML.replace(/\./g, '').replace(/,/g, ''), 10));
      saleRequest.setExternalId(clover.CloverID.getNewId());
      cloverConnector.sale(saleRequest);
    };
    CloverConnectorListener.prototype.onDeviceError = function (deviceErrorEvent) {
      const toastEle = <HTMLInputElement>document.getElementById('toastMsgId');
      toastEle.value = deviceErrorEvent.getMessage() + '---' + 'error';
      const evObj = document.createEvent('Events');
      evObj.initEvent('click', true, false);
      toastEle.dispatchEvent(evObj);
    };
    CloverConnectorListener.prototype.onDeviceDisconnected = function () {
      const toastEle = <HTMLInputElement>document.getElementById('toastMsgId');
      toastEle.value = 'Clover device disconnected' + '---' + 'error';
      const evObj = document.createEvent('Events');
      evObj.initEvent('click', true, false);
      toastEle.dispatchEvent(evObj);
    };
    CloverConnectorListener.prototype.onVerifySignatureRequest = function (verifySignatureRequest) {
      // const canvas = <HTMLCanvasElement>document.getElementById('verify-signature-canvas');
      // const ctx = canvas.getContext('2d');
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.scale(0.25, 0.25);
      // ctx.beginPath();
      // for (let strokeIndex = 0; strokeIndex < verifySignatureRequest.getSignature().strokes.length; strokeIndex++) {
      //   const stroke = verifySignatureRequest.getSignature().strokes[strokeIndex];
      //   ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      //   for (let pointIndex = 1; pointIndex < stroke.points.length; pointIndex++) {
      //     ctx.lineTo(stroke.points[pointIndex].x, stroke.points[pointIndex].y);
      //     ctx.stroke();
      //   }
      // }
      // ctx.scale(4, 4);
      setTimeout(function () {
        if (confirm('Would you like to approve signature?')) {
          this.cloverConnector.acceptSignature(verifySignatureRequest);
        } else {
          this.cloverConnector.rejectSignature(verifySignatureRequest);
        }
      }.bind(this), 0);
    };
    CloverConnectorListener.prototype.onConfirmPaymentRequest = function (confirmPaymentRequest) {
      for (let i = 0; i < confirmPaymentRequest.getChallenges().length; i++) {
        const isLastChallenge = i === confirmPaymentRequest.getChallenges().length - 1;
        if (confirm(confirmPaymentRequest.getChallenges()[i].getMessage())) {
          if (isLastChallenge) {
            this.cloverConnector.acceptPayment(confirmPaymentRequest.getPayment());
          }
        } else {
          this.cloverConnector.rejectPayment(confirmPaymentRequest.getPayment(), confirmPaymentRequest.getChallenges()[i]);
          return;
        }
      }
    };
    CloverConnectorListener.prototype.onSaleResponse = function (saleResponse) {
      if (saleResponse.getSuccess()) {
        const saleRequestAmount = parseInt(window.localStorage.getItem('lastTransactionRequestAmount'), 10);
        const saleResponseAmount = saleResponse.getPayment().getAmount();
        const wasPartialAuth = saleResponseAmount < saleRequestAmount;
        const formattedSaleResponseAmount = (saleResponseAmount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        localStorage.setItem('approval', saleResponse.payment.id);
        localStorage.setItem('reference', saleResponse.payment.order.id);
        localStorage.setItem('tip', saleResponse.payment.tipAmount);
        if (wasPartialAuth) {
          const remainingBalance = saleRequestAmount - saleResponseAmount;
          const formattedRemainingBalance = (remainingBalance / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
          alert(`Partially authorized for ${formattedSaleResponseAmount} — remaining balance is ${formattedRemainingBalance}. Ask the customer for an additional payment method.`);
          // const toastEle = <HTMLInputElement>document.getElementById('toastMsgId');
          // toastEle.value = 'Partially authorized for ' + formattedSaleResponseAmount
          //   + ' — remaining balance is ' + formattedRemainingBalance
          //   + '. Ask the customer for an additional payment method.' + '---' + 'error';
          // const evObj = document.createEvent('Events');
          // evObj.initEvent('click', true, false);
          // toastEle.dispatchEvent(evObj);
          // const saleRequest = new clover.remotepay.SaleRequest();
          // saleRequest.setAmount(remainingBalance);
          // saleRequest.setExternalId(clover.CloverID.getNewId());
          // window.localStorage.setItem('lastTransactionRequestAmount', remainingBalance.toString());
          // this.cloverConnector.sale(saleRequest);
          const insPay = <HTMLInputElement>document.getElementById('insPayId');
          insPay.value = (saleResponseAmount / 100).toString();
          const evObj = document.createEvent('Events');
          evObj.initEvent('click', true, false);
          insPay.dispatchEvent(evObj);
        } else {

          const completeTrs: any = document.getElementById('completeTrsId');
          const evObj = document.createEvent('Events');
          evObj.initEvent('click', true, false);
          completeTrs.dispatchEvent(evObj);
        }
      } else {
        if (saleResponse.getReason() !== 'FAIL') {
          const toastEle = <HTMLInputElement>document.getElementById('toastMsgId');
          toastEle.value = saleResponse.getMessage() + '---' + 'error';
          const evObj = document.createEvent('Events');
          evObj.initEvent('click', true, false);
          toastEle.dispatchEvent(evObj);
        }
      }
    };
    this.cloverConnectorListener = new CloverConnectorListener(this.cloverConnector);
    this.cloverConnector.addCloverConnectorListener(this.cloverConnectorListener);
  }

  setDisposalHandler() {
    window.onbeforeunload = function (event) {
      try {
        this.cloverConnector.dispose();
      } catch (e) {
        // console.error(e);
      }
    }.bind(this);
  }

  completeClover() {
    this.toastr.success('Your Clover payment was successfully completed', null, { timeOut: 3000 });
    const paymentData = {
      'PAYMENTRESPONSE': {
        'APPROVALCODE': [''],
        'UNIQUEREF': ['']
      }
    };
    paymentData.PAYMENTRESPONSE.APPROVALCODE[0] = localStorage.getItem('approval');
    paymentData.PAYMENTRESPONSE.UNIQUEREF[0] = localStorage.getItem('reference');
    let cloverTipTotal: any = localStorage.getItem('tip');
    cloverTipTotal = parseInt(cloverTipTotal, 10);
    this.cloverTip = cloverTipTotal / 100;
    if (cloverTipTotal > 0) {
      const reqObj = {
        'apptid': this.apptId,
        'tip': cloverTipTotal
      };
      this.checkOutEditTicketService.insertCloverTip(reqObj).subscribe();
    }
    setTimeout(() => {
      localStorage.removeItem('approval');
      localStorage.removeItem('reference');
      localStorage.removeItem('tip');
      localStorage.removeItem('lastTransactionRequestAmount');
    }, 500);
    this.selectedPaymentId = this.paymentsData.filter((obj) => obj.Name === 'Clover')[0]['Id'];
    this.savePaymentsData(paymentData);
  }

  updateClvParms() {
    const deviceObj = JSON.parse(localStorage.getItem('browserObject'));
    if (deviceObj && deviceObj['CreditCardDevice'] === 'Clover') {
      this.cloverChk = true;
    } else {
      this.cloverChk = false;
    }
  }

  displayToast() {
    let toastMsg: any = <HTMLInputElement>document.getElementById('toastMsgId');
    toastMsg = toastMsg.value.split('---');
    if (toastMsg[1] === 'error') {
      this.toastr.error(toastMsg[0], null, { timeOut: 4000 });
    } else if (toastMsg[1] === 'info') {
      this.toastr.info(toastMsg[0], null, { timeOut: 2000 });
    } else {
      this.toastr.success(toastMsg[0], null, { timeOut: 1000 });
    }
  }

  insertPayment() {
    const insPay = <HTMLInputElement>document.getElementById('insPayId');
    this.charge = parseFloat(insPay.value);
    this.completeClover();
  }
}
