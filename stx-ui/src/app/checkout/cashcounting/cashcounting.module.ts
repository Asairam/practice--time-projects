import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashCountingRoutingModule } from './cashcounting-routing.module';
import { CashCountingComponent } from './cashcounting.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
@NgModule({
  imports: [
    CommonModule,
    CashCountingRoutingModule,
    FormsModule,
    TranslateModule,
    ShareModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [CashCountingComponent]
})
export class CashCountingModule { }
