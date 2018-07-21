import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckOutMembershipsComponent } from './checkoutmemberships.component';
import { CheckOutMembershipsRoutingModule } from './checkoutmemberships.routing';
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
        CheckOutMembershipsRoutingModule,
        BsDatepickerModule.forRoot(),
        ShareModule,
        ModalModule.forRoot()
    ],
    declarations: [
        CheckOutMembershipsComponent
    ]
})
export class CheckOutMembershipsModule {
}
