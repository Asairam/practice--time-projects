import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/module/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { TotalAuctionComponent } from './total-auction/total-auction.component';
import { ReportsetComponent } from './reportset/reportset.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Report1Component } from './report1/report1.component';
import { Report2Component } from './report2/report2.component';
import { Report2MenuComponent } from './report2/report2-menu/report2-menu.component';
import { Savings } from './total-auction/savings/savings.component';
import { ChatThreadComponent } from 'src/app/shared/component/chat-thread/chat-thread.component';
import { AdminReportComponent } from './admin/admin-report.component';
import { CumulativeReportComponent } from './admin/cumulative-report/cumulative-report.component';
import { CumulativeAuctionTableComponent } from './admin/cumulative-report/cumulative-auction-table/cumulative-auction-table.component';
import { CumulativeReportService } from './admin/cumulative-report/cumulative-report.service';
import { CumulativeItemTableComponent } from './admin/cumulative-report/cumulative-item-table/cumulative-item-table.component';
import { ReportsService } from './reports.service';
import { CumulativeControlBoxComponent } from './admin/cumulative-report/cumulative-control-box/cumulative-control-box.component';
import { CumulativeColumnSelectComponent } from './admin/cumulative-report/cumulative-column-select-popup/cumulative-column-select.component';
import { CumulativePaginatorComponent } from './admin/cumulative-report/cumulative-paginator/cumulative-paginator.component';
import { Report1ColumnComponent } from './report1/report1Column/report1-column.component';
import { MisColumnSelectComponent } from './mis-column-select/mis-column-select.component';
import { MisReportService } from './mis-auction-report/mis-report.service';
import { MisAuctionReportComponent } from './mis-auction-report/mis-auction-report.component';

@NgModule({
	declarations: [
		ReportsComponent,
		Savings,
		TotalAuctionComponent,
		ReportsetComponent,
		Report1Component,
		Report2Component,
		Report2MenuComponent,
		ChatThreadComponent,
		AdminReportComponent,
		CumulativeReportComponent,
		CumulativeAuctionTableComponent,
		CumulativeItemTableComponent,
		CumulativeControlBoxComponent,
		CumulativeColumnSelectComponent,
		CumulativePaginatorComponent,
		Report1ColumnComponent,
		MisAuctionReportComponent,
		MisColumnSelectComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		ReportsRoutingModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
	],	
	entryComponents: [
		Report2MenuComponent, 
		CumulativeColumnSelectComponent,
		MisColumnSelectComponent
	],
	providers: [ReportsService, CumulativeReportService, MisReportService]
})
export class ReportsModule { }
