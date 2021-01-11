import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierLandingComponent } from './supplier-landing.component';
import { SupplierLandingRoutingModule } from './supplier-landing-routing.module';

@NgModule({
  declarations: [SupplierLandingComponent],
  imports: [
    CommonModule,
    SupplierLandingRoutingModule
  ]
})
export class SupplierLandingModule { }
