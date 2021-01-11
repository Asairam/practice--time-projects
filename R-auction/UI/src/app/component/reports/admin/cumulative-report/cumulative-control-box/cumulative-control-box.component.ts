import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../reports.service';
import { CumulativeReportService } from '../cumulative-report.service';
import { AuthService } from '../../../../../authService/auth.service';
import { CommonService } from '../../../../../commonService/common.service';

@Component({
  selector: 'cumulative-control-box',
  templateUrl: './cumulative-control-box.component.html',
  styleUrls: ['./cumulative-control-box.component.css']
})
export class CumulativeControlBoxComponent implements OnInit {


  downButt: boolean = false;
  Arr = Array;
  orgId;
  subOrgList = [];
  orgUserList = [];
  minDate: any;
  maxDate: any;

  constructor(
    public common: CommonService,
    public crService: CumulativeReportService,
    public reportService: ReportsService,
    private authService: AuthService
  ) { } 

  ngOnInit() {
    this.orgId = this.authService.getUserData().org;
    this.reportService.getTreeStructuredOrganization(this.orgId).then((res: any) => {
      this.subOrgList = res;
    })
      .catch(err => console.log("Org tree not created"));
    this.crService.bindFormDetails();
    this.orgUserList.unshift(this.crService.defaultEmail);
    this.crService.queryForm.controls.orgUser.setValue(this.crService.defaultEmail);
    this.crService.getUserSpecificCumuReportSettings().then((res: any) => {
      if (res.data) {
        this.crService.populateColumnsFromConfig(res.data);
      }
    }).catch(err => console.log('cumu conf api failed'));
  }


  orgChanged(e) {
    this.reportService.getUserListForOrg(this.crService.queryForm.value.subOrgObj._id).then((res: any) => {
      this.orgUserList = res.data;
      this.orgUserList.unshift(this.crService.defaultEmail);
      this.crService.queryForm.controls.orgUser.setValue(this.crService.defaultEmail);
    }).catch(err => console.log('user service failed'));
    this.crService.resetTableSettings();
  }
  userChanged(e) {
    this.crService.resetTableSettings();
  }

  clearFromDate() {
    this.crService.queryForm.controls.openDate.setValue('');
  }
  clearToDate() {
    this.crService.queryForm.controls.endDate.setValue('');
  }

  fromDateChanged(obj) {
    this.minDate = obj.value;
  }
  toDateChanged(obj) {
    this.maxDate = obj.value;
  }

  download() {
    this.downButt = true;
    setTimeout(() => {
      this.downButt = false;
    }, 5000);
    this.crService.getCumuReportExcel();
  }

  checkReportStatus() {
    let sendData = {
      flag: 'openAttach',
      pageFrom: 'reportstatus',
      filterReport: 'cumulativeReport'
    }
    this.common.toggleDiv.emit(sendData);
  }


}
