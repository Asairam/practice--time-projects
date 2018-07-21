import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckOutMembershipsComponent } from './checkoutmemberships.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CheckOutMembershipsComponent,
                children: [
                    {
                        path: '',
                        component: CheckOutMembershipsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CheckOutMembershipsRoutingModule {
}
