import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../../commonService/common.service';
import { BuyerEditService } from '../../../component/component-service/buyer-edit.service'
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from '../view-popup/view-popup.component';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../../../component/buyer/edit/state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-lot-popup',
  templateUrl: './lot-popup.component.html',
  styleUrls: ['./lot-popup.component.css']
})
export class LotPopupComponent implements OnInit, OnDestroy {

  auctionReadOnly: boolean = false;
  componentActive: boolean = true;
  
  @Input() viewData;
  @Input() itemList;
  @Input() auctionId: any;
  aucStatus:any;
  createLotForm: FormGroup;
  lotcoloum: any;
  headcoloum: any;
  lotId = null;
  itemAPICall = false;
  translateSer: any;

  constructor(
      private formBuilder: FormBuilder, 
      private common: CommonService, 
      public buyereditservice: BuyerEditService, 
      private MatDialog: MatDialog,
      private store: Store<fromEditModule.EditModuleState>
    ) {

    this.common.translateSer('LOT_COLOUM').subscribe(async (text: string) => {
      this.lotcoloum = text;
    });
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.headcoloum = text;
    });
    this.common.translateSer('ITEM_MSG').subscribe(async (text: string) => {
      this.translateSer = text;
    });
  }

  ngOnInit() {
    this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
      .subscribe(auctionReadOnly => {
        this.auctionReadOnly = auctionReadOnly;
    });
    this.store.pipe(select(fromEditModule.getAuctionStatus), 
      takeWhile(() => this.componentActive)).subscribe(auctionStatus => {
			if( auctionStatus == 'suspended') {
        console.log('Lot suspended');
			}
			if(auctionStatus == 'published') {
        console.log('Lot published');
			}
			if(auctionStatus == 'paused') {
        console.log('Lot paused');
      }
      if(auctionStatus == 'draft') {
        console.log('Lot draft');
      }
      this.aucStatus = auctionStatus;
		});
    this.formData();
    this.getLotData();
  }

  formData() {
    this.createLotForm = this.formBuilder.group({
      lotName: ['', Validators.required],
      lotDescription: [''],
      forcedLot: [false],
      biDirectionalBid: [false],
      lotMinimumChange: null,
      auctionID: [''],
      lotMinChangeType: 'amount',
      remarks: ['']
    });
  }

  getLotData() {
    this.buyereditservice.lotList = this.buyereditservice.getLotList(this.auctionId);
  }
  lotformSubmit() {
    try {
      // this.common.loader = true;
      this.createLotForm.patchValue({
        auctionID: this.auctionId
      });
      if (this.createLotForm.valid) {
        if (this.lotId) {
          Object.assign(this.createLotForm.value, { lotID: this.lotId })
          this.buyereditservice.updateLot(this.createLotForm.value).subscribe((res) => {
            if (res["success"]) {
              this.buyereditservice.itemDetails.forEach(obj => {
                if(obj.lotID == this.lotId) {
                  obj.lotType = this.createLotForm.value.lotName;
                }
              });
              this.common.success("Lot updated successfully")
              const { lotID, ...noA } = this.createLotForm.value;
              this.lotId = null;
              this.createLotForm.patchValue({
                lotName: null,
                lotDescription: null,
                remarks: null
              });
              this.getLotData();
              this.republishMessage();
            }
            this.common.loader = false;
          }, (err) => {
            this.common.loader = false;
          })
        }
        else {
          let checkDupLot = this.buyereditservice.lotList.filter(ele => ele.lotName.toLowerCase() === this.createLotForm.value.lotName.toLowerCase());
          if (checkDupLot && checkDupLot.length > 0) {
            this.common.warning(this.lotcoloum['LOT_EXI']);
          } else {
            this.buyereditservice.createLot(this.createLotForm.value).subscribe((res) => {
              if (res["success"]) {
                this.common.success(this.lotcoloum['LOT_SUCC'])
                this.createLotForm.patchValue({
                  lotName: null,
                  lotDescription: null,
                  remarks: null
                });
                this.getLotData();
              }
              this.republishMessage();
              // this.common.loader = false;
            }, (err) => {
              this.common.loader = false;
            })
          }
        }
      }
    }
    catch{
    }
  }

  onClose() {
    let sendData = {
        flag: 'closeAttach',
        pageFrom: 'LotView',
        itemCall: this.itemAPICall
      }
    this.common.toggleDiv.emit(sendData);
  }

  lotEdit(rec) {
    this.lotId = rec.lotID
    this.createLotForm.patchValue({
      lotName: rec.lotName,
      lotDescription: rec.lotDescription,
      remarks: rec.remarks
    });
  }
  lotDelete(data) {
    try {
      let filterLot = this.itemList.filter(ele => ele.lotID === data.lotID);
      let message = this.translateSer['REMOVE_ITEM'] + '<b>' + data.lotName + '</b>';
      if (filterLot && filterLot.length > 0) {
        message = this.lotcoloum['LOT_ASSIGNE'];
      }
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-xs';
      objMatDialogConfig.data = {
        dialogMessage: this.headcoloum['PLZ_CON'],
        dialogContent: message,
        tab: 'confirm_msg',
        dialogPositiveBtn: "Yes",
        dialogNegativeBtn: "No"
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        if (value) {
          let objDelLot = {
            lotID: [data.lotID],
            auctionID: this.auctionId,
          }
          this.buyereditservice.deleteLot(objDelLot).subscribe((res) => {
            if (res["success"]) {
              this.common.success(this.lotcoloum['LOT_DELETE']);
              this.itemAPICall = true;
              this.getLotData()
            }
            this.republishMessage();
          }, (err) => {
            this.common.loader = false;
          })

        }
      });
    } catch{ }

  }

  republishMessage() {
    if(this.buyereditservice.auctionData.auctionStatus.toLowerCase() != 'published') return;
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.panelClass = 'dialog-md';
		objMatDialogConfig.data = {
			dialogMessage: 'WARNING !',
			dialogContent: 'This auction has been suspended. Kindly Re-Publish for the changes to take effect.',
			tab: 'excel-item-template',
			dialogNegativeBtn: "Close"
    }
    objMatDialogConfig.disableClose = true;
		let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
			if (!value) {
			}
		});
  }
  
  ngOnDestroy() {
    this.componentActive = false;
  }


}
