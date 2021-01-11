import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BuyerEditService } from '../../../component-service/buyer-edit.service';
import { CommonService } from '../../../../commonService/common.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from '../../../../shared/component/view-popup/view-popup.component';
import * as config from '../../../../appConfig/app.config';
/** NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'CUSTOM-FIELD-HOLDER',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.css']
})
export class CustomFieldComponent implements OnInit, OnDestroy {

	auctionReadOnly: boolean = false;
	componentActive: boolean = true;
	aucStatus;
	@Output() onNewCustomList = new EventEmitter<any>();
	commonheader: any;
	translateSer: any;
	customFieldList = [];	
	customFilter = config.filterCustomField;
	sorting = false;
	selectFilter = config.filterCustomField[0].value;
	constructor( 
		private buyerService: BuyerEditService,
		public common: CommonService,
		private MatDialog: MatDialog,
		private store: Store<fromEditModule.EditModuleState>
	) { }

	ngOnInit() {
		this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionReadOnly => {
			this.auctionReadOnly = auctionReadOnly;
		})

		this.store.pipe(select(fromEditModule.getAuctionStatus), 
			takeWhile(() => this.componentActive)).subscribe(auctionStatus => {
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
		
		this.common.translateSer('ITEM_MSG').subscribe(async (text: string) => {
			this.translateSer = text;
		});	
		this.common.translateSer('COMMON').subscribe(async (text: string) => {
			this.commonheader = text;
		});
		this.getCustomFieldList();
		this.buyerService.getCustomFieldObservable().subscribe((data) => {			
			this.getCustomFieldList();
		})
	}

	getCustomFieldList() {
		if(this.buyerService.auctionData.auctionID) {			
			this.buyerService.getCustomFieldList(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
				this.customFieldList = res.data.sort((a, b) => {
					return a._id - b._id;
				});
				this.onNewCustomList.next(this.customFieldList);
			})
		}
	}

	createCustom(customObj=null, viewOnly=null) {
		let sendData = {
		  flag: 'openAttach',
		  pageFrom: 'customField',
		  data: { 'type': 'create', 'aucStatus': this.buyerService.auctionData.auctionStatus, data: { 'attachmentList': [] } },
		  auctionID: this.buyerService.auctionData.auctionID,
		  customFieldObj: customObj,
		  customFieldList: this.customFieldList
		}
		if(viewOnly) sendData.customFieldObj = Object.assign({}, customObj, {viewOnly : true});
		this.common.toggleDiv.emit(sendData);
	}

	deleteCustom(customFieldObj) {
		const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-xs';
        objMatDialogConfig.data = {
          dialogMessage: this.commonheader['PLZ_CON'],
          dialogContent: this.translateSer['REMOVE_ITEM'] + '<b>' + customFieldObj.fieldName + '</b>',
          tab: 'confirm_msg',
          dialogPositiveBtn: "Yes",
          dialogNegativeBtn: "No"
		}
		objMatDialogConfig.disableClose = true;
        let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
			if (value) {				
				let sendData = {
					auctionID: this.buyerService.auctionData.auctionID,
					customFieldID: customFieldObj.customFieldID
				}
				this.buyerService.deleteCustomFieldData(sendData).subscribe(res => {					
					this.getCustomFieldList();
					this.common.success(customFieldObj.fieldName + ' ' + this.commonheader['DELE_SUCC']);
					this.buyerService.setCustomFieldObservable('success-delete');
				})
			}
		});
	}

	customSorting(sort = 0) {
		let selectedField = this.customFilter.find(x => x.value == this.selectFilter);
		if (selectedField.id) {
		  if (sort < 2) {
			  if(sort == 0) {
				this.sorting = false;
			  } else {
				this.sorting = true;
			  }
		  }
		  config.sorting(this.customFieldList , selectedField.id, this.sorting ? 'descending' : 'ascending');
		}
	}

	ngOnDestroy() {
		this.componentActive = false;
	}
}
