import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { CompletedTicketService } from './completedticket.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../common/common.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-completedticket',
  templateUrl: './completedticket.html',
  styleUrls: ['./completedticket.css'],
  providers: [CompletedTicketService, CommonService],
})
export class CompletedTicketComponent implements OnInit {
  apptId: any;
  TicketServiceData = [];
  bookApptVal = '';
  ticketPaymentList: any;
  ticketProductsList: any;
  error = '';
  rewardsList = [];
  toastermessage: any;
  apptData = {
    'apdate': '', 'clientName': '', 'visttype': '', 'clientId': '', 'Status__c': '', 'aptName': '', 'cltemail': '',
    'Name': '', 'isRefund__c': 0
  };
  clientName: any;
  visitType: any;
  noclientLabel: any;
  accountBal: any;
  clientId: any;
  workerTipsList: any;
  ticketOthersList: any;
  includedTicketsList: any = [];
  serviceTotal = 0.00;
  productTotal = 0.00;
  otherTotal = 0.00;
  tipTotal = 0.00;
  paymentTotal = 0.00;
  includedTicketsTotal = 0.00;
  status: any;
  serTax = 0;
  prodTax = 0;
  totalTax = 0;
  CreatedDate = ['', ''];
  emailTemplate = false;
  LastModifiedDate = ['', ''];
  apptName: any;
  clientEmail: any;
  isRebook = false;
  isBookAppt = false;
  balanceDue = 0.00;
  merchantName = '';
  ticketNumber: any;
  companyInfo: any;
  decodedToken: any;
  packageTax = 0;
  @ViewChild('recieptModal') public recieptModal: ModalDirective;
  constructor(private completedTicketService: CompletedTicketService,
    @Inject('apiEndPoint') public apiEndPoint: string,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer) {
    this.route.queryParams.subscribe(params => {
      this.apptId = route.snapshot.params['TicketId'];
    });
  }
  ngOnInit() {
    this.getApptDetails(this.apptId);
    this.getTicketServices(this.apptId);
    this.getTicketProducts(this.apptId);
    this.getTicketPayment(this.apptId);
    this.getOthersTicketDetails();
    this.getWorkerTips();
    this.getIncludedTickets(this.apptId);
    // this.getClientRewardDatabyApptId(this.apptId);
    // ---Start of code for Permissions Implementation--- //
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('rights'));
    } catch (error) {
      this.decodedToken = {};
    }
    if (this.decodedToken.data && this.decodedToken.data.permissions) {
      this.decodedToken = JSON.parse(this.decodedToken.data.permissions);
    } else {
      this.decodedToken = {};
    }
    // ---End of code for permissions Implementation--- //
  }
  /**
   * Method to get appointment details
   */
  getApptDetails(apptid) {
    this.completedTicketService.getApptDetails(apptid).subscribe(data => {
      this.apptData = data['result'][0];
      if (this.apptData) {
        this.ticketNumber = this.apptData.Name; // displaying at header //
        this.clientName = this.apptData.clientName;
        this.visitType = this.apptData.visttype;
        this.clientId = this.apptData.clientId;
        this.status = this.apptData.Status__c;
        this.apptName = this.apptData.aptName;
        this.clientEmail = this.apptData.cltemail;
        const isRefund = this.apptData.isRefund__c;
        this.getClientRewardDatabyApptId(this.apptId, isRefund);
        if (this.apptId && !this.clientName || this.clientName === '' || this.clientName === null) {
          this.noclientLabel = 'NO CLIENT';
          this.accountBal = 0;
        }
        if (this.apptData && this.apptData.apdate !== '') {
          const date = new Date(this.apptData.apdate);
          const apptDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          // const displayName = document.getElementById('displayNameId');
          // displayName.innerHTML = 'Completed Ticket ' + this.apptData.Name + '</br>' + '<span style = "margin-left: 30px">' + apptDate + '</span>';
          // const displayURL = document.getElementById('headerBCId2');
          // displayURL.innerHTML = 'Completed Ticket ' + this.apptData.Name;
        } else {
          const date = new Date();
          const apptDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          // const displayName = document.getElementById('displayNameId');
          // displayName.innerHTML = 'New Ticket' + '</br>' + '<span style = "margin-left: 30px">' + apptDate + '</span>';
        }

        /**
         * Rebook Button validation
         */
        if ((this.clientId !== 'null' || this.clientId !== '') && (this.apptId !== 'null' || this.apptId !== '')) {
          const date1 = new Date();
          const date2 = new Date(this.apptData.apdate);
          const today = (date1.getMonth() + 1) + '-' + date1.getDate() + '-' + date1.getFullYear();
          const apptDate1 = (date2.getMonth() + 1) + '-' + date2.getDate() + '-' + date2.getFullYear();
          if ((this.status === 'Checked In' || this.status === 'Complete') && (apptDate1 === today) && this.clientId) {
            this.isRebook = this.apptData['isNoService__c'] === 0 ? true : false;
          } else if ((this.status === 'Checked In' || this.status === 'Complete') && (apptDate1 < today) && this.clientId) {
            this.isBookAppt = this.apptData['isNoService__c'] === 0 ? true : false;
          }
        }
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
  /**
   * Method to get ticket services
   */
  getTicketServices(apptid) {
    this.completedTicketService.getTicketServicesByApptId(apptid).subscribe(data => {
      this.TicketServiceData = data['result'].ticetServices;
      if (this.TicketServiceData && this.TicketServiceData.length > 0) {
        this.bookApptVal = 'Rebook';
      } else {
        this.bookApptVal = 'Book Appt';
      }
      this.calServRetTax();
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
  /**
   * Method to get ticket products
   */
  getTicketProducts(apptid) {
    this.completedTicketService.getTicketProducts(apptid).subscribe(data => {
      this.ticketProductsList = data['result'];
      this.calCharge();
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
  /**
   * Method to get ticket payments
   */
  getTicketPayment(apptId) {
    this.completedTicketService.getTicketPaymentData(this.apptId)
      .subscribe(data => {
        this.ticketPaymentList = data['result'].paymentList;
        if (data['result'] && data['result'].balanceDue.length > 0) {
          this.balanceDue = data['result'].balanceDue[0].balancedue;
        }
        if (this.ticketPaymentList && this.ticketPaymentList.length > 0) {
          this.CreatedDate = this.commonService.getUsrDtStrFrmDBStr(data['result'].balanceDue[0].CreatedDate);
          // this.CreatedDate = data['result'].balanceDue[0].CreatedDate;
          this.LastModifiedDate = this.commonService.getUsrDtStrFrmDBStr(data['result'].balanceDue[0].LastModifiedDate);
        } else {
          this.ticketPaymentList = [];
          this.CreatedDate = this.commonService.getUsrDtStrFrmDBStr(data['result'].balanceDue[0].CreatedDate);
          this.LastModifiedDate = this.commonService.getUsrDtStrFrmDBStr(data['result'].balanceDue[0].LastModifiedDate);
          this.ticketPaymentList = data['result'].balanceDue.map((obj) => {
            obj['paymentTypeName'] = 'Ticket # ' + obj['Name']; obj['Amount_Paid__c'] = -obj['inclAmount'];
            obj['type'] = 'included'; return obj;
          });
        }
        this.calCharge();
      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (status) {
            case 500:
              break;
            case 400:
              if (statuscode === '2040') {
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                window.scrollTo(0, 0);
              } else if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                  localStorage.setItem('page', this.router.url);
                  this.router.navigate(['/']).then(() => { });
                }
              } break;
          }
        });
  }
  /**
   * Method to get worker tips
   */
  getWorkerTips() {
    this.completedTicketService.getTipsList(this.apptId).subscribe(data => {
      this.workerTipsList = data['result'];
      this.calCharge();
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '2040') {
              this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
              window.scrollTo(0, 0);
            } else if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            } break;
        }
      });
  }
  /**
   * Method to get others ticket details
   */
  getOthersTicketDetails() {
    this.completedTicketService.getOthersTicketList(this.apptId).subscribe(data => {
      this.ticketOthersList = data['result'];
      this.ticketOthersList = this.ticketOthersList.map((obj) => {
        if (obj.Transaction_Type__c === 'Package') {
          obj.packageName = '- ' + obj.packageName;
          obj.Amount__c = obj.Package_Price__c;
        } else {
          obj.packageName = '';
        }
        return obj;
      });
      this.calCharge();
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
      });
  }
  /**
 * Method to get Included tickets
 */
  getIncludedTickets(apptid) {
    this.completedTicketService.getIncludedTicketList(apptid).subscribe(data => {
      this.includedTicketsList = data['result'];
      this.calCharge();
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
  /**
   * Method to sum all
   */
  calCharge() {
    this.serviceTotal = 0;
    this.productTotal = 0;
    this.otherTotal = 0;
    this.paymentTotal = 0;
    this.tipTotal = 0;
    this.includedTicketsTotal = 0;
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      for (let i = 0; i < this.TicketServiceData.length; i++) {
        this.serviceTotal += parseFloat(this.TicketServiceData[i].netPrice);
      }
    }
    if (this.ticketProductsList && this.ticketProductsList.length > 0) {
      for (let i = 0; i < this.ticketProductsList.length; i++) {
        this.productTotal += parseFloat(this.ticketProductsList[i].Net_Price__c) * this.ticketProductsList[i].quantity;
      }
    }
    if (this.workerTipsList && this.workerTipsList.length > 0) {
      for (let i = 0; i < this.workerTipsList.length; i++) {
        this.tipTotal += parseFloat(this.workerTipsList[i].Tip_Amount__c);
      }
    }
    if (this.ticketOthersList && this.ticketOthersList.length > 0) {
      for (let i = 0; i < this.ticketOthersList.length; i++) {
        this.otherTotal += parseFloat(this.ticketOthersList[i].Amount__c);
      }
    }
    if (this.ticketPaymentList && this.ticketPaymentList.length > 0) {
      for (let i = 0; i < this.ticketPaymentList.length; i++) {
        this.paymentTotal += parseFloat(this.ticketPaymentList[i].Amount_Paid__c);
      }
    }
    if (this.includedTicketsList.length > 0) {
      this.includedTicketsTotal = parseFloat(this.includedTicketsList.map(obj => -(+obj['Included_Ticket_Amount__c'])).reduce(this.calculateSum));
    }

  }
  /**
   * apptId method to get getClientRewardDatabyApptId
   * @param apptId
   */
  getClientRewardDatabyApptId(apptId, isRefund) {
    this.completedTicketService.clientRewardDatabyApptId(apptId).subscribe(
      data => {
        this.rewardsList = data['result'];
        if (this.rewardsList && this.rewardsList.length > 0) {
          for (let i = 0; i < this.rewardsList.length; i++) {
            this.rewardsList[i]['earnedPoints'] = 0;
            this.rewardsList[i]['usedPoints'] = 0;
            if (parseInt(isRefund, 10) === 1) {
              if (this.rewardsList[i]['Points_c'] < 0) {
                this.rewardsList[i]['earnedPoints'] += parseFloat(this.rewardsList[i]['Points_c']);
              } else {
                this.rewardsList[i]['usedPoints'] -= parseFloat(this.rewardsList[i]['Points_c']);
              }
            } else if (parseInt(isRefund, 10) === 0) {
              if (this.rewardsList[i]['Points_c'] > 0) {
                this.rewardsList[i]['earnedPoints'] += parseFloat(this.rewardsList[i]['Points_c']);
              } else {
                this.rewardsList[i]['usedPoints'] -= parseFloat(this.rewardsList[i]['Points_c']);
              }
            }
          }
        }
      },
      error => {
        const errStatus = JSON.parse(error['_body'])['status'];
        if (errStatus === '2085' || errStatus === '2071') {
          this.router.navigate(['/']).then(() => { });
        }
      });
  }
  calServRetTax() {
    this.serTax = 0;
    this.prodTax = 0;
    this.packageTax = 0;
    this.totalTax = 0;
    if (this.TicketServiceData && this.TicketServiceData.length > 0) {
      for (let i = 0; i < this.TicketServiceData.length; i++) {
        if (this.TicketServiceData[i]['Taxable__c'] === 1) {
          this.serTax += +this.TicketServiceData[i].Service_Tax__c;
        }
      }
    }
    if (this.ticketProductsList && this.ticketProductsList.length > 0) {
      for (let i = 0; i < this.ticketProductsList.length; i++) {
        if (this.ticketProductsList[i]['Taxable__c'] === 1) {
          this.prodTax += +this.ticketProductsList[i].Product_Tax__c;
        }
      }
    }
    if (this.ticketOthersList && this.ticketOthersList.length > 0) {
      for (let i = 0; i < this.ticketOthersList.length; i++) {
        if (this.ticketOthersList[i].Package__c) {
          this.packageTax += this.ticketOthersList[i]['Service_Tax__c'];
        }
      }
    }
    this.totalTax = this.serTax + this.prodTax + this.packageTax;
    this.calCharge();
  }
  calculateSum(total: number, value: number) {
    return total + value;
  }
  showRecieptModal() {
    this.recieptModal.show();
    this.clientEmail = this.apptData.cltemail;
  }
  commonCancelModal() {
    this.recieptModal.hide();
    this.error = '';
  }
  clearErrMsg() {
    this.error = '';
  }
  sendEmailReciept() {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.clientEmail === '' && !this.clientEmail) {
      this.error = 'Primary Email is required';
    } else if ((this.clientEmail !== '' && !EMAIL_REGEXP.test(this.clientEmail))) {
      this.error = 'CLIENTS.INVALID_CLIENT_INFO_PRIMARY_EMAIL';
    } else {
      const HtmlData = document.getElementById('inner_cont').innerHTML;
      const style = 'body{font-size:10px}.reports-main{border:1px solid #000}.reports,.reports-main{clear:left;overflow:auto}'
        + ' .head1{width:32%;overflow:auto;margin:1%;margin-left: 0px;float:left}.head11{width:fit-content;border:1px solid black;}.main-head p{'
        + ' text-align:right;font-size:9px}.head2,.head3,.head4{width:12%;margin:.8%;float:left}.head11 p{text-align:left;word-break: break-all;} '
        + ' .head2{height:auto}.head5{width:23%;margin:1%;float:left}.reports{width:100%}.reports-heading{overflow:auto; '
        + ' background-color:#a9c7f2;margin:10px}.reports-heading-left{width:45%;float:left;text-align:left;height:auto; '
        + ' padding-left:10px}.reports-heading-right{width:45%;float:right;text-align:right;height:auto;padding-right:10px}'
        + ' .reports table{width:96%;margin:10px;font-size:10px}.reports th{width:20%;margin:0. 2%;text-align:left}.reports '
        + ' .products th{width:12%;margin:0 .25%;text-align:left}.reports .payments th{width:48%;margin:0. 2%;text-align:left}'
        + '.reports-heading-left h4,.reports-heading-right h4 {margin: 5px; }.head1 p{margin: 4px; text-align: left;font-size: 10px;} '
        + '.reports .payments th{width : 32%}.head-margin{margin-bottom:0px;margin-top:0px}.head-margin1{margin-top:0px}.ticketothers th{width:24%;}';
      const finalhtml = HtmlData + '<style>' + style + '</style>';
      const dataObj = {
        'apptName': this.apptName,
        'clientName': this.clientName,
        'clientEmail': this.clientEmail,
        'htmlFile': finalhtml
      };
      this.completedTicketService.sendReciept(dataObj).subscribe(data => {
        this.recieptModal.hide();
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EMAIL_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        this.clientEmail = '';
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
        });
    }
  }

  loadCompanyInfo(data) {
    this.companyInfo = data;
  }

}
