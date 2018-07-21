import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckOutRefundsComponent } from './checkoutrefunds.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CheckOutRefundsComponent,
                children: [
                    {
                        path: '',
                        component: CheckOutRefundsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CheckOutRefundsRoutingModule {
}
