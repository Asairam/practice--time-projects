import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { InventoryusageReportService } from './inventoryusagereport.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../../common/common.service';
@Component({
  selector: 'app-reports-app',
  templateUrl: './inventoryusagereport.html',
  styleUrls: ['./inventoryusagereport.css'],
  providers: [InventoryusageReportService, CommonService],
})
export class InventoryusageReportComponent implements OnInit {
  bsValue = new Date();
  maxDate = new Date();
  bsValue1 = new Date();
  itemsDisplay = false;
  workerTipsData: any;
  datePickerConfig: any;
  usageList = [];
  inventryErr: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private inventoryusageReportService: InventoryusageReportService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
  }
  clearErr() {
    this.inventryErr = '';
  }
  generateReport() {
    if (this.bsValue > this.bsValue1) {
     this.inventryErr = 'Start date must be less than End date';
    } else {
    const stDt = this.commonService.getDBDatStr(this.bsValue);
    const endDt = this.commonService.getDBDatStr(this.bsValue1);
    this.inventoryusageReportService.getInvUsageRecords(stDt, endDt).subscribe(data => {
      this.usageList = data['result']['usageData'];
      const dates = data['result']['dates'];
    this.itemsDisplay = true;
    this.inventryErr = '';
      const dataList = [];
      for (let i = 0; i < dates.length; i++) {
        let price = 0;
        dataList.push(this.usageList.filter((obj) => obj.date === dates[i]));
        const tempArr = this.usageList.filter((obj) => obj.date === dates[i]);
        if (tempArr && tempArr.length > 0) {
          for (let j = 0; j < tempArr.length; j++) {
            price += parseFloat(tempArr[j]['totalCost']);
          }
        }
        dataList[i]['date'] = dates[i + 1];
        dataList[i]['total'] = price;
      }
      this.usageList = dataList.filter((obj) => obj.length);
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
}
