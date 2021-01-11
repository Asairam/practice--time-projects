import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { SupplierService } from '../../../component-service/supplier.service';
import { SupplierbidhistoryService } from './supplier-bid-history.service';
import { CommonService } from 'src/app/commonService/common.service';
import { Subscription } from 'rxjs';
import * as config from '../../../../appConfig/app.config';
/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromSupplierBiddingModule from '../../supplier-bidding/state/supplier-bidding.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'app-supplier-bid-history',
	providers: [SupplierbidhistoryService],
	templateUrl: './supplier-bid-history.component.html',
	styleUrls: ['./supplier-bid-history.component.css']
})
export class SupplierBidHistoryComponent implements OnInit, OnDestroy {

	additionMultiplicationFactor = false;
	componentActive: boolean = true;
	polling2: any;
	@Output() headerApiRef1: EventEmitter<String> = new EventEmitter<String>();
	@Output() sendSocketData1: EventEmitter<String> = new EventEmitter<String>();
	@Output() sendAuctionData: EventEmitter<String> = new EventEmitter<String>();
	@Output() aucCloseShowPopup1: EventEmitter<String> = new EventEmitter<String>();
	auctionStatusList = config.AUCTIONSTATUS;
	@Input() auctionID;
	@Input() exchangeRate: any;
	// @Input() currencyDecimalPlace: any;
	// @Input() auctionData = null;
	currDeciPlac: string = ''
	bidhistorylist = [];
	timeSocket: Subscription;
	timeSocket1: Subscription;
	livesub: Subscription;
	@Input() socketendpoint;
	socketData: any;
	aucData: any;
	auctionData: any;
	constructor(
		private supplierService: SupplierService,
		private sbhService: SupplierbidhistoryService,
		private commonservice: CommonService,
		private store: Store<fromSupplierBiddingModule.SupplierBiddingModuleState>
	) {
	}

	ngOnInit() {
		this.store.pipe(select(fromSupplierBiddingModule.getAuctionDetails), 
			takeWhile(() => this.componentActive)).subscribe(auctionDetails => {
				if(auctionDetails) {
					if(auctionDetails.biddingCurrency) {
						this.exchangeRate = auctionDetails.biddingCurrency.exchangeRate;						
						this.getBidHistory();
					}
					this.additionMultiplicationFactor = auctionDetails.additionMultiplicationFactor;
				}
		});
		this.getDetails();
		this.getBidHistory();
		this.getsocketdata2();
	}
	getBidHistory() {
		this.timeSocket = this.supplierService.getBidHistory(this.auctionID).subscribe((res) => {
			let { filteredList } = this.sbhService.getFormatedOutput(res['data'], this.exchangeRate);
			this.bidhistorylist = filteredList;
		}, (err) => { });
	}

	autoRefreshApi() {
		// Observable.timer(0, 6000)
		// 	.takeWhile(() => this.alive)
		// 	.subscribe(() => {
		// 		this.commonservice.loader = false;
		// 		if (this.commonservice.internetConn) {
		// 			this.getBidHistory();
		// 		}
		// 	});
		this.polling2 = setInterval(() => {
			this.commonservice.loader = false;
			if (this.commonservice.internetConn) {
				this.headerApiRef1.emit();
				this.getBidHistory();
			}
		}, 6000);
	}

	getsocketdata2() {
		this.timeSocket1 = this.socketendpoint.subscribe(data => {
			this.socketData = data;
			this.socketData.supplierStatus = this.aucData.supplierStatus;
			if (this.socketData.status == this.auctionStatusList.CO) {
				this.aucCloseShowPopup1.emit(null);
				this.socketData.seconds = 0;
			} else {
				this.socketData.seconds = this.socketData.seconds - 0.001;
			}
			let sendData = JSON.stringify({ socketData: this.socketData, participate: null, status: this.socketData.supplierStatus, items: [] });
			this.sendSocketData1.emit(sendData);
			clearInterval(this.polling2);
			if (this.socketData.status == this.auctionStatusList.OP) {
				this.autoRefreshApi();
			}
		});
	}

	getDetails() {
		this.livesub = this.supplierService.getLiveBidDetails(this.auctionID).subscribe((res: any) => {
			this.sendAuctionData.emit(res['data']);
			this.aucData = res['data'];
			this.auctionData = res['data'];
			this.socketData = { ...res.data };
			this.currDeciPlac = '.' + this.aucData.currencyDecimalPlace + '-' + this.aucData.currencyDecimalPlace;
			let minutes = config.dateTimeFilter(new Date(this.socketData.startDate), new Date(this.socketData.currentDate)).minutes;

			if (this.aucData.status == this.auctionStatusList.OP) {
				this.autoRefreshApi();
			}
			if (this.socketData.status == this.auctionStatusList.CO) {
				this.socketData.seconds = 0;
			} else if (this.socketData.status === this.auctionStatusList.PA) {
				this.socketData.seconds = this.supplierService.socketDateFil(this.socketData);
			} else if (this.socketData.status == this.auctionStatusList.PB && minutes > 0 && minutes <= 10) {
				this.socketData.seconds = 0;
				this.socketData.status = this.auctionStatusList.PD;
			}
			let sendData = JSON.stringify({ socketData: this.socketData, participate: null, status: this.socketData.supplierStatus, items: [] });
			this.sendSocketData1.emit(sendData);
		});
	}


	ngOnDestroy() {
		this.componentActive = false;
		try {
			clearInterval(this.polling2);
			if (this.timeSocket) {
				this.timeSocket.unsubscribe();
			}
			this.timeSocket1.unsubscribe();
			this.livesub.unsubscribe();
			this.commonservice.loader = true;
		} catch (e) { }
	}
}
