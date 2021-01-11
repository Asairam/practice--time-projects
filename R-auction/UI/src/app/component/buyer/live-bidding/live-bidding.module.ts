import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveBiddingComponent } from './live-bidding.component';
import { LiveBiddingRoutingModule } from './live-bidding-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
import {CountdownModule} from 'ngx-countdown';
import { ItemViewComponent } from './item-view/item-view.component';
import { BestBidComponent } from './item-view/best-bid-col/best-bid-col.component';
import { SupplierMatrixViewComponent } from './supplier-matrix-view/supplier-matrix-view.component';
import { ActivityComponent } from './activity/activity.component';
import { BidhistoryComponent } from './activity/bidhistory/bidhistory.component';
import { LiveAuditLogComponent } from './live-audit-log/live-audit-log.component';
import { BuyItemPopupViewOnlyComponent } from './buy-item-popup-view-only/buy-item-popup-view-only.component';


/* NgRx */
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/live-bidding-module.reducer';
import { BidhistoryPipe } from './activity/bidhistory/bidhistory.pipe';

@NgModule({
  declarations: [
    LiveBiddingComponent, 
    ItemViewComponent, 
    SupplierMatrixViewComponent, 
    ActivityComponent, 
    BidhistoryComponent, 
    LiveAuditLogComponent,
    BuyItemPopupViewOnlyComponent,
    BestBidComponent,
    BidhistoryPipe
  ],
  imports: [
    CommonModule,
    LiveBiddingRoutingModule, 
    SharedModule,
    CountdownModule,
    StoreModule.forFeature('liveBiddingModule', reducer),
  ],
  entryComponents: [
    BuyItemPopupViewOnlyComponent
  ]
})
export class LiveBiddingModule { }
