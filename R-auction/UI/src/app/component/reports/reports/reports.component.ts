import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonService } from '../../../commonService/common.service';
import { AuthService } from '../../../authService/auth.service';
import { BuyerBiddingService } from '../../component-service/buyer-bidding.service';
import * as routerconfig from '../../../appConfig/router.config';
@Component({
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

	auctionID: number;
	report: any;
	displayType = null;
	reportList = [
		{ name: 'Analyse Bid Summary - Portrait View', value: 'portrait', type: "p" },
		{ name: 'Analyse Bid Summary - Landscape View', value: 'landscape', type: "l" },
		{ name: 'Analyse Raw Data', value: 'analyseRaw' },
		{ name: 'Bid History', value: 'bidhistory' },
		{ name: 'Auction Chat History', value: 'auctionchat' }
	];
	constructor(
		public route: ActivatedRoute,
		public routes: Router,
		private common: CommonService,
		private auth: AuthService,
		public bidService: BuyerBiddingService,
	) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			this.auctionID = Number(params.get('auctionID'));
		})
	}

	changeReport() {
		if (this.report === 'bidhistory') {
			if (this.route.snapshot.params.breadCrumbStatus && this.route.snapshot.params.breadCrumbStatus.toLowerCase() === 'closed') {
				this.getBidHistoryReport();
			} else {
				this.common.warning('Not Available');
			}
		} else {
			this.displayType = this.reportList.find(x => x.value == this.report);
		}
		// if (this.report === 'auctionchat') {
		// 	let auc = "hello";
		// 	{{auc}}
		// }
	}

	getBidHistoryReport() {
		let token = this.auth.getTokenValue();
		let id = this.auctionID + '?token=' + token;
		this.bidService.getBidHistoryExcel(id).subscribe(res => {
      this.common.success("Request raised for report generation");
    }, err => {this.common.error("Failed to raise request for report generation")})
	}

	onClickRoute() {
		this.routes.navigate([routerconfig.buyer_router_links.BUYER_LIST_VIEW], { queryParams: { status: this.route.snapshot.params.breadCrumbStatus } });
	}

	oncli() {
		this.common.buyerRedirectLanding();
  }

  checkReportStatus() {
    let sendData = {
      flag: 'openAttach',
      pageFrom: 'reportstatus',
    }
    this.common.toggleDiv.emit(sendData);
  }

}
