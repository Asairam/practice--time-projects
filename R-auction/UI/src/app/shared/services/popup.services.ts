import { Injectable } from "@angular/core";
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from '../component/view-popup/view-popup.component';


@Injectable()
export class PopupService {
    constructor(
        private MatDialog: MatDialog,
    ) {}

    republishMessage() {
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
		return refMatDialog.afterClosed();
    }
}