import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TotalSheetsService } from './totalsheets.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
// import {Component} from "@angular/core";
@Component({
  selector: 'app-reports-app',
  templateUrl: './totalsheets.html',
  styleUrls: ['./totalsheets.css'],
  providers: [TotalSheetsService],
})
export class TotalSheetsComponent implements OnInit {
  startDate = new Date();
  endDate = new Date();
  minDate = new Date();
  itemsDisplay = false;
  datePickerConfig: any;
  workerSalesObj = [];
  companySalesObj = [];
  paymentsData = [];
  grandTotalObj = [];
  accountBalanceObj = {
    'deposit': 0,
    'depositOnline': 0,
    'prepayment': 0,
    'receivedOnAccount': 0,
    'totals': 0
  };
  bsValue = new Date();
  bsValue1 = new Date();
  error: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private totalSheetsService: TotalSheetsService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
  }

  generateReport() {
    if (this.startDate > this.endDate) {
      this.error = 'TOTAL_SHEETS.BEGIN_DATE_SHOULD_BE_AFTER_END_DATE';
    } else {
      this.totalSheetsService.getDailyTotalSheetRecords(this.startDate, this.endDate).subscribe(
        data => {
          this.workerSalesObj = data['result']['workerSalesObj'];
          this.companySalesObj = data['result']['companySalesObj'];
          this.accountBalanceObj = data['result']['accountBalanceObj'];
          this.paymentsData = data['result']['paymentsData'];
          this.grandTotalObj = data['result']['grandTotalObj'];
          this.itemsDisplay = true;
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
  }
  clearMsg() {
    this.error = '';
  }
}
