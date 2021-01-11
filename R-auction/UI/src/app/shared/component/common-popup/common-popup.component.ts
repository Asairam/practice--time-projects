import { Component, Inject,OnInit,OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
// import * as config from '../../../appConfig/app.config';
import * as api from '../../../../environments/environment';
import * as routerconfig from '../../../appConfig/router.config';
import { takeWhile } from 'rxjs/operators';
/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromAppModule from '../../../state/app.reducer';
@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.css']
})
export class CommonPopupComponent implements OnInit, OnDestroy{
  dialogMessage = "";
  dialogPositiveBtn = "Yes";
  dialogNegativeBtn = 'No';
  tab = '';
  componentActive2: boolean = true;
  // imageURL=config.IMAGE_URL;
  imageURL=api.environment.rauction;
  featureObj:any;
  constructor(private route: Router, public dialog: MatDialog, public MatDialogRef: MatDialogRef<CommonPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data, private store: Store<fromAppModule.AppModuleState>) {
    this.dialogMessage = data.dialogMessage;
    this.dialogPositiveBtn = data.dialogPositiveBtn;
    this.dialogNegativeBtn = data.dialogNegativeBtn;
    this.tab = data.tab;
  }
  ngOnInit() {
    this.store.pipe(select(fromAppModule.getAuctionConfigOnly), takeWhile(() => this.componentActive2))
      .subscribe(auctioncon => {
        if (auctioncon && auctioncon.features) {
          this.featureObj = auctioncon.features;
        }
      })
  }

  closeDialog(flag = 0) {
    try {
      if (flag == 1) {
        this.route.navigate([routerconfig.buyer_router_links.CREATE_AUCTION]);
      }
      else if (flag == 2) {
        this.route.navigate([routerconfig.buyer_router_links.CREATE_AUCTION], { queryParams: { template: 'true' } });

      } else if (flag == 3) {
        this.route.navigate(['/cloneauction']);
      } else if (flag == 4) {
        this.route.navigate([routerconfig.buyer_router_links.CREATE_AUCTION], { queryParams: { mode: 'sealedBid' } });
      } 
      this.MatDialogRef.close();
    }
    catch (e) {

    }
  }
  private onPositiveBtn() {
    this.MatDialogRef.close(true);
  }

  private onNegativeBtn() {
    this.MatDialogRef.close(false);
  }

  ngOnDestroy() {
    this.componentActive2 = false;
  }

}
