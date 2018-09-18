import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckOutComponent } from './checkout.component';
import { CheckOutRoutingModule } from './checkout.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
// import { TypeaheadModule } from 'ngx-bootstrap';
@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        DataTableModule,
        TranslateModule,
        CheckOutRoutingModule,
        ModalModule.forRoot(),
        PerfectScrollbarModule,
        // TypeaheadModule.forRoot(),
        ShareModule
    ],
    declarations: [
        CheckOutComponent
    ]
})
export class CheckOutModule {
}
