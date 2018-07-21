import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentsRoutingModule } from './appointments.routing';
import { TranslateModule } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from '../../../custommodules/primeng/primeng';
import { DataTableModule } from '../../../custommodules/primeng/primeng';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ColorPickerModule } from 'ngx-color-picker';
import { MyDatePickerModule } from 'mydatepicker';
import * as $ from 'jquery';
import { TabsModule, TypeaheadModule } from 'ngx-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
// import { FullCalendarModule } from 'ng-fullcalendar';
@NgModule({
    imports: [
        CommonModule,
        AppointmentsRoutingModule,
        TranslateModule,
        CalendarModule,
        MyDatePickerModule,
        ShareModule,
        FormsModule,
        ColorPickerModule,
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        DataTableModule,
        TabsModule.forRoot(),
        TypeaheadModule.forRoot(),
        ReactiveFormsModule,
        PerfectScrollbarModule,
        // FullCalendarModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    declarations: [
        AppointmentsComponent
    ]
})
export class AppointmentModule {
}
