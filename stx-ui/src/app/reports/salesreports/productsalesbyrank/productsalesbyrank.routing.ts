import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductSalesByRankComponent } from './productsalesbyrank.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ProductSalesByRankComponent,
                children: [
                    {
                        path: '',
                        component: ProductSalesByRankComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ProductSalesByRankRoutingModule {
}
