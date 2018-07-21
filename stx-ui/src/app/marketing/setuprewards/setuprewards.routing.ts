import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupRewardsComponent } from './setuprewards.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SetupRewardsComponent,
                children: [
                    {
                        path: '',
                        component: SetupRewardsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SetupRewardsRoutingModule {
}
