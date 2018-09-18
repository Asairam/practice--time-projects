import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { PaymentDetailsService } from './paymentdetails.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../../common/common.service';
import { CheckOutEditTicketService } from '../../../checkout/editticket/checkouteditticket.service';
@Component({
  selector: 'app-reports-app',
  templateUrl: './paymentdetails.html',
  styleUrls: ['./paymentdetails.css'],
  providers: [PaymentDetailsService, CommonService, CheckOutEditTicketService],
})
export class PaymentDetailsComponent implements OnInit, AfterViewInit {
  date = new Date();
  startDate: any = new Date();
  endDate: any = new Date();
  isGenerate = false;
  workerTipsData: any;
  datePickerConfig: any;
  reporttype = 'Company';
  WorkerList = true;
  seleWorker = '';
  dateError: any;
  paymentsList: any;
  workerError: any;
  merchantWorkerList: any = [];
  merchantAccntName: any = '';
  paymentGateWay: any = '';
  error: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private checkOutEditTicketService: CheckOutEditTicketService,
    private commonService: CommonService,
    private paymentDetailsService: PaymentDetailsService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
    this.getWorkerMerchants();
    // this.updateHeaderDate(this.bsValue, this.bsValue1);
  }
  ngAfterViewInit() {
    this.headerDateFormat();
  }
  headerDateFormat() {
    let sDate;
    let sMonth;
    let eDate;
    let eMonth;
    if (this.startDate.getDate() < 10) {
      sDate = '0' + this.startDate.getDate();
    } else {
      sDate = this.startDate.getDate();
    }
    if ((this.startDate.getMonth() + 1) < 10) {
      sMonth = '0' + (this.startDate.getMonth() + 1);
    } else {
      sMonth = (this.startDate.getMonth() + 1);
    }
    if (this.endDate.getDate() < 10) {
      eDate = '0' + this.endDate.getDate();
    } else {
      eDate = this.endDate.getDate();
    }
    if ((this.endDate.getMonth() + 1) < 10) {
      eMonth = '0' + (this.endDate.getMonth() + 1);
    } else {
      eMonth = (this.endDate.getMonth() + 1);
    }
    // const displayName = document.getElementById('displayNameId');
    // displayName.innerHTML = ' Electronic Payment Details ' + sMonth + '/' + sDate + '/' + this.startDate.getFullYear() + ' - ' + eMonth + '/' + eDate + '/' + this.endDate.getFullYear();
  }
  generateReport() {
    this.headerDateFormat();
    if (this.startDate > this.endDate) {
      this.dateError = 'CHECK_OUTS.REFUND.BEGIN_DATE_A_E_D';
    } else if ((this.WorkerList === false) && (this.seleWorker === 'Select Worker')) {
      this.workerError = 'ELECTRONIC_PAYMENT_DETAILS.WORKER_ERR';
    } else {
      this.isGenerate = true;
      const stDate = this.startDate.getFullYear() + '-' + (this.startDate.getMonth() + 1) + '-' + this.startDate.getDate();
      const edDate = this.endDate.getFullYear() + '-' + (this.endDate.getMonth() + 1) + '-' + this.endDate.getDate();
      const dataObj = {
        startDate: stDate,
        endDate: edDate,
        worker: this.seleWorker,
        type: (this.WorkerList === false) ? 'Worker' : 'Company'
      };
      this.paymentDetailsService.getPaymentReport(dataObj).subscribe(data => {
        this.paymentsList = data['result'];
        for (let i = 0; i < this.paymentsList.length; i++) {
          const tempAry =  this.commonService.getAMPM(this.paymentsList[i]['Appt_Date_Time__c']);
          const temp2 = tempAry.split('$');
          this.paymentsList[i]['apptDt'] = temp2[0];
          this.paymentsList[i]['apptTime'] = temp2[1];
        }
      }, error => {

      });
    }
  }
  reportType(value) {
    if (value === 'Company') {
      this.WorkerList = true;
      this.seleWorker = '';
      this.workerError = '';
    } else {
      this.WorkerList = false;
      this.seleWorker = this.merchantAccntName;
    }
  }
  getWorkerMerchants() {
    this.checkOutEditTicketService.getWorkerMerchantsData()
      .subscribe(data => {
        this.merchantWorkerList.push({
          Payment_Gateway__c: 'AnywhereCommerce', FirstName: 'Select',
          LastName: 'Worker', Id: ''
        });
        if (data['result'] && data['result'].length > 0) {
          this.merchantWorkerList = this.merchantWorkerList.concat(data['result']);
        }
        // for default values
        // this.paymentGateWay = this.merchantWorkerList[0]['Payment_Gateway__c'];
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
  merchantOnChange(value) {
    const temp = this.merchantWorkerList.filter((obj) => obj.Id === value)[0];
    this.merchantAccntName = temp.FirstName + ' ' + temp.LastName;
    this.seleWorker = this.merchantAccntName;
    // this.paymentGateWay = temp.Payment_Gateway__c;
  }
  clear() {
    this.dateError = '';
    this.workerError = '';
  }
  // updateHeaderDate(bgnDate: Date, endDate: Date) {
  //   const displayName = document.getElementById('displayNameId');
  //   displayName.innerHTML = 'TICKET DETAILS ' + (bgnDate.getMonth() + 1) + '/' + bgnDate.getDate() + '/' + bgnDate.getFullYear() +
  //     ' - ' + (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + endDate.getFullYear();
  // }
  // datepickerChange(event) {
  //   this.updateHeaderDate(this.bsValue, this.bsValue1);
  // }
}
