import { Component, OnInit } from '@angular/core';
import { CumulativeReportService } from './cumulative-report.service';
import { ReportsService } from '../../reports.service';

@Component({
    selector: 'cumulative-report',
	templateUrl: './cumulative-report.component.html',
	styleUrls: ['./cumulative-report.component.css'],
})
export class CumulativeReportComponent implements OnInit {
    
	constructor(   
		public crService: CumulativeReportService,
		public reportsService: ReportsService
	) { }

	ngOnInit() {
	}

}