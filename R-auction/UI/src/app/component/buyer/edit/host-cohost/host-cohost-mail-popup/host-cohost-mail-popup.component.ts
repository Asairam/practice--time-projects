import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'host-cohost-mail-popup',
	templateUrl: './host-cohost-mail-popup.component.html',
	styleUrls: ['./host-cohost-mail-popup.component.css']
})
export class HostCohostMailPopupComponent implements OnInit {

	dialogMessage: any;
	dialogPositiveBtn: any;
	@Input() cohostList=[];
	@Input() readOnly;
	selectAllFlag: boolean = true;

    constructor(
            public dialog: MatDialog, 
            public MatDialogRef: MatDialogRef<HostCohostMailPopupComponent>,
            @Inject(MAT_DIALOG_DATA) { ...data }
        ) {
			// this.dialogMessage = data.dialogMessage;
			// this.dialogPositiveBtn = data.dialogPositiveBtn;
			// this.cohostList = data.dialogContent;
    }

    ngOnInit() {
		let val = {checked:true}
		this.selectAllCohost(val);
	}
	
	onPositiveBtn() {
		this.MatDialogRef.close("closed");
	}

	selectCohost($event, coHost) {
		if(!$event.checked) this.selectAllFlag = false;
		coHost.selected = $event.checked;
		let allselected = true;
			this.cohostList.forEach(ele => {
				if(!ele.selected) {
					allselected = false;
				}
			})
		this.selectAllFlag = allselected;
	}

	selectAllCohost(val) {
		this.selectAllFlag = val.checked;
		this.cohostList.forEach(ele => {
			ele.selected = val.checked;
		})
	}
	

}
