import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryUsageComponent } from './inventoryusage.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: InventoryUsageComponent,
                children: [
                    {
                        path: '',
                        component: InventoryUsageComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class InventoryUsageRoutingModule {
}
