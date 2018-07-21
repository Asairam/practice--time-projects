import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { PaymentDetailsService } from './paymentdetails.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './paymentdetails.html',
  styleUrls: ['./paymentdetails.css'],
  providers: [PaymentDetailsService],
})
export class PaymentDetailsComponent implements OnInit, AfterViewInit {
  date = new Date();
  startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  endDate = new Date();
  itemsDisplay = false;
  workerTipsData: any;
  datePickerConfig: any;
  reporttype = 'Company';
  WorkerList = true;
  seleWorker = '';
  dateError: any;
  workerError: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private paymentDetailsService: PaymentDetailsService) {
      this.datePickerConfig = Object.assign({},
                  {
                    showWeekNumbers: false,
                    containerClass: 'theme-blue',
                  });
  }
  ngOnInit() {
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
    } else if ((this.WorkerList === false) && ( this.seleWorker === '')) {
       this.workerError = 'ELECTRONIC_PAYMENT_DETAILS.WORKER_ERR';
    } else {
      this.itemsDisplay = true;
    }
  }
  reportType(value) {
    if (value === 'Company') {
      this.WorkerList = true;
      this.seleWorker = '';
      this.workerError = '';
    } else {
      this.WorkerList = false;
    }
  }
  clear () {
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
