import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { AdjustmentReportListService } from './adjustmentreportlist.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../../common/common.service';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-reports-app',
  templateUrl: './adjustmentreportlist.html',
  styleUrls: ['./adjustmentreportlist.css'],
  providers: [AdjustmentReportListService, CommonService],
})
export class AdjustmentReportListComponent implements OnInit {
  todayDate: Date;
  startDate = new Date();
  searchResult = [];
  showDiv: any = true;
  ShowResultDiv: any = false;
  showDeleteDiv: any = false;
  decodedToken: any;
  companyName: any;
  adjustDate: any;
  showDate: any;
  result: any = [];
  viewData = [];
  res2 = [];
  totalListQuantity = [];
  totalListAmount = [];
  costSum = 0;
  onDiffSum = 0;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private Commonservice: CommonService,
    private adjustmentReportListService: AdjustmentReportListService) {

  }
  ngOnInit() {
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('token'));
      this.companyName = this.decodedToken.data.cname;
    } catch (error) {
      this.decodedToken = {};
    }
    const sendDate = {
      'todayDate': this.Commonservice.getDBDatTmStr(this.todayDate),
    };
    this.searchData(sendDate);
  }
  searchData(sendDate) {
    this.adjustmentReportListService.searchForReports(sendDate)
      .subscribe(data => {
        const searchResult1 = data['result'];
        this.searchResult = [];
        this.result = searchResult1.filter((item, i) => {
          const isAlr = searchResult1.findIndex((item1) => item1.CreatedDate === item.CreatedDate) === i;
          if (isAlr) {
            this.searchResult[item.CreatedDate] = [];
          }
          this.searchResult[item.CreatedDate].push(item);

          return isAlr;
        });
      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (JSON.parse(error['_body']).status) {
            case '2033':
              window.scrollTo(0, 0);
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
  showData(date) {
    this.showDate = date;
    this.viewData = this.searchResult[date];
    // for (let i = 0; i < this.viewData.length; i++) {
    //   if (i !== (this.viewData.length - 1)) {
    //     if (this.viewData[i]['Inventory_Group__c'] === this.viewData[i + 1]['Inventory_Group__c']
    //       && this.viewData[i]['plName'] === this.viewData[i + 1]['plName']
    //       && this.viewData[i]['Product_Code__c'] === this.viewData[i + 1]['Product_Code__c']) {
    //       this.costSum += JSON.parse(this.viewData[i].JSON__c)['cost'];
    //       this.onDiffSum += JSON.parse(this.viewData[i].JSON__c)['onHandDiff'];
    //       // this.viewData[i].cost = JSON.parse(this.viewData[i].JSON__c)['cost']
    //     }
    //   }
    //   // console.log(i, i + 1, this.costSum, this.onDiffSum)
    // }
    const res = new Map();
    for (let i = 0; i < this.viewData.length; i++) {
      const l = this.viewData[i];
      l['p'] = JSON.parse(l.JSON__c);

      const name = l.Inventory_Group__c + '&' + l.plName;
      if (res.has(name)) {
        const res1: Array<any> = res.get(name);
        res1.push(l);
        res.set(l.Inventory_Group__c + '&' + l.plName, res1);
      } else {
        res.set(l.Inventory_Group__c + '&' + l.plName, [l]);
      }
    }
    res.forEach((element) => {
      const temp = [];
      let totalQuantity = 0;
      let totalAmount = 0;
      element.forEach((obj, i) => {
        totalQuantity += obj.p.onHandDiff;
        totalAmount += (obj.p.onHandDiff * obj.p.cost);
        const index = element.findIndex((obj1) => obj.Product_Code__c === obj1.Product_Code__c);
        if (index === i) {
          temp.push(obj);
        } else {
          temp[index].p.onHandDiff += obj.p.onHandDiff;
        }
      });

      this.res2.push(temp);
      this.totalListQuantity.push(totalQuantity);
      this.totalListAmount.push(totalAmount);
    });
    // console.log(this.res2[0])

    this.showDiv = false;
    this.ShowResultDiv = true;
    this.showDeleteDiv = false;
  }
  deleteData(deleteData) {
    this.showDeleteDiv = true;
    this.showDiv = false;
    this.ShowResultDiv = false;
    this.adjustDate = deleteData.CreatedDate;

  }
  deleteRecord() {
    const date1 = this.adjustDate.split('/')[2] + '-' + this.adjustDate.split('/')[0] + '-' + this.adjustDate.split('/')[1];
    this.adjustmentReportListService.deleteReports(date1)
      .subscribe(data => {
        const result = data['result'];
        this.ngOnInit();
        this.showDeleteDiv = false;
        this.showDiv = true;
      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          if (statuscode === '2085' || statuscode === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
  }
  cancel() {
    this.showDiv = true;
    this.showDeleteDiv = false;
    this.ShowResultDiv = false;
  }
}
