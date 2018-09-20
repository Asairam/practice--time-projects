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
  totalNetAmount = [];
  titalNetListAmount = [];
  costSum = 0;
  onDiffSum = 0;
  grandListTotal = 0;
  grandNetTotal = 0;
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
    this.showDate = date; /* this is used to dispaly at adjustment date at company info */
    this.viewData = this.searchResult[date];
    const res = new Map();
    for (let i = 0; i < this.viewData.length; i++) {
      const l = this.viewData[i];
      l['values'] = JSON.parse(l.JSON__c);

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
      let netTotal = 0;
      let netListTotal = 0;
      element.forEach((obj, i) => {
        totalQuantity += obj.values.onHandDiff;
        totalAmount += (obj.values.onHandDiff * obj.values.cost);
        netTotal += (obj.values.onHandDiff * obj.values.cost); /*used for total in loop */
        netListTotal += obj.values.onHandDiff; /*used for total in loop  */
        const index = element.findIndex((obj1) => obj.Product_Code__c === obj1.Product_Code__c);
        if (index === i) {
          temp.push(obj);
        } else {
          temp[index].values.onHandDiff += obj.values.onHandDiff;
        }
      });
      this.res2.push(temp);
      this.totalListQuantity.push(totalQuantity);
      this.totalListAmount.push(totalAmount);
      this.titalNetListAmount.push(netListTotal);
      this.totalNetAmount.push(netTotal);

    });
    const quantArray = this.titalNetListAmount;
    const amountArray = this.totalNetAmount;
    for (let i = 0; i < this.titalNetListAmount.length; i++) {
      this.grandListTotal += quantArray[i];
    }
    for (let i = 0; i < this.totalNetAmount.length; i++) {
      this.grandNetTotal += amountArray[i];
    }
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
        if (result) {
          this.ngOnInit();
          this.showDeleteDiv = false;
          this.ShowResultDiv = false;
          this.showDiv = true;
        }
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
    this.showDeleteDiv = false;
    this.ShowResultDiv = false;
    this.showDiv = true;
  }
  printDiv() {
    window.print();
    // const efgh = document.getElementById('inner_cont').innerHTML;
    // const printWindow = window.open('', '');
    // printWindow.document.write('<html><head><title>Inventory Adjustment Report</title>');
    // printWindow.document.write('</head><body style="color: black">');
    // printWindow.document.write(efgh);
    // printWindow.document.write('</body></html>');
    // printWindow.document.close();
    // printWindow.print();
  }
}
