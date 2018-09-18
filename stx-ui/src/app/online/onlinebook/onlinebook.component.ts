import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { OnlineBookService } from './onlinebook.service';
import { JwtHelper } from 'angular2-jwt';
import { CommonService } from '../../common/common.service';
import * as config from '../../app.config';
import { isNullOrUndefined } from 'util';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-onlinebook',
  templateUrl: './onlinebook.component.html',
  styleUrls: ['./onlinebook.component.css'],
  providers: [OnlineBookService, CommonService]
})
export class OnlineBookComponent implements OnInit {
  @ViewChild('serviceNotesModal') public serviceNotesModal: ModalDirective;
  companyName = '';
  companyLogo = 'assets/images/logo.png';
  decodedToken: any;
  clientId: any = '';
  apptId: any;
  minDate: Date;
  maxDate: Date;
  bsValue: Date = new Date();
  serviceGroupName: any;
  type: any;
  datePickerConfig: any;
  workerName: any;
  serviceTax: any;
  onlineBookingErr: any = '';
  apptNotes: any = '';
  apptDate: any;
  appData: any;
  workerList: any = [];
  clientsList: any = [];
  packageGroupList: any = [];
  serviceGroupList: any = [];
  serviceDetailsList: any = [];
  rows: any = [];
  deleteArray: any = [];
  apiEndPoints = config['API_END_POINT'];
  sumOfServiceDurations = 0;
  totalServicePrice = 0;
  prepaidDepositAmount = 0;
  selectedIndex: any;
  serviceDetailKeys = ['Duration_1__c', 'Duration_2__c', 'Duration_3__c',
    'Buffer_After__c', 'Guest_Charge__c', 'Net_Price__c'];
  apptSearchData: any = [];
  showScheduleButton = false;
  isRebookAppt: any = false;
  paymentDetails = false;
  depositAlert = '';
  appointBookingData: any;
  /// payments
  yearList = [];
  expYear: any;
  statesList: any;
  purchaseGiftButt: any;
  merchantWorkerList: any = [];
  MailingPostalCode: any;
  mailingCountry = 'United States';
  mailingCountriesList = [{ 'NAME': 'Canada' }, { 'NAME': 'United States' }];
  monthList = ['01 - January', '02 - February', '03 - March', '04 - April', '05 - May', '06 - June',
    '07 - July', '08 - August', '09 - September', '10 - October', '11 - November', '12 - December'];
  mailingState: any;
  mailingCity: any;
  paymentGateWay: any;
  merchantAccntName: any;
  cardTypes: any;
  orderId: any;
  cardType: any;
  expMonth: any;
  cardNumber: any;
  clientName: any;
  cvv: any;
  apptStatus: any;
  serviceNotes: any;
  companyBookingRestriction: any;
  windowStartOption: any;
  windowEndOption: any;
  showTotalDuration: any;
  showTotalPrice: any;
  Id: any;
  /// payments
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private onlineBookService: OnlineBookService,
    private commonService: CommonService,
  ) {
    if (localStorage.getItem('clienttoken')) {
      const clientInfo = localStorage.getItem('clienttoken');
      this.companyName = localStorage.getItem('compname');
      this.companyLogo = localStorage.getItem('complogo');
      this.decodedToken = new JwtHelper().decodeToken(clientInfo);
      this.clientId = this.decodedToken['data']['id'];
    } else {
      this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
    }
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.apptId = param.get('apptid');
      this.isRebookAppt = param.get('rebook') ? true : false;
    });
  }

  ngOnInit() {
    this.clientId = localStorage.getItem('clientid');
    this.minDate = new Date();
    this.maxDate = new Date();
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
    //  this.addServices(0);
    this.getClientOnlineData();
    this.getAllActivePackages();
    if (!this.apptId) {
      this.getServiceGroups();
    }
    this.getServRetTaxs();
    if (this.apptId) {
      this.getApptServiceDetails(this.clientId, this.apptId);
    }
    this.createYearsList();
    this.getCountry('United States');
    this.getPaymentTypes();
    this.getDoNotBook(this.clientId);
    this.datePickerValues();
  }

  datePickerValues() {
    this.onlineBookService.getOnlineBookingData().subscribe(res => {
      this.windowStartOption = res.result.windowStartOption;
      this.windowEndOption = res.result.windowEndOption;
      this.showTotalDuration = res.result.showTotalDuration;
      this.showTotalPrice = res.result.showTotalPrice;
      if (this.windowStartOption === 'Days') {
        this.minDate.setDate(this.minDate.getDate() + parseInt(res.result.windowStartNumber, 10));
      } else if (this.windowStartOption === 'Hours') {
        this.minDate.setDate(this.minDate.getDate() + parseInt(res.result.windowStartNumber, 10) / 24);
      }
      this.bsValue = this.minDate;
      if (this.windowEndOption === 'Days') {
        this.maxDate.setDate(this.maxDate.getDate() + parseInt(res.result.windowEndNumber, 10));
      } else if (this.windowEndOption === 'Hours') {
        this.maxDate.setDate(this.maxDate.getDate() + parseInt(res.result.windowEndNumber, 10) / 24);
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
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        }
      });
  }
  changeClient(id) {
    this.clientId = id;
    this.getDoNotBook(this.clientId);
    localStorage.setItem('clientid', this.clientId);
  }

  /* Method to get service details */
  getApptServiceDetails(clientId, apptId) {
    const reqDate = this.commonService.getDBDatStr(new Date());
    this.onlineBookService.getApptServices(clientId, apptId, reqDate).subscribe(data => {
      const resData = data['result'];
      this.rows = resData.srvcresult;
      //   this.duplicateBookedRecords.push(resData.srvcresult);
      this.appData = resData.apptrst[0];
      this.apptStatus = this.appData.apstatus;
      this.apptNotes = this.appData.Notes__c === 'null' || this.appData.Notes__c === 'undefined' ? null : this.appData.Notes__c;
      // 30-7-2018
      this.serviceGroupList = resData.srvgResult;
      for (let i = 0; i < this.serviceGroupList.length; i++) {
        this.serviceGroupList[i]['serviceGroupName1'] = this.serviceGroupList[i]['clientFacingServiceGroupName'] ?
          this.serviceGroupList[i]['clientFacingServiceGroupName'] : this.serviceGroupList[i]['serviceGroupName'];
      }
      this.serviceGroupName = this.serviceGroupList.length > 0 ? this.serviceGroupList[0].serviceGroupName + '$' + this.serviceGroupList[0].serviceGroupColor : undefined;
      // 30-7-2018
      this.updateBookedRecords();
      this.bsValue = this.isRebookAppt ? this.bsValue : this.commonService.getDateTmFrmDBDateStr(this.appData.Appt_Date_Time__c);
      // this.checkForTime();
    },
      error => {
        this.rows = [{}];
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        }
      });
  }
  /**
  * Method to get service tax  and retail tax calculation
  */
  popOk() {
    this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
  }
  getServRetTaxs() {
    this.onlineBookService.getServProdTax().subscribe(
      data => {
        const taxData = JSON.parse(data['result'][3].JSON__c);
        const onlineMerchant = JSON.parse(data['result'][1].JSON__c);
        this.serviceTax = taxData.serviceTax;
        if (onlineMerchant.onlineTerminalID !== '' && onlineMerchant.sharedSecret !== '') {
          this.purchaseGiftButt = true;
        } else {
          this.purchaseGiftButt = false;
        }
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        }
      });
  }

  updateBookedRecords() {
    if (this.serviceGroupList.length > 0 && this.rows.length > 0) {
      if (this.rows && this.rows.length > 0) {
        for (let i = 0; i < this.rows.length; i++) {
          this.rows[i]['IsPackage'] = 0;
          this.rows[i]['Booked_Package__c'] = '';
          this.rows[i]['Deposit_Required__c'] = 0;
          this.rows[i]['Deposit_Amount__c'] = 0;
          this.serviceDetailsList[i] = this.rows[i].servList;
          for (let j = 0; j < this.serviceDetailsList[i].length; j++) {
            this.serviceDetailsList[i][j]['Name'] = this.serviceDetailsList[i][j]['Client_Facing_Name__c'] &&
              this.serviceDetailsList[i][j]['Client_Facing_Name__c'] !== 'null' ?
              this.serviceDetailsList[i][j]['Client_Facing_Name__c'] : this.serviceDetailsList[i][j]['Name'];
          }
          //  this.rows[i]['Taxable__c'] = this.rows[i]['Service_Tax__c'];
          this.workerList[i] = this.rows[i].workerList;
          this.assaignServiceDurations(this.workerList[i], this.rows[i].workerName, i, true);
          this.rows[i]['serviceName'] = this.rows[i]['Id'];
          const pckgId = this.rows[i]['pckgId'];
          if (!isNullOrUndefined(pckgId) && pckgId !== '') {
            this.rows[i]['serviceGroupName'] = pckgId;
            this.rows[i]['IsPackage'] = 1;
            this.rows[i]['Booked_Package__c'] = pckgId.split(':')[1];
          } else {
            const serviceGroup = this.rows[i]['serviceGroupName'];
            this.serviceGroupList.filter((service) => service.serviceGroupName === serviceGroup).map((service) => {
              this.rows[i]['serviceGroupName'] = service.serviceGroupName + '$' + service.serviceGroupColor;
            });
          }
        }
        this.calculateServiceDurations();
      }
    }
  }

  assaignServiceDurations(workers: Array<any>, workerId: string, index: number, onLoading?: boolean) {
    const selectedWorker = workers.filter((worker) => worker.workername === workerId).map((worker) => {
      if (!onLoading) {
        Object.assign(this.rows[index], this.commonService.getServiceDurations(worker));
      }
    });
  }

  // Method for service groups
  getServiceGroups() {
    const reqDate = this.commonService.getDBDatStr(this.bsValue);
    this.onlineBookService.getServiceGroups('Service', reqDate).subscribe(data => {
      this.serviceGroupList = data['result']
        .filter(filterList => filterList.active && !filterList.isSystem);
      for (let i = 0; i < this.serviceGroupList.length; i++) {
        this.serviceGroupList[i]['serviceGroupName1'] = this.serviceGroupList[i]['clientFacingServiceGroupName'] ?
          this.serviceGroupList[i]['clientFacingServiceGroupName'] : this.serviceGroupList[i]['serviceGroupName'];
      }
      if (this.serviceGroupList.length > 0) {
        this.serviceGroupName = this.serviceGroupList[0].serviceGroupName;
        this.serviceGroupName = this.serviceGroupName + '$' + this.serviceGroupList[0].serviceGroupColor;
        //  this.rows[0].serviceGroupName = this.serviceGroupName;
        if (!this.apptId) {
          this.addServices(0);
          this.categoryOfService(this.serviceGroupName, 0);
        } else {
          this.updateBookedRecords();
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
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        }
      });
  }

  // Method to get package groups
  getAllActivePackages() {
    this.onlineBookService.getPackageGroups()
      .subscribe(data => {
        for (let i = 0; i < data['result'].length; i++) {
          data['result'][i]['Name'] = data['result'][i]['Client_Facing_Name__c'] &&
            data['result'][i]['Client_Facing_Name__c'] !== 'null' ?
            data['result'][i]['Client_Facing_Name__c'] : data['result'][i]['Name'];
        }
        this.packageGroupList = data['result'].filter((obj) => obj.Active__c === 1 && obj.Available_Client_Self_Booking__c === 1 && obj.IsDeleted === 0);
      },
        error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
            }
          }
        });
  }

  getClientOnlineData() {
    this.onlineBookService.getClientOnlineData().subscribe(
      data => {
        this.clientsList = data['result'];
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
                this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
              }
            }
            break;
        }
      }
    );
  }
  categoryOfService(value, i) {
    if (value.indexOf('scale') === 0) {
      this.type = 'Package';
    } else {
      this.type = 'onlineBook';
    }
    this.apptSearchData = [];
    const serviceGroupName = value.split('$')[0];
    this.rows[i].Id = '';
    this.serviceDetailsList[i] = [];
    this.workerList[i] = [];
    this.rows[i].serviceName = '';
    this.rows[i].workerName = '';
    this.removeServiceDetails(i);
    // this.calculateServiceDurations();
    this.onlineBookService.getServices(serviceGroupName, this.type, this.commonService.getDBDatStr(this.bsValue)).subscribe(data => {
      if (this.type === 'Package') {
        const services: Array<any> = data['result']['serviceresultJson'];
        for (let j = 0; j < services.length; j++) {
          services[j]['Name'] = services[j]['Client_Facing_Name__c'] &&
            services[j]['Client_Facing_Name__c'] !== 'null' ?
            services[j]['Client_Facing_Name__c'] : services[j]['Name'];
        }
        const serviceRelatedWorkers: Array<any> = data['result']['results'];
        const DupserviceGroupName = serviceGroupName;
        const packageId = serviceGroupName.split(':')[1];
        const temp = this.packageGroupList.filter((obj) => obj.Id === packageId)[0]['JSON__c'];
        if (this.serviceDetailsList[i]) {
          this.serviceDetailsList.splice(i, 1);
        }
        if (this.workerList[i]) {
          this.workerList.splice(i, 1);
        }
        if (this.rows[i]) {
          this.rows.splice(i, 1);
        }
        const length = this.rows.length;
        services.filter((service, index) => {
          this.rows.push({ type: 'package', packageId: packageId, Id: '', serviceGroupName: DupserviceGroupName });
          this.serviceDetailsList[length + index] = services;
          const workers = [];
          serviceRelatedWorkers.filter((worker) => {

            if (worker.sId === service.Id) {
              workers.push(worker);
            }
          });

          this.workerList[length + index] = workers;
          this.rows[length + index]['IsPackage'] = 1;
          this.rows[length + index]['Booked_Package__c'] = packageId;
          this.rows[length + index]['serviceGroupName'] = this.rows[length]['serviceGroupName'];
          this.rows[length + index]['workerName'] = workers.length > 0 ? workers[0].workername : '';
          this.rows[length + index]['Id'] = service.Id;
          // this.serviceDetailKeys.map((key) => {
          //     this.rows[length + index][key] = workers[0][key] ? +workers[0][key] : 0;
          // });
          if (this.rows[length + index]['workerName']) {
            Object.assign(this.rows[length + index], this.commonService.getServiceDurations(workers[0]));
          }
          this.rows[length + index].serviceGroupColour = '';
          this.calculateServiceDurations();
        });
        if (this.rows) {
          this.rows = this.rows.filter((obj) => obj.workerName !== '');
        }
        for (let m = 0; m < this.rows.length; m++) {
          for (let j = 0; j < JSON.parse(temp).length; j++) {
            if ((this.rows[m]['type'] === 'package') && (packageId === this.rows[m]['packageId']) && (this.rows[m]['Id'] === JSON.parse(temp)[j]['serviceId'])) {
              this.rows[m]['Net_Price__c'] = JSON.parse(temp)[j]['discountPriceEach'];
            }
          }
        }
      } else {
        this.serviceDetailsList[i] = data['result'];
        for (let j = 0; j < this.serviceDetailsList[i].length; j++) {
          this.serviceDetailsList[i][j]['Name'] = this.serviceDetailsList[i][j]['Client_Facing_Name__c'] &&
            this.serviceDetailsList[i][j]['Client_Facing_Name__c'] !== 'null' ?
            this.serviceDetailsList[i][j]['Client_Facing_Name__c'] : this.serviceDetailsList[i][j]['Name'];
        }
        this.rows[i]['IsPackage'] = 0;
        this.rows[i]['Booked_Package__c'] = '';
        this.rows[i].serviceGroupColour = value.split('$')[1];
      }

      this.calculateServiceDurations();

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
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        }
      });
  }

  // add new service dynamically
  addServices(i) {
    this.rows.push({ Id: '', serviceGroupName: this.serviceGroupName });
    this.workerList[i] = [];
    this.serviceDetailsList[i] = [];
    const index = this.rows.length - 1;
    if (index !== 0) {
      this.categoryOfService(this.serviceGroupName, index);
    }
  }

  removeServiceDetails(index) {
    this.serviceDetailKeys.map((key) => {
      delete this.rows[index][key];
    });
  }
  // Method to calculate the service durations
  calculateServiceDurations() {
    this.apptSearchData = [];
    if (this.rows && this.rows.length > 0) {
      this.sumOfServiceDurations = 0;
      this.totalServicePrice = 0;
      this.prepaidDepositAmount = 0;
      for (let j = 0; j < this.rows.length; j++) {
        let totalDuration = 0;
        if (!isNullOrUndefined(this.rows[j]['workerName']) && this.rows[j]['workerName'] !== '') {
          if (this.rows[j]['Deposit_Required__c'] === 1) {
            this.prepaidDepositAmount += this.rows[j]['Deposit_Amount__c'];
          }
          totalDuration += this.rows[j]['Duration_1__c'];
          totalDuration += this.rows[j]['Duration_2__c'];
          totalDuration += this.rows[j]['Duration_3__c'];
          totalDuration += this.rows[j]['Buffer_After__c'];
          this.totalServicePrice += +this.rows[j]['Net_Price__c'];
          this.rows[j].Duration__c = totalDuration;
          this.sumOfServiceDurations = this.sumOfServiceDurations + totalDuration;
        }
      }
      this.depositAlert = this.prepaidDepositAmount !== 0 ? `This appointment requires a deposit/prepayment of: ${this.prepaidDepositAmount.toFixed(2)}` : '';
      this.prepaidDepositAmount = this.prepaidDepositAmount ? +this.prepaidDepositAmount.toFixed(2) : 0;
    }
  }

  // Method to chane worker

  workerListOnChange(value, i) {
    this.apptSearchData = [];
    this.workerName = value;
    this.workerList[i].filter((worker) => worker.workername === this.workerName).map((worker) => {
      Object.assign(this.rows[i], this.commonService.getServiceDurations(worker));
    });
    this.checkForPrepaidServices(this.rows[i]['Id'], i);
    this.calculateServiceDurations();
    // this.clientdata = JSON.parse(localStorage.getItem('bookstanding'));
  }

  calculateServiceTax(taxableObj): number {
    return this.commonService.calculatePercentage(this.serviceTax, taxableObj['Net_Price__c'], taxableObj['Taxable__c']);
  }
  servicesListOnChange(serviceId, i) {
    let temp = [];
    temp = this.serviceDetailsList[i].filter((obj) => obj.Id === serviceId);
    if (temp && temp.length > 0) {
      this.rows[i]['desc'] = temp[0]['Description__c'];
    }
    this.apptSearchData = [];
    this.workerList[i] = [];
    this.rows[i].workerName = '';
    this.removeServiceDetails(i);
    this.calculateServiceDurations();
    this.rows[i]['serviceName'] = serviceId;
    const bookingdata = {
      bookingdate: this.commonService.getDBDatStr(this.bsValue),
      serviceIds: [this.rows[i].Id]
    };
    this.onlineBookService.getUsers(bookingdata).subscribe(data => {
      this.workerList[i] = data['result'];
      if (data['result'] && data['result'].length > 0) {
        this.rows[i].workerName = this.workerList[i][0].workername;
        this.workerListOnChange(this.rows[i].workerName, i);
        // this.rows[i].name = this.workerList[i][0].name;
        //     this.showWaitinglist = true;
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
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        }
      });
  }
  // Method to clear error messages
  clearErrorMsg() {
    this.onlineBookingErr = '';
  }


  checkForPrepaidServices(serviceId, i) {
    const serviceSelected = this.serviceDetailsList[i].filter((service) => serviceId === service.Id);
    if (serviceSelected.length > 0) {

      if (serviceSelected[0]['Deposit_Required__c'] ? +serviceSelected[0]['Deposit_Required__c'] === 1 : false) {
        this.rows[i]['Deposit_Required__c'] = serviceSelected[0]['Deposit_Required__c'];
        if (serviceSelected[0]['Deposit_Amount__c'] ? +serviceSelected[0]['Deposit_Amount__c'] > 0 : false) {

          this.rows[i]['Deposit_Amount__c'] = +serviceSelected[0]['Deposit_Amount__c'];
        } else {
          /// Here taxable feild in calculatePercentage is set to 1 to calculate percentage but it does not mean tax is applied.
          this.rows[i]['Deposit_Amount__c'] = this.commonService.calculatePercentage(+serviceSelected[0]['Deposit_Percent__c'], this.rows[i]['Net_Price__c'], 1);
        }
      } else {
        this.rows[i]['Deposit_Required__c'] = 0;
      }
    }
  }
  getWorkersFromDate() {
    const serviceIds = [];
    const selectedIds = [];
    this.apptSearchData = [];
    this.rows.filter((data) => {
      if (data['Id'] !== '' || !isNullOrUndefined(data['Id'])) {
        serviceIds.push(data['Id']);
        selectedIds.push(data['Id']);
      } else {
        serviceIds.push(data['']);
      }
    });
    if (selectedIds.length > 0) {
      const bookingdata = {
        bookingdate: this.commonService.getDBDatStr(this.bsValue),
        serviceIds: selectedIds
      };
      this.onlineBookService.getUsers(bookingdata).subscribe(data => {
        const workerservices = data['result'];
        serviceIds.forEach((id, i) => {
          if (id !== '' && !isNullOrUndefined(id)) {
            this.workerList[i] = workerservices.filter((worker) => worker.sId === id);
            const isExsists = this.workerList[i].findIndex((worker) => worker.workername === this.rows[i]['workerName']) !== -1 ? true : false;
            if (!isExsists) {
              this.rows[i]['workerName'] = this.workerList[i].length > 0 ? this.workerList[i][0]['workername'] : '';
              this.workerList[i].filter((worker) => worker.workername === this.workerName).map((worker) => {
                Object.assign(this.rows[i], this.commonService.getServiceDurations(worker));
              });
              this.calculateServiceDurations();
            }
          }
        });
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
              this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
            }
          }
        });
    }

  }

  searchForAppointment() {
    this.showScheduleButton = false;
    if (this.checkForServices(this.rows, 'serviceGroupName', 'Id', 'workerName')) {
      this.onlineBookingErr = 'BOOKSTANDING_APPT.VALID_NO_BLANK_SERVICE_FIELD';
      window.scrollTo(0, 0);
    } else {
      this.selectedIndex = undefined;
      if (this.bsValue >= this.minDate && this.bsValue <= this.maxDate) {
        const searchDate = this.bsValue.getFullYear()
          + '-' + ('0' + (this.bsValue.getMonth() + 1)).slice(-2)
          + '-' + ('0' + this.bsValue.getDate()).slice(-2);
        this.selectDate(searchDate);
      } else if (this.bsValue <= this.minDate) {
        const searchDate = this.minDate.getFullYear()
          + '-' + ('0' + (this.minDate.getMonth() + 1)).slice(-2)
          + '-' + ('0' + this.minDate.getDate()).slice(-2);
        this.selectDate(searchDate);
      } else {
        this.apptSearchData = [];
      }
    }

  }
  selectDate(searchDate) {
    const workerIds = [];
    const durations = [];
    for (let i = 0; i < this.rows.length; i++) {
      workerIds.push(this.rows[i].workerName);
      durations.push(this.rows[i].Duration__c);
    }
    const dataObj = {
      'date': searchDate,
      'id': workerIds,
      'dateformat': 'MM/DD/YYYY hh:mm:ss a',
      'durations': durations,
      'mindate': this.commonService.getDBDatTmStr(new Date()),
      'Booked_Online__c': 1
    };
    this.onlineBookService.searchForAppts(dataObj)
      .subscribe(data => {
        this.apptSearchData = data['result'];
      },
        error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
            }
          }
        });
  }
  checkForServices(services: Array<any>, property1, property2, property3): boolean {
    const properties = [property1, property2, property3];
    if (properties.map((property) => this.checkForServiceObject(services, property)).indexOf(false) !== -1) {
      return true;
    }
    return false;
  }
  checkForServiceObject(services: Array<any>, propertyName: string): boolean {
    const isProperty = services.map((obj) => obj.hasOwnProperty(propertyName)).indexOf(false) !== -1 ? false : true;
    if (isProperty) {
      if (services.filter((obj) => obj[propertyName] === '').length !== 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  bookAppointmentInfo(type) {
    const appointmentDate = this.commonService.getDBDatTmStr2(this.apptDate, 'MM/DD/YYYY hh:mm:ss a');
    // const clientdata = JSON.parse(localStorage.getItem('clientData'));
    const IsPackage = this.rows.filter((obj) => obj['IsPackage'] === 1).length > 0 ? true : false;
    const serviceTaxResult = this.commonService.calculateServiceTax(+this.serviceTax, this.rows, IsPackage);
    const servicesData = serviceTaxResult.bookingData;
    for (let i = 0; i < servicesData.length; i++) {
      for (let j = 0; j < this.serviceDetailsList[i].length; j++) {
        if (this.serviceDetailsList[i][j]['Id'] === servicesData[i]['Id']) {
          servicesData[i]['Resources__c'] = this.serviceDetailsList[i][j]['Resources__c'];
        }
      }
    }
    this.appointBookingData = {
      'apptId': this.isRebookAppt ? '' : this.apptId,
      'Client__c': this.clientId,
      'Duration__c': this.sumOfServiceDurations,
      'Appt_Date_Time__c': appointmentDate,
      'servicesData': serviceTaxResult.bookingData,
      'Notes__c': this.apptNotes ? this.apptNotes : null,
      //   'Rebooked__c': this.isRebooking,
      'IsPackage': IsPackage ? 1 : 0,
      'Service_Tax__c': serviceTaxResult.serviceTax,
      'Service_Sales__c': serviceTaxResult.sales,
      'Booked_Online__c': 1,
      'daleteArray': this.deleteArray,
      'bookingType': this.isRebookAppt ? 'findappt' : type,
      'Status__c': this.apptStatus,
      'apptCreatedDate': this.commonService.getDBDatTmStr(new Date()),
      'isDepositRequired': (serviceTaxResult.bookingData.filter((obj) => obj.Deposit_Required__c && obj.Deposit_Required__c === 1).length > 0) ? true : false
    };
  }
  bookAppointment(type) {
    this.appointBookingData = this.prepaidDepositAmount !== 0 ? true : false;
    this.paymentDetails = this.prepaidDepositAmount !== 0 ? true : false;
    this.bookAppointmentInfo(type);
    this.onlineBookService.appointmentBooking(this.appointBookingData).subscribe(data => {
      const apptStatus = data['result'];
      this.Id = apptStatus.apptId;
      this.onlineBookService.sendEmailToOwner(this.Id).subscribe(data1 => {
        const dataStatus = data1['result'];
      }, error1 => {
        const status = JSON.parse(error1['status']);
        const statuscode = JSON.parse(error1['_body']).status;
        switch (JSON.parse(error1['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        } else if (statuscode === '2091') {
          const bookingError = JSON.parse(error1['_body']).message;
          // Warning Don't Delete This alert Code//
          alert(bookingError);
        }
      });
      if (!this.paymentDetails) {
        if (this.Id) {
          this.router.navigate(['onlinebook/success'], { queryParams: { apptId: this.Id } });
        } else if (this.apptId) {
          this.router.navigate(['onlinebook/success'], { queryParams: { apptId: this.apptId } });
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
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        } else if (statuscode === '2091') {
          const bookingError = JSON.parse(error['_body']).message;
          // Warning Don't Delete This alert Code//
          alert(bookingError);
        }
      });

    if (type === 'findappt') {
      this.countdown();
    }

  }

  scheduleButtonShow(searchData, i) {
    this.apptDate = searchData;
    this.selectedIndex = i;
    this.showScheduleButton = true;
  }
  logout() {
    localStorage.removeItem('clienttoken');
    localStorage.removeItem('fname');
    localStorage.removeItem('lname');
    this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
  }
  // Remove current service dynamically
  removeServices(index) {
    if (this.rows[index].tsId) {
      this.rows[index]['delete'] = true;
      this.deleteArray.push(this.rows[index]);
    }
    this.rows.splice(index, 1);
    this.workerList.splice(index, 1);
    this.serviceDetailsList.splice(index, 1);
    this.calculateServiceDurations();
  }

  createYearsList() {
    const curtYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.yearList.push(curtYear + i);
    }
    this.expYear = this.yearList[0];
  }
  getCountry(coun) {
    this.onlineBookService.getStates(coun)
      .subscribe(statesValues => {
        this.statesList = statesValues['result'];
      },
        error => {
          this.onlineBookingErr = <any>error;
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
            }
          }
        });
  }

  getLocation() {
    if (this.MailingPostalCode.length > 4) {
      this.http.get('https://ziptasticapi.com/' + this.MailingPostalCode).subscribe(
        result => {
          if (result['error']) {
            const toastermessage: any = this.translateService.get('SETUPCOMPANY.ZIP_CODE_NOT_FOUND');
            this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
          } else {
            if (result['country'] === 'US') {
              this.mailingCountry = 'United States';
              this.getCountry(this.mailingCountry);
              config.states.forEach(state => {
                if (state.abbrev === result['state']) {
                  this.mailingState = state.name;
                }
              });
            }
            const cityArray = result['city'].split(' ');
            for (let i = 0; i < cityArray.length; i++) {
              if (i === 0) {
                this.mailingCity = cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
              } else {
                this.mailingCity += cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
              }
            }
          }
        },
        error => {
        }
      );
    }
  }
  getWorkerMerchants() {
    this.onlineBookService.getWorkerMerchantsData()
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
                this.onlineBookingErr = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                window.scrollTo(0, 0);
              } else if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                  localStorage.setItem('page', this.router.url);
                  this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
                }
              } break;
          }
        });
  }
  getPaymentTypes() {
    this.onlineBookService.getPaymentTypesData().subscribe(data => {
      this.cardTypes = data.result.paymentResult.filter(filterList => filterList.Process_Electronically_Online__c === 1 && filterList.Active__c === 1);
      this.orderId = data.result.Id;
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
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        }
      });
  }

  makePayment() {
    let paymentData;
    const d = new Date();
    const dateTime = ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2) + '-' +
      (d.getFullYear() + '').slice(-2) + ':' +
      ('00' + d.getHours()).slice(-2) + ':' +
      ('00' + d.getMinutes()).slice(-2) + ':' +
      ('00' + d.getSeconds()).slice(-2) + ':000';
    // calculate the MD5 hash format - TERMINALID+MERCHANTREF+DATETIME+CARDNUMBER+CARDEXPIRY+CARDTYPE+CARDHOLDERNAME+secret
    const hash = Md5.hashStr(config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID + this.orderId +
      this.prepaidDepositAmount + dateTime + config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_KEY);
    const clientData = {
      ticketPaymntId: this.orderId,
      terminalid: config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID,
      dateTime: dateTime,
      cardNum: this.cardNumber,
      cardType: this.cardType,
      currency: 'USD',
      terminalType: '1',
      transactionType: '4',
      hash: hash,
      amountDue: this.prepaidDepositAmount,
      cardExp: ('0' + this.expMonth).slice(-2) + this.expYear.toString().slice(-2)
    };
    const tokenbody = this.commonService.createPaymentToken(clientData);
    const url = 'https://testpayments.anywherecommerce.com/merchant/xmlpayment';
    if ((this.expYear <= d.getFullYear()) && ((parseInt(this.expMonth, 10) < d.getMonth() + 1))) {
      this.onlineBookingErr = 'Invalid Expiry Date.';
    } else {
      const reqObj = {
        'url': url,
        'xml': tokenbody
      };
      const depositData = {
        Amount__c: this.prepaidDepositAmount,
        Transaction_Type__c: 'Deposit',
        Ticket__c: 'dp318sa9jjlj9i9bi',
        Appt_Date_Time__c: this.commonService.getDBDatTmStr(new Date()),
        pckgObj: {},
        type: 'Online',
        online_c: 1,
        Client__c: this.clientId
      };
      this.onlineBookService.addDepositToOthers(depositData).subscribe(data => {
        const apptStatus = data['result'];
        const appointmentId = this.apptId ? this.apptId : apptStatus.apptId;

        // const appointmentId = this.Id;
        this.onlineBookService.xmlPayment(reqObj).subscribe(
          data2 => {
            const parseString = require('xml2js').parseString;
            parseString(data2['result'], function (err, result) {
              paymentData = result;
            });
            if (paymentData && paymentData.PAYMENTRESPONSE) {
              this.savePaymentsData(paymentData, appointmentId, this.Id);
              const toastermessage: any = this.translateService.get('LOGIN.PAYMENT_SUCCESS');
              this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
            } else {
              this.deleteDataWhenPaymentFailed(appointmentId);
              this.onlineBookingErr = 'Error Occured, Invalid Details';
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
                  this.onlineBookingErr = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                  window.scrollTo(0, 0);
                } else if (statuscode === '2085' || statuscode === '2071') {
                  if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
                  }
                } break;
            }
          });
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
              this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
            }
          }
        });
    }
  }
  deleteDataWhenPaymentFailed(apptId) {
    this.onlineBookService.deleteThePaymentFailedRecords(apptId).subscribe(
      data => {
        const dataStatus = data['result'];
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
                this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
              }
            }
            break;
        }
      }
    );
  }
  savePaymentsData(paymentData, appointmentId, apptId2) {
    let approvalCode = '';
    let refCode = '';
    if (paymentData === null) {
      approvalCode = '';
      refCode = '';
    } else {
      approvalCode = paymentData.PAYMENTRESPONSE.APPROVALCODE[0];
      refCode = paymentData.PAYMENTRESPONSE.UNIQUEREF[0];
    }
    const IsPackage = this.rows.filter((obj) => obj['IsPackage'] === 1).length > 0 ? true : false;
    const serviceTaxResult = this.commonService.calculateServiceTax(+this.serviceTax, this.rows, IsPackage);
    const servesData: any = serviceTaxResult.bookingData;

    const paymentObj = {
      'apptId': appointmentId,
      'merchantAccnt': this.merchantAccntName,
      'paymentGateWay': this.paymentGateWay,
      'cardHolderName': this.clientName,
      'cardNumber': this.cardNumber,
      'zipCode': this.MailingPostalCode,
      'expMonth': this.expMonth,
      'paymentType': this.cardType,
      'expYear': this.expYear,
      'cvv': this.cvv,
      'amountToPay': this.prepaidDepositAmount,
      'approvalCode': approvalCode,
      'refCode': refCode,
      'isGiftPurchase': false,
      // 'giftPurchaseObj': this.appointBookingData
      'isDepositRequired': (servesData.filter((obj) => obj.Deposit_Required__c && obj.Deposit_Required__c === 1).length > 0) ? true : false,
      'apptId1': this.Id,
      'isUpdateAppt1': true,
      'Online__c': 1,
      'clientId': this.clientId
    };
    this.onlineBookService.addToPaymentsTicket(paymentObj)
      .subscribe(data1 => {
        const dataObj = data1['result'];
        this.router.navigate(['onlinebook/success'], { queryParams: { apptId: apptId2 } });
      },
        error => {
        });
  }
  changeCard(type) {
    this.cardType = type;
  }

  cancel() {
    this.onlineBookingErr = '';
    this.MailingPostalCode = '';
    this.cardNumber = '';
    this.cvv = '';
    this.expMonth = '';
    this.expYear = 0;
    this.paymentGateWay = '';
    this.merchantAccntName = '';
    this.paymentDetails = false;
    window.location.reload();
  }
  clearErr() {
    this.onlineBookingErr = '';
  }
  getDoNotBook(clientId) {
    this.onlineBookService.getClientData(clientId).subscribe(data => {
      this.companyBookingRestriction = data.result.results[0].Booking_Restriction_Type__c;
      this.clientName = data.result.results[0].FirstName + ' ' + data.result.results[0].LastName;
      if (this.companyBookingRestriction === 'Do Not Book') {
        this.serviceNotesModal.show();
        this.onlineBookService.getOnlineBookingData().subscribe(res => {
          this.serviceNotes = res.result.loginMessage1;
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
                this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
              }
            }
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
            this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
          }
        }
      });
  }
  countdown() {
    let element, endTime, hours, mins, msLeft, time;
    function twoDigits(n) {
      return (n <= 9 ? '0' + n : n);
    }
    function updateTimer() {
      msLeft = endTime - (+new Date);
      if (msLeft < 1000) {
        time = new Date(msLeft);
        document.getElementById('countdown').style.color = 'red';
        element.innerHTML = 'Your payment session has timed out, and your request has been removed!';
        setTimeout(reload, time.getUTCMilliseconds() + 8000);
      } else {
        time = new Date(msLeft);
        hours = time.getUTCHours();
        mins = time.getUTCMinutes();
        element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : '0' + mins) + ' minutes : ' + twoDigits(time.getUTCSeconds() + ' seconds');
        setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
      }
    }
    function reload() {
      window.location.reload();
    }
    element = document.getElementById('countdown');
    endTime = (+new Date) + 1000 * (60 * 5 + 0) + 500;
    updateTimer();
  }
}
