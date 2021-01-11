import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerLandingComponent } from './buyer-landing.component';
import { BuyerLandingRoutingModule } from './buyer-landing-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
@NgModule({
  declarations: [BuyerLandingComponent],
  imports: [
    CommonModule,
    BuyerLandingRoutingModule, SharedModule
  ]
})
export class BuyerLandingModule { }

