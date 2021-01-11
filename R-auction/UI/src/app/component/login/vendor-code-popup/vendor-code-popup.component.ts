import { Component, Inject} from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	templateUrl: './vendor-code-popup.component.html',
	styleUrls: ['./vendor-code-popup.component.css']
})
export class VendorCodePopupComponent {
	dialogMessage;
	dialogPositiveBtn = "Yes";
	// dialogNegativeBtn = 'No';
	// tab = '';
	dialogContent;
    vendorcodeList = [];

	constructor(
		public dialog: MatDialog, 
		public MatDialogRef: MatDialogRef<VendorCodePopupComponent>, 
		@Inject(MAT_DIALOG_DATA) data){
			this.dialogPositiveBtn = data.dialogPositiveBtn;
			this.dialogContent = data.dialogContent;
			this.dialogContent.vendorcodeList.forEach(element => {
				this.vendorcodeList.push({type: 'vendor', data: element})
			});
			this.dialogContent.customerDetailList.forEach(element => {
				this.vendorcodeList.push({type: 'customer', data: element})
			});
			let vendorOrCustomer = 'Customer';
			if(this.dialogContent.vendorcodeList.length >0) vendorOrCustomer = 'Vendor';
			if(this.dialogContent.customerDetailList.length > 0 && this.dialogContent.vendorcodeList.length > 0) vendorOrCustomer = 'Vendor/Customer';
			
			this.dialogMessage = `Select a ${ vendorOrCustomer} code to continue`;
            this.vendorcodeList[0].selectedVendorcode = "true";
	}

	onPositiveBtn() {
		let finalVendorCodeSelected = this.vendorcodeList.find(ele => ele.selectedVendorcode);
		this.MatDialogRef.close(finalVendorCodeSelected.data);
	}

	selectionChanged(val, i) {
		let index = i;
		this.vendorcodeList.forEach((element, index2) => {
			if(index != index2)
			element.selectedVendorcode = '';
		})		
	}

	isUnregestered(val) {
		if(val.toString().length>12) {
			return true;
		} else {
			return false;
		}
	}

	// onNegativeBtn() {
	// 	this.MatDialogRef.close(false);
	// }

	
}
