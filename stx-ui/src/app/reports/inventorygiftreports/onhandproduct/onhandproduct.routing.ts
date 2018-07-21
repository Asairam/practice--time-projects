import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OnHandProductComponent } from './onhandproduct.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: OnHandProductComponent,
                children: [
                    {
                        path: '',
                        component: OnHandProductComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class OnHandProductRoutingModule {
}
