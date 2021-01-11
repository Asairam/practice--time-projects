import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './take-lead-popup.component.html',
  styleUrls: ['./take-lead-popup.component.css']
})
export class TakeLeadPopupComponent {

	dialogMessage = "";
	dialogContent: any;
	dialogPositiveBtn = "Yes";
	dialogNegativeBtn = 'No';

	constructor(
		public dialog: MatDialog, 
		public MatDialogRef: MatDialogRef<TakeLeadPopupComponent>, 
		@Inject(MAT_DIALOG_DATA) data){
			this.dialogMessage = data.dialogMessage;
			this.dialogPositiveBtn = data.dialogPositiveBtn;
			this.dialogNegativeBtn = data.dialogNegativeBtn;
			this.dialogContent = data.dialogContent;
	}

	onPositiveBtn() {    
		this.MatDialogRef.close(true);
	}

	onNegativeBtn() {
		this.MatDialogRef.close(false);
	}


}
