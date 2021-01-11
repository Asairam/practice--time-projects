import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {DecimalPipe} from '@angular/common';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'ITEM-CARD',
	templateUrl: './item-card.component.html',
})
export class ItemsCardsComponent implements OnInit, OnDestroy {

	auctionReadOnly: boolean = false;
	componentActive: boolean = true;

	@Input() item;
	@Input() index;
	@Input() buyerService;
	@Input() crud;
	aucStatus;
	@Input() itemService;
	@Input() customFieldList;
	@Input() common; 
	@Input() commonheader;
	@Input() translateSer;
	OBS: any = [];

	constructor(
		private _decimalPipe: DecimalPipe,
		private store: Store<fromEditModule.EditModuleState>
	){}

	ngOnInit() {		
		this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionReadOnly => {
			this.auctionReadOnly = auctionReadOnly;
		});
		this.store.pipe(select(fromEditModule.getAuctionStatus),takeWhile(() => this.componentActive))
		.subscribe(auctionStatus => {
			if( auctionStatus == 'suspended') {
				console.log('suspended');
			}
			if(auctionStatus == 'published') {
				console.log('published');
			}
			if(auctionStatus == 'paused') {
				console.log('paused');
			}
			if(auctionStatus == 'draft') {
				console.log('draft');
			}
			this.aucStatus = auctionStatus;
		});
	}

	selectCard(eve) {
		this.item['checked'] = eve;
	}

	seleDrop(butt, item, index) {
		this.itemService.crudFun(this.crud, this.aucStatus);
		if (butt.toLowerCase() === 'attachmentlist' || butt.toLowerCase() === 'edit') {
			let sendData = {
				flag: 'openAttach',
				pageFrom: 'item',
				data: { 'type': 'update', data: item, itemInd: index, 'aucStatus': this.aucStatus, 'pageFrom': !this.common.auctionLeader.host ? '' : 'readonly' },
				auctionID: this.buyerService.auctionData.auctionID,
				customFieldList: this.customFieldList,
				selectedInd: butt.toLowerCase() === 'attachmentlist' ? 1 : 0
			}
			this.common.toggleDiv.emit(sendData);
		} else {
			try {
				this.OBS[this.OBS.length] = this.itemService.confirmationMsg(this.commonheader['PLZ_CON'], this.translateSer['REMOVE_ITEM'], item.itemName).subscribe((value) => {
					if (value) {
						if (!this.buyerService.itemDetails[index]['itemID']) {
							this.buyerService.itemDetails.splice(index, 1);
							this.common.success(item.itemName + ' ' + this.commonheader['DELE_SUCC']);
						} else {
							// this.common.loader = true;
							const deleteItem = {
								'itemID': [item.itemID],
								'auctionID': this.buyerService.auctionData.auctionID
							};
							this.OBS[this.OBS.length] = this.buyerService.itemRemove(deleteItem).subscribe((res) => {
								// this.common.loader = false;
								this.buyerService.itemDetails.splice(index, 1);
								this.common.success(item.itemName + ' ' + this.commonheader['DELE_SUCC']);
							}, (err) => {
								this.common.loader = false;
							})
						}
					}
				});
			} catch (e) {
				console.log("Some error occured")
			}
		}
	}

	ngOnDestroy() {
		this.OBS.forEach(obs => {
			obs.unsubscribe();
		});
		this.componentActive = false;
	}

	formatDigits(val) {
		if(!val) return "NA";
		// let thousandCrore = 10000000000;
		// let oneCrore = 10000000;
		// let oneLakh = 100000;
		let x = Number(val);
		// if(x > thousandCrore) {
		// 	return (x / thousandCrore).toFixed(2) + 'K Cr';
		// }
		// if(x > oneCrore) {
		// 	return (x / oneCrore).toFixed(2) + ' Cr';
		// }
		// if(x > oneLakh) {
		// 	return (x / oneLakh).toFixed(2) + ' Lakhs';
		// }
		return this._decimalPipe.transform(x.toFixed(2),"0.0-2");
	}
}