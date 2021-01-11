import { Component, OnInit } from '@angular/core';
import { MisReportService } from './mis-report.service';
import { reportAnimation } from '../animation';
import { ReportsService } from '../reports.service';
import { CommonService } from 'src/app/commonService/common.service';
import { FormGroup } from '@angular/forms';


type NewType = OnInit; 

@Component({
  selector: 'app-mis-auction-report',
  templateUrl: './mis-auction-report.component.html',
  styleUrls: ['./mis-auction-report.component.css'],
	animations: [reportAnimation]
})
export class MisAuctionReportComponent implements NewType {
	
	
	minDte: any;
	maxDte: any; 
	downButtt: boolean = false;
	
	

	constructor(
		public misService:MisReportService,
		public reportService: ReportsService,
		public common: CommonService,
	) { }

	ngOnInit() {
		this.misService.bindFilterFormDetail();
		this.misService.getUserSpecificMISReportSettings().then((res: any) => {
			if(res.data) {
				this.misService.populateMisColumnFromConfig(res.data);
			}
		}).catch(err => console.log('cumu conf api failed'));
	}

	onfromDateChanged(obj) {
		this.minDte = obj.value;
	}
	onDateChang(obj) {
		this.maxDte = obj.value;
	}


	onPaginatorClick(event) { 
		this.misService.reportData.pageIndex = event.pageIndex + 1;
		this.misService.reportData.pageSize = event.pageSize;
		this.misService.initTo();
	}

	openCloseAllMisSubHeading() {
		this.misService.misShowAll = !this.misService.misShowAll;
		this.misService.reportData.auctionList.forEach(ele => {
			ele.open = this.misService.misShowAll;
		});
	}

	openItem1(auction) {
		auction.open = !auction.open;
	}

	downloadmis() {
		this.downButtt = true;
		setTimeout(() => {
		  this.downButtt = false;
		}, 5000);
		this.misService.getMISReportExcel();
	  }

	  checkMisReportStatus() {
		let sendData = {
		  flag: 'openAttach',
		  pageFrom: 'reportstatus',
		  filterReport: 'cumulativeReport'
		}
		this.common.toggleDiv.emit(sendData);
	  }

	

	

}
