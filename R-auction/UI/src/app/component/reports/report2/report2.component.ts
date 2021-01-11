import { Component, OnInit, Input } from '@angular/core';
import { BuyerBiddingService } from '../../../component/component-service/buyer-bidding.service';
import { Report2Service } from './report2.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CommonService } from '../../../commonService/common.service';
import { reportAnimation } from '../animation';
import { ActivatedRoute } from '@angular/router';
import { BuyerEditService } from '../../component-service/buyer-edit.service';

@Component({
	selector: 'app-report2',
	providers: [Report2Service],
	templateUrl: './report2.component.html',
	styleUrls: ['./report2.component.css'],
	animations: [reportAnimation]
})
export class Report2Component implements OnInit {

	@Input() auctionID: any;
	itemRawDataList: any;
	downButt: boolean = false;
	headerList: any = [];
	selectedHeaders: any = [];
	headerValues: any = [];
	itemColumnNames: any = [];
	supplierColumnNames: any = [];
	supplierSubColumnNames: any = [
		// { fieldName: "preliminaryBid", selected: false },
		// { fieldName: "initialBid", selected: false },
		{ fieldName: "lastBid", selected: true },
	]
	custColNames: any = [];

	constructor(
		public r2Service: Report2Service,
		private bidService: BuyerBiddingService,
		private loader: LoaderService,
		private common: CommonService,
		public route: ActivatedRoute,
		public buyerService: BuyerEditService,
	) { }

	ngOnInit() {
		this.getAuctionData().then((result: any) => {
			this.getRawBidInfo(result["data"].rawDataColumns);
			this.getAuctionHeaders().then((res: any) => {
				let rawDataColumns = result["data"].rawDataColumns;
				if(rawDataColumns && rawDataColumns.header && rawDataColumns.header.length>0) {
					res.forEach(outerElem => {
						rawDataColumns.header.forEach(element => {
							if(outerElem.fieldName == element.name && !element.isCustom) {
								outerElem.selected = true;
							}
						});
					});
					this.showHeaderMenuData();
				}
			}).catch(err =>{ console.log('api failed')});
		}).catch(err =>{ console.log('api failed')})

	}

	getAuctionData() {
		return new Promise((resolve, reject) => {
			this.buyerService.getAuctionData(this.auctionID).subscribe((res: any) => {
			  resolve(res)
			}, (err) => {
			  reject()
			})
		})
	}

	get suppColSpan() {
		let colSpan = 0;
		this.supplierSubColumnNames.forEach((ele: any) => {
			if (ele.selected) colSpan++;
		})
		return colSpan;
	}
	getRawBidInfo(rawDataColumns) {
		this.bidService.getRawBid(this.auctionID).subscribe((res: any) => {
			this.itemRawDataList = res.data.items;
			let { itemNameList, customFieldNameList, suppliesFieldNameList } = this.r2Service.extractColNames(this.itemRawDataList);
			this.itemColumnNames = itemNameList;
			this.custColNames = customFieldNameList;
			if(rawDataColumns && rawDataColumns.item && rawDataColumns.item.length>0) {
				this.itemColumnNames.forEach(outerElem => {
					rawDataColumns.item.forEach(element => {
						if(outerElem.fieldName == element.name && !element.isCustom) {
							outerElem.selected = true;
						}
					});
				});
				this.custColNames.forEach(outerElem => {
					rawDataColumns.item.forEach(element => {
						if(outerElem.fieldName == element.name && element.isCustom) {
							outerElem.selected = true;
						}
					});
				});
			}
			this.supplierColumnNames = suppliesFieldNameList;
		}, (err) => {
		})
	}

	getAuctionHeaders() {
		return new Promise((resolve, reject) => {
			this.bidService.getAuctionHeaders().subscribe((res: any) => {
				this.headerList = this.r2Service.filterHeaderList(res.data);
				resolve(this.headerList);
			}, (err) => {
				reject()
			})
		})

	}

	showHeaderMenu() {
		this.r2Service.openHeaderMenu(this.headerList).subscribe((value) => {
			if (value) {
				this.showHeaderMenuData();
			}
		});
	}

	showHeaderMenuData() {
		this.selectedHeaders = [];
		for (let x = 0; x < this.headerList.length; x++) {
			if (this.headerList[x].selected) {
				this.selectedHeaders.push(this.headerList[x].fieldName);
			}
		}
		this.getRawBidHeader('?auctionHeader=' + this.selectedHeaders.join(","));
	}

	getRawBidHeader(data) {
		// this.common.loader = false;
		// this.loader.loading = true;
		this.bidService.getRawBid(this.auctionID, data).subscribe((res: any) => {
			// this.common.loader = true;
			// this.loader.loading = false;
			let tmp = [];
			this.selectedHeaders.forEach(element => {
				let field = this.r2Service.camelToTitle(element);
				let value = res.data[element];
				if (element == 'startDate' || element == 'endDate' || element == 'createdAt' || element == 'updatedAt') {
					value = this.r2Service.dateAndTime(res.data[element]);
				}
				tmp.push({ field: field, value: value });
			});
			this.headerValues = tmp;
		}, (err) => {
			// this.common.loader = true;
			// this.loader.loading = false;
		})
	}

	showItemMenu() {
		this.r2Service.openItemColumnsMenu(this.itemColumnNames, this.custColNames, this.supplierColumnNames, this.supplierSubColumnNames);
	}

	getExcelReport() {
		if (this.route.snapshot.params.breadCrumbStatus && this.route.snapshot.params.breadCrumbStatus.toLowerCase() === 'closed') {
			this.downButt = true;
			setTimeout(() => { this.downButt = false; }, 5000);
			let queryString = this.r2Service.getExcelQueryString(this.itemColumnNames, this.custColNames, this.selectedHeaders, this.supplierColumnNames);
			this.bidService.getRawBidReportExcel(this.auctionID, queryString).subscribe(res => {
        this.common.success("Request raised for report generation");
      }, err => {this.common.error("Failed to raise request for report generation")})
		} else {
			this.common.warning('Not Available');
		}
	}
}



