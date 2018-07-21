import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GiftBalancesComponent } from './giftbalances.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: GiftBalancesComponent,
                children: [
                    {
                        path: '',
                        component: GiftBalancesComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class GiftBalancesRoutingModule {
}
