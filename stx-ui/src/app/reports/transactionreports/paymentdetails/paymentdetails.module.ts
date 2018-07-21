import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentDetailsComponent } from './paymentdetails.component';
import { PaymentDetailsRoutingModule } from './paymentdetails.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        PaymentDetailsRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        PaymentDetailsComponent
    ]
})
export class PaymentDetailsModule {
}
