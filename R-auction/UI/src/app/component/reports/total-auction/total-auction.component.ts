import { Component, OnInit } from '@angular/core';
import { BuyerBiddingService } from '../../component-service/buyer-bidding.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../authService/auth.service';
import { CommonService } from '../../../commonService/common.service';
import { reportAnimation } from '../animation';
import { LoaderService } from '../../../shared/services/loader.service';
import * as config from '../../../appConfig/app.config';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'total-auction-report',
  templateUrl: './total-auction.component.html',
  styleUrls: ['./total-auction.component.css'],
  animations: [reportAnimation]
})
export class TotalAuctionComponent implements OnInit {

  Arr = Array;
  orgMap = new Map();
  startDate: any;
  endDate: any;
  basicForm: FormGroup;
  formSubmit: boolean = false;
  downButt: boolean = false;
  minDate: any;
  maxDate: any;
  orgId: any;
  orgName: any
  localLoader: boolean = false;
  subOrgList = [];
  subOrgObj: any;
  allOrgList: any = [];
  preAucTotalSavingList = [
    {
      name: 'Initial Bid',
      value: 'initialVal'
    },
    {
      name: 'Preliminary Bid',
      value: 'preliminaryVal'
    },
    {
      name: 'Historical Cost',
      value: 'historicalCost'
    }
  ];

  preAucSaving: any;

  error = {
    hoursError: false,
    hoursCloseError: false,
    minuteError: false,
    minuteCloseError: false,
    startDateError: false,
    endDateError: false
  }

  auctionDetails: any;

  constructor(
    private bidService: BuyerBiddingService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private common: CommonService,
    private loader: LoaderService,
    private reportService: ReportsService
  ) { }

  ngOnInit() {
    this.orgId = this.authService.getUserData().org;
    this.reportService.getTreeStructuredOrganization(this.orgId).then((res: any) => {
      this.subOrgList = res;
    })
      .catch(err => console.log("Org tree not created"));
    this.bindFormDetails();
  }

  fromDateChanged(obj) {
    this.minDate = obj.value;
  }
  toDateChanged(obj) {
    this.maxDate = obj.value;
  }

  bindFormDetails() {
    this.basicForm = this.formBuilder.group({
      openDate: [null],
      endDate: [null],
      subOrgObj: [null],
      preAucSaving: [this.preAucTotalSavingList[0]]
    })
  }



  getOrgNameFromId(orgId) {
    return new Promise((resolve, reject) => {
      this.bidService.getOrganization(orgId).subscribe(res => {
        resolve(res);
      }, err => {
        reject();
      })
    });
  }

  getAdminReports() {
    if (!this.basicForm.valid) return;
    if (!this.basicForm.value.subOrgObj) {
      this.common.error("Please select Organization Unit");
      return;
    }
    let payload = this.getPayLoad(this.basicForm.value.subOrgObj._id);
    if (!payload.error) {
      this.bidService.getAdminReports(payload.startDate, payload.endDate, payload.org, payload.method).subscribe((res: any) => {
        this.auctionDetails = res.data;
      }, (err) => {

      });
    }

  }

  getAdminReportExcel() {
    if (!this.basicForm.valid) return;
    if (!this.basicForm.value.subOrgObj) {
      this.common.error("Please select Organization Unit");
      return;
    }
    let payload = this.getPayLoad(this.basicForm.value.subOrgObj._id);
    if (!payload.error) {
      this.downButt = true;
      setTimeout(() => {
        this.downButt = false;
      }, 5000);
      this.bidService.getAdminReportExcel(payload.startDate, payload.endDate, payload.org, payload.method).subscribe(res => {
        this.common.success("Request raised for report generation");
      }, err => { this.common.error("Failed to raise request for report generation"); })
    }
  }

  checkReportStatus() {
    let sendData = {
      flag: 'openAttach',
      pageFrom: 'reportstatus',
    }
    this.common.toggleDiv.emit(sendData);
  }



  getPayLoad(orgId) {
    try {
      // debugger;
      let startDate: any = '', endDate: any = '';
      if (this.basicForm.value.openDate && this.basicForm.value.endDate) {
        let month = ((this.basicForm.value.openDate).getMonth());
        let day = ((this.basicForm.value.openDate).getDate());
        let year = ((this.basicForm.value.openDate).getFullYear());
        // let hour = ((this.basicForm.value.opent).getHours());
        // let minute = ((this.basicForm.value.opent).getMinutes());
        // let seconds = new Date(this.basicForm.value.opent.setSeconds(0));
        let oMonth = ((this.basicForm.value.endDate).getMonth());
        let oDay = ((this.basicForm.value.endDate).getDate());
        let oYear = ((this.basicForm.value.endDate).getFullYear());
        // let oHour = ((this.basicForm.value.endt).getHours());
        // let oMinute = ((this.basicForm.value.endt).getMinutes());
        // let oSeconds = new Date(this.basicForm.value.endt.setSeconds(0));
        // startDate = new Date(year, month, day, hour, minute);
        // endDate = new Date(oYear, oMonth, oDay, oHour, oMinute);
        startDate = (new Date(year, month, day, 0, 0, 0, 0)).toISOString();
        endDate = (new Date(oYear, oMonth, oDay, 23, 59, 59, 999)).toISOString();
      }

      if (this.endDate <= this.startDate) {
        this.error.endDateError = true;
        return { error: true }
      }
      else {
        return {
          "startDate": startDate,
          "endDate": endDate,
          "org": orgId,
          "method": this.basicForm.value.preAucSaving.value
        }
      }
    }
    catch (e) {
    }
  }

  changeSavings(val) {
    // debugger;
  }

  changeAuctionType(val) {

  }

}
