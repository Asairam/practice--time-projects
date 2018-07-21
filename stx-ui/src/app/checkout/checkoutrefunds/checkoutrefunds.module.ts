import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckOutRefundsComponent } from './checkoutrefunds.component';
import { CheckOutRefundsRoutingModule } from './checkoutrefunds.routing';
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
        CheckOutRefundsRoutingModule,
        BsDatepickerModule.forRoot(),
        ShareModule,
        ModalModule.forRoot()
    ],
    declarations: [
        CheckOutRefundsComponent
    ]
})
export class CheckOutRefundsModule {
}
