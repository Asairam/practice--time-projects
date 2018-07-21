import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewClientRoutingModule } from './newclient-routing.module';
import { NewClientComponent } from './newclient.component';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    NewClientRoutingModule,
    ShareModule, FormsModule,
    PerfectScrollbarModule,
    TranslateModule, ReactiveFormsModule,
    DataTableModule,
    ModalModule.forRoot(), NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  declarations: [NewClientComponent]
})
export class NewClientModule { }
