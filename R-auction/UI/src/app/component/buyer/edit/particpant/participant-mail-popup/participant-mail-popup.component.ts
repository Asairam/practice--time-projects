import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
@Component({
	selector: 'participant-mail-popup',
	templateUrl: './participant-mail-popup.component.html',
	styleUrls: ['./participant-mail-popup.component.css']
})
export class ParticipantMailPopupComponent implements OnInit {

	dialogMessage: any;
	dialogPositiveBtn: any;
	@Input() supplierList=[];
	@Input() readOnly;
	selectAllFlag: boolean = true;

    constructor(
        public dialog: MatDialog, public MatDialogRef: MatDialogRef<ParticipantMailPopupComponent>,
        @Inject(MAT_DIALOG_DATA) { ...data }) {
			// this.dialogMessage = data.dialogMessage;
			// this.dialogPositiveBtn = data.dialogPositiveBtn;
			// this.supplierList = data.dialogContent
    }

    ngOnInit() {
		let val = {checked:true}
		this.selectAllSupplier(val);
	}
	
	onPositiveBtn() {
		this.MatDialogRef.close("closed");
	}

	selectSupplier($event, supplier) {
		if(!$event.checked) this.selectAllFlag = false;
		supplier.selected = $event.checked;
		let allselected = true;
			this.supplierList.forEach(ele => {
				if(!ele.selected) {
					allselected = false;
				}
			})
		this.selectAllFlag = allselected;
		
	}

	selectAllSupplier(val) {
		this.selectAllFlag = val.checked;
		this.supplierList.forEach(ele => {
			ele.selected = val.checked;
		})
	}
	

}
