import { Component, OnInit, ViewChild, Inject } from '@angular/core';
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
// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
// import { WebcamImage } from '../../../assets/webcammodules/webcam/domain/webcam-image';
@Component({
  selector: 'app-checkouteditticket',
  templateUrl: './checkouteditticket.html',
  providers: [CheckOutEditTicketService, NewClientService, CommonService],
  styleUrls: ['./checkouteditticket.component.css']
})
export class CheckOutEditTicketComponent implements OnInit {
  showPrice = true;
  activeClass: any;
  activeClass1: any;
  marketingActiveClass: any;
  clientImgPath = '';
  clientId: any;
  clientRewardsDatabyApptId = [];
  giftCurrentBal = 0;
  giftError: any;
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
  promotionsData: any = [];
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
  rewardId: any;
  showSelectPromotion = true;
  showSelectReward = true;
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
  productObj: any;
  productQuantity = 1;
  productId: any;
  productTaxable: any;
  productWorkerId = '** None **';
  productClientId: any;
  productProRePrice: any = 0;
  promotionId: any;
  productError: any;
  promotionsProdData: any = [];
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
  cardHolderName: any;
  cardNumber: any;
  zipCode: any;
  cvv: any;
  monthList = ['01 - January', '02 - February', '03 - March', '04 - April', '05 - May', '06 - June',
    '07 - July', '08 - August', '09 - September', '10 - October', '11 - November', '12 - December'];
  yearList = [];
  expYear = 0;
  expMonth = '01 - January';
  // misc
  misc = '';
  miscCalList = [];
  calTransactionType = [];
  calAmount: any;
  miscId: any;
  miscScale = 'Misc Sale';
  miscError: any;
  // others start
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
  rowsPerPage: any;
  filterClient: any;
  profileList = true;
  searchData = false;
  clientPackageData: any;
  includedTicketAmount = 0;
  /* creditcard device details */
  obj: any;
  addCreditCardDevice: any;
  ticketNumber: any;
  public searchField = new FormControl();
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
    this.search();
    this.getFavouritesData();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
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

