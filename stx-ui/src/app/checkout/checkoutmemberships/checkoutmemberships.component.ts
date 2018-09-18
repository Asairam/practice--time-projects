import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { CheckOutMembershipsService } from './checkoutmemberships.service';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5/dist/md5';
import * as config from '../../app.config';
import { TranslateService } from 'ng2-translate';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonService } from '../../common/common.service';
@Component({
  selector: 'app-checkoutmemberships',
  templateUrl: './checkoutmemberships.html',
  styleUrls: ['./checkoutmemberships.css'],
  providers: [CheckOutMembershipsService, CommonService],
})
export class CheckOutMembershipsComponent implements OnInit {
  inActive = 1;
  expMonth = 1;
  checkoutMembersipsList: any;
  paymentList: any;
  membershipId: any;
  memPrice: any;
  payment = false;
  showSave = false;
  paymentId: any;
  send_date = new Date();
  formattedDate: any;
  clientData: any;
  clientId: any;
  clientName: any;
  clientPic: any;
  clientPicShow: any;
  clientMembershipId: any;
  posDeviceList: any;
  autoBill: any = false;
  cashDrawer: any;
  cashDrawerObj: any;
  paymentName: any;
  paymentIcon: any;
  yearList = [];
  expYear = 0;
  cardNum = '';
  cardCVV = '';
  tokenbody: any;
  mailingCode: any;
  cardTokenId1 = '';
  clientMemList: any;
  membershipResult: any;
  newclient = false;
  showOk = false;
  datePickerConfig: any;
  minDate = new Date();
  errorMsgAry = ['', '', '', '', '', '', '', ''];
  monthList = ['01 - January', '02 - February', '03 - March', '04 - April', '05 - May', '06 - June',
    '07 - July', '08 - August', '09 - September', '10 - October', '11 - November', '12 - December'];
  @ViewChild('processPaymentModal') public processPaymentModal: ModalDirective;
  constructor(private checkoutMembershipsService: CheckOutMembershipsService,
    @Inject('apiEndPoint') public apiEndPoint: string,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer) {
    this.send_date.setMonth(this.send_date.getMonth() + 1);
    this.formattedDate = this.send_date;
    this.route.queryParams.subscribe(params => {
      this.clientId = route.snapshot.params['clientId'];
    });
    this.datePickerConfig = Object.assign({},
      {
          showWeekNumbers: false,
          containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
    this.createYearsList();
    // this.getClientMemberships();
    this.getSetupMemberships();
    this.getClientData(this.clientId);
    this.cashDrawerObj = localStorage.getItem('browserObject');
    this.cashDrawer = JSON.parse(this.cashDrawerObj).CashDrawer.split(' ')[0];
    this.getClientMemberships();
  }
  updateErrMsg(index: number) {
    this.errorMsgAry[index] = '';
  }
  /*-- Method to get all memberships --*/
  getSetupMemberships() {
    this.checkoutMembershipsService.getSetupMemberships(this.inActive)
      .subscribe(data => {
        this.checkoutMembersipsList = data['result'];
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
  getPriceAndPayList(value) {
    this.payment = true;
    const memVal = value.split('$');
    this.membershipId = memVal[0];
    this.memPrice = memVal[1];
    this.checkoutMembershipsService.getpaymentList().subscribe(
      data => {
        this.paymentList = data['result'].paymentResult.filter(
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
      }
    );
  }
  getClientData(clientId) {
    this.checkoutMembershipsService.getClient(clientId)
      .subscribe(data => {
        this.clientData = data['result'].results[0];
        this.clientName = this.clientData.FirstName + ' ' + this.clientData.LastName;
        this.clientMembershipId = this.clientData.Membership_ID__c;
        this.clientPicShow = this.clientData.Client_Pic__c;
        this.clientPic = this.apiEndPoint + '/' + this.clientData.Client_Pic__c;
      }, error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            //    this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
  getClientMemberships() {
    this.checkoutMembershipsService.getClientMemberships().subscribe(data => {
      this.clientMemList = data['result'].result;
      this.membershipResult = data['result'].clientresult;
      this.clientMemList.forEach(element => {
        if (element.Client__c === this.clientId) {
          this.newclient = false;
        } else {
          this.newclient = true;
        }
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
  showSaveButton(value) {
    this.paymentId = value.split('$')[0];
    this.paymentName = value.split('$')[1];
    this.paymentIcon = this.apiEndPoint + '/' + value.split('$')[2];
    this.showSave = true;
    if (this.clientMembershipId === '' || this.clientMembershipId === null || this.clientMembershipId === 'null') {
      this.errorMsgAry[5] = 'Membership id cannot be blank';
      window.scrollTo(0, 0);
      this.paymentName = 'None';
      this.showSave = false;
      this.showOk = false;
    } else {
      for (let i = 0; i < this.membershipResult.length; i++) {
        if (this.membershipResult[i].Membership_ID__c === this.clientMembershipId) {
          this.errorMsgAry[6] = 'Duplicate Membership ID found. All Membership IDs must be unique.';
          window.scrollTo(0, 0);
          this.paymentName = 'None';
          this.showSave = false;
          this.showOk = false;
        }
      }
    }

    if (this.paymentName === 'Visa') {
      this.showSave = false;
      this.showOk = false;
    }
  }
  clearErrMsg() {
    this.errorMsgAry = [];
    this.paymentList = [];
    this.checkoutMembershipsService.getpaymentList().subscribe(
      data => {
        this.paymentList = data['result'].paymentResult.filter(
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
      }
    );
  }
  /**
   * Payment modal code starts
   */
  showPaymentModal() {
    this.processPaymentModal.show();
    this.errorMsgAry[1] = '';
  }
  createYearsList() {
    const curtYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.yearList.push(curtYear + i);
    }
    this.expYear = this.yearList[0];
  }
  generateToken() {
    let expmonth;
    if (this.expMonth.toString().length <= 1) {
      expmonth = '0' + this.expMonth;
    } else {
      expmonth = this.expMonth;
    }
    const d = new Date();
    const dateTime = ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2) + '-' +
      (d.getFullYear() + '').slice(-2) + ':' +
      ('00' + d.getHours()).slice(-2) + ':' +
      ('00' + d.getMinutes()).slice(-2) + ':' +
      ('00' + d.getSeconds()).slice(-2) + ':000';
    // calculate the MD5 hash format - TERMINALID+MERCHANTREF+DATETIME+CARDNUMBER+CARDEXPIRY+CARDTYPE+CARDHOLDERNAME+secret
    const hash = Md5.hashStr(config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID + this.clientId + dateTime + this.cardNum +
      expmonth + this.expYear.toString().substring(2) + this.paymentName + this.clientName + config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_KEY);
    const clientData1 = {
      merchantref: this.clientId,
      terminalid: config.ANYWHERECOMMERCE_DEVELOPER_TEST_MERCHANT_ID,
      cardType: this.paymentName,
      cardHolName: this.clientName,
      dateTime: dateTime,
      cardNum: this.cardNum,
      cardExp: expmonth + this.expYear.toString().substring(2),
      hash: hash,
      cvv: this.cardCVV
    };
    if (this.newclient === true) {
      this.tokenbody = this.commonService.createToken(clientData1);
    } else if (this.newclient === false) {
      this.tokenbody = this.commonService.updateToken(clientData1);
    }
    // this.tokenbody =  this.commonService.updateToken(clientData1);
    const url = config.ANYWHERECOMMERCE_PAYMENT_API;

    const reqObj = {
      'url': url,
      'xml': this.tokenbody
    };
    this.checkoutMembershipsService.xmlPayment(reqObj).subscribe(
      data => {
        let cardTokenId: any = '';
        const parseString = require('xml2js').parseString;
        parseString(data['result'], function (err, result) {
          cardTokenId = result;
        });
        if (cardTokenId.ERROR && cardTokenId.ERROR.ERRORSTRING[0] === 'INVALID MERCHANTREF') {
          this.errorMsgAry[0] = 'INVALID MERCHANTREF';
        } else if ((cardTokenId.ERROR) && (!cardTokenId.SECURECARDUPDATERESPONSE || !cardTokenId.SECURECARDREGISTRATIONRESPONSE)) {
          if ((cardTokenId.ERROR.ERRORSTRING[0].split(' ')[0] === cardTokenId.ERROR.ERRORSTRING[0].split(' ')[0] || this.cardNum.toString() === '0')
            && (cardTokenId.ERROR.ERRORSTRING[0] !== 'INVALID CARDEXPIRY') &&
            (cardTokenId.ERROR.ERRORSTRING[0] !== 'java.lang.StringIndexOutOfBoundsException: String index out of range: 12')) {
            this.errorMsgAry[1] = 'Credit Card Processing Error: INVALID CARDNUMBER field';
            window.scrollTo(0, 0);
            this.paymentName = '';
            this.processPaymentModal.hide();
          } else if (cardTokenId.ERROR.ERRORSTRING[0] === 'INVALID CARDEXPIRY') {
            this.errorMsgAry[2] = 'Invalid card expiry';
            window.scrollTo(0, 0);
            this.paymentName = '';
            this.processPaymentModal.hide();
          } else if (cardTokenId.ERROR.ERRORSTRING[0] === 'java.lang.StringIndexOutOfBoundsException: String index out of range: 12') {
            this.errorMsgAry[3] = 'Card number must be 12 digits';
            window.scrollTo(0, 0);
            this.paymentName = '';
            this.processPaymentModal.hide();
          }
        }
        if (this.newclient === true) {
          this.cardTokenId1 = cardTokenId.SECURECARDREGISTRATIONRESPONSE.CARDREFERENCE[0];
        } else {
          this.cardTokenId1 = cardTokenId.SECURECARDUPDATERESPONSE.CARDREFERENCE[0];
        }
        this.showOk = true;
        this.showSave = false;
        this.cardNum = '';
        this.cardCVV = '';
        this.processPaymentModal.hide();
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
            } break;
        }
      });


    // this.http.post(url, this.tokenbody, {
    //   headers: new HttpHeaders()
    //     .set('Content-Type', 'text/xml')
    //     .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    //     .append('Access-Control-Allow-Origin', '*')
    //     .append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method')
    //   , responseType: 'text'
    // }).subscribe(data => {
    //   let cardTokenId: any = '';
    //   const parseString = require('xml2js').parseString;
    //   parseString(data, function (err, result) {
    //     cardTokenId = result;
    //   });
    //   if (cardTokenId.ERROR && cardTokenId.ERROR.ERRORSTRING[0] === 'INVALID MERCHANTREF') {
    //     this.errorMsgAry[0] = 'INVALID MERCHANTREF';
    //   } else if ((cardTokenId.ERROR) && (!cardTokenId.SECURECARDUPDATERESPONSE || !cardTokenId.SECURECARDREGISTRATIONRESPONSE)) {
    //     if ((cardTokenId.ERROR.ERRORSTRING[0].split(' ')[0] === cardTokenId.ERROR.ERRORSTRING[0].split(' ')[0] || this.cardNum.toString() === '0')
    //       && (cardTokenId.ERROR.ERRORSTRING[0] !== 'INVALID CARDEXPIRY') &&
    //       (cardTokenId.ERROR.ERRORSTRING[0] !== 'java.lang.StringIndexOutOfBoundsException: String index out of range: 12')) {
    //       this.errorMsgAry[1] = 'Credit Card Processing Error: INVALID CARDNUMBER field';
    //       window.scrollTo(0, 0);
    //       this.paymentName = '';
    //       this.processPaymentModal.hide();
    //     } else if (cardTokenId.ERROR.ERRORSTRING[0] === 'INVALID CARDEXPIRY') {
    //       this.errorMsgAry[2] = 'Invalid card expiry';
    //       window.scrollTo(0, 0);
    //       this.paymentName = '';
    //       this.processPaymentModal.hide();
    //     } else if (cardTokenId.ERROR.ERRORSTRING[0] === 'java.lang.StringIndexOutOfBoundsException: String index out of range: 12') {
    //       this.errorMsgAry[3] = 'Card number must be 12 digits';
    //       window.scrollTo(0, 0);
    //       this.paymentName = '';
    //       this.processPaymentModal.hide();
    //     }
    //   }
    //   if (this.newclient === true) {
    //     this.cardTokenId1 = cardTokenId.SECURECARDREGISTRATIONRESPONSE.CARDREFERENCE[0];
    //   } else {
    //     this.cardTokenId1 = cardTokenId.SECURECARDUPDATERESPONSE.CARDREFERENCE[0];
    //   }
    //   this.showOk = true;
    //   this.showSave = false;
    //   this.cardNum = '';
    //   this.cardCVV = '';
    //   this.processPaymentModal.hide();
    // }, (err: HttpErrorResponse) => {
    // });
  }
  saveCheckoutMemberships() {
    if (this.clientMembershipId === undefined || this.clientMembershipId === 'undefined' || this.clientMembershipId === ''
      || this.clientMembershipId === 'null' || this.clientMembershipId === null) {
      this.errorMsgAry[4] = 'Membership Id cannot be blank';
    } else {
      if (this.autoBill === true) {
        this.autoBill = 1;
      } else {
        this.autoBill = 0;
      }
      const clientMembershipsObj = {
        'Auto_Bill__c': this.autoBill,
        'Client__c': this.clientId,
        'Membership_Price__c': this.memPrice,
        'Membership__c': this.membershipId,
        'Membership_ID__c': this.clientMembershipId,
        'Next_Bill_Date__c': this.formattedDate,
        'Payment_Type__c': this.paymentId,
        'Token__c': this.cardTokenId1
      };
      this.checkoutMembershipsService.saveCheckoutMemberships(clientMembershipsObj).subscribe(data => {
        this.clientMembershipId = '';
        this.router.navigate(['/checkout']);
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

  cancel() {
    this.clientMembershipId = '';
    this.router.navigate(['/checkout']);
  }
  cancelPayModal() {
    this.processPaymentModal.hide();
    this.cardNum = '';
    this.cardCVV = '';
    this.mailingCode = '';
    this.expMonth = 1;
    this.expYear = 2018;
    this.errorMsgAry[0] = '';
  }
  /**
   * Payment modal code ends
   */
}
