import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierStatusDetailsRoutingModule } from './supplier-status-details-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
import { SupplierStatusDetailsComponent } from './supplier-status-details.component';

@NgModule({
  declarations: [SupplierStatusDetailsComponent],
  imports: [
    CommonModule,
    SupplierStatusDetailsRoutingModule, SharedModule
  ]
})
export class SupplierStatusDetailsModule { }
