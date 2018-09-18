import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TicketListService } from './ticketlist.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonService } from '../../common/common.service';

@Component({
  selector: 'app-ticketlist',
  templateUrl: './ticketlist.html',
  providers: [TicketListService,  CommonService],
})
export class TicketListComponent implements OnInit, AfterViewInit {
  startDate = new Date();
  endDate = new Date();
  todayDate = new Date();
  itemsDisplay = false;
  workerTipsData: any;
  datePickerConfig: any;
  dateError: any;
  apptTicketData: any;
  apptcashinoutData: any;
  totalService = 0;
  totalProduct = 0;
  totalOther = 0;
  alltotal = 0;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService, private commonService: CommonService,
    private translateService: TranslateService,
    private ticketListService: TicketListService) {
      this.datePickerConfig = Object.assign({},
                  {
                    showWeekNumbers: false,
                    containerClass: 'theme-blue',
                  });
  }
  ngOnInit() {
    const date = new Date();
    const sendDate = {
      'todayDate': this.commonService.getDBDatTmStr(this.todayDate),
      'search': 'todayDate'
    };
    this.getTicketList(sendDate);
    this.getCashInOutList(sendDate);
   // this.updateHeaderDate(this.startDate, this.endDate);
  }
  ngAfterViewInit() {
    this.headerDateFormat();
   }
  headerDateFormat() {
    let sDate;
    let sMonth;
    let eDate;
    let eMonth;
    if (this.startDate.getDate() < 10) {
      sDate = '0' + this.startDate.getDate();
    } else {
      sDate = this.startDate.getDate();
    }
    if ((this.startDate.getMonth() + 1) < 10) {
      sMonth = '0' + (this.startDate.getMonth() + 1);
    } else {
      sMonth = (this.startDate.getMonth() + 1);
    }
    if (this.endDate.getDate() < 10) {
      eDate = '0' + this.endDate.getDate();
    } else {
      eDate = this.endDate.getDate();
    }
    if ((this.endDate.getMonth() + 1) < 10) {
      eMonth = '0' + (this.endDate.getMonth() + 1);
    } else {
      eMonth = (this.endDate.getMonth() + 1);
    }
    const displayName = document.getElementById('displayNameId');
    displayName.innerHTML = ' Ticket Details ' + sMonth + '/' + sDate + '/' + this.startDate.getFullYear() + ' - ' + eMonth + '/' + eDate + '/' + this.endDate.getFullYear();
  }
  generateReport(val) {
    let sendDate;
    if (val === 'datechange') {
      this.headerDateFormat();
      this.totalService = 0;
      this.totalProduct = 0;
      this.totalOther = 0;
      this.alltotal = 0;
        if (this.startDate > this.endDate) {
          this.dateError = 'CHECK_OUTS.REFUND.BEGIN_DATE_A_E_D';
        } else {
          // this.itemsDisplay = true;
          this.dateError = '';
          sendDate = {
            'startDate': this.commonService.getDBDatTmStr(this.startDate),
            'endDate': this.commonService.getDBDatTmStr(this.endDate),
            'search': 'betweenDate'
          };
        }
    } else if (val === 'today') {
      this.startDate = new Date();
      this.endDate = new Date();
      this.totalService = 0;
      this.totalProduct = 0;
      this.totalOther = 0;
      this.alltotal = 0;
      sendDate = {
        'todayDate': this.commonService.getDBDatTmStr(this.todayDate),
        'search': 'todayDate'
      };
       this.dateError = '';
    }
    this.getTicketList(sendDate);
    this.getCashInOutList(sendDate);
  }

  getTicketList(sendDate) {
    this.ticketListService.searchTicketData(sendDate)
    .subscribe(data => {
      this.apptTicketData = data['result'];
      for (let i = 0; i < this.apptTicketData.length; i++) {
        this.apptTicketData[i].apptTime = this.commonService.getUsrDtStrFrmDBStr(this.apptTicketData[i].Appt_Date_Time__c);
        this.totalService += this.apptTicketData[i].servicePrice;
        this.totalProduct += this.apptTicketData[i].productPrice;
        this.totalOther += this.apptTicketData[i].otherAmount;
        this.alltotal += this.apptTicketData[i].Total;
      }
    }, error => {
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

  getCashInOutList(sendDate) {
    this.ticketListService.searchcashinoutData(sendDate)
    .subscribe(data => {
      this.apptcashinoutData = data['result'];
      for (let i = 0; i < this.apptcashinoutData.length; i++){
        this.apptcashinoutData[i].disaplayDate = this.commonService.getUsrDtStrFrmDBStr(this.apptcashinoutData[i].CreatedDate);
      }
    }, error => {
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
  // updateHeaderDate(bgnDate: Date, endDate: Date) {
  //   const displayName = document.getElementById('displayNameId');
  //   displayName.innerHTML = 'TICKET DETAILS ' + (bgnDate.getMonth() + 1) + '/' + bgnDate.getDate() + '/' + bgnDate.getFullYear() +
  //     ' - ' + (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + endDate.getFullYear();
  // }
  // datepickerChange(event) {
  //   this.updateHeaderDate(this.startDate, this.endDate);
  // }
}
