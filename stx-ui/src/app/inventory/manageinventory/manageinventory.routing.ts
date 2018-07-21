import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManageInventoryComponent } from './manageinventory.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ManageInventoryComponent,
                children: [
                    {
                        path: '',
                        component: ManageInventoryComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ManageInventoryRoutingModule {
}
