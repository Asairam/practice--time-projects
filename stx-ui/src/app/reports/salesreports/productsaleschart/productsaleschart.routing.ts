import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductSalesChartComponent } from './productsaleschart.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ProductSalesChartComponent,
                children: [
                    {
                        path: '',
                        component: ProductSalesChartComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ProductSalesChartRoutingModule {
}
