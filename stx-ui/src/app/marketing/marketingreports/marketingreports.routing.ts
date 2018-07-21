import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarketingReportsComponent } from './marketingreports.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MarketingReportsComponent,
                children: [
                    {
                        path: '',
                        component: MarketingReportsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MarketingReportsRoutingModule {
}
