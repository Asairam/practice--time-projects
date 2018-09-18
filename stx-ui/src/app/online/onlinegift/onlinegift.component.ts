import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as config from '../../app.config';
import { OnlineGiftService } from './onlinegift.service';
import { OnlinePackagePurchaseService } from '../onlinepackagepurchase/onlinepackagepurchase.service';
import { CommonService } from '../../common/common.service';
import { CheckOutEditTicketService } from '../../checkout/editticket/checkouteditticket.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
@Component({
  selector: 'app-online-gift',
  templateUrl: './onlinegift.component.html',
  styleUrls: ['./onlinegift.component.css'],
  providers: [OnlineGiftService, CommonService]
})
export class OnlineGiftComponent implements OnInit {
  apptId: any;
  showPayment: any;
  companyName = '';
  clientBookingInfo: any;
  clientName = '';
  companyLogo = 'assets/images/logo.png';
  apiEndPoints = config['API_END_POINT'];
  mainDiv: any = true;
  amountList = ['25.00', '50.00', '75.00', '100.00', 'other'];
  deliveryTypes = ['Email to Recipient', 'Email to Me'];
  dbName = '';
  giftErr = '';
  isTokenExsists;
  orderId: any;
  giftPurchaseObj: any = {
    Amount: 0,
    deliveryType: '',
    RecipientName: '',
    RecipientEmail: '',
    firstname: '',
    lastname: '',
    PersonalMessage: '',
    email: '',
    listedAmount: '',
    Transaction_Type__c: 'Gift'
  };
  giftAmount: any = '';
  amount = 0;
  cardNumber: any;
  cardType: any = '';
  statesList: any;
  MailingPostalCode: any;
  mailingCountry = 'United States';
  mailingState: any;
  mailingCity: any;
  packageId: any;
  merchantWorkerList: any = [];
  paymentGateWay: any = '';
  merchantAccntName: any = '';
  bill: any;
  cardTypes = [];
  mailingCountriesList = [{ 'NAME': 'Canada' }, { 'NAME': 'United States' }];
  monthList = ['01 - January', '02 - February', '03 - March', '04 - April', '05 - May', '06 - June',
    '07 - July', '08 - August', '09 - September', '10 - October', '11 - November', '12 - December'];
  yearList = [];
  expYear = 0;
  cvv: any;
  errorMessage: any;
  expMonth = 1;
  mailingStreet = '';
  error: any;
  PckgError: any;
  withoutLogin: any;
  constructor(
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private onlineGiftService: OnlineGiftService,
    private commonService: CommonService) {
    this.companyName = localStorage.getItem('compname');
    this.companyLogo = localStorage.getItem('complogo');
    this.dbName = localStorage.getItem('param');
    this.isTokenExsists = localStorage.getItem('clienttoken') ? true : false;
    this.activatedRoute.queryParams.subscribe(params => {
      this.withoutLogin = activatedRoute.snapshot.params['param'];
    });
  }

