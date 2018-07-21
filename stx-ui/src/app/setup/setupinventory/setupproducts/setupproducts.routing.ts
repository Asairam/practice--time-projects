import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupProductsComponent } from './setupproducts.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupProductsComponent,
                children: [
                    {
                        path: '',
                        component: SetupProductsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupProductsRoutingModule {
}
