import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentDetailsComponent } from './paymentdetails.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PaymentDetailsComponent,
                children: [
                    {
                        path: '',
                        component: PaymentDetailsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class  PaymentDetailsRoutingModule {
}
