import { Injectable } from "@angular/core";
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TakeLeadPopupComponent } from '../take-lead-popup/take-lead-popup.component';
import { SupplierService } from '../../../component-service/supplier.service';

@Injectable()
export class SupplierItemViewService {

    constructor(
        private matDialog: MatDialog,
        private supplierService: SupplierService
    ) {}

    openTakeLeadPopup(itemObj, auctionID) {
        const objMatDialogConfig = new MatDialogConfig();        
        objMatDialogConfig.panelClass = 'dialog-md';
        objMatDialogConfig.data = {
            dialogMessage: 'Take Lead',
            dialogContent: {auctionId : auctionID, itemName: itemObj.itemName},
            dialogPositiveBtn: "Confirm",
            dialogNegativeBtn: "Cancel",
        }
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.matDialog.open(TakeLeadPopupComponent, objMatDialogConfig);
        return refMatDialog.afterClosed()
    }

    takeLead(payload) {
        return new Promise((resolve, reject) =>{
            this.supplierService.takeLead(payload).subscribe(res => {
                resolve(res);
            }, err =>{
                reject(err)
            });
        })
    }

 
}