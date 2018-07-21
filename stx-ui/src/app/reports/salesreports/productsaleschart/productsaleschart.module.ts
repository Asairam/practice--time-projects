import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSalesChartComponent } from './productsaleschart.component';
import { ProductSalesChartRoutingModule } from './productsaleschart.routing';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { ChartModule } from '../../../../custommodules/primeng/primeng';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ProductSalesChartRoutingModule,
        ShareModule,
        ChartModule
    ],
    declarations: [
        ProductSalesChartComponent
    ]
})
export class ProductSalesChartModule {
}
