import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveAuctionDetailsComponent } from './live-auction-details.component';
import { LiveAuctionDetailsRoutingModule } from './live-auction-details-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
import {CountdownModule} from 'ngx-countdown';
import { LiveAuctionCardFlipComponent } from './live-auction-card-flip/live-auction-card-flip.component';

@NgModule({
  declarations: [LiveAuctionDetailsComponent, LiveAuctionCardFlipComponent],
  imports: [
    CommonModule,
    LiveAuctionDetailsRoutingModule, SharedModule,CountdownModule
  ],
  entryComponents: []
})
export class LiveAuctionDetailsModule { }
