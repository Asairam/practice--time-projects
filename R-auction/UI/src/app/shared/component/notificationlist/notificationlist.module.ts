import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationlistComponent } from './notificationlist.component';
import { NotificationListRoutingModule } from './notificationlist-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
// import { StatusDetailsComponent } from '../../../component/buyer/status-details/status-details.component';
// import { SupplierStatusDetailsComponent } from '../../../component/supplier/supplier-status-details/supplier-status-details.component';

@NgModule({
  declarations: [NotificationlistComponent],
  imports: [ 
    CommonModule,
    NotificationListRoutingModule, SharedModule
  ]
})
export class NotificationlistModule { }
