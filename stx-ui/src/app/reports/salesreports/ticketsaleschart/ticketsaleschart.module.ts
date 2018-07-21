import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketSalesChartComponent } from './ticketsaleschart.component';
import { TicketSalesChartRoutingModule } from './ticketsaleschart.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { ChartModule } from '../../../../custommodules/primeng/primeng';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TicketSalesChartRoutingModule,
        ShareModule,
        ChartModule
    ],
    declarations: [
        TicketSalesChartComponent
    ]
})
export class TicketSalesChartModule {
}
