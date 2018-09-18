import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportServiceSalesService } from './reportservicesales.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-reports-app',
  templateUrl: './reportservicesales.html',
  styleUrls: ['./reportservicesales.css'],
  providers: [ReportServiceSalesService],
})
export class ReportServiceSalesComponent implements OnInit {
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
  type: any;
  worker: any;
  workerName: any;
  isGenerate = false;
  workerList = [];
  reportTypes = ['Company', 'Worker'];
  showWorkers = true;
  serviceSalesObj = [];
  serviceSalesRefundObj = [];
  serviceGroupTotal = [];
  servSalesArray = [];
  serviceSalesTotal = 0;
  serviceSalesTotalSold = 0;
  serviceSalesTotalAvg = 0;
  lessRefundsTotal = 0;
  lessRefundsSold = 0;
  lessRefundsAvg = 0;
  serviceNetSalesTotal = 0;
  serviceNetSalesSold = 0;
  serviceNetSalesAvg = 0;
  decodedToken: any;
  companyName: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private reportServiceSalesService: ReportServiceSalesService) {
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
    this.getWorkerList();
    this.type = this.reportTypes[0];
  }
  // generateReport() {
  //   this.itemsDisplay = true;
  // }
  reportTypeOnChange(value) {
    this.isGenerate = false;
    this.type = value;
    if (value === 'Worker') {
      this.showWorkers = false;
    } else {
      this.showWorkers = true;
      this.worker = '';
    }
  }
  workerListOnChange(value) {
    this.isGenerate = false;
    this.worker = value.split('$')[0];
    this.workerName = value.split('$')[1];
    this.workererror = '';
  }
  getWorkerList() {
    this.reportServiceSalesService.getWorkerList().subscribe(data => {
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
  generateReport() {
    this.serviceSalesObj = [];
    this.serviceSalesRefundObj = [];
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
      const servieObj = {
        'begindate': stDate,
        'enddate': edDate,
        'type': this.type,
        'worker': this.worker
      };
      this.reportServiceSalesService.generateReport(servieObj).subscribe(data => {
        this.isGenerate = true;
        const temp = [];
        this.serviceSalesObj = data['result']['serviceSalesObj'];
        this.serviceSalesRefundObj = data['result']['serviceSalesRefundObj'];
        const lookup = {};
        const items = this.serviceSalesObj;
        const result = [];

        for (let item, i = 0; item = items[i++];) {
          const serviceGroup = item.serviceGroup;

          if (!(serviceGroup in lookup)) {
            lookup[serviceGroup] = 1;
            result.push(serviceGroup);
          }
        }
        this.servSalesArray = [];
        let totalSalesVal = 0;
        let soldVal = 0;
        let avgSales = 0;
        this.serviceSalesTotal = 0;
        this.serviceSalesTotalSold = 0;
        this.serviceSalesTotalAvg = 0;
        // refunds
        this.lessRefundsTotal = 0;
        this.lessRefundsSold = 0;
        this.lessRefundsAvg = 0;
        // net
        this.serviceNetSalesTotal = 0;
        this.serviceNetSalesSold = 0;
        this.serviceNetSalesAvg = 0;
        for (let i = 0; i < result.length; i++) {
          temp[i] = this.serviceSalesObj.filter(filterList => filterList.serviceGroup === result[i]);
          for (let j = 0; j < temp[i].length; j++) {
            if (this.type === 'Worker') {
            temp[i][j]['totalSales'] = parseFloat(temp[i][j]['workerPrice']);
            totalSalesVal += parseFloat(temp[i][j]['totalSales']);
            soldVal += parseFloat(temp[i][j]['serviceCount']);
            avgSales += parseFloat(temp[i][j]['averageSales']);
            } else {
              totalSalesVal += parseFloat(temp[i][j]['totalSales']);
              soldVal += parseFloat(temp[i][j]['serviceCount']);
              avgSales += parseFloat(temp[i][j]['averageSales']);
            }
            temp[i]['totalSales'] = totalSalesVal;
            temp[i]['soldVal'] = soldVal;
            temp[i]['avgSales'] = totalSalesVal / soldVal;
          }
          totalSalesVal = 0;
          soldVal = 0;
          avgSales = 0;
          this.serviceSalesTotal += temp[i]['totalSales'];

          this.serviceSalesTotalSold += temp[i]['soldVal'];
          this.serviceSalesTotalAvg = this.serviceSalesTotal / this.serviceSalesTotalSold;
        }
        this.servSalesArray = temp;
        if (this.serviceSalesRefundObj && this.serviceSalesRefundObj.length > 0) {
          for (let i = 0; i < this.serviceSalesRefundObj.length; i++) {
            this.lessRefundsTotal += parseFloat(this.serviceSalesRefundObj[i].totalSales);
            this.lessRefundsSold += parseFloat(this.serviceSalesRefundObj[i].serviceCount);
            this.lessRefundsAvg = this.lessRefundsTotal / this.lessRefundsSold;
          }
        }
        this.serviceNetSalesTotal = this.serviceSalesTotal + this.lessRefundsTotal;
        this.serviceNetSalesSold = this.serviceSalesTotalSold - this.lessRefundsSold;
        this.serviceNetSalesAvg = this.serviceNetSalesTotal / this.serviceNetSalesSold;
        for (let i = 0; i < this.servSalesArray.length; i++) {
          this.servSalesArray[i]['percntOfSales'] = this.servSalesArray[i]['totalSales'] / this.serviceSalesTotal * 100;
          for (let j = 0; j < this.servSalesArray[i].length; j++) {
            this.servSalesArray[i][j]['percntOfSales'] = this.servSalesArray[i][j]['totalSales'] / this.serviceSalesTotal * 100;
          }
        }
        // if (this.serviceSalesObj.length > 0 || this.serviceSalesRefundObj.length > 0) {
        this.itemsDisplay = true;
        // } else {
        //   this.itemsDisplay = false;
        // }
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
