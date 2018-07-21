import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { WorkerGoalService } from './workergoals.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
// import {Component} from "@angular/core";
@Component({
  selector: 'app-reports-app',
  templateUrl: './workergoals.html',
  styleUrls: ['./workergoals.css'],
  providers: [WorkerGoalService],
})
export class WorkerGoalComponent implements OnInit {
  itemsDisplay = false;
  workerTipsData: any;
  dataList: any;
  goalsDataList: any;
  yearsDataList: any;
  monthsData: any;
  month: any;
  years: any;
  workerGoal: any;
  workerGoalsData: any;
  constructor(
    private workerGoalService: WorkerGoalService,
    // private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
  ) {

  }
  ngOnInit() {
    this.getEvery();
    this.getyears();
    this.getMonths();
    this.getGoals();
  }

  generateReport() {
    this.itemsDisplay = true;
  }
  getEvery() {
    this.workerGoalService.getEveryTypes().subscribe(
      data => {
        this.dataList = data['workerTips'];
        this.workerTipsData = this.dataList[0].option;
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
        this.years = this.yearsDataList[0].option;
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
        this.monthsData = data['calenderMonths'];
        this.month = this.monthsData[0].option;
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
        this.workerGoalsData = data['CalculateGoals'];
        this.workerGoal = this.workerGoalsData[0].option;
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
  showPercentage() {

  }
}
