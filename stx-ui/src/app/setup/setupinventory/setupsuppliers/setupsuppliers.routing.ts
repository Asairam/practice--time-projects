import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupSuppliersComponent } from './setupsuppliers.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupSuppliersComponent,
                children: [
                    {
                        path: '',
                        component: SetupSuppliersComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupSuppliersRoutingModule {
}