  ngOnInit() {
    this.giftPurchaseObj.listedAmount = this.amountList[0];
    this.giftPurchaseObj.deliveryType = this.deliveryTypes[0];
    this.createYearsList();
    this.getCountry('United States');
    if (this.withoutLogin === 'any') {
      this.getPaymentTypesDataGlobal();
    } else {
      this.getPaymentTypes();
    }
  }
  createYearsList() {
    const curtYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.yearList.push(curtYear + i);
    }
    this.expYear = this.yearList[0];
  }
  getCountry(coun) {
    this.onlineGiftService.getStates(coun)
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
    this.onlineGiftService.getWorkerMerchantsData()
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
  getPaymentTypes() {
    this.onlineGiftService.getPaymentTypesData().subscribe(data => {
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
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
  /**
   //  * need to ask client for payment url
   //  */
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
      this.giftPurchaseObj.Amount + dateTime + config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_KEY);
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
      amountDue: this.giftPurchaseObj.Amount,
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
        let serName;
        this.giftPurchaseObj.online_c = 1;
        if (this.withoutLogin === 'any') {
          serName = this.onlineGiftService.onlineGiftPurchaseWithoutlogin(this.giftPurchaseObj);
        } else {
          serName = this.onlineGiftService.onlineGiftPurchase(this.giftPurchaseObj);
        }
        serName.subscribe((data) => {
          this.apptId = data['result']['apptId'];
          const giftNum = data['result']['giftData']['Gift_Number__c'];
          this.onlineGiftService.xmlPayment(reqObj, this.withoutLogin).subscribe(
            data2 => {
              const parseString = require('xml2js').parseString;
              parseString(data2['result'], function (err, result) {
                paymentData = result;
              });
              if (paymentData && paymentData.PAYMENTRESPONSE) {
                paymentData.Gift_Number__c = giftNum;
                this.savePaymentsData(paymentData);
              } else {
                this.deleteDataWhenPaymentFailed(this.apptId);
                this.error = 'Error Occured, Invalid Details';
                window.scrollTo(0, 400);
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
          // this.router.navigate([localStorage.getItem('page')]);
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
          });
      }
    }
  }
  deleteDataWhenPaymentFailed(apptId) {
    this.onlineGiftService.deleteThePaymentFailedRecords(apptId).subscribe(
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
    const paymentObj = {
      'apptId': this.apptId,
      'merchantAccnt': this.merchantAccntName,
      'paymentGateWay': config.ANYWHERECOMMERCE_PAYMENT_TYPE_GATEWAY,
      'cardHolderName': this.clientName,
      'cardNumber': this.cardNumber,
      'zipCode': this.MailingPostalCode,
      'expMonth': this.expMonth,
      'expYear': this.expYear,
      'cvv': this.cvv,
      'amountToPay': this.giftPurchaseObj.Amount,
      'approvalCode': approvalCode,
      'refCode': refCode,
      'isGiftPurchase': true,
      'giftPurchaseObj': this.giftPurchaseObj,
      'paymentType': this.cardType,
      'giftNumber': paymentData.Gift_Number__c,
      'Online__c': 1
    };
    this.onlineGiftService.addToPaymentsTicket(paymentObj, this.withoutLogin)
      .subscribe(data1 => {
        const dataObj = data1['result'];
        const toastermessage: any = this.translateService.get('LOGIN.PAYMENT_SUCCESS');
        this.toastr.success(toastermessage.value, null, { timeOut: 3000 });
        // this.mainDiv = false;
        if (this.withoutLogin === 'any') {
          this.router.navigate(['/']).then(() => { this.router.navigate(['/onlinegift/any']); });
        } else {
          this.router.navigate(['/onlinebook']);
        }
      },
        error => {
        });
  }
  changeCard(type) {
    this.cardType = type;
  }
  clearErr() {
    this.giftErr = '';
    this.error = '';
  }
  purchaseGift() {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.giftPurchaseObj['Appt_Date_Time__c'] = this.commonService.getDBDatTmStr(new Date());
    this.giftPurchaseObj['dbName'] = this.dbName;
    this.giftPurchaseObj['Amount'] = this.giftPurchaseObj.listedAmount === 'other' ? this.giftAmount : this.giftPurchaseObj.listedAmount;
    if (!this.giftPurchaseObj['Amount']) {
      this.giftErr = 'Amount is required and Must be grater than 0';
      window.scrollTo(0, 0);
    } else if (!this.giftPurchaseObj['RecipientName']) {
      this.giftErr = 'Recipient Name is required';
      window.scrollTo(0, 0);
    } else if (this.giftPurchaseObj['deliveryType'] === this.deliveryTypes[0] ? !this.giftPurchaseObj['RecipientEmail'] : false) {
      this.giftErr = 'Recipient Email is required';
      window.scrollTo(0, 0);
    } else if (!this.giftPurchaseObj['firstname']) {
      this.giftErr = 'Your First Name is required';
      window.scrollTo(0, 0);
    } else if (!this.giftPurchaseObj['lastname']) {
      this.giftErr = 'Your Last Name is required';
      window.scrollTo(0, 0);
    } else if (!this.giftPurchaseObj['email']) {
      this.giftErr = 'Your Email is required';
      window.scrollTo(0, 0);
    } else if (!(/^(?!0)\d{1,9}(\.\d{1,2})?$/g).test(this.giftPurchaseObj['Amount'])) {
      this.giftErr = 'Only a positive, whole number may be entered and must be less than 100.00';
      window.scrollTo(0, 0);
    } else if (this.giftPurchaseObj['RecipientEmail'] ? !EMAIL_REGEXP.test(this.giftPurchaseObj['RecipientEmail']) : false) {
      this.giftErr = 'Invalid Recipient Email Address';
      window.scrollTo(0, 0);
    } else if (!EMAIL_REGEXP.test(this.giftPurchaseObj['email'])) {
      this.giftErr = 'Invalid Email Address';
      window.scrollTo(0, 0);
    } else {
      this.showPayment = true;
      this.clientName = this.giftPurchaseObj['firstname'] + ' ' + this.giftPurchaseObj['lastname'];
      if (this.showPayment) {
        this.countdown();
      }
      // this.onlineGiftService.onlineGiftPurchase(this.giftPurchaseObj).subscribe((data) => {
      //   this.apptId = data['result']['apptId'];
      //   // this.router.navigate([localStorage.getItem('page')]);
      // },
      //   error => {
      //     const status = JSON.parse(error['status']);
      //     const statuscode = JSON.parse(error['_body']).status;
      //     switch (status) {
      //       case 500:
      //         break;
      //       case 400:
      //         if (statuscode === '2085' || statuscode === '2071') {
      //           if (this.router.url !== '/') {
      //             localStorage.setItem('page', this.router.url);
      //             this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
      //           }
      //         }
      //         break;
      //     }
      //   });
    }

  }
  cancel() {
    if (this.withoutLogin === 'any') {
      this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
    } else {
      this.router.navigate(['/onlinebook']);
    }
  }

  amountChange() {
    this.giftAmount = 0;
    this.clearErr();
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
  getPaymentTypesDataGlobal() {
    this.onlineGiftService.getPaymentTypesDataGlobal().subscribe(data => {
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
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }

}
