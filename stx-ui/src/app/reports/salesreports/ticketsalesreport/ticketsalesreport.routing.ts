import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TicketSalesReportComponent } from './ticketsalesreport.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TicketSalesReportComponent,
                children: [
                    {
                        path: '',
                        component: TicketSalesReportComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TicketSalesReportRoutingModule {
}
