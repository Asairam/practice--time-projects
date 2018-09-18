import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MonthlyBussinessAnalysisService } from './monthlybussinessanalysis.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './monthlybussinessanalysis.html',
  styleUrls: ['./monthlybussinessanalysis.css'],
  providers: [MonthlyBussinessAnalysisService],
})
export class MonthlyBussinessAnalysisComponent implements OnInit {
  itemsDisplay: any = false;
  public serviceGroupList = [];
  public productLinesList = [];
  public reportAnalysis: any = {
    'year': undefined,
    'month': undefined,
    'type': 'Comapny Analysis',
    'worker': '',
    'serviceGroup': '',
    'pdLine': ''
  };
  public workerList = [];
  public years = [];
  public months = [
    { Id: '01', name: 'January' },
    { Id: '02', name: 'February' },
    { Id: '03', name: 'March' },
    { Id: '04', name: 'April' },
    { Id: '05', name: 'May' },
    { Id: '06', name: 'June' },
    { Id: '07', name: 'July' },
    { Id: '08', name: 'August' },
    { Id: '09', name: 'September' },
    { Id: '10', name: 'October' },
    { Id: '11', name: 'November' },
    { Id: '12', name: 'December' },
  ];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private monthlyBussinessAnalysisService: MonthlyBussinessAnalysisService) {

  }
  ngOnInit() {
    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      this.years.push(currentDate.getFullYear() - i);
    }
    this.reportAnalysis.year = this.years[0];
    this.reportAnalysis.month = ('00' + (currentDate.getMonth() + 1)).slice(-2);

    this.getServiceGroupList();
    this.getProductLines();
    this.getWorkerList();
  }

  getWorkerList() {
    this.monthlyBussinessAnalysisService.getUserList().subscribe(data => {
      this.workerList = data['result'];
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

  getServiceGroupList() {
    this.monthlyBussinessAnalysisService.getSetupServiceGroupsList().subscribe(data => {
      this.serviceGroupList = data['result'].filter((servcieGroup) => !servcieGroup.isSystem);
      if (this.serviceGroupList.length > 0) {
        this.reportAnalysis.serviceGroup = this.serviceGroupList[0].serviceGroupName;
      }

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

  selectReportsType(value) {
    if (value === 'Comapny Analysis') {
      this.reportAnalysis.worker = '';
      // this.workerName = '';
    }
  }

  clear() {

  }
  getProductLines() {
    this.monthlyBussinessAnalysisService.getProductLines().subscribe(
      data => {
        // this.inventoryGroupsData = data['result'];
        this.productLinesList = data['result'];
        if (this.productLinesList.length > 0) {
          this.reportAnalysis.pdLine = this.productLinesList[0].Id;
        }
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
  generateReport() {
    this.itemsDisplay = true;
    const reportData = {
      startDate: this.reportAnalysis.year + this.reportAnalysis.month,
      worker: this.reportAnalysis.worker,
      serviceGroup: this.reportAnalysis.serviceGroup,
      pdLine: this.reportAnalysis.pdLine
    };
    this.monthlyBussinessAnalysisService.getBussinessAnalysisReport(reportData).subscribe(
      data => {
       // console.log(data['result']);
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
}
