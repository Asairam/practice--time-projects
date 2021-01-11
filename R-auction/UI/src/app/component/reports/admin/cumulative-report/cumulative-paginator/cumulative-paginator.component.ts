import { Component, OnInit } from '@angular/core';
import { CumulativeReportService } from '../cumulative-report.service';
import { ReportsService } from '../../../reports.service';

@Component({
    selector: 'cumulative-paginator',
	templateUrl: './cumulative-paginator.component.html',
	styleUrls: ['./cumulative-paginator.component.css'],
})
export class CumulativePaginatorComponent implements OnInit {
    
	constructor(        
		public crService: CumulativeReportService,
		public reportsService: ReportsService
	) { }

	ngOnInit() {
	}
	
	paginatorClicked(event) {
		this.crService.reportData.pageIndex = event.pageIndex + 1;
		this.crService.reportData.pageSize = event.pageSize;
		this.crService.go();
	}

}