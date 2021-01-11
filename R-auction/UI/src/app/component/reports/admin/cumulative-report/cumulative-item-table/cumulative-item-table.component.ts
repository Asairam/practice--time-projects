import { Component, OnInit, Input } from '@angular/core';
import { CumulativeReportService } from '../cumulative-report.service';
import { ReportsService } from '../../../reports.service';

@Component({
    selector: 'cumulative-item-table',
	templateUrl: './cumulative-item-table.component.html',
	styleUrls: ['./cumulative-item-table.component.css'],
})
export class CumulativeItemTableComponent implements OnInit {

	@Input() itemLevelData;

	@Input() tableClass;
    
	constructor(
		public crService: CumulativeReportService,
		public reportsService: ReportsService
	) { }

	ngOnInit() {
    }

}