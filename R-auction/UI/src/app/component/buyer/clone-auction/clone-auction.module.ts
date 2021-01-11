import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloneAuctionRoutingModule } from './clone-auction-routing.module';
import { CloneAuctionComponent } from './clone-auction.component';
import { SharedModule } from '../../../shared/module/shared.module';

@NgModule({
  declarations: [CloneAuctionComponent],
  imports: [
    CommonModule,
    CloneAuctionRoutingModule,SharedModule
  ]
})
export class CloneAuctionModule { }
