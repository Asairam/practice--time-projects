import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TicketAnalysisReportService } from './ticketanalysisreport.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../../common/common.service';
interface TicketAnalysis {
  serviceSales?: number;
  productSales?: number;
  isRefund?: boolean;
  productTicketCount?: number;
  serviceTicketCount?: number;
  bookedOnline?: boolean;
  noService?: boolean;
  newVisit?: boolean;
  prdtCount?: number;
  servcCount?: number;
}
@Component({
  selector: 'app-reports-app',
  templateUrl: './ticketanalysisreport.html',
  styleUrls: ['./ticketanalysisreport.css'],
  providers: [TicketAnalysisReportService, CommonService],
})
export class TicketAnalysisReportComponent implements OnInit {
  public bsValue: any = new Date();
  public bsValue1: any = new Date();
  itemsDisplay: any = false;
  datePickerConfig: any;
  public workerList: any = [];
  public workerName: any = '';
  public reports = new Map<string, TicketAnalysis>();
  public reportAnalysis = {
    'startDate': undefined,
    'endDate': undefined,
    'worker': '',
    'type': 'Comapny Analysis'
  };
  public error = '';
  public reportDetails: any = {};
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private marketingEmailService: TicketAnalysisReportService,
    private ticketAnalysisService: TicketAnalysisReportService,
    private commonService: CommonService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
  }
  ngOnInit() {
    this.bsValue = '';
    this.bsValue1 = '';
    this.getWorkerList();
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
  getWorkerList() {
    this.ticketAnalysisService.getUserList().subscribe(data => {
      this.workerList = data['result'];
      //   this.userList = this.userListData.filter(
      // filterList => filterList.IsActive === 1);

      // .filter(
      //   filterList => filterList.IsActive === 1);
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

  clear() {
    this.error = '';
    this.reportDetails = {};
    this.itemsDisplay = false;
  }
  generateReport() {
    if (!this.reportAnalysis.startDate) {
      this.error = 'Begin date is required';
    } else if (!this.reportAnalysis.endDate) {
      this.error = 'End date is required';
    } else if (this.reportAnalysis.type !== 'Comapny Analysis' && this.reportAnalysis.worker === '') {
      this.error = 'Worker is required';
    } else {
      this.itemsDisplay = true;
      const reportObj = {
        startDate: this.commonService.getDBDatStr(this.reportAnalysis.startDate),
        endDate: this.commonService.getDBDatStr(this.reportAnalysis.endDate),
        worker: this.reportAnalysis.worker
      };
      this.ticketAnalysisService.getTicketAnalysisReport(reportObj).subscribe(data => {
        this.reports.clear();
        const reportsResult: any = data['result'];
        reportsResult['serviceTxList'].forEach(service => {
          const serviceObj = {
            serviceSales: 0,
            productSales: 0,
            isRefund: false,
            productTicketCount: 0,
            serviceTicketCount: 0,
            newVisit: false,
            bookedOnline: false,
            noService: false,
            Qty_Sold__c: 0,
            prdtCount: 0,
            servcCount: 0
          };
          serviceObj.serviceSales = service.Service_Sales__c;
          serviceObj.isRefund = service.isRefund__c;
          serviceObj.newVisit = service.New_Client__c;
          serviceObj.bookedOnline = service.Booked_Online__c;
          serviceObj.serviceTicketCount = serviceObj.serviceTicketCount++;
          serviceObj.noService = service.isNoService__c;
          serviceObj.servcCount = service.servcCount;
          if (this.reportAnalysis.worker && service.Guest_Charge__c) {
            serviceObj.serviceSales -= service.Guest_Charge__c;
          }
          this.reports.set(service.Appt_Ticket__c, serviceObj);
        });
        reportsResult['productTxList'].forEach(product => {
          let productObj: any = {};
          if (this.reports.has(product.Appt_Ticket__c)) {
            productObj = this.reports.get(product.Appt_Ticket__c);
            // console.log(this.reports.get(product.Appt_Ticket__c));
          } else {
            productObj = {
              serviceSales: 0,
              productSales: 0,
              isRefund: false,
              productTicketCount: 0,
              serviceTicketCount: 0,
              newVisit: false,
              bookedOnline: false,
              noService: false,
              Qty_Sold__c: 0,
              prdtCount: 0,
              servcCount: 0
            };
          }
          productObj.productSales = product.Product_Sales__c;
          productObj.isRefund = product.isRefund__c;
          productObj.newVisit = product.New_Client__c;
          productObj.bookedOnline = product.Booked_Online__c;
          productObj.productTicketCount = productObj.productTicketCount++;
          productObj.noService = product.isNoService__c;
          productObj.Qty_Sold__c = product.Qty_Sold__c;
          productObj.prdtCount = product.prdtCount;
          this.reports.set(product.Appt_Ticket__c, productObj);
        });

        // console.log(this.reports.size);
        this.reportDetails = {};
        this.reportDetails.serviceOnlyCount = 0;
        this.reportDetails.productOnlyCount = 0;
        this.reportDetails.bothCount = 0;
        this.reportDetails.zeroOrRefundCount = 0;
        this.reportDetails.multipleProductCount = 0;
        this.reportDetails.multipleBothCount = 0;
        this.reportDetails.newVisitCount = 0;
        this.reportDetails.newVisitRevenue = 0;
        this.reportDetails.recurringVisitCount = 0;
        this.reportDetails.recurringVisitRevenue = 0;
        this.reportDetails.bookedOnlineCount = 0;
        this.reportDetails.bookedOnlineRevenue = 0;
        this.reportDetails.nonServiceCount = 0;
        this.reportDetails.nonServiceRevenue = 0;
        this.reportDetails.serviceRevenue = 0;
        this.reportDetails.productRevenue = 0;
        this.reportDetails.totalTicketCount = 0;
        this.reportDetails.fullTicketRevenue = 0;
        ////  Ticket Percentage Details
        this.reportDetails.Percent_Product_Revenue_to_Service_Revenue = 0;
        this.reportDetails.Percent_Tickets_with_Product = 0;
        this.reportDetails.Percent_Tickets_with_Service = 0;
        this.reportDetails.Percent_Service_Tickets_with_Product = 0;
        this.reportDetails.Percent_Tickets_with_Multiple_Products = 0;
        /// Ticket Percentage Details

        //// Ticket Average Revenue Details
        this.reportDetails.Avg_Revenue_per_Ticket = 0;
        this.reportDetails.Avg_Service_Revenue_per_Ticket = 0;
        this.reportDetails.Service_Revenue_per_Service_Only_Ticket = 0;
        this.reportDetails.Avg_Product_Revenue_per_Ticket = 0;
        this.reportDetails.Avg_Product_Revenue_per_Product_Only_Ticket = 0;
        this.reportDetails.Avg_Product_Revenue_per_All_Service = 0;
        this.reportDetails.Avg_Product_Revenue_per_Service_Tx_Products = 0;
        //// Ticket Average Revenue Details

        /// Tickets by Client Type Details
        this.reportDetails.Recurring_Visit = 0;
        this.reportDetails.New_Visit = 0;
        this.reportDetails.Booked_Online = 0;
        this.reportDetails.Non_Service = 0;
        /// Tickets by Client Type Details

        /// Tickets by Client Type Revenue Details
        this.reportDetails.Recurring_Visit_Revenue = 0;
        this.reportDetails.New_Visit_Revenue = 0;
        this.reportDetails.Booked_Online_Revenue = 0;
        this.reportDetails.Non_Service_Revenue = 0;
        /// Tickets by Client Type  Revenue Details
        this.reports.forEach((report) => {
          //  console.log(report);
          if (report.serviceSales > 0 && (report.productSales == null || report.productSales === 0)) {
            this.reportDetails.serviceOnlyCount++;
          }

          if (report.productSales > 0 && (report.serviceSales == null || report.serviceSales === 0)) {
            this.reportDetails.productOnlyCount++;
          }

          if (report.serviceSales > 0 && report.productSales > 0) {
            this.reportDetails.bothCount++;
          }

          if (report.isRefund) {
            this.reportDetails.zeroOrRefundCount++;
          }

          if (report.prdtCount > 1) {
            this.reportDetails.multipleProductCount++;
          }

          if (report.prdtCount > 1 && report.servcCount > 1) {
            this.reportDetails.multipleBothCount++;
          }

          if (report.newVisit) {
            this.reportDetails.newVisitCount++;
            this.reportDetails.newVisitRevenue += (report.serviceSales + report.productSales);
          } else {
            this.reportDetails.recurringVisitCount++;
            this.reportDetails.recurringVisitRevenue += (report.serviceSales + report.productSales);
          }
          if (report.bookedOnline) {
            this.reportDetails.bookedOnlineCount++;
            this.reportDetails.bookedOnlineRevenue += (report.serviceSales + report.productSales);
          }
          if (report.noService) {
            this.reportDetails.nonServiceCount++;
            this.reportDetails.nonServiceRevenue += (report.serviceSales + report.productSales);
          }

          // includes refunds in revenue totals
          this.reportDetails.serviceRevenue += report.serviceSales;
          this.reportDetails.productRevenue += report.productSales;

          this.reportDetails.totalTicketCount++;
        });
        this.reportDetails.fullTicketRevenue = this.reportDetails.serviceRevenue + this.reportDetails.productRevenue;
        if (this.reportAnalysis.type === 'Comapny Analysis') {
          this.reportDetails.zeroOrRefundCount += reportsResult['zeroOrRefundCount'];
        }
        ////  Ticket Percentage Calculations
        this.reportDetails.Percent_Product_Revenue_to_Service_Revenue = this.calculatePercentage(this.reportDetails.productRevenue, this.reportDetails.serviceRevenue);
        this.reportDetails.Percent_Tickets_with_Product = this.calculatePercentage(this.reportDetails.productOnlyCount + this.reportDetails.bothCount, this.reportDetails.totalTicketCount);
        this.reportDetails.Percent_Tickets_with_Service = this.calculatePercentage(this.reportDetails.serviceOnlyCount + this.reportDetails.bothCount, this.reportDetails.totalTicketCount);
        this.reportDetails.Percent_Service_Tickets_with_Product = this.calculatePercentage(this.reportDetails.multipleBothCount, this.reportDetails.totalTicketCount);
        this.reportDetails.Percent_Tickets_with_Multiple_Products = this.calculatePercentage(this.reportDetails.multipleProductCount, this.reportDetails.totalTicketCount);
        ////  Ticket Percentage Calculations

        //// Ticket Average Revenue Calculations
        this.reportDetails.Avg_Revenue_per_Ticket = this.calculateAverage(this.reportDetails.serviceRevenue + this.reportDetails.productRevenue, this.reportDetails.totalTicketCount);
        this.reportDetails.Avg_Service_Revenue_per_Ticket = this.calculateAverage(this.reportDetails.serviceRevenue, this.reportDetails.totalTicketCount);
        this.reportDetails.Service_Revenue_per_Service_Only_Ticket = this.calculateAverage(this.reportDetails.serviceRevenue, this.reportDetails.serviceOnlyCount);
        this.reportDetails.Avg_Product_Revenue_per_Ticket = this.calculateAverage(this.reportDetails.productRevenue, this.reportDetails.totalTicketCount);
        this.reportDetails.Avg_Product_Revenue_per_Product_Only_Ticket = this.calculateAverage(this.reportDetails.productRevenue, this.reportDetails.productOnlyCount);
        this.reportDetails.Avg_Product_Revenue_per_All_Service = this.calculateAverage(this.reportDetails.productRevenue, this.reportDetails.serviceOnlyCount + this.reportDetails.bothCount);
        this.reportDetails.Avg_Product_Revenue_per_Service_Tx_Products = this.calculateAverage(this.reportDetails.productRevenue, this.reportDetails.multipleBothCount);
        //// Ticket Average Revenue Calculations

        /// Tickets by Client Type calculations
        this.reportDetails.Recurring_Visit = this.calculatePercentage(this.reportDetails.recurringVisitCount, this.reportDetails.totalTicketCount);
        this.reportDetails.New_Visit = this.calculatePercentage(this.reportDetails.newVisitCount, this.reportDetails.totalTicketCount);
        this.reportDetails.Booked_Online = this.calculatePercentage(this.reportDetails.bookedOnlineCount, this.reportDetails.totalTicketCount);
        this.reportDetails.Non_Service = this.calculatePercentage(this.reportDetails.nonServiceCount, this.reportDetails.totalTicketCount);
        /// Tickets by Client Type calculations

        /// Tickets by Client Type Revenue calculations
        this.reportDetails.Recurring_Visit_Revenue = this.calculatePercentage(this.reportDetails.recurringVisitRevenue, this.reportDetails.fullTicketRevenue);
        this.reportDetails.New_Visit_Revenue = this.calculatePercentage(this.reportDetails.newVisitRevenue, this.reportDetails.fullTicketRevenue);
        this.reportDetails.Booked_Online_Revenue = this.calculatePercentage(this.reportDetails.bookedOnlineRevenue, this.reportDetails.fullTicketRevenue);
        this.reportDetails.Non_Service_Revenue = this.calculatePercentage(this.reportDetails.nonServiceRevenue, this.reportDetails.fullTicketRevenue);
        /// Tickets by Client Type  Revenue calculations
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
