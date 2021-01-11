import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { RemarkComponent } from 'src/app/shared/component/remark/remark.component';
import { CommonService } from 'src/app/commonService/common.service';

@Component({
  templateUrl: './publish-confirmation.component.html',
  styleUrls: ['./publish-confirmation.component.css']
})
export class PublishConfirmationComponent implements OnInit {

    selectedIndex=0;
	dialogMessage: any;
	dialogPositiveBtn: any;
    cohostList: any = [];
    supplierList: any = [];
    remark=null;
    liveRemarkObj: any;
    @ViewChild(RemarkComponent) remarkChild:RemarkComponent;
    readOnly: boolean = false;

    constructor(
            private common:CommonService,
            public dialog: MatDialog, 
            public MatDialogRef: MatDialogRef<PublishConfirmationComponent>,
            @Inject(MAT_DIALOG_DATA) { ...data }
        ) {
			this.dialogMessage = data.dialogMessage;
			this.dialogPositiveBtn = data.dialogPositiveBtn;
            this.cohostList = data.dialogContent.cohosts;
            this.supplierList = data.dialogContent.suppliers;
            this.remark=data.dialogContent["remarks"];
            this.liveRemarkObj = data.dialogContent["liveRemark"];
            this.readOnly = data.dialogContent.readOnly;
    }

    ngOnInit() {
	}
	
	onPositiveBtn() {
        let remark="";
        if(this.remarkChild){
            if(this.remarkChild.remark){
                remark=this.remarkChild.remark;
            }
            // else{
            //   this.selectedIndex=1;
            //   return this.common.error("Enter Remark"); 
            // }
        }
		this.MatDialogRef.close({confirm:true,remark:remark});
    }

    onPositiveBtnLiveRemark() {
        if(!this.liveRemarkObj.data.value) {
			this.selectedIndex = 1;
        } else {
            this.MatDialogRef.close({confirm:true, liveRemarkObj: this.liveRemarkObj});
        }
    }
    
    tabindexChanged() {
        
    }

}
