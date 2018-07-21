import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TicketSalesChartComponent } from './ticketsaleschart.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TicketSalesChartComponent,
                children: [
                    {
                        path: '',
                        component: TicketSalesChartComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TicketSalesChartRoutingModule {
}
