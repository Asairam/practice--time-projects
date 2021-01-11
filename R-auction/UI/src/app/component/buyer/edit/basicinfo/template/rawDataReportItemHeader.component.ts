import { Component, Inject} from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	templateUrl: './rawDataReportItemHeader.component.html',
})
export class RawDataReportItemHeaderComponent {
	dialogMessage = "";
	dialogContent: any;
	dialogPositiveBtn = "Yes";
	dialogNegativeBtn = 'No';
	selectAllHeaderFlag: boolean = false;
	selectAllItemFlag: boolean = false;
	tab = '';

	constructor(
		public dialog: MatDialog, 
		public MatDialogRef: MatDialogRef<RawDataReportItemHeaderComponent>, 
		@Inject(MAT_DIALOG_DATA) data){
			this.dialogMessage = data.dialogMessage;
			this.dialogPositiveBtn = data.dialogPositiveBtn;
			this.dialogNegativeBtn = data.dialogNegativeBtn;
			this.dialogContent = data.dialogContent;
			this.tab = data.tab;
	}

	positiveBtn() {
		this.MatDialogRef.close(true);
	}

	negativeBtn() {
		this.MatDialogRef.close(false);
	}

	camelToTitle = (camelCase) => camelCase
		.replace(/([A-Z])/g, (match) => ` ${match}`)
		.replace(/^./, (match) => match.toUpperCase())
		.trim();


	get selectAllHeaderFlag1() {
		let val = true;
		this.dialogContent.headerList.forEach(ele => {
		if(!ele.selected) val = false;
		})
		this.selectAllHeaderFlag  = val;
		return this.selectAllHeaderFlag;
	}
	
	allHeaderSelection(val) {
		this.selectAllHeaderFlag = val.checked;
		this.dialogContent.headerList.forEach(ele => {
			ele.selected = val.checked;
		})
	}
	pickHeader(val, item) {
		if(!val.checked) this.selectAllHeaderFlag = false;
		item.selected = val.checked;
	}

	get pickAllItemFlag1() {
		let val = true;
		this.dialogContent.itemColumnNames.forEach(ele => {
		if(!ele.selected) val = false;
		})
		this.selectAllItemFlag  = val;
		return this.selectAllItemFlag;
	}
	
	pickAllItem(val) {
		this.selectAllItemFlag = val.checked;
		this.dialogContent.itemColumnNames.forEach(ele => {
		ele.selected = val.checked;
		})
	}

	pickItem(val, item) {
		if(!val.checked) this.selectAllItemFlag = false;
		item.selected = val.checked;
	}

	allowedFields(item) {
		let val = true;
		switch(item.fieldName) {
			case 'itemName':
			case 'minimumDesiredQuantity':
			case 'unitOfMeasure':
			case 'itemCode':
				val = false;
				break;
			default:
				val = true;
		}
		return val
	}


}
