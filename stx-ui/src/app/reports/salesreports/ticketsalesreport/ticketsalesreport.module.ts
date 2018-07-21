import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketSalesReportComponent } from './ticketsalesreport.component';
import { TicketSalesReportRoutingModule } from './ticketsalesreport.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TicketSalesReportRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        TicketSalesReportComponent
    ]
})
export class TicketSalesReportModule {
}
