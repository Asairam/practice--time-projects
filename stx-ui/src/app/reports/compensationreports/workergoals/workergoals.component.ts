import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { WorkerGoalService } from './workergoals.service';
import { SetupWorkersDetailsService } from '../../../setup/setupworkers/setupworkersdetails/setupworkersdetails.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../../common/common.service';
// import {Component} from "@angular/core";
@Component({
  selector: 'app-reports-app',
  templateUrl: './workergoals.html',
  styleUrls: ['./workergoals.css'],
  providers: [WorkerGoalService, SetupWorkersDetailsService, CommonService],
})
export class WorkerGoalComponent implements OnInit {
  itemsDisplay = false;
  workerid = '';
  dataList: any;
  goalsDataList: any;
  yearsDataList: any;
  monthsData: any;
  startmonth: any;
  endmonth: any;
  startyears: any;
  endyears: any;
  workerGoal = '';
  workerGoalsData: any;
  workerGoalData = [];
  calculationList: any;
  calculatedGoal = [];
  percentOfGoal = [];
  constructor(
    private workerGoalService: WorkerGoalService, private setupWorkersdetailsservice: SetupWorkersDetailsService,
    // private route: ActivatedRoute,
    private router: Router, private commonService: CommonService,
    private toastr: ToastrService,
    private translateService: TranslateService,
  ) {

  }
  ngOnInit() {
    this.getEvery();
    this.getyears();
    this.getMonths();
    this.getGoals(); // Goals to calculate list
  }

  generateReport() {
    const ValiSDate = this.startmonth + '-' + '01' + '-' + this.startyears;
    const ValiEDate = this.endmonth + '-' + '01' + '-' + this.endyears;
    if (new Date(ValiSDate) > new Date(ValiEDate)) {
      this.toastr.warning('Begin Date must be before the End Date', null, { timeOut: 3000 });
    } else if (!this.workerid) {
      const toastermessage: any = this.translateService.get('Worker is required');
      this.toastr.warning(toastermessage.value, null, { timeOut: 1500 });
    } else {
      const sendRecored = {
        'workerId': this.workerid,
        'startDate': this.startyears + this.startmonth,
        'endDate': this.endyears + this.endmonth,
        'Goal__c': this.workerGoal
      };
      this.workerGoalService.generateReportSer(sendRecored).subscribe(data => {
        this.workerGoalData = data['result'];
      }, error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
    }
    this.itemsDisplay = true;
  }
  getEvery() {
    this.setupWorkersdetailsservice.getUserList().subscribe(
      data => {
        this.dataList = data['result'];
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
  getyears() {
    this.workerGoalService.getYearsType().subscribe(
      data => {
        this.yearsDataList = data['CalenderYears'];
        this.startyears = this.yearsDataList[0].option;
        this.endyears = this.yearsDataList[0].option;
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
  getMonths() {
    this.workerGoalService.getMonthsTypes().subscribe(
      data => {
        this.monthsData = data['workerGoalMonths'];
        this.startmonth = this.monthsData[0].value;
        this.endmonth = this.monthsData[0].value;
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
  getGoals() {
    this.workerGoalService.getGoalsTypes().subscribe(
      data => {
        this.workerGoalsData = data['result'].filter((obj) => obj.Active__c === 1);
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
  showPercentage(goallist, index) {
    goallist.startDate2 = this.commonService.getDBDatStr(new Date(goallist.startDate));
    goallist.endDate2 = this.commonService.getDBDatStr(new Date(goallist.endDate));
    this.setupWorkersdetailsservice.updateGoal(goallist, this.workerid).subscribe(data => {
      this.calculationList = data['result'];
      if (this.calculationList) {
        this.calculatedGoal[index] = this.calculationList.calculatedGoal;
        this.percentOfGoal[index] = this.calculationList.percentOfGoal;
        this.percentOfGoal[index] = Math.round(this.percentOfGoal[index] * 100) / 100 + '%';
      }
    }, error => {
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
