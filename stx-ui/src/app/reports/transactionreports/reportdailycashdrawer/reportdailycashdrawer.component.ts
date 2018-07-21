import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportDailyCashDrawerService } from './reportdailycashdrawer.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../common/common.service';
import { TranslateService } from 'ng2-translate';
// import {Component} from "@angular/core";
@Component({
  selector: 'app-reports-app',
  templateUrl: './reportdailycashdrawer.html',
  styleUrls:['./reportdailycashdrawer.css'],
  providers: [ReportDailyCashDrawerService, CommonService],
})
export class ReportDailyCashDrawerComponent implements OnInit {
  bsValue: any;
  maxdate = new Date();
  itemsDisplay = false;
  cashDrawerData: any;
  sendDate: any;
  datePickerConfig: any;
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
  }
  generateReport(date) {
    this.bsValue = new Date(date);
    this.sendDate = this.commonService.getDBDatTmStr(this.bsValue).split(' ')[0];
    this.itemsDisplay = true;
    this.reportDailyCashDrawerService.getCashDrawer(this.sendDate)
    .subscribe(data => {
      this.cashDrawerData = data['result'];
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
}
