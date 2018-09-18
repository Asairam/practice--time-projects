/*
ngOnInit(): Method to laod data
calTotAmt(amunt): Method to to calculate the amountsfor opening and closing.
getPosDevicesData():Method to get cashDrawer data
generateCashCountingReport(): Method to generate cash counting data
saveCashCounting(): Method to save cash counting data
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { CashCountingService } from './cashcounting.service';
import { CommonService } from '../../common/common.service';
@Component({
  selector: 'app-cashcounting',
  templateUrl: './cashcounting.component.html',
  styleUrls: ['./cashcounting.component.css'],
  providers: [CashCountingService, CommonService]
})
export class CashCountingComponent implements OnInit {
  maxDate: Date;
  datePickerConfig: any;
  posDevicesList: any = [];
  bsValue = new Date();
  cashCountError: any;
  dateError: any;
  cashDrawer: any = '';
  totalAmt: number;
  listData: any;
  cashData: any = [];
  savecashData: any = [];
  editcashData: any = [];
  showOpening: any;
  showClosing: any;
  showReadOnly: any;
  amount: any = {};
  Cash_In_Out_Total: number;
  Cash_Over_Under: number;
  Closing_Cash: number;
  Opening_Cash: number;
  Transaction_Total: number;
  showReport: any = false;
  cashdrawerId: any;
  total_open_cash: number;
  close_100: number;
  close_50_cent: number;
  close_50: number;
  close_25_cent: number;
  close_20: number;
  close_10_cent: number;
  close_10: number;
  close_05_cent: number;
  close_5: number;
  close_01_cent: number;
  close_1: number;
  closing_cash: number;
  open_cash: number;
  selectDate: any;
  opening_Cash: number;
  read_open_cash: number;
  read_closing_cash: number;
  close_Transaction_Total: number;
  Close_Cash_Over_Under: number;
  close_Closing_Cash: number;
  read_Cash_Over_Under__c: number;
  read_Transaction_Total__c: number;
  read_Cash_In_Out_Total: number;
  read_total_close_cash: number;
  close_total_open_cash: number;
  close_Cash_In_Out_Total: number;
  openAmount = {
    'Open_100__c': '',
    'Open_50_cent__c': '',
    'Open_50__c': '',
    'Open_25_cent__c': '',
    'Open_20__c': '',
    'Open_10_cent__c': '',
    'Open_10__c': '',
    'Open_5_cent__c': '',
    'Open_5__c': '',
    'Open_1_cent__c': '',
    'Open_1__c': ''
  };
  closeAmount = {
    'Close_100__c': '',
    'Close_50_cent__c': '',
    'Close_50__c': '',
    'Close_25_cent__c': '',
    'Close_20__c': '',
    'Close_10_cent__c': '',
    'Close_10__c': '',
    'Close_5_cent__c': '',
    'Close_5__c': '',
    'Close_1_cent__c': '',
    'Close_1__c': ''
  };
  constructor(private cashCountingService: CashCountingService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private commonService: CommonService,
    private router: Router) {

  }
  /* Method for laoding data */
  ngOnInit() {
    this.maxDate = new Date();
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
    this.getPosDevicesData();
  }
  /* Method to calculate the amounts for open and close time */
  calTotAmt(amount) {
    this.totalAmt = 0;
    if (this.showOpening === true) {
      Object.keys(amount).map((key) => {
        if (this.amount[key]) {
          this.amount[key] = +this.amount[key];
        }
        if (key === 'Open_100__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 100;
        } else if (key === 'Open_50_cent__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 0.5;
        } else if (key === 'Open_50__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 50;
        } else if (key === 'Open_25_cent__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 0.25;
        } else if (key === 'Open_20__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 20;
        } else if (key === 'Open_10_cent__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 0.1;
        } else if (key === 'Open_10__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 10;
        } else if (key === 'Open_5_cent__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 0.5;
        } else if (key === 'Open_5__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 5;
        } else if (key === 'Open_1_cent__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 0.01;
        } else if (key === 'Open_1__c' && this.amount[key]) {
          this.totalAmt += (amount[key]) * 1;
        }
      });
      this.amount.Total_Open__c = this.totalAmt;
    } else if (this.showClosing === true) {
      Object.keys(amount).map((key) => {
        if (this.amount[key]) {
          this.amount[key] = +this.amount[key];
        }
        if (key === 'Close_100__c') {
          this.totalAmt += (amount[key]) * 100;
        } else if (key === 'Close_50_cent__c') {
          this.totalAmt += (amount[key]) * 0.5;
        } else if (key === 'Close_50__c') {
          this.totalAmt += (amount[key]) * 50;
        } else if (key === 'Close_25_cent__c') {
          this.totalAmt += (amount[key]) * 0.25;
        } else if (key === 'Close_20__c') {
          this.totalAmt += (amount[key]) * 20;
        } else if (key === 'Close_10_cent__c') {
          this.totalAmt += (amount[key]) * 0.1;
        } else if (key === 'Close_10__c') {
          this.totalAmt += (amount[key]) * 10;
        } else if (key === 'Close_5_cent__c') {
          this.totalAmt += (amount[key]) * 0.5;
        } else if (key === 'Close_5__c') {
          this.totalAmt += (amount[key]) * 5;
        } else if (key === 'Close_1_cent__c') {
          this.totalAmt += (amount[key]) * 0.01;
        } else if (key === 'Close_1__c') {
          this.totalAmt += (amount[key]) * 1;
        }
      });
      this.amount.Total_Close__c = this.totalAmt;
    }
  }
  /*  Method to get cash Drawer data */
  getPosDevicesData() {
    this.cashCountingService.
      getPosdevices().subscribe(data => {
        if (data['result'][0].JSON__c) {
          this.posDevicesList = JSON.parse(data['result'][0].JSON__c).filter((obj) => obj.readOnly === true);
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
  /* Method to generete cash drawer data for cash counting*/
  generateCashCountingReport() {
    if (this.bsValue === undefined || this.bsValue === null) {
      this.dateError = 'Please Select a date';
    } else if (this.cashDrawer === '' || this.cashDrawer === 'undefined' || this.cashDrawer === undefined || this.cashDrawer === '--Select Cash Drawer--') {
      this.cashCountError = 'Please select a cash drawer';
    } else {
      const convertedDate = this.commonService.getDBDatStr(this.bsValue);
      this.selectDate = convertedDate.split(' ')[0];
      this.cashCountingService.getCashCountingReport(this.selectDate, this.cashDrawer)
        .subscribe(data => {
          this.showReadOnly = data['result']['showReadOnly'];
          this.showOpening = data['result']['showOpening'];
          this.showClosing = data['result']['showClosing'];
          this.amount = {};
          if (this.showOpening) {
            this.amount = this.openAmount;
          } else if (this.showClosing) {
            this.amount = this.closeAmount;
          }
          this.listData = data['result'];
          this.showReport = true;
          if (this.listData.showReadOnly === true) {
            this.read_Transaction_Total__c = this.listData.dailyCashRecord.Transaction_Total__c;
            if (this.read_Transaction_Total__c === null) {
              this.read_Transaction_Total__c = 0;
            }
            this.read_Cash_Over_Under__c = this.listData.dailyCashRecord.Cash_Over_Under__c;
            this.read_Cash_In_Out_Total = this.listData.dailyCashRecord.Cash_In_Out_Total__c;
            if (this.read_Cash_In_Out_Total === null) {
              this.read_Cash_In_Out_Total = 0;
            }
            this.read_total_close_cash = this.listData.dailyCashRecord.Total_Close__c;
            this.read_open_cash = this.listData.dailyCashRecord.Opening_Cash__c;
            this.read_closing_cash = this.listData.dailyCashRecord.Closing_Cash__c;
            this.close_100 = this.listData.dailyCashRecord.Close_100__c;
            this.close_50_cent = this.listData.dailyCashRecord.Close_50_cent__c;
            this.close_50 = this.listData.dailyCashRecord.Close_50__c;
            this.close_25_cent = this.listData.dailyCashRecord.Close_25_cent__c;
            this.close_20 = this.listData.dailyCashRecord.Close_20__c;
            this.close_10_cent = this.listData.dailyCashRecord.Close_10_cent__c;
            this.close_10 = this.listData.dailyCashRecord.Close_10__c;
            this.close_05_cent = this.listData.dailyCashRecord.Close_5_cent__c;
            this.close_5 = this.listData.dailyCashRecord.Close_5__c;
            this.close_01_cent = this.listData.dailyCashRecord.Close_1_cent__c;
            this.close_1 = this.listData.dailyCashRecord.Close_1__c;
          }
          if (this.listData.showClosing === true) {
            this.close_Transaction_Total = this.listData.dailyCashRecord.Transaction_Total__c;
            if (this.close_Transaction_Total === null) {
              this.close_Transaction_Total = 0;
            }
            this.close_Cash_In_Out_Total = this.listData.dailyCashRecord.Cash_In_Out_Total__c;
            if (this.close_Cash_In_Out_Total === null || this.close_Cash_In_Out_Total === 0) {
              this.close_Cash_In_Out_Total = 0;
            }
            this.close_total_open_cash = this.listData.dailyCashRecord.Total_Open__c;
            this.cashdrawerId = this.listData.dailyCashRecord.Id;
            this.Close_Cash_Over_Under = this.listData.dailyCashRecord.Cash_Over_Under__c;
            this.Opening_Cash = this.listData.dailyCashRecord.Opening_Cash__c;
            this.close_Closing_Cash = this.listData.dailyCashRecord.Closing_Cash__c;
            if (this.close_Closing_Cash === 0 || this.close_Closing_Cash === null) {
              this.close_Closing_Cash = 0;
            }
          }
          if (this.listData.showOpening === true) {
            /* this.opening_Cash is used to show the value in html side only */
            this.opening_Cash = this.listData.dailyCashRecord.Opening_Cash__c;
            this.Cash_Over_Under = this.listData.dailyCashRecord.Cash_Over_Under__c;
            this.Cash_In_Out_Total = this.listData.dailyCashRecord.Cash_In_Out_Total__c;
            this.Closing_Cash = this.listData.dailyCashRecord.Closing_Cash__c;
            this.Transaction_Total = this.listData.dailyCashRecord.Transaction_Total__c;
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
    } /*if end */
  }
  /*Method to save cash counting data */
  saveCashCounting() {
    if (this.showOpening) {
      this.cashData = {
        'Status__c': 'Open',
        'showOpening': true,
        'Cash_In_Out_Total__c': this.Cash_In_Out_Total,
        'Cash_Over_Under__c': this.Cash_Over_Under,
        'Closing_Cash__c': this.Closing_Cash,
        'Opening_Cash__c': this.totalAmt,
        'Transaction_Total__c': this.Transaction_Total,
        'Total_Open__c': this.totalAmt,
        'Cash_Drawer_Number__c': + this.cashDrawer.split(' ')[0],
        'Cash_Drawer__c': this.cashDrawer.split(' ')[1],
        'Date__c': this.selectDate
      };
      const modifyAmount = {};
      Object.keys(this.amount).map((key) => {
        if (this.amount[key]) {
          modifyAmount[key] = this.amount[key];
        } else {
          modifyAmount[key] = 0;
        }
      });
      this.cashData = Object.assign(this.cashData, modifyAmount);
      this.cashCountingService.saveCashCounting(this.cashData)
        .subscribe(data => {
          this.savecashData = data['result'];
          this.router.navigate(['/checkout']);
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
    } else if (this.showClosing) {
      this.cashData = {
        'Status__c': 'Closed',
        'showClosing': true,
        'Cash_In_Out_Total__c': this.close_Cash_In_Out_Total,
        'Cash_Over_Under__c': this.Close_Cash_Over_Under,
        'Closing_Cash__c': this.totalAmt,
        'Opening_Cash__c': this.Opening_Cash,
        'Transaction_Total__c': this.close_Transaction_Total,
        'Total_Open__c': this.totalAmt,
        'Total_Close__c': this.totalAmt,
        'Cash_Drawer_Number__c': this.cashDrawer.split(' ')[0],
        'Cash_Drawer__c': this.cashDrawer.split(' ')[1],
        'Date__c': this.selectDate
      };
      const modifyAmount = {};
      Object.keys(this.amount).map((key) => {
        if (this.amount[key]) {
          modifyAmount[key] = this.amount[key];
        } else {
          modifyAmount[key] = 0;
        }
      });
      this.cashData = Object.assign(this.cashData, modifyAmount);

      this.cashCountingService.editCashCounting(this.cashdrawerId, this.cashData)
        .subscribe(data => {
          this.editcashData = data['result'];
          this.router.navigate(['/checkout']);
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
  clearErrMsg() {
    this.cashCountError = '';
    this.dateError = '';
  }
  /* method to restrict specialcharecters  */
  keyPress(event: any) {
    const pattern = /^\d+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
}