    if (!this.apptId) {
      this.getPromotions();
      // this.getClientRewardData();
      this.getPaymentTypes();
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
  // filterClientBySearchValue(searchKey) {
  //   searchKey = searchKey.toLowerCase();
  //   let searchFilterData = [];
  //   searchFilterData = this.DataObj.filter((obj1) => {
  //     const name = obj1.FirstName + ' ' + obj1.LastName;
  //     if (name.toLowerCase().indexOf(searchKey) !== -1) {
  //       return true;
  //     }
  //   });
  //   this.filterClient = searchFilterData;
  //   if (this.filterClient.length > 0) {
  //     this.searchData = true;
  //   } else {
  //     this.searchData = false;
  //   }
  // }
  /**
   * Navigation to add new client
   */
  addNewClient() {
    this.router.navigate(['/client/quick/add']);
  }
  /* Method to search client data */
  // searchClients(searchKey) {
  //   this.checkOutEditTicketService.getData(searchKey)
  //     .subscribe(data => {
  //       this.DataObj = data['result'];
  //       // this.clientSearchModal.show();
  //     }, error => {
  //       const status = JSON.parse(error['status']);
  //       const statuscode = JSON.parse(error['_body']).status;
  //       switch (JSON.parse(error['_body']).status) {
  //         case '2033':
  //           this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
  //           window.scrollTo(0, 0);
  //           break;
  //       }
  //       if (statuscode === '2085' || statuscode === '2071') {
  //         this.router.navigate(['/']).then(() => { });
  //       }
  //     });
  // }
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
          const rwdData = this.filterRewards(data['result']);
          this.serviceRewards = this.commonService.removeDuplicates(rwdData.srvcRwds, 'Name');
          this.productRewards = this.commonService.removeDuplicates(rwdData.prodRwds, 'Name');
          this.finalRewardsList = this.serviceRewards.concat(this.productRewards);
          // this.finalRewardsList = this.removeDuplicates(this.finalRewardsList, 'Name');
          if (this.clientRwrdsData && this.clientRwrdsData.length > 0) {
            for (let i = 0; i < this.finalRewardsList.length; i++) {
              for (let j = 0; j < this.clientRwrdsData.length; j++) {
                if (this.clientRwrdsData[j].rwdId === this.finalRewardsList[i].Id) {
                  this.clientRwrdsData[j]['crId'] = this.finalRewardsList[i]['crId'];
                  this.clientRwrdsData[j]['crdId'] = this.finalRewardsList[i]['crdId'];
                  this.clientRwrdsData[j]['isNew'] = false;
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
  // getClientRewardDatabyApptId(apptId) {
  //   this.checkOutEditTicketService.clientRewardDatabyApptId(this.apptId).subscribe(
  //     data => {
  //       this.clientRewardsDatabyApptId = data['result'];
  //     },
  //     error => {
  //       const errStatus = JSON.parse(error['_body'])['status'];
  //       if (errStatus === '2085' || errStatus === '2071') {
  //         this.router.navigate(['/']).then(() => { });
  //       }
  //     });
  // }
  /**
   * Method to get promotions data
   */
  getPromotions() {
    this.checkOutEditTicketService.getPromotionsData().subscribe(data => {
      this.promotionsData = data['result'].filter(
        filterList => filterList.Active__c === 1);
      if (this.promotionsData && this.promotionsData.length > 0) {
        this.updatePromotionId = this.promotionsData[0]['Promotion__c'];
      }
      const promArray = this.promotionsData.filter(
        filterList => filterList.Service_Discount__c === 1);
      const promProdArray = this.promotionsData.filter(
        filterList => filterList.Product_Discount__c === 1);
      this.promotionsData = [];
      this.allPromData = [];
      let serviceDate;
      if (this.apptData && this.apptData.apdate) {
        serviceDate = this.apptData.apdate.split(' ')[0];
      } else {
        const date = (new Date().getMonth() + 1) + '/' + new Date().getDate() + '/' + new Date().getFullYear();
        serviceDate = date.split(' ')[0];
      }
      // for Services
      this.promotionsData = [];
      for (let i = 0; i < promArray.length; i++) {
        if ((promArray[i].Start_Date__c !== null && promArray[i].End_Date__c !== null) &&
          (new Date(promArray[i].Start_Date__c) <= new Date(serviceDate)
            && new Date(promArray[i].End_Date__c) >= new Date(serviceDate)) &&
          (promArray[i].Service_Discount__c === 1)) {
          this.promotionsData.push(promArray[i]);
          this.allPromData.push(promArray[i]);
        } else if (((promArray[i].Start_Date__c === null && promArray[i].End_Date__c === null))
          && promArray[i].Service_Discount__c === 1) {
          this.promotionsData.push(promArray[i]);
          this.allPromData.push(promArray[i]);
        }
      }
      // for products
      this.promotionsProdData = [];
      for (let i = 0; i < promProdArray.length; i++) {
        if ((promProdArray[i].Start_Date__c !== null && promProdArray[i].End_Date__c !== null) &&
          (new Date(promProdArray[i].Start_Date__c) <= new Date(serviceDate)
            && new Date(promProdArray[i].End_Date__c) >= new Date(serviceDate)) &&
          (promProdArray[i].Product_Discount__c === 1)) {
          this.promotionsProdData.push(promProdArray[i]);
          this.allPromData.push(promArray[i]);
        } else if (((promProdArray[i].Start_Date__c === null && promProdArray[i].End_Date__c === null))
          && promProdArray[i].Product_Discount__c === 1) {
          this.promotionsProdData.push(promProdArray[i]);
          this.allPromData.push(promArray[i]);
        }
      }
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
        this.getClientPackages(this.clientId);
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
      this.ticketPaymentId = data.result.Id;
      for (let i = 0; i < this.paymentsData.length; i++) {
        if (this.paymentsData[i].Icon_Document_Name__c !== 'undefined') {
          this.paymentsData[i].Icon_Name = this.apiEndPoint + '/' + this.paymentsData[i].Icon_Document_Name__c;
        }
        if (!this.clientId || this.clientId === '' || this.clientId === null || this.clientId === 'null') {
          if (this.paymentsData[i].Name === 'Account Charge' || this.paymentsData[i].Name === 'Card on File') {
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
      this.charge = list.Amount_Paid__c;
      this.showRedAmount = true;
      this.ticketPaymentId = list.Id;
      this.giftNumber = list.Gift_Number__c;
      this.amountPaid = list.Amount_Paid__c;
      this.paymentNotes = list.Notes__c;
      this.paymentsModal.show();
      this.changeBack = '';
    }
  }
  // getGiftData() {
  //   if (this.giftNumber && this.giftNumber !== '') {
  //     this.checkOutEditTicketService.getGiftData(this.giftNumber)
  //       .subscribe(data => {

  //         console.log(data['result'])
  //         if (data['result'] && data['result'].length > 0) {
  //           const giftData = data['result'].result[0];
  //           this.giftCurrentBal = giftData.currentBalnce;
  //           if (this.amountPaid >= this.giftCurrentBal) {
  //             this.giftError = 'Gift Number has no remaining balance';
  //           }
  //         }
  //       }, error => {
  //         const status = JSON.parse(error['status']);
  //         const statuscode = JSON.parse(error['_body']).status;
  //         switch (JSON.parse(error['_body']).status) {
  //           case '2033':
  //             this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
  //             window.scrollTo(0, 0);
  //             break;
  //         }
  //         if (statuscode === '2085' || statuscode === '2071') {
  //           if (this.router.url !== '/') {
  //             localStorage.setItem('page', this.router.url);
  //             this.router.navigate(['/']).then(() => { });
  //           }
  //         }
  //       });
  //   }
  // }
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
    this.paymentsModal.show();
    this.getPaymentTypes();
  }
  showPaymentsModal(paymentType) {
    this.obj = localStorage.getItem('browserObject');
    if (this.obj === null) {
      this.addCreditCardDevice = '';
    } else if (this.obj !== undefined || this.obj !== '') {
      this.obj = JSON.parse(this.obj);
      this.addCreditCardDevice = this.obj.CreditCardDevice;
    }
    this.clientPckgArray = [];
    this.clientRwdArray = [];
    if ((this.TicketServiceData && this.TicketServiceData.length > 0) && (this.ticketProductsList && this.ticketProductsList.length > 0)) {
      this.clientRwdArray = this.clientRwrdsData;
    } else if ((this.TicketServiceData && this.TicketServiceData.length > 0) && (this.ticketProductsList && this.ticketProductsList.length <= 0)) {
      this.clientRwdArray = this.clientRwrdsData.filter((obj) => obj.item === 'Services');
    } else if ((this.TicketServiceData && this.TicketServiceData.length <= 0) && (this.ticketProductsList && this.ticketProductsList.length > 0)) {
      this.clientRwdArray = this.clientRwrdsData.filter((obj) => obj.item === 'Products');
    }
    const dataFilter = [];
    console.log(this.clientRwdArray)
    if (this.clientRwdArray && this.clientRwdArray.length > 0) {
      for (let i = 0; i < this.clientRwdArray.length; i++) {
        if (this.clientRwdArray[i]['isNew'] === undefined) {
          this.clientRwdArray[i]['isNew'] = true;
        }
        if (this.clientRwdArray[i]['item'] === 'Services') {
          this.clientRwdArray[i]['points'] = parseFloat(this.clientRwdArray[i]['points']) * (parseFloat(this.servicesCharge));
        }
        if (this.clientRwdArray[i]['item'] === 'Products') {
          this.clientRwdArray[i]['points'] = parseFloat(this.clientRwdArray[i]['points']) * (parseFloat(this.productsCharge));
        }
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
                if ((this.TicketServiceData[i].reward__c === this.clientRwdArray[j].rwdId) && this.clientRwdArray[j].redeemJson[k]['onOneItem'] === 'Services') {
                  redeempoints += this.clientRwdArray[j].redeemJson[k]['redeemPoints'];
                  this.clientRwdArray[j]['points'] = this.clientRwdArray[j]['points'] - redeempoints;
                  this.clientRwdArray[j]['used'] = redeempoints;
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
                if (this.ticketProductsList[i].Reward__c === this.clientRwdArray[j].rwdId && this.clientRwdArray[j].redeemJson[k]['onOneItem'] === 'Products') {
                  redeempoints += this.clientRwdArray[j].redeemJson[k]['redeemPoints'];
                  this.clientRwdArray[j]['points'] = this.clientRwdArray[j]['points'] - redeempoints;
                  this.clientRwdArray[j]['used'] = redeempoints;
                }
              }
              redeempoints = 0;
            }
          }
        }
      }
      // this.clientRwdArray = this.getFilterRwdsByAwardRules(this.clientRwdArray);
    }
    // for packages
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      for (let i = 0; i < this.TicketServiceData.length; i++) {
        if (this.TicketServiceData[i].Booked_Package__c && this.TicketServiceData[i].Booked_Package__c !== '' && this.TicketServiceData[i].Booked_Package__c !== null) {
          for (let j = 0; j < this.packagesList.length; j++) {
            if (this.TicketServiceData[i].Booked_Package__c === this.packagesList[j].Id) {
              const tempPkgListJSON = JSON.parse(this.packagesList[j].JSON__c);
              for (let k = 0; k < tempPkgListJSON.length; k++) {
                if (this.TicketServiceData[i].ServiceId === tempPkgListJSON[k].serviceId) {
                  tempPkgListJSON[k].used += 1;
                }
                this.clientPckgArray.push({
                  'pckgId': this.TicketServiceData[i].Booked_Package__c,
                  'clientId': this.clientId,
                  'apptId': this.apptId,
                  'pckgDetails': JSON.stringify(tempPkgListJSON[k])
                });
              }
            }
          }
        }
      }
    }
    if (paymentType.Name === 'Gift Redemption') {
      this.paymentAction = 'Add';
      this.showRedAmount = true;
      const temp = this.charge.toFixed(2);
      this.amountPaid = Number(temp);
      this.popUpPaymentName = paymentType.Name;
      this.selectedPaymentId = paymentType.Id;
      this.paymentsModal.show();
      this.changeBack = '';
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
      } else {
        // this.popUpPaymentName = this.paymentsData[0].Name;
        // this.selectedPaymentId = this.paymentsData[0].Id;
        // if (this.paymentsData[0].Process_Electronically__c === 1) {
        //   this.enterManuallyButton = true;
        // } else {
        //   this.enterManuallyButton = false;
        // }
        // this.paymentsModal.show();
      }
    }
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
          'Payment_Gateway_Name__c': 'AnywhereCommerce', 'FirstName': 'STX',
          'LastName': 'QA 2017'
        });
        if (data['result'] && data['result'].length > 0) {
          this.merchantWorkerList = this.merchantWorkerList.concat(data['result']);
        }
        // for default values
        this.merchantAccntName = this.merchantWorkerList[0]['Payment_Gateway_Name__c'];
        this.paymentGateWay = this.merchantWorkerList[0]['FirstName'] + this.merchantWorkerList[0]['LastName'];
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
  proceedToPayment() {
    // if (!this.giftError || this.giftError !== '') {
    if (this.enterManuallyButton === true) {
      let paymentData;
      const d = new Date();
      const dateTime = ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2) + '-' +
        (d.getFullYear() + '').slice(-2) + ':' +
        ('00' + d.getHours()).slice(-2) + ':' +
        ('00' + d.getMinutes()).slice(-2) + ':' +
        ('00' + d.getSeconds()).slice(-2) + ':000';
      // calculate the MD5 hash format - TERMINALID+MERCHANTREF+DATETIME+CARDNUMBER+CARDEXPIRY+CARDTYPE+CARDHOLDERNAME+secret
      const hash = Md5.hashStr(config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID + this.ticketPaymentId + this.charge + dateTime + config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_KEY);
      const clientData = {
        ticketPaymntId: this.ticketPaymentId,
        terminalid: config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID,
        dateTime: dateTime,
        cardNum: this.cardNumber,
        cardType: 'VISA',
        currency: 'USD',
        terminalType: '1',
        transactionType: '4',
        hash: hash,
        amountDue: this.charge
      };
      const tokenbody = this.commonService.createPaymentToken(clientData);
      const url = 'https://testpayments.anywherecommerce.com/merchant/xmlpayment';
      this.http.post(url, tokenbody, {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method')
        , responseType: 'text'
      }).subscribe(data => {
        const parseString = require('xml2js').parseString;
        parseString(data, function (err, result) {
          paymentData = result;
        });
        if (paymentData && paymentData.PAYMENTRESPONSE) {
          this.savePaymentsData(paymentData);
        } else {
          this.error = 'Error Occured, Invalid Details';
        }
      }, (err: HttpErrorResponse) => {
      });
    } else {
      const paymentData = null;
      this.savePaymentsData(paymentData);
    }
    // }
  }
  savePaymentsData(paymentData) {
    // this.getGiftData();
    let approvalCode = '';
    if (paymentData === null) {
      approvalCode = '';
    } else {
      approvalCode = paymentData.PAYMENTRESPONSE.APPROVALCODE[0];
    }
    if (this.paymentAction === 'Add') {
      let apptStatus;
      if (this.charge >= this.listCharge) {
        apptStatus = 'Complete';
      } else {
        apptStatus = 'Checked In';
      }
      const paymentObj = {
        'Id': this.ticketPaymentId,
        'amountToPay': this.charge,
        'apptId': this.apptId,
        'merchantAccnt': this.merchantAccntName,
        'notes': this.paymentNotes,
        'paymentType': this.selectedPaymentId,
        'cardHolderName': this.clientName,
        'cardNumber': this.cardNumber,
        'zipCode': this.zipCode,
        'expMonth': this.expMonth,
        'expYear': this.expYear,
        'cvv': this.cvv,
        'approvalCode': approvalCode,
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
        'clientRwrdIds': this.clientRewardIds
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
          this.expMonth = '';
          this.expYear = 0;
          this.enterManuallyButton = false;
          this.checkOutEditTicketService.getTicketPaymentData(this.apptId)
            .subscribe(data => {
              this.ticketPaymentList = data['result'].paymentList;
              this.calCharge();
              this.listCharge = Math.floor(this.listCharge);
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
                  this.error = 'Gift redemption code has expired';
                } break;
            }
          });
    } else if (this.paymentAction === 'Update') {
      const paymentObj = {
        'amountToPay': this.amountPaid,
        'apptId': this.apptId,
        'notes': this.paymentNotes,
        'paymentName': this.popUpPaymentName,
        'giftNumber': this.giftNumber
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
          this.expMonth = '';
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
  deleteTicketPayment() {
    this.checkOutEditTicketService.deleteTicketPayment(this.ticketPaymentId)
      .subscribe(data => {
        const removeTicketPayments = data['result'];
        this.getTicketPayment(this.apptId);
        this.commonCancelModal();
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
  merchantOnChange(value) {
    if (value && value.split('$')[0] && value.split('$')[1]) {
      this.merchantAccntName = value.split('$')[0] + value.split('$')[1];
    }
    if (value && value.spilt('$')[2]) {
      this.paymentGateWay = value.spilt('$')[2];
    }
  }
  getTicketPayment(apptId) {
    this.checkOutEditTicketService.getTicketPaymentData(this.apptId)
      .subscribe(data => {
        this.ticketPaymentList = data['result'].paymentList;
        if (this.ticketPaymentList && this.ticketPaymentList.length > 0 && this.chargeButton === true) {
          for (let i = 0; i < this.paymentsData.length; i++) {
            if (this.paymentsData[i].Name === 'Account Charge') {
              this.paymentsData.splice(i, 1);
            }
          }
          if (this.paymentsData.length < 25) {
            this.paymentsData.push({ 'Name': '', 'color': '#AAAAAA' });
          }
        }
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
  promotionOnChange(value, type) {
    if (type === 'promotion') {
      this.servicesArray[0].promotionId = value.split('$')[2];
      this.servicesArray[0].rewardId = '';
      this.showSelectReward = false;
      this.showPrice = false;
      this.showSelectPromotion = true;
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
        this.showSelectReward = true;
        this.showSelectPromotion = true;
        this.showPrice = true;
        this.servicesArray[0].Net_Price__c = this.refPrice;
        this.price = this.refPrice;
      }
    } else if (type === 'reward') {
      this.servicesArray[0].Net_Price__c = 0;
      for (let i = 0; i < this.finalRewardsList.length; i++) {
        if (this.finalRewardsList[i].Id === value && this.finalRewardsList[i].redeemjson.onOneItem === 'Services') {
          const tempJson = this.finalRewardsList[i].redeemjson;
          if (tempJson.discountType === 'Percent') {
            this.servicesArray[0].Net_Price__c = parseInt(this.refPrice, 10) - parseInt(this.price, 10) * parseInt(tempJson.discount, 10) / 100;
          } else {
            this.servicesArray[0].Net_Price__c = parseInt(this.refPrice, 10) - parseInt(tempJson.discount, 10);
          }
          this.servicesArray[0].rewardId = value;
          this.servicesArray[0].promotionId = '';
          this.showSelectReward = true;
          this.showSelectPromotion = false;
          this.showPrice = false;
          if (this.servicesArray[0].Net_Price__c <= 0) {
            this.servicesArray[0].Net_Price__c = 0;
          }
        }
      }
      this.price = this.servicesArray[0].Net_Price__c.toFixed(2);
      if (this.workerId === '') {
        this.price = 0.00;
      }
      if (value === 'None') {
        this.showSelectReward = true;
        this.showSelectPromotion = true;
        this.showPrice = true;
        this.servicesArray[0].Net_Price__c = this.refPrice;
        this.price = this.refPrice;
      }
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
          }
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
  // removeDuplicates(originalArray, prop) {
  //   const newArray = [];
  //   const lookupObject = {};
  //   for (let i = 0; i < originalArray.length; i++) {
  //     lookupObject[originalArray[i][prop]] = originalArray[i];
  //   }
  //   for (const field of Object.keys(lookupObject)) {
  //     newArray.push(lookupObject[field]);
  //   }
  //   return newArray;
  // }
  workerOnChange(value) {
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
    if (this.servicesArray[0].Taxable__c === 1) {
      this.servicesArray[0].Service_Tax__c = (this.price * this.serviceTax) / 100;
    } else {
      this.servicesArray[0].Service_Tax__c = 0;
    }
  }
  showServiceListModal(listData) {
    this.servicesArray = [];
    this.serviceAction = 'Update';
    this.serviceModal.show();
    this.popUpServiceName = listData.ServiceName;
    this.updateTicketSerivceId = listData.TicketServiceId;
    this.workerId = listData.Net_Price__c + '$' + listData.workerId;
    this.price = listData.netPrice.toFixed(2);
    this.refPrice = listData.Price__c;
    this.promotionId = listData.Promotion__c;
    this.rewardId = listData.reward__c;
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
      'notes': listData.Notes__c
    });
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
    if (this.promotionsData && this.promotionsData.length > 0) {
      for (let i = 0; i < this.promotionsData.length; i++) {
        if (listData.Promotion__c === this.promotionsData[i].Id) {
          this.promotionId = this.promotionsData[i].discountPers + '$' + this.promotionsData[i].discountAmount + '$' + this.promotionsData[i].Id;
        }
      }
    }
  }
  addToTicket() {
    this.servicesArray[0].Notes__c = this.notes;
    this.servicesArray[0].isNoService__c = 0;
    this.servicesArray[0].Net_Price__c = this.price;
    this.servicesArray[0]['Appt_Date_Time__c'] = this.commonService.getDBDatTmStr(new Date());
    if (this.serviceAction === 'Add') {
      const type = this.action;
      if (this.servicesArray[0].workerId === '' || this.servicesArray[0].workerId === null ||
        this.servicesArray[0].workerId === 'null') {
        this.serviceError = 'Worker is required';
      } else {
        this.checkOutEditTicketService.addToTicketService(this.servicesArray, type)
          .subscribe(data => {
            const ticketAddStatus = data['result'];
            if (ticketAddStatus && ticketAddStatus.apptId) {
              this.router.navigate(['/checkout/' + ticketAddStatus.apptId]);
            }
            this.popUpServiceName = '';
            this.getTicketServices(this.apptId);
            this.getTicketProducts(this.apptId);
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
        const updateServicesObj = {
          'updateServiceData': this.servicesArray
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
  addValues(serviceData) {
    if (serviceData.Id) {
      const priceLevels = JSON.parse(serviceData.pricelevels);
    }
  }
  removeTicketSerices() {
    this.checkOutEditTicketService.removeTicketSerices(this.updateTicketSerivceId)
      .subscribe(data => {
        const removeTicketServicesList = data['result'];
        this.getTicketServices(this.apptId);
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
  showFavoriteModal(favoriteslist, i) {
    this.servicesArray = [];
    this.productWorkerId = '';
    if (favoriteslist.type === 'Product') {
      this.productAction = 'Add';
      // this.promotionId = '';
      this.popupProductName = favoriteslist.name;
      this.productProRePrice = favoriteslist.price.toFixed(2);
      this.productPrice = this.productProRePrice;
      this.proRefPrice = this.productPrice;
      this.productId = favoriteslist.id;
      this.productTaxable = favoriteslist.Taxable__c;
      this.tabType = 'favourites';
      let showPopup = true;
      if (this.ticketProductsList && this.ticketProductsList.length > 0) {
        for (let j = 0; j < this.ticketProductsList.length; j++) {
          if (favoriteslist.id === this.ticketProductsList[j].Product__c) {
            this.productWorkerId = 'No Worker';
            this.productAddToTicket();
            this.productWorkerId = '';
            showPopup = false;
          }
        }
      }
      if (showPopup !== false) {
        this.productModal.show();
      }
    } else if (favoriteslist.type === 'Service') {
      this.servicesArray = [];
      this.price = parseFloat(this.price).toFixed(2);
      this.serviceAction = 'Add';
      this.servicesArray.push(favoriteslist);
      this.popUpServiceName = favoriteslist.name;
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
      this.checkOutEditTicketService.isWorkerAssociated(favoriteslist.id)
        .subscribe(data => {
          this.workerList = data['result'];
          if (this.workerList.length > 1) {
            this.serviceModal.show();
            this.showSelectPromotion = true;
            this.showSelectReward = true;
            this.showPrice = true;
            this.servicesArray[0].workerId = '';
          } else if (this.workerList.length === 1) {
            this.servicesArray[0].workerId = this.workerList[0].Price + '$' + this.workerList[0].Id;
            //  this.servicesArray[0].promotionId = 'None';
            this.price = this.workerList[0].Price;
            this.servicesArray[0].Price__c = this.price;
            this.servicesArray[0].Net_Price__c = this.price;
            if ((this.serviceTax !== '' || this.serviceTax !== null) && this.servicesArray[0].Taxable__c === 1) {
              this.servicesArray[0].Service_Tax__c = (this.price * this.serviceTax) / 100;
            } else {
              this.servicesArray[0].Service_Tax__c = 0;
            }
            this.addToTicket();
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
    this.showProductModal(this.productListData, '');
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
  /*-- This method is used to show products modal --*/
  showProductModal(productslist, index) {
    this.promotionId = 'None';
    this.rewardId = 'None';
    this.productWorkerId = '';
    this.productAction = 'Add';
    this.popupProductName = productslist.Name + '-' + productslist.Size__c + ' ' + productslist.Unit_of_Measure__c;
    this.proRefPrice = productslist.Price__c;
    this.productProRePrice = productslist.Price__c;
    if (!this.productProRePrice || this.productProRePrice === 'null' || this.productProRePrice === null) {
      this.productProRePrice = 0;
      this.productProRePrice = this.productProRePrice;
      this.productProRePrice = this.productProRePrice.toFixed(2);
    } else {
      this.productProRePrice = productslist.Price__c;
      this.productProRePrice = this.productProRePrice.toFixed(2);
    }
    this.productId = productslist.Id;
    this.productTaxable = productslist.Taxable__c;
    let showPopup = true;
    if (this.ticketProductsList && this.ticketProductsList.length > 0) {
      for (let j = 0; j < this.ticketProductsList.length; j++) {
        if (productslist.Id === this.ticketProductsList[j].Product__c) {
          this.productWorkerId = 'No Worker';
          this.productAddToTicket();
          this.productWorkerId = '';
          showPopup = false;
        }
      }
    }
    if (showPopup !== false) {
      if (productslist.Name !== '' || productslist.Id !== '') {
        this.productModal.show();
      }
    }
  }
  showListModal(ticketproductlist) {
    this.productModal.show();
    this.productAction = 'Update';
    this.ticketProductId = ticketproductlist.Id;
    this.popupProductName = ticketproductlist.Name;
    this.productWorkerId = ticketproductlist.workerId;
    this.productProRePrice = ticketproductlist.Net_Price__c.toFixed(2);
    this.proRefPrice = ticketproductlist.Price__c;
    // this.productProRePrice = this.productPrice;
    this.productQuantity = ticketproductlist.quantity;
    // if (ticketproductlist.Promotion__c === '') {
    //   this.showSelectReward = true;
    //   this.showSelectPromotion = false;
    // } else if (ticketproductlist.Reward__c === '') {
    //   this.showSelectReward = false;
    //   this.showSelectPromotion = true;
    // }
    this.promotionId = ticketproductlist.Promotion__c;
    this.rewardId = ticketproductlist.Reward__c;
    if (this.promotionId === '') {
      this.promotionId = 'None';
    }
    if (this.rewardId === '') {
      this.rewardId = 'None';
    }
    if (this.promotionsData && this.promotionsData.length > 0) {
      for (let i = 0; i < this.promotionsData.length; i++) {
        if (ticketproductlist.Promotion__c === this.promotionsData[i].Id) {
          this.promotionId = this.promotionsData[i].discountPers + '$' + this.promotionsData[i].discountAmount + '$' + this.promotionsData[i].Id;
        }
      }
    }
  }
  productWorkerOnChange(value) {
    this.productWorkerId = value;
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
  productPromotionOnChange(value, type) {
    if (type === 'promotion') {
      this.promotionId = value;
      this.rewardId = 'None';
      this.showSelectReward = false;
      this.showSelectPromotion = true;
      this.showPrice = false;
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
        this.productProRePrice = 0;
      }
      if (value === 'None') {
        this.showSelectReward = true;
        this.showSelectPromotion = true;
        this.showPrice = true;
        this.productProRePrice = parseFloat(this.productPrice).toFixed(2);
      }
    } else if (type === 'reward') {
      this.rewardId = value;
      this.promotionId = 'None';
      this.showSelectReward = true;
      this.showSelectPromotion = false;
      this.showPrice = false;
      let proPrice: any;
      for (let i = 0; i < this.finalRewardsList.length; i++) {
        if (this.finalRewardsList[i].Id === value && this.finalRewardsList[i].redeemjson.onOneItem === 'Products') {
          const tempJson = this.finalRewardsList[i].redeemjson;
          if (tempJson.discountType === 'Percent') {
            proPrice = parseInt(this.proRefPrice, 10) - parseInt(this.proRefPrice, 10) * parseInt(tempJson.discount, 10) / 100;
            proPrice = parseFloat(proPrice).toFixed(2);
          } else if (tempJson.discountType === 'Amount') {
            proPrice = parseInt(this.proRefPrice, 10) - parseInt(tempJson.discount, 10);
            proPrice = parseFloat(proPrice).toFixed(2);
          } else if (type === 'None') {
            proPrice = this.proRefPrice.toFixed(2);
          }
        }
      }
      if (this.productWorkerId) {
        this.productProRePrice = proPrice;
      } else {
        this.productProRePrice = 0;
      }
      if (value === 'None') {
        this.showSelectReward = true;
        this.showSelectPromotion = true;
        this.showPrice = true;
        this.productProRePrice = parseFloat(this.productPrice).toFixed(2);
      }
    }
  }
  prodPriceOnClick() {
    this.productProRePrice = this.productProRePrice.toFixed(2);
  }
  productAddToTicket() {
    if (this.productAction === 'Add') {
      if (this.productWorkerId === 'undefined' || this.productWorkerId === undefined ||
        this.productWorkerId === '' || this.productWorkerId === null || this.productWorkerId === 'null') {
        this.productError = 'Worker is required';
      } else {
        if (this.productTaxable === 1) {
          this.prodTax = (this.productProRePrice * this.retailTax) / 100;
        } else {
          this.prodTax = 0.00;
        }
        if (this.promotionId === 'None') {
          this.promotion__c = '';
        } else if (this.promotionId) {
          this.promotion__c = this.promotionId.split('$')[2];
        } else {
          this.promotion__c = '';
        }
        //  this.productProRePrice = this.productProRePrice;
        this.productObj = {
          'Appt_Ticket__c': this.apptId,
          'Client__c': this.productClientId,
          'Product__c': this.productId,
          'Worker__c': this.productWorkerId,
          'Price__c': this.productProRePrice,
          'Qty_Sold__c': this.productQuantity,
          'Taxable__c': this.productTaxable,
          'Promotion__c': this.promotion__c,
          'Reward__c': this.rewardId,
          'Product_Tax__c': this.prodTax * this.productQuantity,
          'isNoService__c': 1,
          'Appt_Date_Time__c': this.commonService.getDBDatTmStr(new Date())
        };
        this.checkOutEditTicketService.productAddToTicket(this.productObj, this.action)
          .subscribe(data => {
            const productAddToTicketList = data['result'];
            this.productWorkersList = [];
            this.promotionsData = [];
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
      }
    } else if (this.productAction === 'Update') {
      if (this.productWorkerId === 'undefined' || this.productWorkerId === undefined ||
        this.productWorkerId === '' || this.productWorkerId === null || this.productWorkerId === 'null') {
        this.productError = 'Worker is required';
      } else {
        if (this.retailTax !== '' || this.retailTax !== null) {
          this.prodTax = (this.productProRePrice * this.retailTax) / 100;
        }
        if (this.rewardId = 'reward=') {
          this.rewardId = '';
        }
        this.productObj = {
          'Worker__c': this.productWorkerId,
          'Price__c': this.productProRePrice,
          'Qty_Sold__c': this.productQuantity,
          'Promotion__c': this.promotionId,
          'Reward__c': this.rewardId,
          'Product_Tax__c': this.prodTax * this.productQuantity,
          'isNoService__c': 1
        };
        this.checkOutEditTicketService.updateTicket(this.ticketProductId, this.productObj)
          .subscribe(data => {
            const productAddToTicketList = data['result'];
            this.productWorkersList = [];
            this.promotionsData = [];
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
        //  this.promotionsData = [];
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
    this.checkOutEditTicketService.removeTicketProduct(this.ticketProductId)
      .subscribe(data => {
        const removeTicketProduct = data['result'];
        this.productWorkersList = [];
        this.finalRewardsList = [];
        //  this.promotionsData = [];
        this.getWorkersList();
        //   this.productQuantity = 1;
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
      if (this.TicketServiceData && this.TicketServiceData.length > 0 && this.TicketServiceData[j].Promotion__c === null) {
        if (parseInt(favoriteslist.Discount_Percentage__c, 10) !== 0 && parseInt(favoriteslist.Discount_Percentage__c, 10) !== null) {
          if (this.TicketServiceData[j].netPrice < parseInt(favoriteslist.Discount_Percentage__c, 10)) {
            this.TicketServiceData[j].Net_Price__c = 0;
          } else {
            this.TicketServiceData[j].Net_Price__c = this.TicketServiceData[j].netPrice - this.TicketServiceData[j].netPrice * parseInt(favoriteslist.Discount_Percentage__c, 10) / 100;
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
          if (this.ticketProductsList[j].Price__c < parseInt(favoriteslist.Discount_Percentage__c, 10)) {
            this.ticketProductsList[j].Net_Price__c = 0;
          } else {
            this.ticketProductsList[j].Net_Price__c = this.ticketProductsList[j].Price__c - this.ticketProductsList[j].Price__c * parseInt(favoriteslist.Discount_Percentage__c, 10) / 100;
          }
          this.ticketProductsList[j].Promotion__c = favoriteslist.id;
        } else {
          if (this.ticketProductsList[j].Price__c < parseInt(favoriteslist.Discount_Amount__c, 10)) {
            this.ticketProductsList[j].Net_Price__c = 0;
          } else {
            this.ticketProductsList[j].Net_Price__c = this.ticketProductsList[j].Price__c - parseInt(favoriteslist.Discount_Amount__c, 10);
          }
          this.ticketProductsList[j].Promotion__c = favoriteslist.id;
          this.TicketServiceData[j].Product_Tax__c = (this.TicketServiceData[j].Net_Price__c * +this.retailTax) / 100;
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
        && new Date(favoriteslist.End_Date__c) >= new Date(serviceDate)) && favoriteslist.Service_Discount__c === 1) {
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
    this.promotionsProdData = [];
    this.promotionsData = [];
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
      const calObj = {
        'Ticket__c': this.apptId,
        'Amount__c': this.misc,
        'Transaction_Type__c': this.miscScale,
        'isNoService__c': 1,
        'Appt_Date_Time__c': this.commonService.getDBDatTmStr(new Date())
      };
      this.checkOutEditTicketService.saveMisc(calObj, this.action).subscribe(data => {
        const calData = data['result'];
        if (calData && calData.apptId) {
          this.router.navigate(['/checkout/' + calData.apptId]);
        }
        this.getCalList();
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
    this.checkOutEditTicketService.getCalList(this.miscScale, this.apptId).subscribe(data => {
      this.miscCalList = data['result'];
      if (this.miscCalList && this.miscCalList.length > 0) {
        this.calCharge();
        this.getOthersTicketDetails();
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
  showMiscModal(misccallist) {
    this.miscModal.show();
    this.miscId = misccallist.Id;
    this.calAmount = misccallist.Amount__c;
  }
  updateMiscTicket() {
    const calObj = {
      'Amount__c': this.calAmount
    };
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
    this.checkOutEditTicketService.deleteMiscTicket(this.miscId).subscribe(data => {
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
      }
    );
  }
  getOthersTicketDetails() {
    this.checkOutEditTicketService.getOthersTicketList(this.apptId).subscribe(data => {
      this.ticketOthersList = data['result'];
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
    const filteredPackage = this.packagesList.filter((obj) => obj.Id === this.packageId);
    if (filteredPackage.length !== 0) {
      this.packageAmount = filteredPackage[0]['Discounted_Package__c'];
    } else {
      this.packageAmount = '';
    }
  }
  addToTicketInOthers(type: string) {
    let obj: any = {};

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
            'Transaction_Type__c': 'Received On Account'
          };
        } else {
          this.otherError = 'CHECK_OUTS.OTHERS.RECEIVED_ON_ACCOUNT_ERR';
          return;
        }
      }
        break;
      case 'package': {
        if (this.packageId !== '') {
          obj = {
            'Package__c': this.packageId,
            'Package_Price__c': +this.packageAmount,
            'Amount__c': +this.packageAmount,
            'Transaction_Type__c': 'Package'
          };
        } else {
          this.otherError = 'CHECK_OUTS.OTHERS.PACKAGE_ERR';
          return;
        }
      }
        break;
      case 'gift': {
        let isNotValidDate = false;
        if (!isNullOrUndefined(this.issueDate) && !isNullOrUndefined(this.expireDate)) {
          const giftIssueDate = new Date(this.commonService.getDBDatStr(this.issueDate));
          const giftExpireDate = new Date(this.commonService.getDBDatStr(this.expireDate));
          isNotValidDate = giftIssueDate.getTime() > giftExpireDate.getTime();
        }
        if (this.giftNumber === '' && !this.validateAmount(this.giftAmount)) {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_ERR';
          window.scrollTo(0, 0);
          return;
        } else if (this.giftNumber === '') {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_NUMBER_ERR';
          window.scrollTo(0, 0);
          return;
        } else if (this.giftNumber.length < 3) {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_NUMBER_MIN_ERR';
          window.scrollTo(0, 0);
          return;
        } else if (!this.validateAmount(this.giftAmount)) {
          this.otherError = 'CHECK_OUTS.OTHERS.GIFT_AMOUNT_ERR';
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
            'Expires__c': this.commonService.getDBDatTmStr(this.expireDate).split(' ')[0],
            'Recipient__c': this.recepient,
            'Issued__c': this.commonService.getDBDatTmStr(this.issueDate).split(' ')[0],
            'Worker__c': this.workerId
          };
        }

      }
    }
    obj = Object.assign(obj, {
      'Ticket__c': this.apptId,
      'Appt_Date_Time__c': this.commonService.getDBDatTmStr(new Date())
    });
    this.checkOutEditTicketService.addToTicket(obj, this.action).subscribe(data => {
      const dataStatus = data['result'];
      if (dataStatus && dataStatus.apptId) {
        this.router.navigate(['/checkout/' + dataStatus.apptId]);
      }
      this.clear(type);
      this.getOthersTicketDetails();
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


    this.checkOutEditTicketService.updateOthersTicket(this.updateOthersInfo.Id, this.updateOthersInfo).subscribe(data => {
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
    this.checkOutEditTicketService.detleteOthersTicket(this.updateOthersInfo.Id).subscribe(data => {
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
    this.updateOthersInfo.error = '';
    this.updateOthersInfo = Object.assign(this.updateOthersInfo, otherTicketData);
    this.othersModal.show();
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
    this.tipsModal.show();
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
    this.workerTips.status = 'update';
    this.workerTips.error = '';
    this.tipsModal.show();
  }
  addTipToWorker() {
    // delete this.workerTips.status;
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
      this.workerTips = Object.assign(this.workerTips, { 'Appt_Ticket__c': apptId });
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
      this.workerTips = Object.assign(this.workerTips, { 'Appt_Ticket__c': this.apptId });
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
    this.checkOutEditTicketService.deleteWorkerTip(this.workerTips.tipId).subscribe(data => {
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
  calServRetTax() {
    this.serTax = 0;
    this.prodTax = 0;
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
        this.prodTax += this.ticketProductsList[i].Product_Tax__c * this.ticketProductsList[i].quantity;
      }
    }
    this.totalTax = this.serTax + this.prodTax;
  }
  // Rewards start

  getRewards() {
    this.checkOutEditTicketService.getRewardsData().subscribe(
      data => {
        const tempRwdData = data['result'].filter((obj) => obj.Active__c === 1);
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
                // redeemPoints: redeemPoints,
                redeemJson: temp2
              });
            }
          }
          this.clientRwrdsData = this.getFilterRwdsByAwardRules(this.clientRwrdsData);
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
    const rList = rewardsForClient.filter((obj) => obj.Active__c);
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
    // this.servicesListModal.hide();
    this.serviceModal.hide();
    this.productModal.hide();
    this.showSelectReward = true;
    this.showSelectPromotion = true;
    this.showPrice = true;
    this.getPromotions();
    this.productWorkersList = [];
    this.promotionsProdData = [];
    this.getWorkersList();
    this.productModal.hide();
    this.paymentsModal.hide();
    this.promotionsModal.hide();
    this.miscModal.hide();
    this.othersModal.hide();
    this.updateOthersInfo = {};
    this.clientSearchModal.hide();
    this.tipsModal.hide();
    this.workerTips = {};
    this.enterManuallyButton = false;
    this.error = '';
    this.giftError = '';
    this.zipCode = '';
    this.cardNumber = '';
    this.cvv = '';
    this.expMonth = '';
    this.expYear = 0;
    this.workerId = '';
    this.price = 0.00;
    this.notes = '';
    this.rewardId = 'None';
    this.promotionId = 'None';
    this.productQuantity = 1;
    this.getPromotions();
    // this.getClientRewardData();
    this.enterManually = false;
  }

  updateTabs(order: number) {
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
}
