import { Component, Inject} from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	templateUrl: './republish-question.component.html',
})
export class RepublishQuestionComponent {
	dialogMessage = "";
	dialogContent: any;
	dialogPositiveBtn = "Yes";
	dialogNegativeBtn = 'No';
	selectAllHeaderFlag: boolean = false;
	selectAllItemFlag: boolean = false;
	tab = '';

	constructor(
		public dialog: MatDialog, 
		public MatDialogRef: MatDialogRef<RepublishQuestionComponent>, 
		@Inject(MAT_DIALOG_DATA) data){
			this.dialogMessage = data.dialogMessage;
			this.dialogPositiveBtn = data.dialogPositiveBtn;
			this.dialogNegativeBtn = data.dialogNegativeBtn;
			this.dialogContent = data.dialogContent;
			this.tab = data.tab;
	}

	onPositiveReply() {    
		this.MatDialogRef.close('yes');
	}

	onNegativeReply() {
		this.MatDialogRef.close('no');
	}

}
