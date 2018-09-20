import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { AbcReportService } from './abcreport.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { TotalSheetsService } from '../../../reports/transactionreports/totalsheets/totalsheets.service';
import { ReportVisitTypeOverviewService } from '../../../reports/businessanalysisreports/reportvisittypeoverview/reportvisittypeoverview.service';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-reports-app',
  templateUrl: './abcreport.html',
  styleUrls: ['./abcreport.css'],
  providers: [AbcReportService, TotalSheetsService, ReportVisitTypeOverviewService],
})
export class AbcReportComponent implements OnInit {
  startDate = new Date();
  endDate = new Date();
  minDate = new Date();
  isGenerate = false;
  workerTipsData: any;
  datePickerConfig: any;
  companySalesObj = [];
  accountBalanceObj = {
    'deposit': 0,
    'depositOnline': 0,
    'prepayment': 0,
    'receivedOnAccount': 0,
    'totals': 0
  };
  error: any;
  decodedToken: any;
  companyName: any;
  newClients = [];
  nonserviceClients = [];
  allrecord: any;
  visittypeRecord = [];
  totalNewClients = 0;
  totalRebooked = 0;
  totalBookedOnline = 0;
  totalServiceSales = 0;
  totalNonService = 0;
  totalRecurringClients = 0;
  totalProductSales = 0;
  NumberTickets = 0;
  ProductperTicket = 0;
  newVisitTotal = 0;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private totalSheetsService: TotalSheetsService,
    private reportVisitTypeOverviewService: ReportVisitTypeOverviewService,
    private abcReportService: AbcReportService) {
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
  }
  generateReport() {
    if (this.startDate === null) {
      this.toastr.warning('Please select Begin Date', null, { timeOut: 3000 });
    } else if (this.endDate === null) {
      this.toastr.warning('Please select End Date', null, { timeOut: 3000 });
    } else if (this.startDate > this.endDate) {
      this.toastr.warning('Begin Date must be before the End Date', null, { timeOut: 3000 });
    } else {
      /* reqData is used to send dates for visitypes data  */
      const startTime = ('00' + (this.startDate.getMonth() + 1)).slice(-2) + '-' + ('00' + this.startDate.getDate()).slice(-2) + '-' +
        (this.startDate.getFullYear() + '');
      const endTime = ('00' + (this.endDate.getMonth() + 1)).slice(-2) + '-' + ('00' + this.endDate.getDate()).slice(-2) + '-' +
        (this.endDate.getFullYear() + '');
        const reqData = {
          startDate: this.startDate.getFullYear() + '-' + (this.startDate.getMonth() + 1) + '-' + this.startDate.getDate(),
          endDate: this.endDate.getFullYear() + '-' + (this.endDate.getMonth() + 1) + '-' + this.endDate.getDate()
        };
      if (startTime > endTime) {
        this.toastr.warning('Begin Date must be before the End Date', null, { timeOut: 3000 });
      } else {
        this.totalSheetsService.getDailyTotalSheetRecords(this.startDate, this.endDate).subscribe(
          data => {
            this.companySalesObj = data['result']['companySalesObj'];
            this.accountBalanceObj = data['result']['accountBalanceObj'];
            this.isGenerate = true;
            this.callingClientsData(reqData);
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (status) {
              case 500:
                break;
              case 400:
                break;
            }
            if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          }
        );
      } /* 2nd else End */
    } /* 1st else End */
  }
  callingClientsData(data) {
    this.clear(); /* clear method is used to clear all totals every time when generete a report */
    this.reportVisitTypeOverviewService.getClientInfo(data).subscribe(res => {
      let records = [];
      // this.itemsDisplay = true;
      this.newClients = res['result']['newClients'];
      this.nonserviceClients = res['result']['nonserviceClients'];
      const onlineClients = res['result']['onlineClients'];
      const productSales = res['result']['productSales'];
      const rebookedClients = res['result']['rebookedClients'];
      const recurringClients = res['result']['recurringClients'];
      const serviceSales = res['result']['serviceSales'];
      const visitTypeData = res['result']['visitTypeData'];
      // this is for get nonserviceClients data
      records = this.newClients.concat(this.nonserviceClients);
      for (let i = 0; i < records.length; i++) {
        if (!records[i]['dupl']) {
          for (let j = i + 1; j < records.length; j++) {
            if (records[i]['workerId'] === records[j]['workerId']) {
              records[j]['dupl'] = true;
              records[i]['nonServiceClients'] = records[j]['nonServiceClients'] ? records[j]['nonServiceClients'] : '';
            }
          }
        }
      }

      // this is for get onlineClients data
      let onlinerecord = [];
      onlinerecord = records.concat(onlineClients);
      for (let i = 0; i < onlinerecord.length; i++) {
        if (!onlinerecord[i]['dupl']) {
          for (let j = i + 1; j < onlinerecord.length; j++) {
            if (onlinerecord[i]['workerId'] === onlinerecord[j]['workerId']) {
              onlinerecord[j]['dupl'] = true;
              onlinerecord[i]['onlineClients'] = onlinerecord[j]['onlineClients'] ? onlinerecord[j]['onlineClients'] : '';
            }
          }
        }
      }

      // this is for get productSales data
      let productSalesrecord = [];
      productSalesrecord = onlinerecord.concat(productSales);
      for (let i = 0; i < productSalesrecord.length; i++) {
        if (!productSalesrecord[i]['dupl']) {
          for (let j = i + 1; j < productSalesrecord.length; j++) {
            if (productSalesrecord[i]['workerId'] === productSalesrecord[j]['workerId']) {
              productSalesrecord[j]['dupl'] = true;
              productSalesrecord[i]['productSales'] = productSalesrecord[j]['productSales'] ? productSalesrecord[j]['productSales'] : '';
            }
          }
        }
      }

      // this is for get rebookedClients data
      let rebookedrecord = [];
      rebookedrecord = productSalesrecord.concat(rebookedClients);
      for (let i = 0; i < rebookedrecord.length; i++) {
        if (!rebookedrecord[i]['dupl']) {
          for (let j = i + 1; j < rebookedrecord.length; j++) {
            if (rebookedrecord[i]['workerId'] === rebookedrecord[j]['workerId']) {
              rebookedrecord[j]['dupl'] = true;
              rebookedrecord[i]['rebookedClients'] = rebookedrecord[j]['rebookedClients'] ? rebookedrecord[j]['rebookedClients'] : '';
            }
          }
        }
      }

      // this is for get recurringClients data
      let recurringrecord = [];
      recurringrecord = rebookedrecord.concat(recurringClients);
      for (let i = 0; i < recurringrecord.length; i++) {
        if (!recurringrecord[i]['dupl']) {
          for (let j = i + 1; j < recurringrecord.length; j++) {
            if (recurringrecord[i]['workerId'] === recurringrecord[j]['workerId']) {
              recurringrecord[j]['dupl'] = true;
              recurringrecord[i]['recurringClients'] = recurringrecord[j]['recurringClients'] ? recurringrecord[j]['recurringClients'] : '';
            }
          }
        }
      }

      // this is for get serviceSales data
      let serviceSalesrecord = [];
      serviceSalesrecord = recurringrecord.concat(serviceSales);
      for (let i = 0; i < serviceSalesrecord.length; i++) {
        if (!serviceSalesrecord[i]['dupl']) {
          for (let j = i + 1; j < serviceSalesrecord.length; j++) {
            if (serviceSalesrecord[i]['workerId'] === serviceSalesrecord[j]['workerId']) {
              serviceSalesrecord[j]['dupl'] = true;
              serviceSalesrecord[i]['serviceSales'] = serviceSalesrecord[j]['serviceSales'] ? serviceSalesrecord[j]['serviceSales'] : '';
            }
          }
        }
      }
      const calrecord = serviceSalesrecord.filter(function (obj) { return !obj['dupl']; });

      // calculation - Number Of Tickets
      calrecord.forEach(element => {
        element.totalNumberOfTickets = (element.recurringClients ? Number(element.recurringClients) : 0) +
          (element.newClients ? Number(element.newClients) : 0) + (element.nonServiceClients ? Number(element.nonServiceClients) : 0);
        if (element.productSales !== 0 && element.totalNumberOfTickets !== 0) {
          element.totalProductperTicket = ((element.productSales ? Number(element.productSales) : 0) / (element.totalNumberOfTickets ? Number(element.totalNumberOfTickets) : 0)).toFixed(2);
        }
        this.totalRecurringClients += element.recurringClients ? Number(element.recurringClients) : 0;
        this.totalNewClients += element.newClients ? Number(element.newClients) : 0;
        this.totalRebooked += element.rebookedClients ? Number(element.rebookedClients) : 0;
        this.totalBookedOnline += element.onlineClients ? Number(element.onlineClients) : 0;
        this.totalNonService += element.nonServiceClients ? Number(element.nonServiceClients) : 0;
        this.totalServiceSales += element.serviceSales ? Number(element.serviceSales) : 0;
        this.totalProductSales += element.productSales ? Number(element.productSales) : 0;
        this.NumberTickets += element.totalNumberOfTickets ? Number(element.totalNumberOfTickets) : 0;
        this.ProductperTicket += element.totalProductperTicket ? Number(element.totalProductperTicket) : 0;
      });
      this.allrecord = calrecord.filter(function (obj) { return !obj['dupl']; });

      // this is for get visitTypeData
      const visitresult = [];

      visitTypeData.forEach(function (a) {
        if (!this[a.workerId]) {
          this[a.workerId] = { workerId: a.workerId, workerName: a.workerName, visitType: a.visitType, visitTypeClients: 0 };
          visitresult.push(this[a.workerId]);
        }
        this[a.workerId].visitTypeClients += a.visitTypeClients ? Number(a.visitTypeClients) : 0;
      }, Object.create(null));
      this.visittypeRecord = visitresult;

      // for loop in total New Visit
      this.visittypeRecord.forEach(b => {
        this.newVisitTotal += b.visitTypeClients ? Number(b.visitTypeClients) : 0;
      });
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
  clearMsg() {
    this.error = '';
  }
  clear() {
    this.totalRecurringClients = 0;
    this.totalNewClients = 0;
    this.totalRebooked = 0;
    this.totalBookedOnline = 0;
    this.totalNonService = 0;
    this.totalServiceSales = 0;
    this.totalProductSales = 0;
    this.NumberTickets = 0;
    this.ProductperTicket = 0;
    this.newVisitTotal = 0;
    this.allrecord = [];
    this.visittypeRecord = [];
  }
}
