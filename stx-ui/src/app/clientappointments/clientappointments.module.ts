import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientappointmentsComponent } from './clientappointments.component';
import { ClientappointmentsRoutingModule } from './clientappointments.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../common/share.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
    imports: [
        CommonModule,
        ClientappointmentsRoutingModule,
        TranslateModule,
        FormsModule,
        ShareModule,
        ModalModule,
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        ClientappointmentsComponent
    ]
})
export class ClientappointmentsModule {
}
