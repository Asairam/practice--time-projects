import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeClockService } from './timeclock.service';
import { CheckOutEditTicketService } from '../checkout/editticket/checkouteditticket.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { DatePipe } from '@angular/common';
import { CommonService } from '../common/common.service';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './timeclock.html',
  styleUrls: ['./timeclock.component.css'],
  providers: [TimeClockService, CheckOutEditTicketService, CommonService],
})
export class TimeClockComponent implements OnInit {
  activeTab2 = [false, false];
  activeTabClass = ['active', ''];
  datePickerConfig: any;
  currentDate = new Date();
  rows = [];
  rowLength: any;
  rowLengthInc: any;
  workerPin: any;
  workerData: any;
  showButton = false;
  buttonVale = '';
  inTime: any;
  outTime: any;
  clockIn: any;
  clockOut: any;
  hours: any;
  showSave = false;
  schedule: any;
  timeClockData: any;
  timeData = [];
  errorMessage = '';
  adjustmentErrorMessage: any = '';
  workersList = [];
  workerId: any;
  activeRowsLength: any = 0;
  selectedDate = new Date();
  companyHours = [];
  workerHours: any = {};
  isScheduleApplied = false;
  hideField = 'inline';
  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private timeClockService: TimeClockService,
    private checkOutEditTicketService: CheckOutEditTicketService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
    this.updateTabs(0);
    // this.addRows();
    this.getWorkerTimeClock(this.selectedDate);
    this.method();
    this.getAllActiveWorkers();

  }
  getWorkerByPin() {
    this.timeClockService.getWorkerByPin(this.workerPin, this.commonService.getDBDatTmStr(this.currentDate)).subscribe(data => {
      if (data['result']['workerresult'].length > 0) {
        this.errorMessage = '';
        this.workerData = data['result']['workerresult'][0];
        if ( this.workerData.workerId !== '') {
          this.hideField = 'none';
        }
        this.companyHours = data['result']['companyhours'];
        if (data['result']['timeClockresult'].length > 0) {
          this.workerData['Time_In__c'] = data['result']['timeClockresult'][0]['Time_In__c'];
          this.workerData['tcId'] = data['result']['timeClockresult'][0]['tcId'];
          this.clockIn = this.commonService.getDateTmFrmDBDateStr(data['result']['timeClockresult'][0]['Time_In__c']);
          this.inTime = this.clockIn.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
          this.buttonVale = 'Clock Out';
        } else {
          this.buttonVale = 'Clock In';
        }
        this.showButton = true;
        this.showSave = true;
        this.workerHours = !isNullOrUndefined(this.companyHours) ? this.getWorkerHours(this.currentDate, this.companyHours[0]) : {};
        if (this.workerData.Uses_Time_Clock__c === 1 && !isNullOrUndefined(this.companyHours) && this.workerHours.timeIn !== '') {
          this.schedule = this.workerHours.timeIn + ' to ' + this.workerHours.timeOut;
        } else {
          this.schedule = 'Closed';
        }
      } else {
        this.errorMessage = 'Invalid Pin';
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

  applySchedule() {
    if (this.schedule !== 'Closed' && this.isScheduleApplied) {
      this.inTime = this.workerHours.timeIn;
      this.outTime = this.workerHours.timeOut;
      this.clockIn = this.timeConversionToDate(this.inTime);
      this.clockOut = this.timeConversionToDate(this.outTime);
      this.hours = this.calculateDurations(this.clockIn, this.clockOut);
      this.showButton = false;
    } else {
      this.inTime = undefined;
      this.outTime = undefined;
      this.hours = undefined;
      this.buttonVale = 'Clock In';
      this.showButton = this.schedule === 'Closed' && this.isScheduleApplied ? false : true;
    }
  }
  checkAction(value) {
    if (value === 'Clock In') {
      this.buttonVale = 'Clock Out';
      this.clockIn = new Date();
      this.inTime = this.clockIn.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (this.buttonVale === 'Clock Out') {
      this.clockOut = new Date();
      this.outTime = this.clockOut.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      this.showButton = false;
      this.hours = this.calculateDurations(this.clockIn, this.clockOut);
    }
  }

  getWorkerHours(timeInDate: Date, workerHours): { 'timeIn': string, 'timeOut': string } {
    const day = this.weekDays[timeInDate.getDay()];
    const workerTimings: any = {};
    for (const key in workerHours) {
      if (key === day + 'StartTime__c') {
        workerTimings.timeIn = workerHours[key];
      } else if (key === day + 'EndTime__c') {
        workerTimings.timeOut = workerHours[key];
      }
    }
    return workerTimings;
  }


  calculateDurations(inTime: Date, outTime: Date): string {
    const hours: number = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60);
    return hours.toFixed(2);
  }
  saveWorkerTimeClock() {

    if (isNullOrUndefined(this.inTime) && isNullOrUndefined(this.outTime)) {
      this.router.navigate(['/home']);
    } else {
      const dataObj = {
        'Apply_Schedule__c': '',
        'Hours__c': this.hours,
        'Schedule__c': this.schedule,
        'Time_In__c': this.clockIn ? this.commonService.getDBDatTmStr(this.clockIn) : null,
        'Time_Out__c': this.clockOut ? this.commonService.getDBDatTmStr(this.clockOut) : null,
        'Worker__c': this.workerData.workerId,
        'isNew': this.workerData['Time_In__c'] ? false : true,
        'Id': this.workerData['Time_In__c'] ? this.workerData['tcId'] : true
      };
      this.timeClockService.saveMultiple([dataObj]).subscribe(data => {
        const dataResult = data['result'];
        this.router.navigate(['/home']).then(() => {
          const toastermessage: any = this.translateService.get('Record Created Succesfully');
          this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
        });
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
  getWorkerTimeClock(date: Date) {
    this.adjustmentErrorMessage = '';
    this.rows = [];
    if (!isNullOrUndefined(date) && !isNaN(date.getTime())) {
      this.timeClockService.getWorkerTimeClock(this.commonService.getDBDatStr(date)).subscribe(data => {
        this.rows = data['result'];
        if (data['result'] && data['result'].length > 0) {
          for (let i = 0; i < data['result'].length; i++) {
            this.rows[i]['timeIn'] = new DatePipe('en-Us').transform(data['result'][i]['Time_In__c'], 'hh:mm a');
            this.rows[i]['timeOut'] = new DatePipe('en-Us').transform(data['result'][i]['Time_Out__c'], 'hh:mm a');
            this.rows[i]['default1'] = true;
            this.rows[i]['default2'] = true;
            this.rows[i]['isNew'] = false;
            this.rows[i]['isTouched'] = true;
            this.rows[i]['Removed'] = false;
            for (let j = 0; j < this.timeData.length; j++) {
              if (this.rows[i]['timeIn'] === this.timeData[j]) {
                this.rows[i]['default1'] = false;
              }
              if (this.rows[i]['timeOut'] === this.timeData[j]) {
                this.rows[i]['default2'] = false;
              }
            }
          }
          this.calculateActiveRows();
        } else {
          this.addRows();
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
    } else {
      this.adjustmentErrorMessage = 'Enter a valid Search Date';
    }

  }


  timeConversionToDate(time: string): Date {
    let date;
    let hours: any;
    const timeInDate = this.selectedDate;
    let minutes: any = time.split(' ')[0].split(':')[1];
    if (time.split(' ')[1] === 'AM') {
      hours = time.split(' ')[0].split(':')[0];
      if (+hours === 12) {
        hours = 0;
      }
    } else if (time.split(' ')[1] === 'PM') {
      hours = time.split(' ')[0].split(':')[0];
      if (parseInt(hours, 10) !== 12) {
        hours = parseInt(hours, 10) + 12;
      }
    }
    minutes = parseInt(minutes, 10);
    date = new Date(timeInDate.getFullYear(), timeInDate.getMonth(), timeInDate.getDate(), hours, minutes);
    return date;
  }
  method() {
    let datIndex = 0;
    const crDate = new Date();
    const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
    const endDate = new Date(0, 0, 1, 0, 0, 0, 0);
    this.timeData = [];
    do {
      let elem = '';
      if (startDate.getHours() < 12) {
        if (startDate.getHours() === 0) {
          elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
        } else {
          elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
        }
      } else {
        if ((startDate.getHours() - 12) === 0) {
          elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
        } else {
          elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
        }
      }
      this.timeData.push(elem);
      if (crDate.getHours() < startDate.getHours()) {
        datIndex++;
      }
      startDate.setMinutes(startDate.getMinutes() + 15);
    }
    while (startDate < endDate);
  }
  getAllActiveWorkers() {
    this.checkOutEditTicketService.getAllWorkers().subscribe(data => {
      this.workersList = [];
      this.workersList = data['result']
        .filter(filterList => filterList.IsActive);
      if (this.workersList.length > 0) {
        this.workerId = this.workersList[0]['Id'];
      }
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
  // }
  // }
  calculateHours(isSave?: string): Array<any> {
    this.rows = this.rows.map((data) => {
      if (!isNullOrUndefined(data['timeIn']) && !isNullOrUndefined(data['timeOut'])) {
        const timeIn = this.timeConversionToDate(data['timeIn']);
        const timeOut = this.timeConversionToDate(data['timeOut']);
        data['Hours__c'] = this.calculateDurations(timeIn, timeOut);
        if (+data['Hours__c'] < 0) {
          this.adjustmentErrorMessage = 'Time In must be less than Time Out';
        }
      }
      if (!isNullOrUndefined(isSave)) {
        if (!isNullOrUndefined(data['timeIn'])) {
          data['Time_In__c'] = this.commonService.getDBDatTmStr(this.timeConversionToDate(data['timeIn']));
        }
        if (!isNullOrUndefined(data['timeOut'])) {
          data['Time_Out__c'] = this.commonService.getDBDatTmStr(this.timeConversionToDate(data['timeOut']));
        }
      }

      return data;
    });
    return this.rows;
  }
  addRows() {
    this.rows.push({ 'Worker__c': '', 'isNew': true, 'isTouched': true, 'Removed': false, 'timeIn': null, 'timeOut': null });
    this.calculateActiveRows();
  }
  saveMultipleWorkerTimeClock() {
    if (this.rows.length > 0) {
      this.adjustmentErrorMessage = '';
      this.checkForTimings();
      let dataObj = this.calculateHours('save');
      if (this.adjustmentErrorMessage === '') {
        dataObj = dataObj.filter((data) => (data['isNew'] && !data['isRemoved']) || (!data['isNew'] && (data['isRemoved'] || data['isTouched'])));
        this.timeClockService.saveMultiple(dataObj).subscribe(data => {
          const dataStatus = data['result'];
          this.router.navigate(['/home']).then(() => {
            const toastermessage: any = this.translateService.get('Record Edited Succesfully');
            this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
          });
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
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }
  deleteRow(index) {
    this.rows[index]['Removed'] = true;
    if (this.rows[index]['isNew']) {
      this.rows.splice(index, 1);
    }
    this.calculateActiveRows();
    if (this.activeRowsLength === 0) {
      this.addRows();
    }
  }

  calculateActiveRows() {
    const activeRows = this.rows.filter((obj) => !obj['Removed']);
    this.activeRowsLength = activeRows.length;
  }
  cancel() {
    this.router.navigate(['/home']);
  }
  updateTabs(order: number) {
    for (let i = 0; i < this.activeTab2.length; i++) {
      if (i === order) {
        this.activeTab2[i] = true;
        this.activeTabClass[i] = 'active';
      } else {
        this.activeTab2[i] = false;
        this.activeTabClass[i] = '';
      }
    }
  }

  clearErrorMsg() {
    this.adjustmentErrorMessage = '';
  }
  checkForTimings() {
    if (this.rows.findIndex((data) => data['Worker__c'] === '') !== -1) {
      this.adjustmentErrorMessage = 'Worker is Required';
    } else if (this.rows.findIndex((data) => data['timeIn'] === null) !== -1) {
      this.adjustmentErrorMessage = 'Timein is required';
    } else {
      if (this.commonService.getDBDatStr(new Date()) !== this.commonService.getDBDatStr(this.selectedDate)) {
        if (this.rows.findIndex((data) => data['timeOut'] === null) !== -1) {
          this.adjustmentErrorMessage = 'Timeout is Required';
        }
      }
    }
  }
}
