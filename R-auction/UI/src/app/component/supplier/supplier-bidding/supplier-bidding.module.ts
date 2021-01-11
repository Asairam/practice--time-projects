import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/module/shared.module';
import { SupplierBiddingComponent } from './supplier-bidding.component';
import { SupplierBiddingRoutingModule } from './supplier-bidding-routing.module';
import {CountdownModule} from 'ngx-countdown';
import { SupplierItemViewComponent } from './supplier-item-view/supplier-item-view.component';
import { SupplierBidHistoryComponent } from './supplier-bid-history/supplier-bid-history.component';
import { SupplierBiddingService } from './supplier-bidding.service';
import { TakeLeadPopupComponent } from './take-lead-popup/take-lead-popup.component';
import { SuppItemPopupViewOnlyComponent } from './supp-item-popup-view-only/supp-item-popup-view-only.component';
import { SuppAuctionAcceptPopupComponent } from './supp-auction-accept-popup/supp-auction-accept-popup.component';

/* NgRx */
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/supplier-bidding.reducer';


@NgModule({
  declarations: [
    SupplierBiddingComponent, 
    SupplierItemViewComponent, 
    SupplierBidHistoryComponent,
    TakeLeadPopupComponent,
    SuppItemPopupViewOnlyComponent,
    SuppAuctionAcceptPopupComponent
  ],
  imports: [
    CommonModule,
    SupplierBiddingRoutingModule,CountdownModule,SharedModule,
    StoreModule.forFeature('supplierBiddingModule', reducer),
  ],
  providers: [SupplierBiddingService],
  entryComponents: [
    TakeLeadPopupComponent,
    SuppItemPopupViewOnlyComponent,
    SuppAuctionAcceptPopupComponent
  ]
})
export class SupplierBiddingModule { }
