import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckOutEditTicketComponent } from './checkouteditticket.component';
import { CheckOutEditTicketRoutingModule } from './checkouteditticket.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
// import {WebcamModule} from '../../../assets/webcammodules/webcam/webcam.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        CheckOutEditTicketRoutingModule,
        ShareModule,
        DataTableModule, ReactiveFormsModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        PerfectScrollbarModule
        // WebcamModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    declarations: [
        CheckOutEditTicketComponent
    ]
})
export class CheckOutEditTicketModule {
}
