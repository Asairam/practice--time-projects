import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { Location } from '@angular/common';
import { CommonService } from '../../common/common.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { OnlinePackagePurchaseService } from './onlinepackagepurchase.service';
import { CheckOutEditTicketService } from '../../checkout/editticket/checkouteditticket.service';
import { Md5 } from 'ts-md5/dist/md5';
import { JwtHelper } from 'angular2-jwt';
import * as config from '../../app.config';

@Component({
  selector: 'app-onlinepackagepurchase',
  templateUrl: './onlinepackagepurchase.component.html',
  styleUrls: ['./onlinepackagepurchase.component.css'],
  providers: [OnlinePackagePurchaseService, CommonService]
})

export class OnlinePackagePurchaseComponent implements OnInit {
  decodedToken: any;
  clientId: any;
  apptId = '';
  mainDiv: any = true;
  error: any;
  PckgError: any;
  clientName: any;
  packagesList: any = [];
  isActive: any = true;
  clientPckgObj = {};
  amount: any = 0;
  clientsList: any = [];
  packageName: any;
  apiEndPoints = config['API_END_POINT'];
  companyLogo = '';
  companyName = '';
  cardNumber: any;
  cardType = '';
  statesList: any;
  MailingPostalCode = '';
  mailingCountry = 'United States';
  mailingState: any;
  mailingCity: any;
  packageId: any;
  merchantWorkerList: any = [];
  paymentGateWay: any = '';
  merchantAccntName: any = '';
  bill: any;
  clientPckgArray = [];
  mailingCountriesList = [{ 'NAME': 'Canada' }, { 'NAME': 'United States' }];
  monthList = ['01 - January', '02 - February', '03 - March', '04 - April', '05 - May', '06 - June',
    '07 - July', '08 - August', '09 - September', '10 - October', '11 - November', '12 - December'];
  yearList = [];
  expYear = 0;
  cvv: any;
  errorMessage: any;
  expMonth = 1;
  mailingStreet = '';
  paymentsData = [];
  paymentId: any;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private translateService: TranslateService,
    private onlinePackagePurchaseService: OnlinePackagePurchaseService,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.apptId = activatedRoute.snapshot.params['apptId'];
    });
  }

  ngOnInit() {
    if (localStorage.getItem('clienttoken')) {
      const clientInfo = localStorage.getItem('clienttoken');
      this.companyName = localStorage.getItem('compname');
      this.companyLogo = localStorage.getItem('complogo');
      this.decodedToken = new JwtHelper().decodeToken(clientInfo);
      this.clientId = this.decodedToken['data']['id'];
      this.onlinePackagePurchaseService.getApptDetails(this.apptId).subscribe(
        data => {
        },
        error => {
          this.toastr.error('Invalid URL', null, { timeOut: 3000 });
        }
      );
      this.getClientOnlineData();
      this.getpackagesListing();
      this.createYearsList();
      this.getCountry('United States');
      this.getPaymentTypes();
      this.countdown();
    } else {
      this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
    }
  }
  getClientOnlineData() {
    this.onlinePackagePurchaseService.getClientOnlineData().subscribe(
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
  purchaseProduct() {
    const filteredPackage = this.packagesList.filter((list) => list.Id === this.packageId);
    const obj = {
      'Package__c': this.packageId,
      'Package_Price__c': +this.amount,
      'Amount__c': +this.amount,
      'Transaction_Type__c': 'Package',
      'Service_Tax__c': filteredPackage[0]['Tax__c'] ? filteredPackage[0]['Tax__c'] : 0,
      'Appt_Date_Time__c': this.commonService.getDBDatTmStr(new Date()),
      'Booked_Online__c': 1,
      'Client__c': this.clientId
    };
    const tempPkgListJSON = JSON.parse(filteredPackage[0]['JSON__c']);
    this.clientPckgArray.push({
      'pckgId': this.packageId,
      'clientId': localStorage.getItem('clientid'),
      // 'apptId': this.apptId,
      'pckgDetails': tempPkgListJSON,
      'isDependedPackage': false,
      'Online__c': 1,
      isDepositRequired: 1
    });
    const amountToPay = parseFloat(this.amount) + parseFloat(filteredPackage[0]['Tax__c']);
    this.onlinePackagePurchaseService.addToTicket(obj, 'New').subscribe(data => {
      const dataStatus = data['result'];
      if (dataStatus && dataStatus.apptId) {
        const dataObj = {
          amount: amountToPay,
          apptId: dataStatus.apptId
        };
        this.apptId = dataStatus.apptId;
        this.proceedToPayment(dataObj);
      }
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
  /**
    //  * need to ask client for payment url
    //  */
  proceedToPayment(dataObj) {
    let paymentData;
    const d = new Date();
    const dateTime = ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2) + '-' +
      (d.getFullYear() + '').slice(-2) + ':' +
      ('00' + d.getHours()).slice(-2) + ':' +
      ('00' + d.getMinutes()).slice(-2) + ':' +
      ('00' + d.getSeconds()).slice(-2) + ':000';
    // calculate the MD5 hash format - TERMINALID+MERCHANTREF+DATETIME+CARDNUMBER+CARDEXPIRY+CARDTYPE+CARDHOLDERNAME+secret
    const hash = Md5.hashStr(config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID + this.paymentId + dataObj.amount + dateTime + config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_KEY);
    const clientData = {
      ticketPaymntId: this.paymentId,
      terminalid: config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID,
      dateTime: dateTime,
      cardNum: this.cardNumber,
      cardType: this.cardType,
      currency: 'USD',
      terminalType: '1',
      transactionType: '4',
      hash: hash,
      amountDue: dataObj.amount,
      cardExp: ('0' + this.expMonth).slice(-2) + this.expYear.toString().slice(-2)
    };
    const tokenbody = this.commonService.createPaymentToken(clientData);
    const url = 'https://testpayments.anywherecommerce.com/merchant/xmlpayment';
    if (this.clientName === '' || this.clientName === undefined) {
      this.PckgError = 'CardHolder Name is required';
      window.scrollTo(0, 400);
    } else if (this.MailingPostalCode === '' || this.MailingPostalCode === undefined) {
      this.PckgError = 'ZipCode should is required';
      window.scrollTo(0, 400);
    } else if (this.mailingCity === '' || this.mailingCity === undefined) {
      this.PckgError = 'Mailing City is required';
      window.scrollTo(0, 400);
    } else if (this.mailingStreet === '' || this.mailingStreet === undefined) {
      this.PckgError = 'Mailing Street is required';
      window.scrollTo(0, 400);
    } else if (this.cardType === '' || this.changeCard === null) {
      this.PckgError = 'Select Card Type';
      window.scrollTo(0, 400);
    } else if (this.cardNumber === '' || this.cardNumber === undefined) {
      this.PckgError = 'Card Number is required';
      window.scrollTo(0, 400);
    } else if (this.cardNumber < 0) {
      this.PckgError = 'Card Number: Only a number may be entered';
      window.scrollTo(0, 400);
    } else if (this.cardNumber.length >= 0 && this.cardNumber.length < 14) {
      this.PckgError = 'Card Number: Enter Valid Card Number';
      window.scrollTo(0, 400);
    } else if (this.cvv === '' || this.cvv === undefined) {
      this.PckgError = 'CVV is required';
      window.scrollTo(0, 400);
    } else if (this.cvv.length < 3 || this.cvv.length >= 4) {
      this.PckgError = 'CVV: length should be 3 is required';
      window.scrollTo(0, 400);
    } else if (this.cvv < 0) {
      this.PckgError = 'CVV: Only a number may be entered';
      window.scrollTo(0, 400);
    } else {
      if ((this.expYear <= d.getFullYear()) && ((this.expMonth < d.getMonth() + 1))) {
        this.error = 'Invalid Expiry Date.';
        window.scrollTo(0, 400);
      } else {
        const reqObj = {
          'url': url,
          'xml': tokenbody
        };
        this.onlinePackagePurchaseService.xmlPayment(reqObj).subscribe(
          data => {
            const parseString = require('xml2js').parseString;
            parseString(data['result'], function (err, result) {
              paymentData = result;
            });
            if (paymentData && paymentData.PAYMENTRESPONSE) {
              this.savePaymentsData(paymentData);
            } else {
              this.deleteDataWhenPaymentFailed(dataObj.apptId);
              this.error = 'Error Occured, Invalid Details';
              window.scrollTo(0, 400);
            }
            this.toastr.success('Thank you! Your payment was successfully processed', null, { timeOut: 4000 });
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
  deleteDataWhenPaymentFailed(apptId) {
    this.onlinePackagePurchaseService.deleteThePaymentFailedRecords(apptId).subscribe(
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
  savePaymentsData(paymentData) {
    let approvalCode = '';
    let refCode = '';
    if (paymentData === null) {
      approvalCode = '';
      refCode = '';
    } else {
      approvalCode = paymentData.PAYMENTRESPONSE.APPROVALCODE[0];
      refCode = paymentData.PAYMENTRESPONSE.UNIQUEREF[0];
    }
    this.clientPckgArray[0]['apptId'] = this.apptId;
    const paymentObj = {
      'apptId': this.apptId,
      'merchantAccnt': this.merchantAccntName,
      'paymentGateWay': this.paymentGateWay,
      'cardHolderName': this.clientName,
      'cardNumber': this.cardNumber,
      'zipCode': this.MailingPostalCode,
      'expMonth': this.expMonth,
      'expYear': this.expYear,
      'cvv': this.cvv,
      'amountToPay': this.amount,
      'approvalCode': approvalCode,
      'refCode': refCode,
      'clientPckgData': this.clientPckgArray,
      'Online__c': 1,
      'paymentType': this.cardType
    };
    this.onlinePackagePurchaseService.addToPaymentsTicket(paymentObj)
      .subscribe(data1 => {
        const dataObj = data1['result'];
        this.clear();
        // const toastermessage: any = this.translateService.get('LOGIN.PAYMENT_SUCCESS');
        // this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
        // this.mainDiv = false;
        this.router.navigate(['/onlinebook']);
      },
        error => {
        });
  }
  getpackagesListing() {
    this.onlinePackagePurchaseService.getAllServiceDetails(this.isActive).subscribe(data => {
      for (let i = 0; i < data['result'].length; i++) {
        data['result'][i]['Name'] = data['result'][i]['Client_Facing_Name__c'] &&
          data['result'][i]['Client_Facing_Name__c'] !== 'null' ?
          data['result'][i]['Client_Facing_Name__c'] : data['result'][i]['Name'];
      }
      this.packagesList = data['result'].filter((obj) => obj.Active__c === 1 && obj.Available_Online_Purchase__c === 1 && obj.IsDeleted === 0);
      this.packageName = this.packagesList[0].Name;
      this.packageId = this.packagesList[0].Id;
      this.amount = this.packagesList[0].Discounted_Package__c.toFixed(2);
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
  onPackageChange(Id) {
    this.packageId = Id;
    const temp = this.packagesList.filter((obj) => obj.Id === Id)[0];
    this.amount = temp.Discounted_Package__c.toFixed(2);
    this.packageName = temp.Name;
  }
  createYearsList() {
    const curtYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.yearList.push(curtYear + i);
    }
    this.expYear = this.yearList[0];
  }
  getCountry(coun) {
    this.onlinePackagePurchaseService.getStates(coun)
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
    this.onlinePackagePurchaseService.getWorkerMerchantsData()
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
  changeCard(type) {
    this.cardType = type;
  }
  clear() {
    this.error = '';
    this.PckgError = '';
  }
  cancel() {
    this.error = '';
    this.MailingPostalCode = '';
    this.cardNumber = '';
    this.cvv = '';
    this.expMonth = 1;
    this.paymentGateWay = '';
    this.merchantAccntName = '';
    this.router.navigate(['/onlinebook']);
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
  /**
  * payments code starts here
  */
  getPaymentTypes() {
    this.onlinePackagePurchaseService.getPaymentTypesData().subscribe(data => {
      this.paymentsData = data.result.paymentResult.filter(filterList => filterList.Process_Electronically_Online__c === 1 && filterList.Active__c === 1);
      this.paymentId = data.result.Id;
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
      location.replace('/#/onlinebook');
    }
    element = document.getElementById('countdown');
    endTime = (+new Date) + 1000 * (60 * 5 + 0) + 500;
    updateTimer();
  }

}
