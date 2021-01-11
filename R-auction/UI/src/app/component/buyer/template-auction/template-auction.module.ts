import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateAuctionRoutingModule } from './template-auction-routing.module';
import { TemplateAuctionComponent } from './template-auction.component';
import { SharedModule } from '../../../shared/module/shared.module';

@NgModule({
  declarations: [TemplateAuctionComponent],
  imports: [
    CommonModule,
    TemplateAuctionRoutingModule,SharedModule
  ]
})
export class TemplateAuctionModule { }
