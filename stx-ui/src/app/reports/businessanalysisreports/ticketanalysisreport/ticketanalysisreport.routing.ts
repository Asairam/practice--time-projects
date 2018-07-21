import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TicketAnalysisReportComponent } from './ticketanalysisreport.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TicketAnalysisReportComponent,
                children: [
                    {
                        path: '',
                        component: TicketAnalysisReportComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TicketAnalysisReportRoutingModule {
}
