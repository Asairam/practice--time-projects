import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientRetentionService } from './clientretention.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { DecimalPipe } from '@angular/common';
import { CommonService } from '../../../common/common.service';
@Component({
  selector: 'app-reports-app',
  templateUrl: './clientretention.html',
  styleUrls: ['./clientretention.css'],
  providers: [ClientRetentionService, CommonService],
})
export class ClientRetentionComponent implements OnInit {
  public reportAnalysis = {
    'retentionType': 'New',
    'startDate': undefined,
    'endDate': undefined,
    'noOfVisits': undefined,
    'worker': '',
    'type': 'Comapny Analysis',

  };
  itemsDisplay = false;
  workerTipsData: any;
  datePickerConfig: any;
  workerList: any = [];
  workerName: any;
  error: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private clientRetentionService: ClientRetentionService,
    private commonService: CommonService) {

    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  clientRetentionData = {};
  clientsList: any = [];
  ngOnInit() {
    this.getWorkerList();
  }

  clear() {
    this.error = '';
    // this.reportDetails = {};
    this.itemsDisplay = false;
  }
  selectReportsType(value) {
    if (value === 'Comapny Analysis') {
      this.reportAnalysis.worker = '';
      this.workerName = '';
    }
  }

  selectWorker() {
    const selectedWorker = this.workerList.filter((worker) => worker.Id === this.reportAnalysis.worker);
    if (selectedWorker.length > 0) {
      this.workerName = selectedWorker[0].FirstName + ' ' + selectedWorker[0].LastName;
    }
  }
  changeToDecimal() {
    const v = new DecimalPipe('en-US').transform(12, '1.2-2');
    alert(v);
    const v1 = new DecimalPipe('en-US').transform(13.1, '1.2-2');
    alert(v1);
    const v2 = new DecimalPipe('en-US').transform(14.125, '1.2-2');
    alert(v2);
  }
  getWorkerList() {
    this.clientRetentionService.getUserList().subscribe(data => {
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
  generateReport() {
    this.itemsDisplay = true;
    const reportObj = {
      startDate: this.commonService.getDBDatStr(this.reportAnalysis.startDate),
      endDate: this.commonService.getDBDatStr(this.reportAnalysis.endDate),
      worker: this.reportAnalysis.worker,
      retentionType: this.reportAnalysis.retentionType
    };
    this.clientRetentionService.getClientRetentionReport(reportObj).subscribe(data => {
      //  console.log(data);
      const result = data['result']['done'];
      const workerIdsSetPerClient = data['result']['clientWithWorkerId'];
      const clientVisit = new Map();
      const clientApptDates: any = new Map();
      const clients = new Map();
      result.forEach((clientInfo) => {
        const apptDate = this.commonService.getDateFrmDBDateStr(clientInfo.Appt_Date_Time__c);
        if (clientVisit.has(clientInfo.Id)) {
          const noOfVisits = clientVisit.get(clientInfo.Id);
          const appts: Array<any> = clientApptDates.get(clientInfo.Id);
          appts.push(apptDate);
          clientApptDates.set(clientInfo.Id, appts);
          clientVisit.set(clientInfo.Id, noOfVisits + 1);
        } else {
          clientVisit.set(clientInfo.Id, 1);
          clientApptDates.set(clientInfo.Id, [apptDate]);
          clients.set(clientInfo.Id, { id: clientInfo.Id, clientName: clientInfo.clientName });
        }
      });
      let retainedCount = 0;
      clients.forEach((value, key) => {
        const clientObj: any = value;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        clientObj['firstVisitDate'] = clientApptDates.get(key)[0];
        const noOfAppointments = clientApptDates.get(key).length;
        clientObj['lastVisitDate'] = clientApptDates.get(key)[noOfAppointments - 1];
        clientObj['numVisitsAfterStartDate'] = clientVisit.get(key);
        const days = this.daysBetweenDates(currentDate, clientObj['lastVisitDate']);
        clientObj['numDaysSinceLastVisit'] = days >= 0 ? days : -days;
        const numDaysFirstVisitToNow = this.daysBetweenDates(clientObj['firstVisitDate'], currentDate);
        clientObj['averageDaysBetweenVisits'] = this.calculateAverage(numDaysFirstVisitToNow, clientObj['numVisitsAfterStartDate']);
        if (clientObj['numVisitsAfterStartDate'] >= this.reportAnalysis.noOfVisits) {
          clientObj['isRetained'] = true;
          retainedCount++;
        } else {
          clientObj['isRetained'] = false;
        }
        const workers = workerIdsSetPerClient[key];
        clientObj['numWorkersSeen'] = workers.length;
        this.clientsList.push(clientObj);
      });

      this.clientRetentionData['Total_Recurring_Visits'] = this.clientsList.length;
      this.clientRetentionData['Total_Retained'] = retainedCount;
      this.clientRetentionData['Percent_Retained'] = this.calculatePercentage(retainedCount, this.clientsList.length);
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

  daysBetweenDates(startDate: Date, endDate: Date): number {
    const milliseconds = endDate.getTime() - startDate.getTime();
    const days = milliseconds / (24 * 60 * 60 * 1000);
    return days;
  }

  calculatePercentage(firstValue: number, secondValue: number): number {
    if (secondValue === 0) {
      return 0.00;
    } else {
      let percentage = (firstValue / secondValue) * 100;
      percentage = +percentage.toFixed(2);
      return percentage;
    }
  }
  calculateAverage(firstValue: number, secondValue: number): number {
    if (secondValue === 0) {
      return 0.00;
    } else {
      let percentage = (firstValue / secondValue);
      percentage = +percentage.toFixed(2);
      return percentage;
    }
  }
}
