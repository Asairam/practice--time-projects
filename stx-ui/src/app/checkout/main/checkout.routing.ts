import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckOutComponent } from './checkout.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CheckOutComponent,
                children: [
                    {
                        path: '',
                        component: CheckOutComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CheckOutRoutingModule {
}
