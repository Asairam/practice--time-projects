import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'LIST-ITEM',
	templateUrl: './list-item.component.html',
})
export class ListItemComponent implements OnInit, OnDestroy {

	auctionReadOnly3: boolean = false;
	componentActive1: boolean = true;

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
	@Input() itemcoloum;

	constructor(
		private _decimalPipe1:DecimalPipe,
		private store1: Store<fromEditModule.EditModuleState>
	){}

	ngOnInit() {		
		this.store1.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive1) )
		.subscribe(auctionReadOnly => {
			this.auctionReadOnly3 = auctionReadOnly;
		});
		this.store1.pipe(select(fromEditModule.getAuctionStatus),takeWhile(() => this.componentActive1))
		.subscribe(auctionStatus1 => {
			if( auctionStatus1 == 'suspended') {
				console.log('suspended');
			}
			if(auctionStatus1 == 'published') {
				console.log('published');
			}
			if(auctionStatus1 == 'paused') {
				console.log('paused');
			}
			if(auctionStatus1 == 'draft') {
				console.log('draft');
			}
			this.aucStatus = auctionStatus1;
		});
	}
	
	selectCard(eve) {
		this.item['checked'] = eve;
	}

	formatDigits(val2) {
		if(!val2) return "NA";
		let x = Number(val2);
			return this._decimalPipe1.transform(x.toFixed(2),"0.0-2");
	}

	seleDrop(butt, item, index) {
		this.itemService.crudFun(this.crud, this.aucStatus);
		if (butt.toLowerCase() === 'attachmentlist' || butt.toLowerCase() === 'edit') {
			let sendData = {
				flag: 'openAttach',
				pageFrom: 'item',
				data: { 
					type: 'update', 
					data: item, 
					itemInd: index, 
					aucStatus: 
					this.aucStatus, 
					pageFrom: !this.common.auctionLeader.host ? '' : 'readonly' 
				},
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
		this.componentActive1 = false;
	}
}