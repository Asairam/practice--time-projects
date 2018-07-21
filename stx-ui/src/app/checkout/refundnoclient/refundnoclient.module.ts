import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefundnoclientComponent } from './refundnoclient.component';
import { RefundnoclientRoutingModule } from './refundnoclient.routing';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
@NgModule({
  imports: [
    CommonModule,
    RefundnoclientRoutingModule, FormsModule, BsDatepickerModule.forRoot(), ShareModule, TranslateModule
  ],
  declarations: [RefundnoclientComponent]
})
export class RefundnoclientModule { }
