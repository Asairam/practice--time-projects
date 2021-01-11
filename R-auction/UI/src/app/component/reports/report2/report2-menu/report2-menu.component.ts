import { Component, Inject} from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	templateUrl: './report2-menu.component.html',
})
export class Report2MenuComponent {
	dialogMessage = "";
	dialogContent: any;
	dialogPositiveBtn = "Yes";
	dialogNegativeBtn = 'No';
	selectAllHeaderFlag: boolean = false;
	selectAllItemFlag: boolean = false;
	tab = '';

	constructor(
		public dialog: MatDialog, 
		public MatDialogRef: MatDialogRef<Report2MenuComponent>, 
		@Inject(MAT_DIALOG_DATA) data){
			this.dialogMessage = data.dialogMessage;
			this.dialogPositiveBtn = data.dialogPositiveBtn;
			this.dialogNegativeBtn = data.dialogNegativeBtn;
			this.dialogContent = data.dialogContent;
			this.tab = data.tab;
	}

	onPositiveBtn() {    
		this.MatDialogRef.close(true);
	}

	onNegativeBtn() {
		this.MatDialogRef.close(false);
	}

	camelToTitle = (camelCase) => camelCase
		.replace(/([A-Z])/g, (match) => ` ${match}`)
		.replace(/^./, (match) => match.toUpperCase())
		.trim();


	get selectAllHeaderFlag1() {
		let val = true;
		this.dialogContent.forEach(ele => {
		if(!ele.selected) val = false;
		})
		this.selectAllHeaderFlag  = val;
		return this.selectAllHeaderFlag;
	}
	
	selectAllHeader(val) {
		this.selectAllHeaderFlag = val.checked;
		this.dialogContent.forEach(ele => {
		ele.selected = val.checked;
		})
	}
	selectHeader(val, item) {
		if(!val.checked) this.selectAllHeaderFlag = false;
		item.selected = val.checked;
	}

	get selectAllItemFlag1() {
		let val = true;
		this.dialogContent.itemColumnNames.forEach(ele => {
		if(!ele.selected) val = false;
		})
		this.selectAllItemFlag  = val;
		return this.selectAllItemFlag;
	}
	
	selectAllItem(val) {
		this.selectAllItemFlag = val.checked;
		this.dialogContent.itemColumnNames.forEach(ele => {
		ele.selected = val.checked;
		})
	}

	selectItem(val, item) {
		if(!val.checked) this.selectAllItemFlag = false;
		item.selected = val.checked;
	}


}
