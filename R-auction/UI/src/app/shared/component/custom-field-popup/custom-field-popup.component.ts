import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../../commonService/common.service';
import { BuyerEditService } from '../../../component/component-service/buyer-edit.service'
import * as config from '../../../appConfig/app.config';

@Component({
  selector: 'custom-field-popup',
  templateUrl: './custom-field-popup.component.html',
  styleUrls: ['./custom-field-popup.component.css']
})
export class CustomFieldPopupComponent implements OnInit {
  
	@Input() auctionId: any;
	@Input() customFieldObj: any;
	@Input() customFieldList: any;
	createCustomFieldForm: FormGroup;
	typeOfField = [{val: 'string', name: 'String'}, {val: 'number', name: 'Number'}];
	typeOfDisplay = [
		// {val: 'header', name: 'Header'}, 
		{val: 'item', name: 'Item'}];
	visibility = config.customFieldVisibility;
	viewOnly: boolean = false;
	editObj: any;

	constructor(
		private formBuilder: FormBuilder,
		private common: CommonService, 
		private buyerService: BuyerEditService
	) { }

	ngOnInit() {
		this.viewOnly = this.customFieldObj && this.customFieldObj.viewOnly ? this.customFieldObj.viewOnly : false;
		this.formData(this.customFieldObj);
	}

	formData(editObj) {
		this.editObj = editObj;
		this.createCustomFieldForm = this.formBuilder.group({
			fieldName: [editObj && editObj.fieldName ? editObj.fieldName : '', Validators.required],
			dataType: [editObj && editObj.dataType ? editObj.dataType : 'string', Validators.required],
			displayLevel: [editObj && editObj.displayLevel ? editObj.displayLevel  : 'item', Validators.required],
			vendorLevelDisplay: [editObj && editObj.vendorLevelDisplay ? editObj.vendorLevelDisplay : false],
			isMandatory: [editObj && editObj.isMandatory ? editObj.isMandatory : false],
		});
	}

	formSubmit() {		
		if(!this.createCustomFieldForm.valid) return; // Validity Check.
		if(this.customFieldList && this.customFieldList.length>0) {
			let exist = false;
			for(let x=0; x<this.customFieldList.length; x++) {
				if(this.editObj) {
					if(this.customFieldList[x].fieldName == this.createCustomFieldForm.value.fieldName && this.editObj._id != this.customFieldList[x]._id ) {
						exist = true;
						break;
					}
				} else {
					if(this.customFieldList[x].fieldName.toLowerCase() == this.createCustomFieldForm.value.fieldName.toLowerCase()) {
						exist = true;
						break;
					}
				}
			}
			if(exist) {
				this.common.error("Name Already Exists");
				return;
			} 
		}
		let payload = this.createCustomFieldForm.value;
		payload.auctionID = this.auctionId;
		if(this.customFieldObj) {
			if(!this.checkIfFormEdited(this.customFieldObj, payload)) {
				this.onClose();
			} else {
				payload.customFieldID = this.customFieldObj.customFieldID;
				this.buyerService.updateCustomFieldData(payload).subscribe(res => {
					this.buyerService.setCustomFieldObservable('success-update');
					this.onClose();
				});
			}
		} else {
			this.buyerService.createCustomFieldData(payload).subscribe(res => {
				this.buyerService.setCustomFieldObservable('success-create');
				this.onClose();
			});
		}		
	}

	checkIfFormEdited(custObj, formdata) {
		if(custObj.dataType !== formdata.dataType || 
			custObj.displayLevel !== formdata.displayLevel ||
			custObj.fieldName !== formdata.fieldName ||
			custObj.isMandatory !== formdata.isMandatory ||
			custObj.vendorLevelDisplay !== formdata.vendorLevelDisplay) {
				return true;
			} else {
				return false;
			}
	}

	onClose() {
		let sendData;
		sendData = {
			flag: 'closeAttach',
			pageFrom: 'customField'
		}
		this.common.toggleDiv.emit(sendData);
	}

}
