import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarketingEmailComponent } from './marketingemail.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MarketingEmailComponent,
                children: [
                    {
                        path: '',
                        component: MarketingEmailComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MarketingEmailRoutingModule {
}
