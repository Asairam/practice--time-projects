import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportDailyCashDrawerService } from './reportdailycashdrawer.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../common/common.service';
import { TranslateService } from 'ng2-translate';
import { JwtHelper } from 'angular2-jwt';
// import {Component} from "@angular/core";
@Component({
  selector: 'app-reports-app',
  templateUrl: './reportdailycashdrawer.html',
  styleUrls: ['./reportdailycashdrawer.css'],
  providers: [ReportDailyCashDrawerService, CommonService],
})
export class ReportDailyCashDrawerComponent implements OnInit {
  bsValue: any;
  maxdate = new Date();
  itemsDisplay = false;
  paymentsData: any;
  cashInOutData: Array<any>;
  cashDrawerData: any;
  tipsData: any;
  sendDate: any;
  datePickerConfig: any;
  decodedToken: any;
  companyName: any;
  totalAmt: number;
  reportData: any;
  AmountData: any = {};
  constructor(private route: ActivatedRoute, private commonService: CommonService,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private reportDailyCashDrawerService: ReportDailyCashDrawerService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('token'));
      this.companyName = this.decodedToken.data.cname;
    } catch (error) {
      this.decodedToken = {};
    }
  }
  calculateSum(total: number, value: number) {
    return total + value;
  }
  generateReport(date) {
    this.bsValue = new Date(date);
    this.sendDate = this.commonService.getDBDatTmStr(this.bsValue).split(' ')[0];
    this.itemsDisplay = true;
    this.reportDailyCashDrawerService.getCashDrawer(this.sendDate)
      .subscribe(data => {
        const payments = data['result']['paymentObjdata'];
        const tips = data['result']['tipsObjData'];
        //  const paymentWithTips: Array<any> = payments.concat(tips);
        this.reportData = [];
        this.cashInOutData = data['result']['cashInOutData'];
        const dat1 = this.cashInOutData.filter((obj) => obj.Type__c === 'Cash Paid In');
        const dat2 = this.cashInOutData.filter((obj) => obj.Type__c === 'Cash Paid Out');

        this.AmountData = {};
        // const tt1 = dat1.length > 0 ? parseFloat(dat1.map(obj => +obj['Amount__c']).reduce(this.calculateSum)) : 0;
        // const tt2 = dat2.length > 0 ? parseFloat(dat2.map(obj => +obj['Amount__c']).reduce(this.calculateSum)) : 0;
        // this.totalAmt = tt1 - tt2;
        const cashDrawerMap = new Map();
        this.cashDrawerData = data['result']['cashDrawerData'];
        const paymentMap = new Map();
        this.cashDrawerData.forEach((drawerData) => {
          const name = drawerData.Cash_Drawer_Number__c.toString();
          const obj = {
            'cashDrawer': drawerData,
            'cashInOut': [],
            'paymentsMade': [],
            'cashDrawerNumber': drawerData.Cash_Drawer_Number__c
          };
          if (!cashDrawerMap.has(name)) {
            cashDrawerMap.set(name, obj);
            if (!this.AmountData.hasOwnProperty(name)) {
              this.AmountData[name] = 0;
            }
          } else {
            cashDrawerMap.set(name, obj);
          }
        });
        this.cashInOutData.forEach((cashData) => {
          const name = cashData.Drawer_Number__c.toString();
          const obj = {
            'cashDrawer': undefined,
            'cashInOut': [cashData],
            'paymentsMade': [],
            'cashDrawerNumber': cashData.Drawer_Number__c
          };
          if (!this.AmountData.hasOwnProperty(name)) {
            this.AmountData[name] = 0;
          }
          if (this.AmountData.hasOwnProperty(name)) {
            if (cashData.Type__c === 'Cash Paid In') {
              this.AmountData[name] += +cashData.Amount__c;
            } else {
              this.AmountData[name] -= +cashData.Amount__c;
            }
          }

          if (!cashDrawerMap.has(name)) {
            cashDrawerMap.set(name, obj);
          } else {
            const mappedObj = cashDrawerMap.get(name);
            mappedObj.cashInOut.push(cashData);
            cashDrawerMap.set(name, mappedObj);
          }
        });
        payments.forEach((payment) => {
          const name = payment.drawerNumber.toString();
          const obj = {
            'cashDrawer': undefined,
            'cashInOut': [],
            'paymentsMade': [payment],
            'cashDrawerNumber': name
          };
          if (!this.AmountData.hasOwnProperty(name)) {
            this.AmountData[name] = 0;
          }
          if (this.AmountData.hasOwnProperty(name)) {
            this.AmountData[name] += +payment.paymentAmount;
          }
          if (!paymentMap.has(name.toString())) {

            paymentMap.set(name, +payment.balanceDue.toFixed(2));
          }
          if (!cashDrawerMap.has(name)) {
            cashDrawerMap.set(name, obj);
          } else {
            const mappedObj = cashDrawerMap.get(name);
            mappedObj.paymentsMade.push(payment);
            cashDrawerMap.set(name, mappedObj);
          }
        });
        tips.forEach((tip) => {
          const name = tip.drawerNumber.toString();
          const obj = {
            'cashDrawer': undefined,
            'cashInOut': [],
            'paymentsMade': [tip],
            'cashDrawerNumber': name
          };
          if (!paymentMap.has(name)) {
            paymentMap.set(name, +tip.balanceDue.toFixed(2));
          }
          // if (tipsMap.has(tip.drawerNumber)) {
          //   const tipsTotal = tipsMap.get(tip.drawerNumber);
          //   if (tip.paymentType !== 'Tip Left in Drawer') {
          //     tipsMap.set(tip.drawerNumber, tipsTotal + tip.paymentAmount);
          //   }
          // } else {
          //   if (tip.paymentType !== 'Tip Left in Drawer') {
          //     tipsMap.set(tip.drawerNumber, tip.paymentAmount);
          //   }
          // }
          if (!this.AmountData.hasOwnProperty(name)) {
            this.AmountData[name] = 0;
          }
          if (this.AmountData.hasOwnProperty(name)) {
            if (tip.paymentType !== 'Tip Left in Drawer') {
              this.AmountData[name] -= +tip.paymentAmount;
            }
          }
          if (!cashDrawerMap.has(name)) {
            cashDrawerMap.set(name, obj);
          } else {
            const mappedObj = cashDrawerMap.get(name);
            mappedObj.paymentsMade.push(tip);
            cashDrawerMap.set(name, mappedObj);
          }
        });
        // const dat123 = [];
        // cashDrawerMap.forEach((elment) => {
        //   dat123.push(elment);
        // });
        // console.log(dat123);
        this.reportData = [];
        let i = 0;
        cashDrawerMap.forEach((elment, index) => {
          const name = elment.cashDrawerNumber.toString();
          if (paymentMap.has(name)) {
            this.AmountData[name] += paymentMap.get(name);
            this.AmountData[name] = +this.AmountData[name].toFixed(2);
          }
          const dat12 = elment;
          dat12['paymentsMade'] = this.getPaymentsByTicketNumber(elment['paymentsMade'], +index);
          i++;
          this.reportData.push(dat12);
        });
        // console.log(dat123);
        //  this.tipsData = data['result']['tipsObjData'];
      }, error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
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

  GroupByDrawerNumber(tickets: Array<any>, orgticket, keyName, filterType, index) {
    const resultArray = tickets.filter((ticket) => orgticket.Cash_Drawer_Number__c.toString() === ticket[keyName]);
    if (filterType !== 'payments') {
      resultArray.forEach((obj, j) => this.calculateTotalAmount(index, obj, 'Amount__c'));
      return resultArray;
    } else {
      return this.getPaymentsByTicketNumber(resultArray, index);
    }

  }
  getPaymentsByTicketNumber(paymentByTicket: Array<any>, index): Array<any> {
    const paymentDataByDrawer = [];
    let payments = [];
    payments = payments.concat(paymentByTicket);
    const test = [];
    payments.forEach(paymentData => {
      const payment = [];
      payments.forEach((Pdata, i) => {
        if (test.filter((data) => data === Pdata.apptTicketName).length === 0) {
          if (paymentData.apptTicketName === Pdata.apptTicketName) {
            test.push(Pdata.apptTicketName);
            payment.push(Pdata);
            //   this.calculateTotalAmount(index, Pdata, 'paymentAmount');
            // payments.splice(i, 1);
          }
        }
      });
      paymentDataByDrawer.push(payment);
    });
    // console.log(paymentDataByDrawer);
    return paymentDataByDrawer;
  }

  calculateTotalAmount(index, object, property) {
    // let property = '';
    // property = object['paymentType'] ? 'paymentAmount' : 'Amount__c';
    if (this.AmountData[index]) {
      this.AmountData[index] += object[property] ? +object[property] : 0;
    } else {
      this.AmountData.push(object[property] ? +object[property] : 0);
    }
  }
}
