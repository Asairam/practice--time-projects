import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketAnalysisReportComponent } from './ticketanalysisreport.component';
import { TicketAnalysisReportRoutingModule } from './ticketanalysisreport.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TicketAnalysisReportRoutingModule,
        ShareModule,
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        TicketAnalysisReportComponent
    ]
})
export class TicketAnalysisReportModule {
}
