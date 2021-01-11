import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonService } from '../../../../../commonService/common.service';
import { AttachDocumentComponent } from '../../../../../shared/component/attach-document/attach-document.component';
import { ItemPopupComponent } from '../item-popup/item-popup.component';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';

@Component({
  selector: 'app-item-popup-holder',
  templateUrl: './item-popup-holder.component.html',
  styleUrls: ['./item-popup-holder.component.css']
})
export class ItemPopupHolderComponent implements OnInit {

	fullReset:boolean = false;
	formObj;
	@ViewChild(AttachDocumentComponent) childAttach: AttachDocumentComponent;
	@ViewChild(ItemPopupComponent) childItem: ItemPopupComponent;
	@Input() selectedIndex;
	@Input() drawerData;	
	@Input() auctionId;
	viewData: any;
	attachTabDisabled:boolean = false;
	showSelected:boolean = false;
	finalSelected: boolean = false
	tab:number = 0;
	index: number = 0;
	sapcode:any;
	selectedMMCSArr: any = []
	column: any;
	constructor(
		public common: CommonService, 
		public buyerService: BuyerEditService
	) { }

	ngOnInit() {
		this.attachTabDisabled = true;
		this.viewData = this.drawerData.data;
		this.tab = this.selectedIndex;
		this.common.translateSer('ITEM_COLOUM').subscribe(async (text: string) => {
			this.column = text;
		});
	}

	selectedMMCS(obj) {
		this.index = 0;
		this.selectedMMCSArr = obj.val;
		this.showSelected = obj.showSelection;
		this.finalSelected = obj.final;
	}
	
	tabindexChanged(evt) {
		this.tab = evt.index;
		if(this.selectedMMCSArr.length > 0) {
			this.sapcode = this.selectedMMCSArr[this.index].sapcode;
		}
	}
	nextAddition(evt) {
		this.viewData.data.attachmentList = [];
		this.index++;
		this.childItem.addNextFromParentComp(this.selectedMMCSArr[this.index]);
		if(!this.selectedMMCSArr[this.index]) this.selectedMMCSArr = []
		// if(this.index == this.selectedMMCSArr.length) this.index = this.selectedMMCSArr.length-1;
	}

	onMMCSSearchEnabled(obj) {
		this.attachTabDisabled = obj.attachTabDisabled;
	}

	changeTab() {
		this.selectedIndex = 0
	}

	enableAttachFetch(eve) {
		this.selectedMMCSArr = [eve];
		this.sapcode = eve.sapcode;
	}

	saveDisabled(val) {
		this.attachTabDisabled = val.disabled;
		this.formObj = val.formObj;
	}

	reset(val) {
		this.attachTabDisabled = true;
		this.selectedMMCSArr = [];
		this.formObj = null;
		if(this.viewData && this.viewData.data) {
			this.viewData.data.attachmentList = [];
		}
		this.fullReset = true;
		setTimeout(() => {
			this.fullReset = false;
		}, 700);
	}
	

}
