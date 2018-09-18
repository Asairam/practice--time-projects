import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TicketSalesReportService } from './ticketsalesreport.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../../common/common.service';
@Component({
  selector: 'app-reports-app',
  templateUrl: './ticketsalesreport.html',
  styleUrls: ['./ticketsalesreport.css'],
  providers: [TicketSalesReportService, CommonService],
})
export class TicketSalesReportComponent implements OnInit {
  bsValue = new Date();
  bsValue1 = new Date();
  itemsDisplay = false;
  salesList = [];
  datePickerConfig: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private ticketSalesReportService: TicketSalesReportService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
  }
  generateReport() {
    this.itemsDisplay = true;
    const stDt = this.commonService.getDBDatStr(this.bsValue);
    const endDt = this.commonService.getDBDatStr(this.bsValue1);
    this.ticketSalesReportService.getsalesRecords(stDt, endDt).subscribe(data => {
      this.salesList = data['result']['salesData'];
      const dates = data['result']['dates'];
      const dataList = [];
      for (let i = 0; i < dates.length; i++) {
        let price = 0;
        dataList.push(this.salesList.filter((obj) => obj.aptDt === dates[i]));
        const tempArr = this.salesList.filter((obj) => obj.aptDt === dates[i]);
        if (tempArr && tempArr.length > 0) {
          for (let j = 0; j < tempArr.length; j++) {
            price += parseFloat(tempArr[j]['Payments__c']);
          }
        }
        dataList[i]['date'] = dates[i];
        dataList[i]['total'] = price;
      }
      this.salesList = dataList.filter((obj) => obj.length);
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
