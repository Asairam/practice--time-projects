import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { WorkerTipsService } from './workertips.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
// import {Component} from "@angular/core";
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-reports-app',
  templateUrl: './workertips.html',
  styleUrls: ['./workertips.css'],
  providers: [WorkerTipsService],
})
export class WorkerTipsComponent implements OnInit {
  startDate = new Date();
  endDate = new Date();
  minDate = new Date();
  bsValue = new Date();
  bsValue1 = new Date();
  worker = 'company';
  workerId: any;
  itemsDisplay = false;
  userListData: any;
  userList: any;
  datePickerConfig: any;
  error: any;
  decodedToken: any;
  companyName: any;
  workerTipsList: any;
  reportTypes = ['Company Tips', 'Worker Tips'];
  totalTipsAmount = 0;
  tipsWithDates = [];
  tipsAmount = [];
  tipsAmountWithDate = [];
  type: any;
  constructor(
    private workerTipsService: WorkerTipsService,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
    this.getUserList();
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('token'));
      this.companyName = this.decodedToken.data.cname;
    } catch (error) {
      this.decodedToken = {};
    }
    this.type = this.reportTypes[0];
  }

  generateReport() {
    const startTime = ('00' + (this.startDate.getMonth() + 1)).slice(-2) + '-' + ('00' + this.startDate.getDate()).slice(-2) + '-' +
      (this.startDate.getFullYear() + '');
    const endTime = ('00' + (this.endDate.getMonth() + 1)).slice(-2) + '-' + ('00' + this.endDate.getDate()).slice(-2) + '-' +
      (this.endDate.getFullYear() + '');
    if (startTime > endTime) {
      this.error = 'TOTAL_SHEETS.BEGIN_DATE_SHOULD_BE_AFTER_END_DATE';
    } else {
      const startDate = this.startDate.getFullYear() + '-' + (this.startDate.getMonth() + 1) + '-' + this.startDate.getDate();
      const endDate = this.endDate.getFullYear() + '-' + (this.endDate.getMonth() + 1) + '-' + this.endDate.getDate();
      const obj = {
        'begindate': startDate,
        'enddate': endDate,
        'used': this.worker,
        'workerId': this.workerId
      };
      this.itemsDisplay = true;
      this.workerTipsService.getWorkerTipsRecords(obj).subscribe(data => {
        this.workerTipsList = [];
        let tipsData: Array<any> = data['result']['data'][0];
        tipsData = tipsData.concat(data['result']['data'][1]);
        //   console.log(tipsData);
        const dates = data['result']['dates'];
        // const dataList = [];
        // for (let i = 0; i < dates.length; i++) {
        //   let price = 0;
        //   dataList.push(this.workerTipsList.filter((obj1) => obj1.aptDt === dates[i]));
        //   const tempArr = this.workerTipsList.filter((obj1) => obj1.aptDt === dates[i]);
        //   if (tempArr && tempArr.length > 0) {
        //     for (let j = 0; j < tempArr.length; j++) {
        //       price += parseFloat(tempArr[j]['Tip_Amount__c']);
        //     }
        //   }
        //   dataList[i]['date'] = dates[i];
        //   dataList[i]['total'] = price;
        // }
        // this.workerTipsList = dataList.filter((obj1) => obj1.length);

        this.tipsWithDates = [];
        this.tipsAmount = [];
        this.totalTipsAmount = 0;
        this.tipsAmountWithDate = [];
        dates.forEach((gDate) => {
          // const tipsWithSameDate = [];
          let tipsDateAmount = 0;
          const tipsWithSameDate = tipsData.filter((obj2) => gDate === obj2.aptDt);

          if (tipsWithSameDate.length > 0) {
            // console.log('jddvkjxvn');
            const tipsWithSameId = [];
            const tipsWithDate = [];
            const dupData = [];
            dupData.push(tipsWithSameDate);
            tipsWithSameDate.forEach((obj1) => {
              if (dupData.indexOf(obj1.Name) === -1) {
                const tmpAry = tipsWithSameDate.filter((obj3) => obj3.Name === obj1.Name);
                const tmpAry1 = [];
                const uniqueObj = tmpAry.filter((data1, i) => tmpAry.findIndex((data2) => data1.Worker__c === data2.Worker__c) === i);
                let tipsPerAppt = 0;
                uniqueObj.forEach((data4) => {

                  const obj3: any = {
                    Service_Sales__c: 0,
                    Tip_Amount__c: 0,
                    Tip_Left_in_Drawer__c: 0,
                    Tip_Paid_Out__c: 0
                  };
                  tmpAry.forEach((data5, i) => {
                    if (data4.Worker__c === data5.Worker__c) {
                      obj3.Name = data5.Name;
                      obj3.clientName = data5.clientName;
                      obj3.userName = data5.userName;
                      obj3.aptDt = data5.aptDt;
                      if (Object.keys(data5).filter((key) => key === 'Service_Sales__c').length > 0) {
                        obj3.Service_Sales__c += data5.Service_Sales__c;
                      } else {
                        obj3.Tip_Amount__c += data5.Tip_Amount__c;
                        obj3.Tip_Left_in_Drawer__c += +data5.Tip_Left_in_Drawer__c;
                        obj3.Tip_Paid_Out__c += + data5.Tip_Paid_Out__c;
                        tipsPerAppt += data5.Tip_Amount__c;
                        this.totalTipsAmount += data5.Tip_Amount__c;
                        tipsDateAmount += data5.Tip_Amount__c;
                      }
                    }
                  });
                  tmpAry1.push(obj3);

                });
                tipsWithDate.push(tipsPerAppt);
                tipsWithSameId.push(tmpAry1);
                dupData.push(obj1.Name);
              }
            });
            if (tipsWithSameId.length > 0) {
              this.tipsWithDates.push(tipsWithSameId);
              this.tipsAmount.push(tipsWithDate);
              this.tipsAmountWithDate.push(tipsDateAmount);
            }
          }
        });
        // console.log(this.tipsWithDates);
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
  getUserList() {
    this.workerTipsService.getUserList()
      .subscribe(data => {
        this.userListData = data['result'];
        this.userList = this.userListData.filter(
          filterList => filterList.IsActive === 1);
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
  clearErr() {
    this.error = '';
  }
  onChangeUser(id) {
    this.itemsDisplay = false;
    if (!id || id === '--Company--') {
      this.worker = 'company';
      this.workerId = undefined;
      this.type = this.reportTypes[0];
    } else {
      this.workerId = id;
      this.worker = undefined;
      this.type = this.reportTypes[1];
    }
  }
}
