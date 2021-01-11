import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'mmcs',
	templateUrl: './mmcs.component.html',
	styleUrls: ['./mmcs.component.css']
})
export class MmcsComponent implements OnInit, OnDestroy {

	auctionReadOnly: boolean = false;
	componentActive: boolean = true;

	@Input() showSearch: boolean;
	searchResult: any = [];
	selectedVal: any;
	searchTerm = '';
	allChecked: boolean = false;
	@Output() itemSearched: EventEmitter<any> = new EventEmitter();

	constructor(
		private store: Store<fromEditModule.EditModuleState>,
		public buyerService?: BuyerEditService
		) { }

	ngOnInit() {
		this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionReadOnly => {
			this.auctionReadOnly = auctionReadOnly;
		});
	}

	searchMmcs() {
		this.itemSearched.emit({searchEnabled: true});
		if(!this.searchTerm) return;
		this.allChecked = false;
		this.buyerService.getMaterialDetails(this.searchTerm).subscribe((res: any) => {   
			this.searchResult = res.data.result;
			this.searchResult.forEach(element => {
				element.fromMMCS = true;
			});
			this.itemSearched.emit({searchEnabled: true, searchResult: this.searchResult});
		})
	}

	selectAll() {
		let val = this.allChecked ? true : false;
		this.searchResult.forEach(ele => {
		  ele.checked = val;
		});
		this.checkForCheckbox();
	}

	selectOne(stateObj, index) {
		this.searchResult[index].checked = stateObj.checked;
		this.checkForCheckbox();
	}

	checkForCheckbox() {    
		let allChecked = true;
		this.selectedVal = [];
		this.searchResult.forEach(ele => {
		  if(!ele.checked) {
			allChecked = false;
		  } else {
			this.selectedVal.push(ele);
		  }
		})
		this.allChecked = allChecked;
		this.itemSearched.emit(
			{searchEnabled: true, searchResult: this.searchResult, selectedVal:this.selectedVal}
		);
	}

	ngOnDestroy() {
		this.componentActive = false;
	}
}
