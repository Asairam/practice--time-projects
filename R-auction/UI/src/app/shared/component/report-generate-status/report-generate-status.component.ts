import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonService } from '../../../commonService/common.service';
import { ReportsService } from '../../../component/reports/reports.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-report-generate-status',
  templateUrl: './report-generate-status.component.html',
  styleUrls: ['./report-generate-status.component.css']
})
export class ReportGenerateStatus implements OnInit {
	modalReference  = null;
	@ViewChild('modalContent1') modalContent1: TemplateRef<any>;
  @Input() drawerData;

  public paginationData = {
    // auctionList: [],
    totalRecord: 0,
    pageSize: 10,
    pageIndex: 1
  }

  constructor(
    private modal: NgbModal,
    private common: CommonService,
    public reportService: ReportsService
  ) { }

  reportStatusList = [];

  ngOnInit() {
    this.getReportList(this.paginationData.pageIndex);
  }

  getReportList(pageNumber) {
    this.reportService.getReportGenerationStatus(pageNumber)
      .then((data: any) => {
        this.paginationData.totalRecord = data.count;
        this.reportStatusList = data.requests; //data.filter(report => report.excelName == this.drawerData.filterReport);
      }).catch(err => console.log('Unable to fetch report generate status'));
  }

  close() {
    let sendData = {
      flag: 'closeAttach',
      pageFrom: 'reportstatus'
    }
    this.common.toggleDiv.emit(sendData);
  }

  paginatorClicked(event) {
    this.reportStatusList = [];
    this.paginationData.pageIndex = event.pageIndex + 1;
    this.paginationData.pageSize = event.pageSize;
    this.getReportList(this.paginationData.pageIndex);
  }

  clearallpopup(){
    this.modalReference  = this.modal.open(this.modalContent1, {
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'my-popupclass'
      });
    }
  clearall(){
    this.reportService.allReportClear().then((data: any) => {
      this.getReportList(this.paginationData.pageIndex);
      this.modalReference.close();
      this.common.success( 'Reports deleted successfully.');
    }).catch(err => {});
  }
}
