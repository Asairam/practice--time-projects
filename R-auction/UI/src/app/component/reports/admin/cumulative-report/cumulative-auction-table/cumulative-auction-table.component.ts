import { Component, OnInit } from '@angular/core';
import { CumulativeReportService } from '../cumulative-report.service';
import { ReportsService } from '../../../reports.service';

@Component({
    selector: 'cumulative-auction-table',
	templateUrl: './cumulative-auction-table.component.html',
	styleUrls: ['./cumulative-auction-table.component.css'],
})
export class CumulativeAuctionTableComponent implements OnInit {
	    
	constructor(
		public crService: CumulativeReportService,
		public reportsService: ReportsService
	) { }

	ngOnInit() {
	}
	
	openItem(auction) {
		auction.open = !auction.open;
	}

	openCloseAll() {
		this.crService.showAll = !this.crService.showAll;
		this.crService.reportData.auctionList.forEach(ele => {
			ele.open = this.crService.showAll;
		});
	}

}