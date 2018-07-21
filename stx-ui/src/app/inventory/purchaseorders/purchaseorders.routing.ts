import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PurchaseOrderComponent } from './purchaseorders.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PurchaseOrderComponent,
                children: [
                    {
                        path: '',
                        component: PurchaseOrderComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class PurchaseOrderRoutingModule {
}
