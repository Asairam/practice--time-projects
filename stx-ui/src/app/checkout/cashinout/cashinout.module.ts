import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashInOutComponent } from './cashinout.component';
import { CashInOutRoutingModule } from './cashinout.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        CashInOutRoutingModule,
        BsDatepickerModule.forRoot(),
        ShareModule,
        ModalModule.forRoot()
    ],
    declarations: [
        CashInOutComponent
    ]
})
export class CashInOutModule {
}
