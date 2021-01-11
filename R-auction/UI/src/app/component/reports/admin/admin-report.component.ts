import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../../commonService/common.service';
/* NgRx */
import { Store, select} from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import * as fromAppModule from '../../../state/app.reducer';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	templateUrl: './admin-report.component.html',
	styleUrls: ['./admin-report.component.css'],
})
export class AdminReportComponent implements OnInit, OnDestroy {

	componentActive: boolean = true;
    adminReport: any;
	reportType = this.route.snapshot.queryParamMap.get('type')
    adminReportList = [
		{ name: 'Total Auction Report', value: 'TotalAuctionReport' }
    ];
    
	constructor(        
		private common: CommonService,
		private route: ActivatedRoute,
		private appstore: Store<fromAppModule.AppModuleState>
	) { }

	ngOnInit() {
		this.appstore.pipe(select(fromAppModule.getAuctionConfigOnly),takeWhile(() => this.componentActive) ).subscribe(auctionConfig => {
			if(auctionConfig && auctionConfig.features && auctionConfig.features.cumulativeReport && this.reportType != "misreport") {
				this.adminReportList.push({ name: 'Cumulative Auction Report', value: 'CumulativeAuctionReport' });
			} else {
				if(this.reportType == "misreport") {
					this.adminReportList = [
						{ name: 'MIS Report', value: 'MISAuctionReport' }
					];
				}
			}
		});
    }
    
    goHome() {
		this.common.buyerRedirectLanding();
    }
    
    changeAdminReport() {

	}
	
	ngOnDestroy() {
		this.componentActive = false;
	}

}