import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { CashInOutService } from './cashinout.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonService } from '../../common/common.service';
import * as config from '../../app.config';
@Component({
  selector: 'app-cashinout',
  templateUrl: './cashinout.html',
  styleUrls: ['./cashinout.css'],
  providers: [CashInOutService, CommonService],
})
export class CashInOutComponent implements OnInit {
  clientId: any;
  clientData: any;
  clientName: any;
  cashDrawerObj: any;
  cashDrawer: any;
  cashAmount: any;
  cashDrawerNumber: any;
  transactionName: any;
  cashDrawerName: any;
  cashFrom: any;
  cashReason: any;
  cashType = config.cashinout.cashTypeIn;
  cashTo: any;
  cashError1: any = '';
  cashError2: any = '';
  cashError3: any = '';
  cashError4: any = '';
  cashError5: any = '';
  constructor(private cashInOutService: CashInOutService,
    @Inject('apiEndPoint') public apiEndPoint: string,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer) {
    this.route.queryParams.subscribe(params => {
      this.clientId = route.snapshot.params['clientId'];
    });
  }
  ngOnInit() {
    this.cashDrawerObj = localStorage.getItem('browserObject');
    this.cashDrawer = JSON.parse(this.cashDrawerObj).CashDrawer;
    this.cashDrawerNumber = JSON.parse(this.cashDrawerObj).CashDrawer.split(' ')[0];
    this.cashDrawerName = JSON.parse(this.cashDrawerObj).CashDrawer.split(' ')[1];
  }
  saveCashInOut() {
    if (this.transactionName === 'undefined' || this.transactionName === undefined || this.transactionName === '') {
      this.cashError1 = 'CHECK_OUT_LIST.CASH_IN_OUT.VALID_NO_BLANK_TRANSACTION_BY';
    }
    if (this.cashAmount === 'undefined' || this.cashAmount === undefined || this.cashAmount === '') {
      this.cashError2 = 'CHECK_OUT_LIST.CASH_IN_OUT.VALID_NO_BLANK_AMOUNT';
    }
    if (this.cashAmount > 999999.99) {
      this.cashError2 = 'CHECK_OUT_LIST.CASH_IN_OUT.INVALID_NUMBER';
    }
    if (this.cashType === config.cashinout.cashTypeIn && (this.cashFrom === undefined || this.cashFrom === 'undefined' || this.cashFrom === '')) {
      this.cashError3 = 'CHECK_OUT_LIST.CASH_IN_OUT.VALID_NO_BLANK_FROM';
    }
    if (this.cashType === config.cashinout.cashTypeOut && (this.cashTo === undefined || this.cashTo === 'undefined' || this.cashTo === '')) {
      this.cashError4 = 'CHECK_OUT_LIST.CASH_IN_OUT.VALID_NO_BLANK_TO';
    }
    if (this.cashReason === 'undefined' || this.cashReason === undefined || this.cashReason === '') {
      this.cashError5 = 'CHECK_OUT_LIST.CASH_IN_OUT.VALID_NO_BLANK_REASON';
    } else if (this.cashError2 === '' || this.cashError2 === undefined) {
      const cashInOutObj = {
        'Amount__c': this.cashAmount,
        'Drawer_Name__c': this.cashDrawerName,
        'Drawer_Number__c': this.cashDrawerNumber,
        'From__c': this.cashFrom,
        'To__c': this.cashTo,
        'Reason__c': this.cashReason,
        'Transaction_By__c': this.transactionName,
        'Type__c': this.cashType
      };
      this.cashInOutService.saveCashInOut(cashInOutObj).subscribe(data => {
        const cashInOutList = data['result'];
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
  clearMsg() {
    this.cashError1 = '';
    this.cashError2 = '';
    this.cashError3 = '';
    this.cashError4 = '';
    this.cashError5 = '';
  }
  clear() {
    this.transactionName = '';
    this.cashAmount = '';
    this.cashFrom = '';
    this.cashTo = '';
    this.cashReason = '';
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
    this.clearMsg();
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

  cancel() {
    this.router.navigate(['/checkout']);
  }
}
