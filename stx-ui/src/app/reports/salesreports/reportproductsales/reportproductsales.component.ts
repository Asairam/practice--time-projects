import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportProductSalesService } from './reportproductsales.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../../common/common.service';
import { NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core/src/view/provider';
@Component({
  selector: 'app-reports-app',
  templateUrl: './reportproductsales.html',
  styleUrls: ['./reportproductsales.css'],
  providers: [ReportProductSalesService, CommonService],
})
export class ReportProductSalesComponent implements OnInit {
  bsValue = new Date();
  bsValue1 = new Date();
  itemsDisplay = false;
  workerTipsData: any;
  datePickerConfig: any;
  minDate = new Date();
  startDate = new Date();
  endDate = new Date();
  error: any;
  workererror: any;
  noDataErr: any;
  type: any;
  worker: any;
  pdLineId: any = 'All';
  workerName: any;
  isGenerate = false;
  workerList = [];
  reportTypes = ['Company', 'Worker'];
  showWorkers = true;
  productSalesObj = [];
  productNetSalesTotal = 0;
  productLineList: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private reportProductSalessService: ReportProductSalesService) {

    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
    this.getWorkerList();
    this.getProductLine();
    this.type = this.reportTypes[0];
  }
  reportTypeOnChange(value) {
    this.isGenerate = false;
    this.type = value;
    if (value === 'Worker') {
      this.showWorkers = false;
    } else {
      this.showWorkers = true;
    }
  }
  workerListOnChange(value) {
    this.isGenerate = false;
    this.worker = value.split('$')[0];
    this.workerName = value.split('$')[1];
    this.workererror = '';
  }
  pdLineListOnChange(value) {
    this.pdLineId = value;
    // this.workerName = value.split('$')[1];
    this.workererror = '';
  }
  getWorkerList() {
    this.reportProductSalessService.getWorkerList().subscribe(data => {
      this.workerList = [];
      this.workerList = data['result']
        .filter(filterList => filterList.IsActive);
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
  /*-- Method to get product lines list(active) --*/
  getProductLine() {
    this.reportProductSalessService.getProductLineDetails(1)
      .subscribe(data => {
        this.productLineList = data['result'];
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
  clearErrorMsgs() {
    this.workererror = '';
    this.error = '';
    this.noDataErr = '';
  }
  generateReport() {
    this.productSalesObj = [];
    const startTime = ('00' + (this.startDate.getMonth() + 1)).slice(-2) + '-' + ('00' + this.startDate.getDate()).slice(-2) + '-' +
      (this.startDate.getFullYear() + '');
      const endTime = ('00' + (this.endDate.getMonth() + 1)).slice(-2) + '-' + ('00' + this.endDate.getDate()).slice(-2) + '-' +
      (this.endDate.getFullYear() + '');
    if (startTime > endTime) {
      this.error = 'TOTAL_SHEETS.BEGIN_DATE_SHOULD_BE_AFTER_END_DATE';
    } else if (this.type === 'Worker' && !this.worker) {
      this.workererror = 'Worker is Required';
    } else {
      const stDate = this.startDate.getFullYear() + '-' + (this.startDate.getMonth() + 1) + '-' + this.startDate.getDate();
      const edDate = this.endDate.getFullYear() + '-' + (this.endDate.getMonth() + 1) + '-' + this.endDate.getDate();
      const productObj = {
        'begindate': stDate,
        'enddate': edDate,
        'type': this.type,
        'worker': this.worker,
        'pdLine': this.pdLineId
      };
      this.reportProductSalessService.generateReport(productObj).subscribe(data => {
        this.isGenerate = true;
        const productSalesObj = data['result'];
        if (productSalesObj.length === 0) {
          this.noDataErr = '**Data Not Found';
        } else {
          for (let i = 0; i < productSalesObj.length; i++){
            productSalesObj[i].disaplayDate = this.commonService.getUsrDtStrFrmDBStr(productSalesObj[i].Appt_Date_Time__c);
          }
          this.noDataErr = '';
        }
        const items = productSalesObj;
        const lookup = {};
        const result = [];
        let totalSalesVal = 0;
        for (let item, i = 0; item = items[i++];) {
          const prodctName = item.productName;

          if (!(prodctName in lookup)) {
            lookup[prodctName] = 1;
            result.push(prodctName);
          }
        }
        const proArray = [];
        this.productNetSalesTotal = 0;
        for (let i = 0; i < result.length; i++) {
          proArray[i] = productSalesObj.filter((obj) => obj.productName === result[i]);
          for (let j = 0; j < proArray[i].length; j++) {
            totalSalesVal += parseFloat(proArray[i][j]['Net_Price__c']);
            proArray[i]['Net_Price__c'] = totalSalesVal;
          }
          totalSalesVal = 0;
        }
        this.productSalesObj = proArray;
        let temp = 0;
        this.productSalesObj.map((obj) => { temp += obj.Net_Price__c; });
        this.productNetSalesTotal = temp;
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
