import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from '../../../../commonService/common.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { Subject } from 'rxjs';
import * as config from '../../../../appConfig/app.config';
import 'rxjs/add/operator/takeUntil';
import { BuyerBiddingService } from 'src/app/component/component-service/buyer-bidding.service';
import { BuyerEditService } from '../../../../component/component-service/buyer-edit.service';
import * as api from '../../../../../environments/environment';
import { SummaryService } from './summary.service';
import { summaryAnimations } from './summary.animation';
import { SocketService } from '../../../socketService/socket.service';
import { BuyItemPopupViewOnlyComponent } from '../buy-item-popup-view-only/buy-item-popup-view-only.component';

@Component({
	selector: 'app-item-view',
	templateUrl: './item-view.component.html',
	styleUrls: ['./item-view.component.css'],
	providers: [SummaryService],
	animations: [summaryAnimations]
})
export class ItemViewComponent implements OnInit {

	decimalPlace = 0;
	exchangeRate = {};
	@Input() issealedBidDis1 = false;
	@Input() viewFlag: string;
	OBS = [];
	@Input() selectedSavings: any;
	bidList = [];
	animationMap = new Map();
	@Output() sendAuctionData: EventEmitter<any> = new EventEmitter<any>();
	@Input() auctionID: number;
	itemSource = [];
	index: any;
	itemSocketData: any = null;
	view = !this.common.isMobile ? "list" : 'card';
	@Input() select_sav_bid = 0;
	columnsPopup = false;
	typeView = false;
	itemListData = [];
	imageURL = api.environment.rauction;
	destroySubcriptions$: Subject<boolean> = new Subject<boolean>();
	buyer_savings_drop = config.BUYER_SAVINGS;
	@Input() auctionData = null;
	type;
	customfieldList: any = [];
	constructor(
		public bidService: BuyerBiddingService,
		public common: CommonService,
		private MatDialog: MatDialog,
		public buyerService: BuyerEditService,
		private sService: SummaryService,
		private socketService: SocketService
	) { }

	ngOnInit() {
		this.auctionData.currency.forEach(curObj => {
			this.exchangeRate[curObj.currencyCode] = curObj.exchangeRate;
		});
		this.decimalPlace = this.auctionData.currencyDecimalPlace;
		this.initalizeSocket();
		this.subscribeSavingsDropdown();
		this.getCustomFields()
			.then((result) => {
				this.customfieldList = result;
				return this.getItemBidDetails();
			})
			.then(result => {
				this.getdetails(result);
			}).catch(ex => {
				this.common.error(ex);
				this.common.loader = false;
			})
	}

	initalizeSocket() {
		let socketObs = this.socketService.getBidSocketData(this.auctionID, 'buyer').subscribe(data => {
			if (this.viewFlag == "item") {
				let lotList = this.processing1(data[0]);

				let itemlist = this.processing2(lotList);
				let newBid = this.getNewBid(itemlist);

				let oldIndex = this.bidList.findIndex((element) => element.itemID == newBid.itemID);
				// this.buyersavingsFun();
				let calculatedBid = this.sService.calculateAndSortBid([newBid], this.selectedSavings, this.auctionData, this.buyer_savings_drop)[0];
				this.insertAndAnimate(this.bidList, calculatedBid, oldIndex);
				this.itemListData = lotList;
				this.itemSource = itemlist;
				this.common.playAudio();
			}
		})
		this.OBS.push(socketObs)
	}

	subscribeSavingsDropdown() {
		this.bidService.savingTypeObs.subscribe(res => {
			this.selectedSavings = res;
			// this.buyersavingsFun();
			if (this.bidList.length == 0) {
				this.bidList = this.sService.calculateAndSortBid(this.itemSource, this.selectedSavings, this.auctionData, this.buyer_savings_drop);
			} else {
				this.bidList = this.sService.calculateAndSortBid(this.bidList, this.selectedSavings, this.auctionData, this.buyer_savings_drop);
			}
		})
	}

	getItemBidDetails() {
		return new Promise((resolve, reject) => {
			let getapiitem = this.bidService.getItemBidDetails(this.auctionID).takeUntil(this.destroySubcriptions$).subscribe((res) => {
				resolve(res['data'][0]);
			}, (err) => {
				reject(err);
			});
			this.OBS.push(getapiitem);
		})
	}

	processing1(data: any) {
		let lotList = [];
		lotList = data.lots.filter((obj) => {
			return obj.items.length > 0;
		});
		this.bidService.summaryList = [...lotList];
		this.sendAuctionData.emit(data);
		this.type = data['type'];
		lotList.forEach(lot => {
			lot.items.forEach(bid => {
				bid.customFieldData.forEach(customFie => {
					bid[customFie.name] = customFie.value
				});
		    });
	    });
		return lotList;
	}

	processing2(lotList) {
		let itemList = []
		lotList.forEach(lot => {
			lot.items.forEach(bid => {
				this.sService.setNewProperties(bid, lot, this.auctionData);
			});
			itemList = itemList.concat(lot.items);
		});
		return itemList;
	}

	getNewBid(itemlist) {
		return itemlist.find(item => item.newBid);
	}

