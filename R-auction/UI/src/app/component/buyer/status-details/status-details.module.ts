import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusDetailsRoutingModule } from './status-details-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
import { StatusDetailsComponent } from './status-details.component';

@NgModule({
  declarations: [StatusDetailsComponent],
  imports: [
    CommonModule,
    StatusDetailsRoutingModule, SharedModule
  ]
})
export class StatusDetailsModule { }
