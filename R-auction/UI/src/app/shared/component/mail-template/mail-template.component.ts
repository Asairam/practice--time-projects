import { Component,OnChanges, Input, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BuyerEditService } from '../../../component/component-service/buyer-edit.service';
import { CommonService } from '../../../commonService/common.service';
import * as config from '../../../appConfig/app.config';
import {AddChipComponent} from '../../../shared/component/add-chip/add-chip.component';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';
import { ViewPopupComponent } from '../view-popup/view-popup.component';
/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../../../component/buyer/edit/state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

import { MailTemplateService } from './mail-template.service';

@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.css'],
  providers: [MailTemplateService]
})
export class MailTemplateComponent implements OnChanges, OnInit, OnDestroy {

  auctionReadOnly: boolean = false;
	componentActive: boolean = true;
  @ViewChild(AddChipComponent) private addChip:AddChipComponent;
  @Input() supplier = false;
  @Input() auctionId = null;
  @Input() popupFlag=false;
  @Input() MatDialogRef:MatDialogRef<ViewPopupComponent>;
  mailList=[];
  supplierMailBody = ""; 
  showBcc=false;
  hostMailBody = "";
  bccText="";
  auctionStatus=config.AUCTIONSTATUS;
  editorConfig: any;
  common_btn: any;

  constructor(
      public common: CommonService, 
      public buyerService: BuyerEditService,
      private MatDialog: MatDialog,    
      private store: Store<fromEditModule.EditModuleState>,
      private mailTemplateService: MailTemplateService
    ) {
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.common_btn = text;
    });
  }

  ngOnInit() {
    this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionReadOnly => {
      this.auctionReadOnly = auctionReadOnly;
      this.mailTemplateService.editorConfig.editable = !this.auctionReadOnly;
      this.editorConfig = this.mailTemplateService.editorConfig;
		})
  }

	ngOnChanges() {
		if(!(this.buyerService.auctionData.auctionStatus==this.auctionStatus.DR || this.buyerService.auctionData.auctionStatus==this.auctionStatus.PB)){
			this.editorConfig.editable=false;
		}

		if (this.supplier) {
			this.supplierMailBody =  this.buyerService.supplierMailBody();
			// this.supplierMailBody = this.buyerService.supplierMail;
		} else {
			this.hostMailBody = this.buyerService.hostMailBody();
			// this.hostMailBody = this.buyerService.hostMail;
		}
		this.mailList=(this.supplier)?this.buyerService.supplierEmail:this.buyerService.hostEmail;
	}

  ngAfterViewInit() {
   
    if (this.supplier) {
      var supplierDiv = document.getElementById("supplierBody");
      var supplierAngText = supplierDiv.getElementsByClassName("angular-editor-toolbar-set");
      supplierAngText[11].className = "hide";
      supplierAngText[10].className = "hide";
      supplierAngText[9].className = "hide";

    }
    else {
      var hostDiv = document.getElementById("hostBody");
      var hostAngText = hostDiv.getElementsByClassName("angular-editor-toolbar-set");
      hostAngText[11].className = "hide";
      hostAngText[10].className = "hide";
      hostAngText[9].className = "hide";
    }
  
  }

  closeClick() {
    //  this.mailList=(this.supplier)?this.buyerService.supplierEmail:this.buyerService.hostEmail;
    if (this.popupFlag) {
      this.MatDialogRef.close(false);
    }
    else {
      let sendData = {
        flag: 'closeAttach',
        pageFrom: 'mailTemplate'
      }
      this.common.toggleDiv.emit(sendData);
    }
  }

  saveMailBody() {
    if(this.supplier && !(this.supplierMailBody)){
      return this.common.error("Mail template can't be blank.");
    }

    if(!this.supplier && !(this.hostMailBody)){
      return this.common.error("Mail template can't be blank.");
    }

    if (this.addChip.emailList.some(x => x.invalid)) {
      return this.common.error('Email Id is invalid');
    }
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-md';
    objMatDialogConfig.data = {
      dialogMessage: this.common_btn['PLZ_CON'],
      dialogContent: this.common_btn['ADD_CC'],
      tab: 'confirm_msg',
      dialogPositiveBtn: "Yes",
      dialogNegativeBtn: "No"
    }
    objMatDialogConfig.disableClose = true;
    let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
    refMatDialog.afterClosed().subscribe((value) => {
      if (value) {
        if (this.supplier) {
          this.buyerService.supplierMail = this.supplierMailBody;
          this.buyerService.supplierEmail = this.addChip.emailList;
        }
        else {
          this.buyerService.hostMail = this.hostMailBody;
          this.buyerService.hostEmail = this.addChip.emailList;

        }
        if(this.popupFlag){
          this.MatDialogRef.close(true);
        }
        else{
          this.common.success("Mail template saved successfully")        
        }
      }
    })
  }

  resetMail() {
    if (this.supplier) {
     this.supplierMailBody = this.buyerService.defaultSupplierMail();
    }
    else {
     this.hostMailBody = this.buyerService.defaultHostMail();;
    }
    if(this.popupFlag){
      this.common.success("Mail template reset successfully and confirm it.")
    }
    else{
    this.common.success("Mail template reset successfully and save it.")
    }
  }

  showBccClick(){
    this.showBcc=(!this.showBcc)?true:false;
  }

  ngOnDestroy() {
		this.componentActive = false;
	}

}
