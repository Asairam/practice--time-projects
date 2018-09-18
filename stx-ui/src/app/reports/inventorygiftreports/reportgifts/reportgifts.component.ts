import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportGiftsService } from './reportgifts.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { JwtHelper } from 'angular2-jwt';
import { CommonService } from '../../../common/common.service';

@Component({
  selector: 'app-reports-app',
  templateUrl: './reportgifts.html',
  styleUrls: ['./reportgifts.css'],
  providers: [ReportGiftsService, CommonService],
})
export class ReportGiftsComponent implements OnInit {
  bsValue = new Date();
  bsValue1 = new Date();
  startDate = new Date();
  endDate = new Date();
  // minDate = new Date();
  itemsDisplay = false;
  workerTipsData: any;
  datePickerConfig: any;
  decodedToken: any;
  companyName: any;
  type: any;
  isGenerate = false;
  orginalAmt = 0;
  currentAmt = 0;
  ticketCount: any = 0;
  reportTypes = ['Issued', 'Expired', 'No Expires Date'];
  goalsObj: any;
  error: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private reportGiftsService: ReportGiftsService) {
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
    this.type = this.reportTypes[0];
  }
  reportTypeOnChange(value) {
    this.isGenerate = false;
    this.type = value;
  }
  clearErrorMsgs() {
    this.error = '';
  }
  generateReport() {
    const startTime = ('00' + (this.startDate.getMonth() + 1)).slice(-2) + '-' + ('00' + this.startDate.getDate()).slice(-2) + '-' +
      (this.startDate.getFullYear() + '');
      const endTime = ('00' + (this.endDate.getMonth() + 1)).slice(-2) + '-' + ('00' + this.endDate.getDate()).slice(-2) + '-' +
      (this.endDate.getFullYear() + '');
    if (startTime > endTime) {
      this.error = 'TOTAL_SHEETS.BEGIN_DATE_SHOULD_BE_AFTER_END_DATE';
    } else {
      const stDate = this.startDate.getFullYear() + '-' + (this.startDate.getMonth() + 1) + '-' + this.startDate.getDate();
      const edDate = this.endDate.getFullYear() + '-' + (this.endDate.getMonth() + 1) + '-' + this.endDate.getDate();
      const servieObj = {
        'begindate': stDate,
        'enddate': edDate,
        'type': this.type
      };
      this.reportGiftsService.generateReport(servieObj).subscribe(data => {
        this.isGenerate = true;
        this.goalsObj = data['result'];
        let temp = 0;
        let temp1 = 0;
        this.ticketCount = this.goalsObj.length;
        this.goalsObj.map((obj) => { temp += obj.Amount__c; });
        this.orginalAmt = temp;
        this.goalsObj.map((obj) => { temp1 += obj.currentBalnce; });
        this.currentAmt = temp1;
        this.itemsDisplay = true;
      },
        error => {
          this.itemsDisplay = false;
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
}
