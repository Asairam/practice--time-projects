import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryusageReportComponent } from './inventoryusagereport.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: InventoryusageReportComponent,
                children: [
                    {
                        path: '',
                        component: InventoryusageReportComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class InventoryusageReportRoutingModule {
}