	getAnimateIndex(bid) {
		let { oldIndex, newIndex } = this.animationMap.get(bid.itemID);
		if (oldIndex == newIndex) {
			return { value: 'up', params: { index: 0 } }
		}
		if (oldIndex < newIndex) {
			return { value: 'down', params: { index: -1 * (32 * (newIndex - oldIndex)) } }
		}
		if (oldIndex > newIndex) {
			return { value: 'up', params: { index: (32 * (oldIndex - newIndex)) } }
		}
	}

	decideColor(obj) {
		if (obj.savingsPercentage == 'NA') return 'greyRow';
		if (obj.savingsPercentage <= 50) return 'redRow';
		if (obj.savingsPercentage > 50) return 'greenRow';
	}

	insertAndAnimate(bidList, calculatedBid, oldIndex) {
		let copyArr = bidList.slice();
		copyArr.splice(oldIndex, 1, calculatedBid);
		this.sService.sortBid(copyArr);
		let newIndex = copyArr.findIndex((element) => element.itemID == calculatedBid.itemID);
		let oldValueAtNewIndex = bidList[newIndex];
		let newIndexOfOldValue = copyArr.findIndex((element) => element.itemID == oldValueAtNewIndex.itemID);
		this.animationMap.set(calculatedBid.itemID, {
			oldIndex: oldIndex,
			newIndex: newIndex
		});
		this.animationMap.set(oldValueAtNewIndex.itemID, {
			oldIndex: newIndex,
			newIndex: newIndexOfOldValue
		});
		this.bidList = copyArr;
	}


	onclickItem(item) {
			if (!item.minimumChangeValue) {
				item.minimumChangeValue = this.auctionData.minBidChangeValue;
				item.minChangeType = this.auctionData.minBidChangeType;
			}
			const objMatDialogConfig = new MatDialogConfig();
			objMatDialogConfig.panelClass = 'dialog-lg';
			objMatDialogConfig.data = {
				data: {
					'selectedItem': item,
					'customfieldList': this.customfieldList
				},
			}
			objMatDialogConfig.disableClose = true;
			let refMatDialog = this.MatDialog.open(BuyItemPopupViewOnlyComponent, objMatDialogConfig);
			refMatDialog.afterClosed()
	}

	aucView() {
		try {
			const objMatDialogConfig = new MatDialogConfig();
			objMatDialogConfig.panelClass = 'dialog-lg';
			objMatDialogConfig.data = {
				dialogMessage: "Basic Info",
				tab: 'aucView',
				auctionID: this.auctionID
			}
			// objMatDialogConfig.width = "500px";
			// objMatDialogConfig.height = "250px";
			objMatDialogConfig.disableClose = true;
			let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
			refMatDialog.afterClosed().subscribe((value) => {
				console.log("popup closed ")
			});
		} catch (e) {

		}
	}

	switchView() {
		this.typeView = this.typeView ? false : true;
	}

	onclickLot(lot) {
		try {
			const objMatDialogConfig = new MatDialogConfig();
			objMatDialogConfig.panelClass = 'dialog-lg';
			objMatDialogConfig.data = {
				dialogMessage: "View Lot",
				tab: 'LotView',
				data: { 'data': lot, 'pageFrom': 'readonly' },
				auctionID: this.auctionID
			}
			objMatDialogConfig.disableClose = true;
			let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
			refMatDialog.afterClosed().subscribe((value) => {
				console.log("popup closed ")
			});
		} catch (e) {

		}
	}

	lotclick(ind) {
		this.itemListData.forEach((element, index) => {
			if (ind === index) {
				element.dis = element.dis ? false : true;
			}
		});
	}

	getCustomFields() {
		return new Promise((resolve, reject) => {
			if (this.auctionID) {
				this.buyerService.getCustomFieldList(this.auctionID).subscribe((res: any) => {
					let itemCustList = res.data.filter(cust => cust.displayLevel === "item");
					let customFieldList = itemCustList.sort((a, b) => {
						return a._id - b._id;
					});
					resolve(customFieldList);
				}, err => {
					reject();
				})
			} else {
				reject();
			}
		})
	}

	ngOnDestroy() {
		this.OBS.forEach(ele => {
			ele.unsubscribe();
		})
		try {
			this.destroySubcriptions$.next(true);
			// Now let's also unsubscribe from the subject itself:
			this.destroySubcriptions$.complete();
		} catch (e) {

		}
	}

	getdetails(result) {

		this.auctionData.decimalPlace = (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"];
		// this.getItemData(result);

		// this.buyersavingsFun();

		this.itemListData = this.processing1(result);
		this.itemSource = this.processing2(this.itemListData);

		let bidList = this.sService.calculateAndSortBid(this.itemSource, this.selectedSavings, this.auctionData, this.buyer_savings_drop);

		bidList.forEach((bid, index) => {
			this.animationMap.set(bid.itemID, {
				oldIndex: index,
				newIndex: index
			});
		})
		this.bidList = bidList;
	}

	autoRefreshItemBidDetails() {
		this.getItemBidDetails().then(result => {
			this.getdetails(result);
		}).catch(ex => {
			this.common.error(ex);
			this.common.loader = false;
		});
	}

	buyersavingsFun() {
		this.buyer_savings_drop[0]['totalValue'] = 0;
		this.buyer_savings_drop[1]['totalValue'] = 0;
		this.buyer_savings_drop[2]['totalValue'] = 0;
	}

	cardViewDisCol(field) {
		return this.common.cardViewDisCol(this.bidService.columnNames,field);
	}


}
