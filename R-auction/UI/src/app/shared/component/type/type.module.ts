import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeComponent } from './type.component';
import { TypeRoutingModule } from './type-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
// import { SupplierStatusDetailsComponent } from '../../../component/supplier/supplier-status-details/supplier-status-details.component';

@NgModule({
  declarations: [TypeComponent],
  imports: [
    CommonModule,
    TypeRoutingModule, SharedModule
  ]
})
export class TypeModule { }
