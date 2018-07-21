import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  TicketListComponent } from './ticketlist.component';
import {  TicketListRoutingModule } from './ticketlist.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TicketListRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        TicketListComponent
    ]
})
export class  TicketListModule {
}
